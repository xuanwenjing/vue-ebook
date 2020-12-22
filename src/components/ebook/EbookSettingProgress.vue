<template>
  <transition name='slide-down'>
    <div class="setting-wrapper" v-show="settingVisible===2">
      <div class="progress-readed-text">
        <span>{{getReadTimeText()}}</span>
        <span class="icon-forward"></span>
      </div>
      <div class="pregress-wrapper">
        <div class="icon-back left" @click='prevSection()'></div>
        <input class="progress" type="range" max='100' min='0' :value="progress" :disabled="!bookAvailable" @change="onProgressChange($event.target.value)" step='1' @input="onProgressInput($event.target.value)" ref="progress">
        <div class="icon-forward right" @click='nextSection()'></div>
      </div>
      <div class="book-text">
        <span class="book-section-text">{{getSectionName}}</span>
        <span>({{bookAvailable? progress +'%' : '加载中...'}})</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  computed: {
    getSectionName() {
      if (this.section) {
        const sectionInfo = this.currentBook.section(this.section);
        if (sectionInfo && sectionInfo.href) {
          return this.currentBook.navigation.get(sectionInfo.href).label;
        }
      }
      return '';
    }
  },
  methods: {
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg();
        this.displayProgress();
      });
    },
    displayProgress() {
      const location =
        this.progress / 100 > 0
          ? this.currentBook.locations.cfiFromPercentage(this.progress / 100)
          : 0;
      // this.currentBook.rendition.display(location).then(() => {
      //   this.refreshLocation();
      // });
      this.display(location);
    },
    onProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg();
      });
      // .then(() => {
      //   this.displayProgress();
      // });
    },
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection();
        });
      }
    },
    nextSection() {
      if (this.section < this.currentBook.spine.length && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection();
        });
      }
    },
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section);
      if (sectionInfo && sectionInfo.href) {
        // this.currentBook.rendition.display(sectionInfo.href).then(() => {
        //   this.refreshLocation();
        //   this.updateProgressBg();
        // });
        this.display(sectionInfo.href);
      }
    },
    updateProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    getReadTimeText() {
      let readTime = localStorage.getReadTime(this.flieName);
      readTime = readTime ? Math.floor(readTime / 60) + 1 : 1;
      return this.$t('book.haveRead').replace('$1', readTime);
    }
  },
  updated() {
    this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  position: absolute;
  left: 0;
  bottom: px2rem(45);
  width: 100%;
  background: red;
  display: flex;
  flex-direction: column;
  .progress-readed-text {
    font-size: px2rem(14);
    @include center;
    margin: px2rem(10) 0;
  }
  .pregress-wrapper {
    display: flex;
    align-items: center;
    font-size: px2rem(20);
    .left {
      flex: 0 0 px2rem(30);
      @include center;
    }
    .progress {
      flex: 1;
      -webkit-appearance: none;
      height: px2rem(4);
      background: -webkit-linear-gradient(rgb(250, 250, 250), rgb(153, 153, 153)) no-repeat,
        rgb(238, 238, 238);
      background-size: 0 100%;
      &:focus {
        outline: none;
      }
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: px2rem(20);
        width: px2rem(20);
        border-radius: 50%;
        background: white;
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
        border: px2rem(1) solid rgb(43, 43, 43);
      }
    }
    .right {
      flex: 0 0 px2rem(30);
      @include center;
    }
  }
  .book-text {
    @include center;
    font-size: px2rem(10);
    margin: px2rem(10) 0;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .book-section-text {
      @include ellipsis;
    }
  }
}
</style>
