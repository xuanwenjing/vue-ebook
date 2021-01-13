<template>
  <div class="store-shelf">
    <shelf-title :showBack="true"></shelf-title>
    <scroll :top="0" :bottom="scrollBottom" class="store-shelf-scroll" ref="scroll" @onScroll='onScroll'>
      <shelf-list :data="categoryData" :top="45" v-if="categoryData.length>0"></shelf-list>
      <div class="emptyList" v-else>
        <span class="icon-book2"></span>
      </div>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/shelfTitle';
import Scroll from '../../components/common/Scroll';
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
    this.setIsCategory(true);
    this.setCategoryName(this.$route.query.category);
    if (this.shelfList.filter(item => item.title === this.categoryName)[0]) {
      this.setCategoryData(
        this.shelfList.filter(item => item.title === this.categoryName)[0].itemList
      );
    }
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
    .emptyList {
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(64);
    }
  }
}
</style>
