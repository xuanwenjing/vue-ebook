<template>
  <transition name='fade-right'>
    <div class="slide-content-wrapper" v-show="settingVisible===1">
      <transition name='slide-right'>
        <div class="content" v-if="settingVisible===1">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component :is="currentTab===1? content : bookmark"></component>
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item" :class="{'selected':currentTab===1}" @click="selectTab(1)">{{$t('book.navigation')}}</div>
              <div class="content-page-tab-item" :class="{'selected':currentTab===2}" @click="selectTab(2)">{{$t('book.bookmark')}}</div>
            </div>
          </div>
          <div class="content-loading" v-else>
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <div class="bg" @click='setSettingVisible(-1)'></div>
    </div>
  </transition>

</template>

<script>
import { ebookMixin } from '../../utils/mixin';
import EbookSlideContents from './EbookSlideContents';
import EbookSlideBookmark from './EbookSlideBookmark';
import EbookLoading from './EbookLoadding';
export default {
  mixins: [ebookMixin],
  components: {
    EbookLoading,
    EbookSlideBookmark
  },
  data() {
    return {
      currentTab: 1,
      content: EbookSlideContents,
      bookmark: EbookSlideBookmark
    };
  },
  methods: {
    selectTab(selected) {
      this.currentTab = selected;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 301;
  display: flex;
  .content {
    flex: 0 0 85%;
    width: 85%;
    .content-page-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-tab {
        flex: 0 0 px2rem(48);
        width: 100%;
        display: flex;
        .content-page-tab-item {
          flex: 1;
          font-size: px2rem(12);
          @include center;
        }
      }
    }
    .content-loading {
      width: 100%;
      height: 100%;
      @include center;
    }
  }
  .bg {
    flex: 0 0 15%;
    width: 15%;
  }
}
</style>
