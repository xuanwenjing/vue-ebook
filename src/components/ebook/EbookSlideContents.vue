<template>
  <div class="ebook-slide-contents">
    <div class="content-search-wrapper">
      <div class="content-search-input-warpper">
        <span class="icon-search icon search-icon"></span>
        <input class="search-input" @keyup.enter.exact="showSearchResult" @click="showSearchPage()" v-model='query' type="text" :placeholder="$t('book.searchHint')">
      </div>
      <div class="cancel-search" v-if="searchVisible" @click='hideSearchPage()'><span>{{$t('book.cancel')}}</span></div>
    </div>
    <div class="contents-book-wrapper" v-show="!searchVisible">
      <div class="contents-book-img-wrapper">
        <img :src="cover" class="contents-book-img">
      </div>
      <div class="contents-book-info-wrapper">
        <span class="book-title">{{metadata.title}}</span>
        <span class="book-author">{{metadata.creator}}</span>
      </div>
      <div class="contents-book-progress-wrapper">
        <span class="progress">{{progress+'%'+$t('book.haveRead2')}}</span>
        <span class="progress-text">{{getReadTimeText()}}</span>
      </div>
    </div>
    <scroll class="contents-lists-wrapper" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
      <div class="contents-list" v-for="(item,index) in navigation" :key="index" :class="{'selected':section === index}" @click="selectSection(item)">
        <span class="content-list-item-label" :style="contentItemStyle(item)">{{item.label}}</span>
        <span class="content-list-item-page">{{item.page}}</span>
      </div>
    </scroll>

    <scroll class="contents-lists-search-wrapper" v-show="searchVisible" :top="66" :bottom="48" ref="scroll">
      <div class="contents-list-search" v-for="(item,index) in queryList" :key="index" @click="selectSearchResult(item)">
        <div class="content-list-search-item-label" v-html="item.excerpt"></div>
      </div>
    </scroll>

  </div>
</template>

<script>
// import localStorage from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin';
import { px2rem } from '../../utils/utils';
import Scroll from '../common/Scroll';
export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchVisible: false,
      query: '',
      queryList: []
    };
  },
  methods: {
    hideSearchPage() {
      this.searchVisible = false;
      this.query = '';
      this.queryList = [];
    },
    showSearchPage() {
      this.searchVisible = true;
    },
    contentItemStyle(item) {
      return {
        marginLeft: px2rem(item.level * 15) + 'rem'
      };
    },
    selectSection(item) {
      this.display(item.href, this.toggleTitleAndMenu);
    },
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    showSearchResult() {
      if (this.query && this.query.length > 0) {
        this.currentBook.ready.then(() => {
          this.doSearch(this.query).then(result => {
            result.forEach(item => {
              item.excerpt = item.excerpt.replace(
                this.query,
                `<span class="selected">${this.query}</span>`
              );
            });
            this.queryList = result;
          });
        });
      }
    },
    selectSearchResult(item) {
      this.display(item.cfi, () => {
        this.toggleTitleAndMenu();
        this.currentBook.rendition.annotations.highlight(item.cfi);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-slide-contents {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-search-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    display: flex;
    color: rgba(128, 127, 127, 0.973);
    .content-search-input-warpper {
      border: 1px solid rgba(97, 95, 94, 0.342);
      border-radius: 5px;
      flex: 1;
      display: flex;
      width: 100%;
      height: 100%;
      padding: px2rem(8);
      box-sizing: border-box;
      .search-icon {
        flex: 0 0 px2rem(20);
        font-size: px2rem(15);
        @include center;
        margin-right: px2rem(3);
      }
      .search-input {
        font-size: px2rem(15);
        flex: 1;
        -webkit-appearance: none;
        border: none;
        background: none;
        &:focus {
          outline: none;
        }
      }
    }
    .cancel-search {
      flex: 0 0 px2rem(20);
      font-size: px2rem(5);
      @include center;
      padding: px2rem(10);
      box-sizing: border-box;
    }
  }
  .contents-book-wrapper {
    width: 100%;
    height: px2rem(70);
    padding: px2rem(10) 0 px2rem(20) 0;
    border-bottom: 1px solid rgba(124, 124, 124, 0.473);
    display: flex;
    font-size: px2rem(16);
    .contents-book-img-wrapper {
      flex: 0 0 px2rem(80);
      height: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .contents-book-img {
        width: 100%;
        height: 100%;
      }
    }
    .contents-book-info-wrapper {
      flex: 1;
      font-size: px2rem(10);
      height: 100%;
      width: px2rem(140);
      .book-title {
        @include ellipsis2(2);
      }
      .book-author {
        display: block;
        @include ellipsis;
        margin-top: px2rem(5);
      }
    }
    .contents-book-progress-wrapper {
      padding: 0 px2rem(10);
      box-sizing: border-box;
      font-size: px2rem(10);
      flex: 0 0 px2rem(100);
      height: 100%;
      .progress {
        display: block;
      }
      .progress-text {
        display: block;
        margin-top: px2rem(5);
      }
    }
  }
  .contents-lists-wrapper {
    font-size: px2rem(14);
    .contents-list {
      display: flex;
      margin: 0 px2rem(20);
      box-sizing: border-box;
      border-bottom: 1px solid rgba(129, 129, 129, 0.336);
      .content-list-item-label {
        flex: 1;
        @include ellipsis;
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
      .content-list-item-page {
        padding: px2rem(20) 0;
        padding-left: px2rem(10);
        box-sizing: border-box;
      }
    }
  }
  .contents-lists-search-wrapper {
    font-size: px2rem(14);
    .contents-list-search {
      display: flex;
      margin: 0 px2rem(20);
      box-sizing: border-box;
      border-bottom: 1px solid rgba(129, 129, 129, 0.336);
      .content-list-search-item-label {
        flex: 1;
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
}
</style>
