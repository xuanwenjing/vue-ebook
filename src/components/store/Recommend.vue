<template>
  <div class="recommend-wrapper">
    <title-view :titleLeft="$t('home.recommend')" :titleRight="$t('home.seeAll')" @onClick="seeAll"></title-view>
    <div class="recommend-content-wrapper">
      <div class="recommend-content-item" @click="goToDetail(item)" v-for="(item,index) in recommendData" :key="index">
        <div class="recommend-cover">
          <img :src="item.cover" alt="">
        </div>
        <div class="recommend-title">{{item.title}}</div>
        <div class="recommend-result">{{$t('home.readers').replace('$1', item.readers)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title';
export default {
  props: {
    recommendList: Array
  },
  components: {
    TitleView
  },
  methods: {
    seeAll() {},
    goToDetail(item) {
      this.$emit('onClick', [item, this]);
    }
  },
  computed: {
    recommendData() {
      if (this.recommendList.length) {
        return this.recommendList;
      } else {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.recommend-wrapper {
  width: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  margin-top: px2rem(-30);
  .recommend-content-wrapper {
    @include center;
    display: flex;
    margin: px2rem(10) 0;
    .recommend-content-item {
      flex: 0 0 33.3%;
      padding: px2rem(10);
      box-sizing: border-box;
      .recommend-cover {
        @include center;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .recommend-title {
        @include ellipsis2(2);
        overflow: hidden;
        font-size: px2rem(14);
        text-align: center;
        font-weight: bold;
        line-height: px2rem(16);
        margin: px2rem(10) 0;
      }
      .recommend-result {
        font-size: px2rem(13);
        color: rgb(153, 153, 153);
      }
    }
  }
}
</style>
