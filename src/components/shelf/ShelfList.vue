<template>
  <div class="shelf-list-wrapper" :style="{top:topList}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key='item.id'>
        <shelf-item :item="item"></shelf-item>
        <div class="shelf-item-title-wrapper">
          <span>{{item.title}}</span>
        </div>
      </div>
    </transition-group>

  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin';
import ShelfItem from './ShelfItem';
import { px2rem } from '../../utils/utils';
export default {
  mixins: [storeShelfMixin],
  props: {
    top: {
      type: Number,
      default: 85
    },
    data: {
      type: Array
    }
  },
  components: {
    ShelfItem
  },
  computed: {
    topList() {
      return px2rem(this.top) + 'rem';
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-list-wrapper {
  position: absolute;
  left: 0;
  // top: px2rem(85);
  width: 100%;
  #shelf-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.333%;
      width: 33.333%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 0.5s;
      }
      .shelf-item-title-wrapper {
        font-size: px2rem(12);
        font-weight: bold;
        margin-top: px2rem(10);
        @include ellipsis2(2);
      }
    }
  }
}
</style>
