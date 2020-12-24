<template>
  <div>
    <transition name='slide-down'>
      <div class="menu-wrapper" :class="{'hide-box-shadow':settingVisible!==-1 || !menuVisible}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress icon" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright icon" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a icon" @click="showSetting(4)">A</span>
        </div>
      </div>
    </transition>
    <ebook-setting-fonts></ebook-setting-fonts>
    <ebook-setting-fonts-popup></ebook-setting-fonts-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>

</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import EbookSettingFonts from './EbookSettingFonts';
import EbookSettingFontsPopup from './EbookSettingFontPopup';
import EbookSettingTheme from './EbookSettingTheme';
import EbookSettingProgress from './EbookSettingProgress';
import EbookSlide from './EbookSlide';
export default {
  components: {
    EbookSettingFonts,
    EbookSettingFontsPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  mixins: [ebookMixin],
  methods: {
    showSetting(key) {
      if (key === this.settingVisible) {
        this.setSettingVisible(-1);
      } else {
        this.setSettingVisible(key);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(45);
  background: white;
  display: flex;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .icon-wrapper {
    flex: 1;
    @include center;
  }
  &.hide-box-shadow {
    box-shadow: none;
  }
}
</style>
