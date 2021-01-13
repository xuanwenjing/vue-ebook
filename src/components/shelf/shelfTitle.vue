<template>
  <transition name='fade'>
    <div class="shelf-title" v-show="shelfTitleVisible" :class="{'shadowVisible':shadowVisible}">
      <div class="shelf-title-text-wrapper">
        <div class="shelf-title-clearCache" @click="clickCache" v-if="!showBack">{{$t('shelf.clearCache')}}</div>
        <div class="shelf-title-clearCache icon-back" @click="back" v-else></div>
        <div class="shelf-title-center-wrapper">
          <div class="shelf-title-center-shelf" v-show="!isCategory">{{$t('shelf.title')}}</div>
          <div class="shelf-title-center-shelf" v-show="isCategory">{{categoryName}}</div>
          <div class="shelf-title-center-text" v-show="isEditMode">{{titleCenterText}}</div>
        </div>
        <div class="shelf-title-right" @click="changeModeClick">{{isEditMode? $t('shelf.cancel'):$t('shelf.edit')}}</div>
      </div>
    </div>
  </transition>

</template>

<script>
import { storeShelfMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
import { clearLocalForage } from '../../utils/localForage';
export default {
  mixins: [storeShelfMixin],
  props: {
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
    titleCenterText() {
      const number = this.shelfSelected ? this.shelfSelected.length : 0;
      if (this.isEditMode) {
        if (number >= 2) {
          return this.$t('shelf.haveSelectedBooks').replace('$1', number);
        } else if (number === 1) {
          return this.$t('shelf.haveSelectedBook').replace('$1', number);
        } else {
          return this.$t('shelf.selectBook');
        }
      } else {
        return '';
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    changeModeClick() {
      this.setIsEditMode(!this.isEditMode);

      if (!this.isEditMode) {
        // console.log(1212);
        while (this.shelfSelected.length) {
          this.shelfSelected.shift().selected = false;
        }
      }
    },
    clickCache() {
      // localStorage.removeLocalStorage('shelf');
      localStorage.clearLocalStorage();
      clearLocalForage();
      this.setShelfList([]);
      this.clearSelectedList();
      this.getShelfList();
      this.simpleToast('缓存已清空');
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-title {
  width: 100%;
  height: px2rem(45);
  padding: px2rem(10);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 130;
  background: rgb(253, 253, 253);
  box-sizing: border-box;
  &.shadowVisible {
    box-shadow: 0 px2rem(4) px2rem(4) rgba(139, 139, 139, 0.555);
  }
  .shelf-title-text-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: px2rem(14);
    .shelf-title-clearCache {
      color: rgb(148, 144, 144);
    }
    .icon-back {
      margin-left: px2rem(10);
      font-size: px2rem(16);
    }
    .shelf-title-center-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .shelf-title-center-shelf {
        font-size: px2rem(16);
        font-weight: bold;
      }
      .shelf-title-center-text {
        margin-top: px2rem(2);
        font-size: px2rem(8);
        color: rgb(148, 144, 144);
      }
    }
    .shelf-title-right {
      color: rgb(148, 144, 144);
    }
  }
}
</style>
