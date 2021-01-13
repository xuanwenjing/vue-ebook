<template>
  <div class="dialog-wrapper">
    <div class="dialog-bg">
      <div class="dialog-title-wrapper">
        <span class="dialog-title">{{title}}</span>
      </div>
      <slot></slot>
      <div class="dialog-btn-wrapper">
        <slot name='btn'>
          <div class="dialog-btn-left-wrapper" @click="sureClick">
            <span class="dialog-btn-left">
              确定
            </span>
          </div>
          <div class="dialog-btn-right-wrapper" @click="cancelClick">
            <span class="dialog-btn-right">取消</span>
          </div>
        </slot>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: String,
    groupName: String
  },
  methods: {
    sureClick() {},
    cancelClick() {}
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.dialog-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  top: 35%;
  @include center;
  z-index: 2500;
  .dialog-bg {
    position: relative;
    width: 60%;
    background: white;
    border-radius: px2rem(8);
    overflow: hidden;
    .dialog-title-wrapper {
      width: 100%;
      @include center;
      font-size: px2rem(22);
      line-height: px2rem(56);
      font-weight: bold;
      .dialog-title {
      }
    }
    .dialog-btn-wrapper {
      width: 100%;
      height: px2rem(38);
      background: rgb(2, 136, 245);
      display: flex;
      font-size: px2rem(18);
      color: white;
      .dialog-btn-left-wrapper {
        flex: 0 0 50%;
        @include center;
        .dialog-btn-left {
        }
      }
      .dialog-btn-right-wrapper {
        flex: 0 0 50%;
        @include center;
        .dialog-btn-right {
        }
      }
    }
  }
}
</style>
