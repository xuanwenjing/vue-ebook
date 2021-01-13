<template>
  <transition name='slide-down'>
    <div class="setting-wrapper" v-show="settingVisible===3">
      <div class="setting-theme-wrapper">
        <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index" @click='selectTheme(item)'>
          <div class="item-color" :class="{active:defaultTheme === item.name}" :style="{color:item.style.body.color,background:item.style.body.background}"></div>
          <div class="item-text" :class="{active:defaultTheme === item.name}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
export default {
  mixins: [ebookMixin],
  methods: {
    selectTheme(item) {
      this.setDefaultTheme(item.name).then(() => {
        this.currentBook.rendition.themes.select(item.name);
      });

      localStorage.saveTheme(this.fileName, item.name);
      this.initGlobalTheme();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  position: absolute;
  left: 0;
  bottom: px2rem(45);
  width: 100%;
  height: px2rem(60);
  background: white;
  box-shadow: 0 px2rem(-4) px2rem(5) rgba(131, 131, 131, 0.1);
  padding-top: px2rem(5);
  .setting-theme-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    @include center;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      @include center;
      .item-color {
        width: 95%;
        height: 95%;
        &.active {
          border: 1px solid rgba(116, 112, 112, 0.55);
          box-shadow: 0 px2rem(-2) px2rem(8) rgba(94, 94, 94, 0.25);
        }
      }
      .item-text {
        font-size: px2rem(12);
        color: rgb(184, 184, 184);
        &.active {
          font-weight: bold;
          color: rgb(109, 105, 105);
        }
      }
    }
  }
}
</style>
