<template>
  <div class="title-wrapper1" :class="{'boxShadowVisible':boxShadowVisible}">
    <div class="icon-back left" @click="back"></div>
    <div class="center">{{$t('home.allBook').replace('$1',length)}}</div>
    <div class="icon-shelf right" @click='watchBookShelf'></div>
  </div>
</template>

<script>
export default {
  props: {
    length: Number,
    boxShadowVisible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
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
  margin-bottom: px2rem(5);
  color: rgb(85, 85, 85);
  &.boxShadowVisible {
    box-shadow: 0 px2rem(2) px2rem(4) rgba(199, 199, 199, 0.623);
  }
  .left {
    font-size: px2rem(16);
  }
  .center {
    font-size: px2rem(22);
  }
  .right {
    font-size: px2rem(16);
  }
}
</style>
