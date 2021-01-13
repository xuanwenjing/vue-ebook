<template>
  <div class="category-wrapper">
    <title-view :titleLeft="$t('home.category')" :titleRight="$t('home.seeAll')" @onClick="seeAll(-1)"></title-view>
    <div class="category-content-wrapper">
      <div class="category-item" v-for="(item,index) in categoryData" @click="seeAll(item.category)" :key="index">
        <div class="category-content">
          <div class="category">{{getCategory(item.category)}}</div>
          <div class="num">{{item.num+$t('home.books')}}</div>
        </div>
        <div class="covers">
          <div class="img1">
            <img :src="item.img1" alt="">
          </div>
          <div class="img2">
            <img :src="item.img2" alt="">
          </div>
        </div>
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
    category: Array
  },
  computed: {
    categoryData() {
      if (this.category.length) {
        return this.category;
      } else {
        return [];
      }
    }
  },
  methods: {
    seeAll(id) {
      this.$emit('showAllFromCate', [id, this]);
    },
    getCategory(id) {
      return getCategoryFromId(id, this);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.category-wrapper {
  width: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  .category-content-wrapper {
    margin: px2rem(10) 0;
    display: flex;
    flex-wrap: wrap;
    .category-item {
      flex: 0 0 50%;
      display: flex;
      padding: px2rem(5);
      box-sizing: border-box;
      background: rgba(185, 185, 185, 0.37);
      background-clip: content-box;
      .category-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .category {
          font-size: px2rem(16);
          font-weight: bold;
          margin-bottom: px2rem(10);
        }
        .num {
          font-size: px2rem(14);
        }
      }
      .covers {
        flex: 0 0 45%;
        position: relative;
        display: flex;
        justify-content: flex-start;
        .img1 {
          flex: 0 0 80%;
          transform: scale(0.8);
          transform-origin: left;
          z-index: 100;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .img2 {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform: scale(0.6);
          transform-origin: 70% 50%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
