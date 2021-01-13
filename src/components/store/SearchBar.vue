<template>
  <div>
    <div class="search-bar" :class="{'hide-titie':!titleVisible,'show-shadow':shadowVisible}">
      <transition name='title-down'>
        <div class="search-bar-title-wrapper" v-show='titleVisible'>
          <div class="text title">{{$t('home.title')}}</div>
          <div class="icon-shake icon" @click="showFlapCard"></div>
        </div>
      </transition>
      <div class="icon-back icon" :class="{'down-icon':!titleVisible}" @click="backClick"></div>
      <div class="search-bar-search" :class="{'up-search':!titleVisible}">
        <div class="blank" :class="{'blank-flex':!titleVisible}"></div>
        <div class="search-bar-search-warpper">
          <div class="icon-search icon"></div>
          <input type="text" class="input" v-model="searchText" @keyup.13.exact="showSearchResult" @click="inputClick" :placeholder="$t('home.hint')">
        </div>
      </div>
    </div>
    <transition name='hotList-up'>
      <hot-search-list v-show="hotListVisible" ref="hotSearchList"></hot-search-list>
    </transition>

  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin';
import HotSearchList from './HotSearchList';
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data() {
    return {
      searchText: '',
      titleVisible: true,
      hotListVisible: false,
      shadowVisible: false
    };
  },
  watch: {
    offsetY(v) {
      if (v > 0) {
        this.titleVisible = false;
        this.shadowVisible = true;
      } else {
        this.titleVisible = true;
        this.shadowVisible = false;
      }
    },
    hotSearchOffsetY(v) {
      if (v > 0) {
        this.shadowVisible = true;
      } else {
        this.shadowVisible = false;
      }
    }
  },
  methods: {
    showSearchResult() {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      });
    },
    showFlapCard() {
      this.setFlapCardVisible(true);
    },
    inputClick() {
      this.titleVisible = false;
      this.hotListVisible = true;
      this.shadowVisible = false;
      this.$nextTick(() => {
        this.$refs.hotSearchList.reset(0, 0);
      });
    },
    backClick() {
      this.titleVisible = true;

      if (this.offsetY > 0) {
        this.shadowVisible = true;
        this.titleVisible = false;
      } else {
        this.shadowVisible = false;
        this.titleVisible = true;
      }
      if (this.hotListVisible) {
        this.hotListVisible = false;
      } else {
        this.$router.push('/store/shelf');
      }

      // if (this.hotListVisible === false) {
      //   console.log('back');
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.search-bar {
  width: 100%;
  height: px2rem(90);
  position: relative;
  &.show-shadow {
    box-shadow: 0 px2rem(2) px2rem(8) rgb(148, 148, 148);
  }
  &.hide-titie {
    height: px2rem(50);
  }
  .search-bar-title-wrapper {
    width: 100%;
    height: px2rem(40);
    padding: px2rem(10);
    box-sizing: border-box;
    position: relative;
    .text {
      position: absolute;
      left: 50%;
      top: px2rem(15);
      transform: translate(-50%, 0);
    }
    .icon-shake {
      position: absolute;
      right: px2rem(15);
      top: px2rem(10);
    }
  }
  .icon-back {
    position: absolute;
    z-index: 100;
    left: px2rem(10);
    top: px2rem(10);
    transition: all $animationTime $animationType;
    &.down-icon {
      top: px2rem(15);
    }
  }
  .search-bar-search {
    position: absolute;
    left: 0;
    top: px2rem(40);
    width: 100%;
    height: px2rem(50);
    padding: px2rem(5);
    box-sizing: border-box;
    display: flex;
    transition: top $animationTime $animationType;
    &.up-search {
      top: 0;
    }
    .blank {
      flex: 0 0 0;
      transition: all $animationTime $animationType;
      &.blank-flex {
        flex: 0 0 px2rem(30);
      }
    }
    .search-bar-search-warpper {
      display: flex;
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background: rgba(202, 202, 202, 0.205);
      border-radius: px2rem(20);
      align-items: center;
      flex: 1;
      .icon {
        font-size: px2rem(16);
        color: rgba(167, 164, 164, 0.637);
      }
      .input {
        margin-left: px2rem(10);
        border: none;
        background: none;
        width: 100%;

        height: 100%;
        font-size: px2rem(14);
        &::-webkit-input-placeholder {
          color: rgba(139, 138, 138, 0.534);
        }
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
