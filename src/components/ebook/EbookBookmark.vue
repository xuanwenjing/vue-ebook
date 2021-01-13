<template>
  <div class="ebook-bookmark">
    <div class="bookmark-content-wrapper" ref="ebookBookmark">
      <div class="ebook-bookmark-text-wrapper">
        <div class="ebook-bookmark-down-wrapper" ref="iconDown">
          <span class="icon-down"></span>
        </div>
        <div class="ebook-bookmark-text">
          {{text}}
        </div>
      </div>
      <div class="ebook-bookmark-icon-wrapper" :style="isFixed?fixedStyle:{}">
        <bookmark :width="15" :height="35" :color="color" ref="bookmark"></bookmark>
      </div>
    </div>

  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import Bookmark from '../common/Bookmark';
import { realPx, px2rem } from '../../utils/utils';
import localStorage from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  data() {
    return {
      text: '',
      color: 'white',
      isFixed: false,
      isPull: false
    };
  },
  computed: {
    height() {
      return realPx(35);
    },
    threshold() {
      return realPx(55);
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: px2rem(30)
      };
    }
  },
  watch: {
    isBookmark(v) {
      if (v) {
        this.isFixed = true;
        this.color = 'blue';
      } else {
        this.isFixed = false;
        this.color = 'white';
      }
    },
    offsetY(v) {
      if (this.menuVisible) {
        return;
      }
      if (v >= this.height && v <= this.threshold) {
        // 状态2
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        // 状态3
        this.afterThreshold(v);
      } else if (v > 0 && v < this.height) {
        // 状态1
        this.beforeHeight(v);
      } else if (v === 0) {
        // 最终状态
        if (this.isPull) {
          this.setIsBookmark(!this.isBookmark);
        }
        if (this.isBookmark) {
          this.addBookmark();
          this.isFixed = true;
        } else {
          this.removeBookmark();
          this.isFixed = false;
        }
      }
    }
  },
  methods: {
    addBookmark() {
      this.bookmark = localStorage.getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      }
      const currentLocation = this.currentBook.rendition.currentLocation();
      const baseCfi = currentLocation.start.cfi.replace(/!.*/, '');
      const startCfi = currentLocation.start.cfi.replace(/.*!/, '').replace(')', '');
      const endCfi = currentLocation.end.cfi.replace(/.*!/, '');
      const rangeCfi = baseCfi + '!' + ',' + startCfi + ',' + endCfi;
      this.currentBook.getRange(rangeCfi).then(range => {
        const text = range.toString().replace(/\s\s/g, '');
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        });
        localStorage.saveBookmark(this.fileName, this.bookmark);
      });
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      this.bookmark = localStorage.getBookmark(this.fileName);
      localStorage.saveBookmark(
        this.fileName,
        this.bookmark.filter(item => item.cfi !== currentLocation.start.cfi)
      );
      this.setIsBookmark(false);
    },
    beforeHeight(v) {
      this.isPull = false;
      this.$refs.ebookBookmark.style.bottom = '0px';
      this.isFixed = false;
      this.$refs.iconDown.style.transform = 'rotate(0deg)';
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark');
        this.color = 'blue';
      } else {
        this.text = this.$t('book.pulldownAddMark');
        this.color = 'white';
      }
    },
    beforeThreshold(v) {
      this.$refs.ebookBookmark.style.bottom = `${v - this.height}px`;
      this.isFixed = false;
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark');
        this.color = 'blue';
      } else {
        this.text = this.$t('book.pulldownAddMark');
        this.color = 'white';
      }

      if (this.$refs.iconDown.style.transform === 'rotate(180deg)') {
        this.$refs.iconDown.style.transform = 'rotate(0deg)';
      }
    },
    afterThreshold(v) {
      this.$refs.ebookBookmark.style.bottom = `${v - this.height}px`;
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark');
        this.color = 'white';
      } else {
        this.text = this.$t('book.releaseAddMark');
        this.color = 'blue';
      }
      this.$refs.iconDown.style.transform = 'rotate(180deg)';
      this.isPull = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-bookmark {
  position: absolute;
  top: px2rem(-667);
  left: 0;
  width: 100%;
  height: px2rem(667);
  background: rgba(53, 53, 53, 0.616);
  .bookmark-content-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: rgb(104, 104, 104);
        transition: all 0.2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: rgb(58, 58, 58);
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(10);
    }
  }
}
</style>
