<template>
  <transition name='slide-down'>
    <div class="setting-wrapper" v-show="settingVisible===4">
      <div class="setting-font-size">
        <div class="prev" :style="{fontSize:fontSizeList[0].fontSize+'px'}">A</div>
        <div class="select-wrapper" v-for="(item,index) in fontSizeList" :key="index" @click='setFontSize(item)'>
          <div class="line" :style="{opacity:index===0?0:1}"></div>
          <div class="point-wrapper">
            <div class="point" v-show="shouFont(item)">
              <div class="small-point">
              </div>
            </div>
          </div>
          <div class="line" :style="{opacity:index===(fontSizeList.length-1)?0:1}"></div>
        </div>
        <div class="prev" :style="{fontSize:fontSizeList[fontSizeList.length-1].fontSize+'px'}">A</div>
      </div>
      <div class="setting-font-family">
        <div class="setting-font-family-default-wrapper" @click='showFontFamilyPopup'>
          <span class="setting-font-family-default">{{defaultFontFamily}}</span>
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>

  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import { FONT_SIZE_LIST } from '../../utils/book';
import localStorage from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST
    };
  },
  methods: {
    setFontSize(item) {
      this.setDefaultFontSize(item.fontSize);
      localStorage.saveFontSize(this.fileName, item.fontSize);
      this.currentBook.rendition.themes.fontSize(item.fontSize);
    },
    showFontFamilyPopup() {
      this.setFontFamilyVisible(true);
    },
    shouFont(item) {
      // console.log(item);
      // console.log(this.defaultFontSize);
      return item.fontSize === this.defaultFontSize;
    }
  },
  created() {
    // console.log(this.defaultFontSize);
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  display: flex;
  flex-direction: column;
  background: white;
  position: absolute;
  left: 0;
  bottom: px2rem(45);
  width: 100%;
  height: px2rem(90);
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-font-size {
    flex: 2;
    display: flex;
    .prev {
      flex: 0 0 px2rem(50);
      @include center;
    }
    .select-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      .line {
        height: 0;
        border-top: 1px solid rgb(129, 129, 129);
        flex: 1;
      }
      .point-wrapper {
        width: 0;
        height: px2rem(5);
        border-left: 1px solid rgb(129, 129, 129);
        flex: 0 0 0;
        position: relative;
        .point {
          border-radius: 50%;
          border: 1px solid rgb(129, 129, 129);
          width: px2rem(15);
          height: px2rem(15);
          background: white;
          position: absolute;
          left: px2rem(-6);
          top: px2rem(-6);
          @include center;
          box-shadow: 0 px2rem(2) px2rem(8) rgb(116, 116, 116);
          .small-point {
            background: black;
            border-radius: 50%;
            width: px2rem(5);
            height: px2rem(5);
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    @include center;
    .setting-font-family-default-wrapper {
      @include center;
      font-size: px2rem(12);
      color: rgb(92, 92, 92);
    }
  }
}
</style>
