<template>
  <div class="catagory-book-wrapper">
    <title-view :titleLeft="getCategory(categoryData.category)" :titleRight="$t('home.seeAll')" @onClick="seeAll(categoryData.category)"></title-view>
    <div class="category-content-wrapper">
      <div class="category-content-item" @click="goToDetail(subItem)" v-for="(subItem,index) in (categoryData.list.length>4? categoryData.list.slice(0,4) : categoryData.list)" :key="index">
        <div class="cover">
          <img :src="subItem.cover" alt="">
        </div>
        <div class="title">{{subItem.title}}</div>
        <div class="author">{{subItem.author}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title';
import { getCategoryFromId } from '../../utils/store';
export default {
  components: {
    TitleView
  },
  props: {
    categroyItem: Object
  },
  computed: {
    categoryData() {
      if (this.categroyItem && this.categroyItem.list.length) {
        // console.log('1', this.categroyItem);

        return this.categroyItem;
      } else {
        return [];
      }
    }
  },
  methods: {
    getCategory(id) {
      return getCategoryFromId(id, this);
    },
    seeAll(categoryId) {
      this.$emit('showAllFromCate', [categoryId, this]);
    },
    goToDetail(item) {
      this.$emit('onClick', [item, this]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.catagory-book-wrapper {
  width: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  .category-content-wrapper {
    margin: px2rem(10) 0;
    display: flex;
    .category-content-item {
      flex: 0 0 25%;
      padding: px2rem(5);
      box-sizing: border-box;
      .cover {
        @include center;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        font-size: px2rem(10);
        margin: px2rem(10) 0 px2rem(5) 0;
        @include ellipsis2(2);
      }
      .author {
        font-size: px2rem(5);
        @include ellipsis2(1);
      }
    }
  }
}
</style>
