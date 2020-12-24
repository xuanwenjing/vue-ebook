<template>
  <div class="ebook-slide-bookmark">
    <div class="ebook-slide-bookmark-title-wrapper">
      <span class="text">{{this.$t('book.bookmark')}}</span>
      <span class="point">·</span>
      <span class="count">{{count}}</span>
    </div>
    <scroll>
      <div class="ebook-slide-bookmark-lists-wrapper">
        <div class="ebook-slide-bookmark-items" @click="display(item.cfi,toggleTitleAndMenu)" v-for="(item,index) in bookmarkList" :key='index'>
          <div class="icon-wrapper">
            <div class="icon-bookmark">
            </div>
          </div>
          <div class="ebook-slide-bookmark-item">{{item.text}}</div>
        </div>
      </div>
    </scroll>

  </div>
</template>

<script>
import localStorage from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin';
import Scroll from '../../components/common/Scroll';
export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      count: 0,
      bookmarkList: []
    };
  },
  mounted() {
    const bookmark = localStorage.getBookmark(this.fileName);

    if (bookmark) {
      this.count = bookmark.length;
      this.bookmarkList = bookmark;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-slide-bookmark {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .ebook-slide-bookmark-title-wrapper {
    width: 100%;
    flex: 0 0 px2rem(30);
    border-bottom: 1px solid rgb(182, 182, 182);
    padding: px2rem(14);
    font-size: px2rem(14);
    font-weight: bold;
    box-sizing: border-box;
    .text {
    }
    .point {
      margin: 0 px2rem(4);
    }
    .count {
    }
  }
  .ebook-slide-bookmark-lists-wrapper {
    flex: 1;
    .ebook-slide-bookmark-items {
      border-bottom: 1px solid rgb(182, 182, 182);
      display: flex;
      font-size: px2rem(16);
      padding: px2rem(10);
      box-sizing: border-box;
      @include center;
      .icon-wrapper {
        flex: 0 0 px2rem(20);
        width: px2rem(20);
        height: px2rem(20);
        background: rgba(110, 110, 110, 0.39);
        border-radius: 50%;
        margin-right: px2rem(10);
        @include center;
        .icon-bookmark {
        }
      }

      .ebook-slide-bookmark-item {
        @include ellipsis2(3);
        flex: 1;
      }
    }
  }
}
</style>
