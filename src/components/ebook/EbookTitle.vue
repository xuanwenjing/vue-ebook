<template>
  <transition name='slide-up'>
    <div class="setting-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back icon" @click="back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf icon"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart icon"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more icon"></span>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { ebookMixin } from '../../utils/mixin';

export default {
  mixins: [ebookMixin],
  methods: {
    back() {
      console.log('back');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, 0.15);
  display: flex;
  .left {
    flex: 0 0 px2rem(80);
    @include center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .icon-wrapper {
      @include center;
      flex: 0 0 px2rem(40);
    }
  }
}
</style>
