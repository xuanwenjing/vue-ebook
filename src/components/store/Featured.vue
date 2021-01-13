<template>
  <div class="featured-wrapper">
    <title-view :titleLeft="titleLeft" :titleRight="$t('home.seeAll')" @Click="seeAll" :titleRightVisible="titleRightVisible"></title-view>
    <div class="feature-content-wrapper">
      <div class="feature-content-item" @click="goToDetail(item)" v-for="(item,index) in featureData" :key="index">
        <div class="cover">
          <img :src="item.cover" alt="">
        </div>
        <div class="content-wrapper">
          <div class="title">{{item.title}}</div>
          <div class="author">{{item.author}}</div>
          <div class="catagory">{{getCategory(item.category)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title';
import { getCategoryFromId } from '../../utils/store';
export default {
  props: {
    featuredList: Array,
    titleRightVisible: {
      type: Boolean,
      default() {
        return true;
      }
    },
    titleLeft: String
  },
  components: {
    TitleView
  },
  methods: {
    seeAll() {},
    getCategory(id) {
      return getCategoryFromId(id, this);
    },
    goToDetail(item) {
      this.$emit('onClick', [item, this]);
    }
  },
  computed: {
    featureData() {
      if (this.featuredList.length) {
        return this.featuredList;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.featured-wrapper {
  width: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  .feature-content-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: px2rem(10) 0;
    .feature-content-item {
      flex: 0 0 50%;
      display: flex;
      margin-bottom: px2rem(20);
      .cover {
        flex: 0 0 35%;
        margin-right: px2rem(8);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content-wrapper {
        flex: 65%;
        .title {
          font-size: px2rem(13);
          @include ellipsis2(2);
          line-height: px2rem(16);
        }
        .author {
          margin: px2rem(20) 0 px2rem(10) 0;
          font-size: px2rem(12);
          @include ellipsis2(1);
          color: rgb(85, 85, 85);
        }
        .catagory {
          font-size: px2rem(12);
          color: rgb(85, 85, 85);
        }
      }
    }
  }
}
</style>
