<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item,index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem,index) in item" :key="index">
          <div class="ebook-loading-line" ref='line'></div>
        </div>
        <div class="ebook-loading-mask" style="left:1rem; top:0" ref='mask'></div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils';
import { ebookMixin } from '../../utils/mixin';
export default {
  mixins: [ebookMixin],
  data() {
    return {
      data: [[{}, {}, {}], [{}, {}, {}]]
    };
  },
  mounted() {
    switch (this.defaultTheme) {
      case 'Default':
        this.$refs.mask[0].style.background = '#cecece';
        this.$refs.mask[1].style.background = '#cecece';
        break;
      case 'Eye':
        this.$refs.mask[0].style.background = '#a9c1a9';
        this.$refs.mask[1].style.background = '#a9c1a9';
        break;
      case 'Gold':
        this.$refs.mask[0].style.background = '#c6c2b6';
        this.$refs.mask[1].style.background = '#c6c2b6';
        break;
      case 'Night':
        this.$refs.mask[0].style.background = '#0f1014';
        this.$refs.mask[1].style.background = '#0f1014';
        break;
      default:
        this.$refs.mask[0].style.background = '#cecece';
        this.$refs.mask[1].style.background = '#cecece';
        break;
    }
    let positionX = 0;
    this.task = setInterval(() => {
      this.$refs.mask.forEach(item => {
        item.style.left = px2rem(positionX) + 'rem';
        positionX += 2;
        if (positionX > 20) {
          positionX = 0;
        }
      });
    }, 100);
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-loading {
  .ebook-loading-wrapper {
    width: px2rem(80);
    height: px2rem(60);
    border: 4px solid rgba(233, 233, 233, 0.377);
    display: flex;
    padding: px2rem(4);
    box-sizing: border-box;
    position: relative;
    border-radius: px2rem(3);
    .ebook-loading-item {
      flex: 1;
      display: flex;
      position: relative;
      flex-direction: column;
      justify-content: space-evenly;
      height: 100%;
      width: 100%;
      .ebook-loading-line-wrapper {
        width: 100%;
        height: 1;
        padding: px2rem(4);
        box-sizing: border-box;
        .ebook-loading-line {
          border: 2px solid rgba(224, 224, 224, 0.295);
        }
      }
      .ebook-loading-mask {
        position: absolute;
        left: 0;
        top: 0;
        background: #cecece;
        width: 15%;
        height: 100%;
      }
    }
    .ebook-loading-center {
      border: 2px solid rgba(233, 233, 233, 0.377);
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, 0);
      width: 1;
      height: 100%;
    }
  }
}
</style>
