<template>
  <div class="shelf-search-bar" :class="{'search-top':ifInputClick}">
    <div class="shelf-search-bar-wrapper">
      <div class="shelf-search-bar-icon-wrapper">
        <div class="icon-search"></div>
      </div>
      <div class="shelf-search-bar-input-wrapper">
        <input type="text" @click="searchClick" v-model="searchText" class="shelf-search-bar-input" :placeholder="$t('shelf.search')">
        <div class="icon-close" v-show="searchText.length" @click="searchText=''"></div>
      </div>
    </div>
    <div class="shelf-search-bar-icon-wrapper">
      <div class="icon-cn icon-cn-en" @click="switchLocale" v-show="!ifInputClick && lang === 'cn'"></div>
      <div class="icon-en icon-cn-en" @click="switchLocale" v-show="!ifInputClick && lang === 'en'"></div>
      <div class="text icon-cn-en" v-show="ifInputClick" @click="cancelClick">取消</div>
    </div>
    <transition name="fade">
      <div class="shelf-tab-bar-wrapper" v-show="tabBarVisible" :class="{'tab-top':tabBarVisible,'shadowVisible':shadowVisible}">
        <div class="shelf-tab-item" :class="{'selected':selectedTab===item.id}" v-for="item in tabs" :key="item.id" @click="tabClick(item.id)">
          <span>{{item.text}}</span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import localStorage from '../../utils/localStorage';
import { storeShelfMixin } from '../../utils/mixin';
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      ifInputClick: false,
      searchText: '',
      selectedTab: 1,
      tabBarVisible: false,
      shadowVisible: false
    };
  },
  watch: {
    offsetY(v) {
      if (v > 0) {
        this.shadowVisible = true;
      } else {
        this.shadowVisible = false;
      }
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ];
    }
  },
  methods: {
    tabClick(id) {
      this.selectedTab = id;
    },
    switchLocale() {
      if (this.lang === 'cn') {
        this.$i18n.locale = 'en';
      } else {
        this.$i18n.locale = 'cn';
      }
      localStorage.saveLocale(this.$i18n.locale);
    },
    searchClick() {
      this.ifInputClick = true;
      this.setShelfTitleVisible(false);
      this.tabBarVisible = true;
    },
    cancelClick() {
      this.ifInputClick = false;
      this.searchText = '';
      this.setShelfTitleVisible(true);
      this.tabBarVisible = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-search-bar {
  position: absolute;
  left: 0;
  top: px2rem(45);
  z-index: 150;
  background: white;
  width: 100%;
  height: px2rem(40);
  padding: px2rem(5) px2rem(10);
  box-sizing: border-box;
  display: flex;
  transition: top 0.2s linear;
  &.search-top {
    position: fixed;
    left: 0;
    top: 0;
  }
  .shelf-search-bar-wrapper {
    flex: 1;
    display: flex;
    border: 1px solid rgb(196, 196, 196);
    align-items: center;
    border-radius: px2rem(4);
    .shelf-search-bar-icon-wrapper {
      @include center;
      .icon-search {
        color: rgb(167, 167, 167);
        font-size: px2rem(16);
      }
    }
    .shelf-search-bar-input-wrapper {
      @include center;
      width: 100%;
      .shelf-search-bar-input {
        border: none;
        font-size: px2rem(12);
        width: 100%;
        &:focus {
          outline: none;
        }
      }
      .icon-close {
        border-radius: 50%;
        font-size: px2rem(10);
        margin: px2rem(8);
        padding: px2rem(2);
        box-sizing: border-box;
        background: rgba(133, 132, 132, 0.534);
        color: white;
      }
    }
  }
  .shelf-search-bar-icon-wrapper {
    display: flex;
    align-items: center;
    margin: 0 px2rem(10);
    .icon-cn-en {
      font-size: px2rem(24);
      background: white;
    }
    .text {
      font-size: px2rem(14);
      color: rgb(6, 134, 238);
    }
  }
  .shelf-tab-bar-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    &.tab-top {
      top: px2rem(40);
    }
    &.shadowVisible {
      box-shadow: 0 px2rem(4) px2rem(4) rgba(139, 139, 139, 0.555);
    }
    .shelf-tab-item {
      font-size: px2rem(12);
      color: rgb(170, 170, 170);
      &:nth-child(2) {
        margin: 0 px2rem(20);
      }
      &.selected {
        color: rgb(19, 142, 243);
        font-weight: none;
      }
    }
  }
}
</style>
