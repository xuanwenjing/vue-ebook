<template>
  <div class="title-wrapper1">
    <div class="icon-back left" @click="back"></div>
    <div class="icon-shelf right" @click='watchBookShelf'></div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$emit('onClickBack');
    },
    watchBookShelf() {
      this.$emit('onClickShelf');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.title-wrapper1 {
  width: 100%;
  height: px2rem(50);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px2rem(10);
  box-sizing: border-box;
  box-shadow: 0 px2rem(2) px2rem(4) rgba(199, 199, 199, 0.623);
  .left {
    font-size: px2rem(16);
  }
  .right {
    font-size: px2rem(16);
  }
}
</style>
