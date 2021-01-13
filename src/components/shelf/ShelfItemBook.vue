<template>
  <div class="shelf-item-book-wrapper">
    <img :src="data.cover" alt="">
    <div class="shelf-item-book-icon-bg" v-show="data.private===true">
      <div class="icon-private"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-item-book-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .shelf-item-book-icon-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-width: px2rem(14);
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.445) rgba(0, 0, 0, 0.445);
    .icon-private {
      position: absolute;
      left: px2rem(-13);
      top: px2rem(-2);
      color: white;
      font-size: px2rem(13);
    }
  }
}
</style>
