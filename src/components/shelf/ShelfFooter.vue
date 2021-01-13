<template>
  <div class="shelf-footer-wrapper" v-show="isEditMode" :class="{'unselected':shelfSelected.length===0}">
    <div class="shelf-footer-item" v-for="item in tabs" :class="{'danger':item.index===4}" :key='item.index' @click="onTabClick(item)">
      <div class="shelf-footer-item-icon" :class="item.icon"></div>
      <div class="shelf-footer-text">
        <span>{{item.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
import { download } from '../../utils/store';
import { removeLocalForage } from '../../utils/localForage';

export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      popSlide: null,
      shelfDialogVisible: false
    };
  },
  computed: {
    tabs() {
      return [
        {
          label: this.isPrivate ? this.$t('shelf.noPrivate') : this.$t('shelf.private'),
          icon: this.isPrivate ? 'icon-private-see' : 'icon-private',
          index: 1
        },
        {
          label: this.isCache ? this.$t('shelf.delete') : this.$t('shelf.download'),
          icon: this.isCache ? 'icon-download-remove' : 'icon-download',
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          icon: 'icon-move',
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          icon: 'icon-shelf',
          index: 4
        }
      ];
    },
    isPrivate() {
      if (this.shelfSelected.length > 0) {
        return this.shelfSelected.every(item => item.private);
      } else {
        return false;
      }
    },
    isCache() {
      if (this.shelfSelected.length > 0) {
        return this.shelfSelected.every(item => item.cache);
      } else {
        return false;
      }
    }
  },
  methods: {
    openPrivate() {
      this.shelfSelected.forEach(item => {
        item.private = true;
      });
    },
    closePrivate() {
      this.shelfSelected.forEach(item => {
        item.private = false;
      });
    },
    downloadBook(book) {
      const toast = this.continueToast(
        this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub`)
      );
      toast.continueShow();
      return new Promise((resolve, reject) => {
        download(
          book,
          book => {
            // toast.hide();
            toast.remove();
            resolve(book);
          },
          reject,
          progressEvent => {
            const downloadPercent =
              Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '%';
            const text = this.$t('shelf.progressDownload').replace(
              '$1',
              `${book.fileName}.epub(${downloadPercent})`
            );
            toast.updateText(text);
            // console.log(text);
          }
        );
      });
    },
    deleteBook(book) {
      return new Promise((resolve, reject) => {
        localStorage.removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
        removeLocalForage(`${book.fileName}`);
        resolve(book);
      });
    },
    async openDownload() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true;
        });
      }
    },
    async closeDownload() {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.deleteBook(this.shelfSelected[i]).then(book => {
          book.cache = false;
        });
      }
    },
    removeSelectedBook() {
      if (this.isCategory) {
        this.setShelfList(
          this.shelfList.map(item => {
            if (item.itemList && item.title === this.categoryName) {
              item.itemList = item.itemList.filter(subItem => {
                return !this.shelfSelected.includes(subItem);
              });
              this.setCategoryData(item.itemList);
            }
            return item;
          })
        );
      } else {
        this.setShelfList(
          this.shelfList.filter(item => {
            return !this.shelfSelected.includes(item);
          })
        );
      }
      // console.log(this.shelfList);
    },
    async setDownLoad() {
      this.setIsEditMode(false);
      this.popSlide.hide();
      if (this.isCache) {
        await this.closeDownload();
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'));
      } else {
        await this.openDownload();
        this.simpleToast(this.$t('shelf.setDownloadSuccess'));
      }

      this.clearSelectedList();
      localStorage.saveBookShelf(this.shelfList);
    },
    showPrivateRead() {
      this.popSlide = this.popup({
        title: this.isPrivate
          ? this.$t('shelf.closePrivateTitle')
          : this.$t('shelf.setPrivateTitle'),
        btn: [
          {
            text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
            click: () => {
              this.isPrivate ? this.closePrivate() : this.openPrivate();
              this.simpleToast(
                this.isPrivate
                  ? this.$t('shelf.setPrivateSuccess')
                  : this.$t('shelf.closePrivateSuccess')
              );
              this.clearSelectedList();
              localStorage.saveBookShelf(this.shelfList);
              this.setIsEditMode(false);
              this.popSlide.hide();
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.setIsEditMode(false);
              this.clearSelectedList();
              this.popSlide.hide();
            }
          }
        ]
      });
      this.popSlide.show();
    },
    showDownload() {
      this.popSlide = this.popup({
        title: this.isCache
          ? this.$t('shelf.removeDownloadTitle')
          : this.$t('shelf.setDownloadTitle'),
        btn: [
          {
            text: this.isCache ? this.$t('shelf.delete') : this.$t('shelf.download'),
            click: () => {
              this.setDownLoad();
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.setIsEditMode(false);
              this.clearSelectedList();
              this.popSlide.hide();
            }
          }
        ]
      });
      this.popSlide.show();
    },
    showRemoveShelf() {
      this.popSlide = this.popup({
        title: this.$t('shelf.removeBookTitle').replace(
          '$1',
          this.shelfSelected.length > 1
            ? this.$t('shelf.selectedBooks')
            : `《${this.shelfSelected[0].title}》`
        ),
        btn: [
          {
            text: this.$t('shelf.removeBook'),
            click: () => {
              this.removeSelectedBook();
              this.setIsEditMode(false);
              this.clearSelectedList();
              localStorage.saveBookShelf(this.shelfList);
              this.popSlide.hide();
            },
            type: 'danger'
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.setIsEditMode(false);
              this.clearSelectedList();
              this.popSlide.hide();
            }
          }
        ]
      });
      this.popSlide.show();
    },
    onTabClick(item) {
      if (this.shelfSelected.length === 0) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivateRead();
          break;
        case 2:
          this.showDownload();
          break;
        case 3:
          this.shelfDialog().show();
          break;
        case 4:
          this.showRemoveShelf();
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-footer-wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: px2rem(48);
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.2);
  display: flex;
  background: white;
  &.unselected {
    opacity: 0.5;
  }
  .shelf-footer-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.danger {
      color: rgba(230, 10, 10, 0.966);
    }
    .shelf-footer-item-icon {
      font-size: px2rem(18);
    }
    .shelf-footer-text {
      margin-top: px2rem(4);
      font-size: px2rem(14);
    }
  }
}
</style>
