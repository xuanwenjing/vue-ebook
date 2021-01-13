<template>
  <div class="speak-playing-wrapper">
    <div class="speak-play-item" ref="item" v-for="(item,index) in length" :key="index">
    </div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils';
export default {
  props: {
    length: {
      type: Number,
      default: 6
    }
  },
  methods: {
    randomHeight() {
      for (let i = 0; i < this.length; i++) {
        const random = px2rem(Math.ceil(Math.random() * 10)) + 'rem';
        this.$refs.item[i].style.height = random;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.speak-playing-wrapper {
  width: px2rem(16);
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-right: px2rem(7);
  .speak-play-item {
    width: 10px;
    height: 10px;
    background: rgb(4, 212, 248);
    margin-right: 1px;
  }
}
</style>
