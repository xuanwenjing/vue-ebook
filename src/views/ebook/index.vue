<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader';
import EbookTitle from '../../components/ebook/EbookTitle';
import EbookMenu from '../../components/ebook/EbookMenu';
import EbookHeader from '../../components/ebook/EbookHeader';
import EbookFooter from '../../components/ebook/EbookFooter';
import localStorage from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin';
import { setInterval, setTimeout } from 'timers';
import EbookBookmark from '../../components/ebook/EbookBookmark';
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY(v) {
      if (!this.menuVisible) {
        if (v === 0) {
          this.restore();
        } else if (v > 0) {
          this.move(v);
        }
      }
    }
  },
  methods: {
    move(v) {
      this.$refs.ebook.style.top = v + 'px';
    },
    restore() {
      this.$refs.ebook.style.top = 0 + 'px';
      this.$refs.ebook.style.transition = 'all 0.2s linear';
      setTimeout(() => {
        this.$refs.ebook.style.transition = '';
      }, 200);
    },
    startLoopReadTime() {
      let readTime = localStorage.getReadTime(this.fileName);
      if (readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          localStorage.saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
@import '../../assets/styles/global.scss';
.ebook {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
