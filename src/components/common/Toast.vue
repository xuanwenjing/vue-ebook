<template>
  <div class="common-toast">
    <div class="common-toast-bg" v-if="visible">
      <div class="common-toast-wrapper">
        <div class="common-toast-text" v-html="continueText"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    text: [String, Number],
    timeOut: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      visible: false,
      continueText: ''
    };
  },
  methods: {
    hide() {
      this.visible = false;
    },
    show() {
      this.updateText(this.text);
      clearTimeout(this.task);
      this.task = null;
      this.visible = true;
      this.task = setTimeout(() => {
        this.visible = false;
      }, this.timeOut);
    },
    continueShow() {
      clearTimeout(this.task);
      this.task = null;
      this.visible = true;
    },
    updateText(newText) {
      this.continueText = newText;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.common-toast-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2500;
  @include center;
  width: 100%;
  .common-toast-wrapper {
    width: 60%;
    line-height: px2rem(20);
    padding: px2rem(10) px2rem(20);
    box-sizing: border-box;
    background: rgba(156, 156, 156, 0.795);
    border-radius: px2rem(10);
    font-size: px2rem(14);
    color: white;
    .common-toast-text {
      text-align: center;
      word-break: break-all;
    }
  }
}
</style>
