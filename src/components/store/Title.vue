<template>
  <div class="title-wrapper1">
    <div class="title-left">{{titleLeft}}</div>
    <div class="title-right" v-show="titleRightVisible" @click='click'>{{titleRight}}</div>
  </div>
</template>

<script>
export default {
  props: {
    titleLeft: {
      type: String,
      default() {
        return this.$t('home.guessYouLike');
      }
    },
    titleRight: {
      type: String,
      default() {
        return this.$t('home.change');
      }
    },
    titleRightVisible: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  methods: {
    click() {
      this.$emit('onClick');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.title-wrapper1 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: px2rem(20);
  .title-left {
    font-size: px2rem(16);
    font-weight: bold;
  }
  .title-right {
    font-size: px2rem(14);
    color: rgba(0, 167, 245, 0.637);
  }
}
</style>
