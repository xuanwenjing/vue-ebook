<template>
  <div class="book-detail-wrapper">
    <book-title @onClickBack="onClickBack" @onClickShelf="onClickShelf"></book-title>
    <scroll :top="50" :bottom="60" ref="scroll">
      <book-info :title="title" :cover="cover" :author="author"></book-info>
      <div class="book-detail-content-wrapper">
        <div class="detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="detail-content-wrapper">
          <div class="publisher-wrapper">
            <span class="publisher">{{$t('detail.publisher')}}</span><span class="text">{{publisher}}</span>
          </div>
          <div class="category-wrapper">
            <span class="category">{{$t('detail.category')}}</span><span class="text">{{categoryText}}</span>
          </div>
          <div class="lang-wrapper">
            <span class="lang">{{$t('detail.lang')}}</span><span class="text">{{language}}</span>
          </div>
          <div class="ISBN-wrapper">
            <span class="ISBN">{{$t('detail.ISBN')}}</span><span class="text">{{metadata? metadata.identifier:'-'}}</span>
          </div>
        </div>
      </div>
      <div class="book-detail-navigation-wrapper">
        <div class="loading" v-show="!displayed">
          <span>{{$t('detail.loading')}}</span>
        </div>
        <div class="navigation-text-wrapper" v-show="displayed">
          <div class="navigation-text">
            {{$t('detail.navigation')}}
          </div>
          <div class="navigation-lists-wrapper">
            <div class="navigation-item" v-for="(item,index) in navigationData" :key="index">
              <div class="text" :class="{'indent':item.parent}">{{item.label}}</div>
            </div>
          </div>
          <div class="trial">{{$t('detail.trial')}}</div>
        </div>

      </div>
      <div class="preview-wrapper">

        <div class="preview-show" id="preview" ref="preview"></div>
      </div>
    </scroll>
    <div class="btn-wrapper">
      <div class="btn" @click="showBookReader">{{$t('detail.read')}}</div>
      <div class="btn" @click="showSpeaking">{{$t('detail.listen')}}</div>
      <div class="btn" @click="addToShelf">
        <span class="icon-check" v-show="inBookShelf"></span>
        <span v-show="!inBookShelf">{{$t('detail.addOrRemoveShelf')}}</span>
        <span v-show="inBookShelf">{{$t('detail.isAddedToShelf')}}</span>
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
import BookTitle from '../../components/detail/BookTitle';
import BookInfo from '../../components/detail/BookInfo';
import { detail } from '../../api/store';
import Toast from '../../components/common/Toast';
import { getCategoryName, addToBookShelf, removeFromBookShelf } from '../../utils/store';
import Scroll from '../../components/common/Scroll';
import { storeShelfMixin } from '../../utils/mixin';
import Epub from 'epubjs';
global.ePub = Epub;
export default {
  mixins: [storeShelfMixin],
  components: {
    BookTitle,
    BookInfo,
    Scroll,
    Toast
  },
  data() {
    return {
      fileName: '',
      title: '',
      cover: '',
      author: '',
      publisher: '-',
      language: '-',
      categoryText: '-',
      opf: null,
      book: null,
      metadata: null,
      navigation: null,
      displayed: false,
      toastText: '',
      data: null
    };
  },
  computed: {
    navigationData() {
      if (this.navigation) {
        var res = [];
        [...this.navigation.toc].forEach(item => {
          res.push(item);
          res = [].concat(...res, ...item.subitems);
        });
        return res;
      } else {
        return '';
      }
    },
    inBookShelf() {
      let res = false;
      // const shelfList = localStorage.getBookShelf();

      if (this.shelfList && this.data) {
        this.shelfList.forEach(item => {
          if (item.type === 1 && item.fileName === this.data.fileName) {
            res = true;
          } else if (item.type === 2 && item.itemList) {
            item.itemList.forEach(subItem => {
              if (subItem.type === 1 && subItem.fileName === this.data.fileName) {
                res = true;
              }
            });
          }
        });
      }
      return res;
    }
  },
  methods: {
    showToast(text) {
      this.toastText = text;
      this.$refs.toast.show();
    },
    init() {
      this.fileName = this.$route.query.fileName;
      this.categoryText = this.$route.query.category;

      if (this.fileName) {
        detail(this.fileName).then(response => {
          if (response && response.data.error_code === 0 && response.data.data) {
            this.data = response.data.data;
            this.title = this.data.title;
            this.cover = this.data.cover;
            this.author = this.data.author;
            this.publisher = this.data.publisher;
            this.language = this.data.language[0].toUpperCase() + this.data.language.substring(1);
            let rootFile = this.data.rootFile;
            // console.log(rootFile);

            if (rootFile.startsWith('/')) {
              rootFile = rootFile.substring(1, rootFile.length);
            }
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`;
            // console.log(this.opf);

            this.parseBook(this.opf);
          } else {
            this.showToast(response.data.msg);
          }
        });
      }
    },
    parseBook(blob) {
      this.book = new Epub(blob);
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata;
      });
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav;
        if (this.navigation.toc && this.navigation.toc.length > 1) {
          this.display(this.navigation.toc[1].href).then(section => {
            this.displayed = true;
            if (this.$refs.scroll) {
              this.$refs.scroll.refresh();
            }
          });
        }
      });
    },
    display(location) {
      if (this.$refs.preview) {
        if (!this.rendition) {
          this.rendition = this.book.renderTo('preview', {
            height: window.innerHeight,
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            method: 'default'
          });
        }
        if (!location) {
          return this.rendition.display();
        } else {
          return this.rendition.display(location);
        }
      }
    },
    onClickBack() {
      this.$router.go(-1);
    },
    onClickShelf() {
      this.$router.push('/store/shelf');
    },
    showBookReader() {
      const path = `/ebook/${getCategoryName(Number(this.categoryText))}|${this.fileName}`;
      this.$router.push({
        path
      });
    },
    showSpeaking() {
      // console.log(this.fileName);
      this.$router.push({
        path: '/store/speaking',
        query: {
          fileName: this.fileName
        }
      });
    },
    addToShelf() {
      if (this.inBookShelf) {
        this.setShelfList(removeFromBookShelf(this.data));
      } else {
        this.setShelfList(addToBookShelf(this.data));
      }
    }
  },
  mounted() {
    this.init();
    if (this.shelfList || this.shelfList.length === 0) {
      this.getShelfList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.book-detail-wrapper {
  .book-detail-content-wrapper {
    border-top: 1px solid rgba(151, 151, 151, 0.342);
    padding: px2rem(10);
    box-sizing: border-box;
    .detail-content-title {
      font-size: px2rem(22);
      font-weight: bold;
      margin: px2rem(10) 0;
    }
    .detail-content-wrapper {
      margin: px2rem(20) 0;
      font-size: px2rem(14);
      color: rgba(143, 143, 143, 0.836);
      .publisher-wrapper {
        display: flex;
        margin: px2rem(8) 0;
        .publisher {
          flex: 0 0 20%;
        }
        .text {
          flex: 1;
        }
      }
      .category-wrapper {
        display: flex;
        margin: px2rem(8) 0;
        .category {
          flex: 0 0 20%;
        }
        .text {
          flex: 1;
        }
      }
      .lang-wrapper {
        display: flex;
        margin: px2rem(8) 0;
        .lang {
          flex: 0 0 20%;
        }
        .text {
          flex: 1;
        }
      }
      .ISBN-wrapper {
        display: flex;
        margin: px2rem(8) 0;
        .ISBN {
          flex: 0 0 20%;
        }
        .text {
          flex: 1;
        }
      }
    }
  }
  .book-detail-navigation-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    border-top: 1px solid rgba(211, 211, 211, 0.514);
    font-size: px2rem(16);
    color: rgba(87, 87, 87, 0.76);
    .loading {
      span {
      }
    }
    .navigation-text-wrapper {
      .navigation-text {
        font-size: px2rem(22);
        font-weight: bold;
        color: rgb(0, 0, 0);
        margin: px2rem(20) 0;
      }
      .navigation-lists-wrapper {
        .navigation-item {
          // margin: px2rem(20) 0;
          .text {
            text-align: left;
            line-height: px2rem(60);
            border-top: 1px solid rgba(211, 211, 211, 0.514);
            @include ellipsis;
            &.indent {
              margin-left: px2rem(20);
            }
          }
        }
      }
      .trial {
        font-size: px2rem(22);
        font-weight: bold;
        color: rgb(0, 0, 0);
        margin: px2rem(20) px2rem(10);
      }
    }
  }

  .btn-wrapper {
    width: 100%;
    height: px2rem(60);
    box-shadow: 0 px2rem(-4) px2rem(8) rgba(207, 207, 207, 0.699);
    display: flex;
    .btn {
      flex: 1;
      @include center;
      font-size: px2rem(16);
      color: rgb(0, 159, 252);
      font-weight: bold;
    }
  }
}
</style>
