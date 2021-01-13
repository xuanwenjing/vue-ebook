<template>

  <div class="popup" v-if="popupVisible" @click="onBtnClick">
    <transition name='fade'>
      <div class="popup-bg" v-show="popupWrapperVisible"></div>
    </transition>
    <transition name='slide-down'>
      <div class="popup-wrapper" v-show="popupWrapperVisible">
        <div class="popup-title" v-show="title && title.length>0">{{title}}</div>
        <div class="popup-btn" :class="{'danger':item.type==='danger'}" @click="item.click" v-for="(item,index) in btn" :key="index">{{item.text}}</div>
      </div>
    </transition>
  </div>

</template>

<script>
export default {
  name: 'popup',
  props: {
    title: String,
    btn: Array
  },
  data() {
    return {
      popupVisible: false,
      popupWrapperVisible: false
    };
  },
  methods: {
    show() {
      this.popupVisible = true;
      setTimeout(() => {
        this.popupWrapperVisible = true;
      });
    },
    hide() {
      this.popupWrapperVisible = false;
      setTimeout(() => {
        this.popupVisible = false;
      }, 200);
    },
    onBtnClick(item) {
      this.hide();
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.popup {
  .popup-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1500;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.452);
  }
  .popup-wrapper {
    position: absolute;
    z-index: 2500;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    .popup-title {
      // height: px2rem(30);
      line-height: px2rem(40);
      width: 100%;
      text-align: center;
      box-shadow: 0 px2rem(2) px2rem(2) rgba(179, 179, 179, 0.192);
      font-size: px2rem(12);
      color: rgba(119, 119, 119, 0.801);
    }
    .popup-btn {
      // height: px2rem(30);
      line-height: px2rem(50);
      text-align: center;
      width: 100%;
      border-bottom: 1px solid rgba(184, 184, 184, 0.377);
      font-size: px2rem(18);
      &.danger {
        color: rgba(194, 0, 0, 0.733);
      }
    }
  }
}
</style>
