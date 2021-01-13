<template>
  <div class="hot-search">
    <div class="hot-search-title-warpper">
      <div class="hot-search-title-left">{{title.left}}</div>
      <div class="hot-search-title-right">{{title.right}}</div>
    </div>
    <div class="hot-search-content-warpper">
      <div class="hot-search-content-item" v-for="(item,index) in searchList" :key="index">
        <div class="icon" :class="item.icon"></div>
        <div class="right-wrapper">
          <div class="text">{{item.text}}</div>
          <div class="searchNumber" v-show="item.searchNumber!==''">{{`${item.searchNumber}万人搜索`}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Object,
      default: () => {
        return {
          left: '热门搜索',
          right: '清空'
        };
      }
    },
    searchList: {
      type: Array,
      default: () => {
        return [
          { icon: 'icon-book', text: 'Computer Science', searchNumber: '1.8' },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' }
        ];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.hot-search {
  width: 100%;
  .hot-search-title-warpper {
    width: 100%;
    // height: px2rem(20);
    padding: px2rem(5) px2rem(10);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: px2rem(14);
    font-weight: bold;
    .hot-search-title-left {
      color: rgba(54, 54, 54, 0.781);
    }
    .hot-search-title-right {
      color: rgb(48, 152, 250);
    }
  }
  .hot-search-content-warpper {
    width: 100%;
    padding: px2rem(10) px2rem(10) 0 px2rem(10);
    box-sizing: border-box;
    .hot-search-content-item {
      display: flex;
      height: px2rem(40);
      margin-bottom: px2rem(10);
      .icon {
        font-size: px2rem(16);
        flex: 0 0 px2rem(40);
        @include center;
      }
      .right-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        .text {
          font-size: px2rem(16);
        }
        .searchNumber {
          margin-top: px2rem(5);
          font-size: px2rem(14);
          color: rgba(168, 168, 168, 0.541);
        }
      }
    }
  }
}
</style>
