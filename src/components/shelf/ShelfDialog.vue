<template>
  <dialog-view :title="title" ref='dialog' v-show="shelfDialogVisible">
    <div class="shelf-dialog-list-wrapper" v-if="!newGroupVisible">
      <div class="dialog-list-newgroup" :class="{'selected':selectedType===-1}" @click="newGroupVisible=true">
        <span>{{$t('shelf.newGroup')}}</span>
      </div>
      <div class="dialog-list-remove" @click="removeOutCategory" v-show="isCategory">
        <span>{{$t('shelf.groupOut')}}</span>
      </div>
      <div class="category-item" :class="{'selected':selectedType===item.id}" @click="addToCategory(item)" v-for="item in categoryList" :key="item.id">
        <span>{{item.title}}</span>
        <span class="icon-check" v-show="categoryName===item.title" :class="{'selected':categoryName===item.title}"></span>
      </div>
    </div>
    <div class="shelf-dialog-newgroup-wrapper" v-if="newGroupVisible">
      <div class="shelf-dialog-newgroup-group-name"><span>分组名</span></div>
      <div class="shelf-dialog-newgroup-input-wrapper">
        <input type="text" v-model="groupName" class="shelf-dialog-newgroup-text">
        <span class="shelf-dialog-newgroup-delete icon-close" v-show="groupName&& groupName.length>0" @click="groupName=''"></span>
      </div>
    </div>
    <div slot="btn" class="shelf-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div class="dialog-btn" @click="createNewGroup" v-show="newGroupVisible"> {{$t('shelf.confirm')}}</div>
    </div>
  </dialog-view>
</template>

<script>
import DialogView from '../common/Dialog';
import { storeShelfMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
export default {
  name: 'shelfDialog',
  mixins: [storeShelfMixin],
  components: {
    DialogView
  },
  data() {
    return {
      title: '移动书籍',
      newGroupVisible: false,
      shelfDialogVisible: false,
      groupName: '',
      selectedType: -1
    };
  },
  computed: {
    categoryList() {
      return this.shelfList.filter(item => item.type === 2);
    }
  },
  methods: {
    show() {
      this.shelfDialogVisible = true;
    },
    hide() {
      this.clearSelectedList();
      this.setIsEditMode(false);
      this.shelfDialogVisible = false;
      this.newGroupVisible = false;
      this.groupName = '';
    },
    createNewGroup() {
      if (this.groupName && this.groupName.length > 0) {
        this.shelfList.splice(this.shelfList.length - 1, 0, {
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          itemList: [],
          selected: false,
          title: this.groupName,
          type: 2
        });
      }
      this.hide();
      localStorage.saveBookShelf(this.shelfList);
    },
    addToCategory(categoryItem) {
      while (this.shelfSelected.length) {
        const book = this.shelfSelected.shift();
        book.selected = false;
        categoryItem.itemList.push(book);
        if (!this.isCategory) {
          this.setShelfList(this.shelfList.filter(item => item !== book));
        } else {
          this.shelfList.forEach(item => {
            if (item.title === this.categoryName) {
              item.itemList.forEach((subitem, index) => {
                if (subitem === book) {
                  item.itemList.splice(index, 1);
                }
              });
            }
          });
        }
      }
      this.hide();
      localStorage.saveBookShelf(this.shelfList);
    },
    removeOutCategory() {
      while (this.shelfSelected.length) {
        const book = this.shelfSelected.shift();
        book.selected = false;
        this.shelfList.forEach(item => {
          if (item.title === this.categoryName) {
            item.itemList.forEach((subitem, index) => {
              if (subitem === book) {
                item.itemList.splice(index, 1);
              }
            });
          }
        });
        this.shelfList.splice(this.shelfList.length - 1, 0, book);
        // this.refreshShelfListId();
      }
      this.hide();
      localStorage.saveBookShelf(this.shelfList);
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-dialog-list-wrapper {
  width: 100%;
  max-height: px2rem(120);
  min-height: px2rem(60);
  overflow-x: hidden;
  overflow-y: scroll;
  padding: px2rem(0) px2rem(15);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: px2rem(14);
  line-height: px2rem(32);
  position: relative;
  .dialog-list-newgroup {
  }
  .dialog-list-remove {
  }
  .category-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
.shelf-dialog-newgroup-wrapper {
  padding: px2rem(10);
  box-sizing: border-box;
  width: 100%;
  height: px2rem(80);
  .shelf-dialog-newgroup-group-name {
    font-size: px2rem(8);
  }
  .shelf-dialog-newgroup-input-wrapper {
    width: 100%;
    height: px2rem(20);
    border: 1px solid rgba(139, 139, 139, 0.582);
    display: flex;
    align-items: center;
    margin-top: px2rem(10);
    .shelf-dialog-newgroup-text {
      flex: 1;
      border: none;
      &:focus {
        outline: none;
      }
    }
    .shelf-dialog-newgroup-delete {
      background: rgba(112, 112, 112, 0.384);
      border-radius: 50%;
      font-size: px2rem(12);
      margin: 0 px2rem(5);
    }
  }
}
.shelf-dialog-btn-wrapper {
  width: 100%;
  @include center;
  .dialog-btn {
    flex: 1;
    @include center;
  }
}
</style>
