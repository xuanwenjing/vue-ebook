<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader';
import EbookTitle from '../../components/ebook/EbookTitle';
import EbookMenu from '../../components/ebook/EbookMenu';
import localStorage from '../../utils/localStorage';
import { ebookMixin } from '../../utils/mixin';
import { setInterval } from 'timers';
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  methods: {
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
</style>
