<template>
  <div class="shelf-list-item" @click="onItemClick()" :class="{'shadow':item.type!==3}">
    <component :class="{'is-edit':item.type===2 && isEditMode}" :is="component" :data="item" :style="{'height':itemHeight}"></component>
    <div class="select-icon icon-selected" :class="{'is-selected':item.selected}" v-show="isEditMode && item.type===1"></div>
  </div>
</template>

<script>
import ShelfItemBook from './ShelfItemBook';
import ShelfItemAdd from './ShelfItemAdd';
import ShelfItemCategory from './ShelfItemCategory';
import { realPx } from '../../utils/utils';
import { storeShelfMixin } from '../../utils/mixin';
export default {
  mixins: [storeShelfMixin],
  props: {
    item: Object
  },
  data() {
    return {
      book: ShelfItemBook,
      add: ShelfItemAdd,
      category: ShelfItemCategory
    };
  },
  computed: {
    component() {
      return this.item.type === 1 ? this.book : this.item.type === 2 ? this.category : this.add;
    },
    itemHeight() {
      return (((window.innerWidth - realPx(120)) / 3) * 350) / 250 + 'px';
    }
  },
  methods: {
    onItemClick() {
      if (!this.isEditMode) {
        if (this.item.type === 1) {
          this.showBookDetail(this.item);
        } else if (this.item.type === 2) {
          // console.log(this.item);

          this.$router.push({
            path: '/store/category',
            query: {
              category: this.item.title
            }
          });
        } else if (this.item.type === 3) {
          this.goToStoreHome();
        }
      } else if (this.item.type === 1) {
        this.item.selected = !this.item.selected;
        if (this.item.selected) {
          this.shelfSelected.push(this.item);
          this.setShelfSelected([...new Set(this.shelfSelected)]);
        } else {
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.item.id));
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-list-item {
  width: 100%;
  position: relative;
  &.shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(8) rgba(150, 149, 149, 0.712);
  }
  .is-edit {
    opacity: 0.5;
  }
  .select-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: rgb(0, 153, 255);
    }
  }
}
</style>
