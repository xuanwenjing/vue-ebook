<template>
  <transition name='popup-slide'>
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <span class="icon-down2" @click="hide"></span>
        <span class="font-select">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-list-item" :class="{active:item.font === defaultFontFamily}" v-for="(item,index) in fontFamilyList" :key="index" @click='setFontFamily(item)'>
          <div class="ebook-popup-item-text">{{item.font}}</div>
          <div class="ebook-popup-item-icon-wrapper" v-show="item.font === defaultFontFamily">
            <div class="icon-check"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import { FONT_FAMILY } from '../../utils/book';
import localStorage from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    };
  },
  methods: {
    hide() {
      this.setFontFamilyVisible(false);
    },
    setFontFamily(item) {
      this.setDefaultFontFamily(item.font);
      localStorage.saveFontFamily(this.fileName, item.font);
      if (item.font === 'Default') {
        this.currentBook.rendition.themes.font('Times New Roman');
      } else {
        this.currentBook.rendition.themes.font(item.font);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-popup-list {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 300;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: px2rem(220);
  background: white;
  font-size: px2rem(14);
  box-shadow: 0 px2rem(-4) px2rem(8) rgba(133, 133, 133, 0.2);

  .ebook-popup-title {
    flex: 1.2;
    display: flex;
    border-bottom: 1px solid rgba(189, 189, 189, 0.4);
    .icon-down2 {
      flex: 0 0 px2rem(40);
      @include center;
      font-weight: bold;
    }
    .font-select {
      flex: 1;
      @include center;
      padding-right: px2rem(30);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wrapper {
    flex: 5;
    display: flex;
    flex-direction: column;
    font-size: px2rem(12);
    .active {
      color: rgb(0, 102, 255);
      font-weight: bold;
    }
    .ebook-popup-list-item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .ebook-popup-item-text {
        margin-left: px2rem(20);
        @include center;
      }
      .ebook-popup-item-icon-wrapper {
        margin-right: px2rem(20);
        @include center;
      }
    }
  }
}
</style>
