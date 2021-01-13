<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <scroll :top="0" :bottom="scrollBottom" class="store-shelf-scroll" ref="scroll" @onScroll='onScroll'>
      <shelf-search-bar></shelf-search-bar>
      <shelf-list :data="shelfList"></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/shelfTitle';
import Scroll from '../../components/common/Scroll';
import ShelfSearchBar from '../../components/shelf/ShelfSearchBar';
import ShelfList from '../../components/shelf/ShelfList';
import ShelfFooter from '../../components/shelf/ShelfFooter';
import { storeShelfMixin } from '../../utils/mixin';

export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      scrollBottom: 0
    };
  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearchBar,
    ShelfList,
    ShelfFooter
  },
  watch: {
    isEditMode(v) {
      if (v) {
        this.scrollBottom = 48;
      } else {
        this.scrollBottom = 0;
      }
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    }
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    }
  },
  mounted() {
    this.setIsCategory(false);
    this.getShelfList();
    this.setCategoryName('');
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.store-shelf {
  width: 100%;
  height: 100%;
  position: relative;
  background: white;
  .store-shelf-scroll {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 101;
  }
}
</style>
