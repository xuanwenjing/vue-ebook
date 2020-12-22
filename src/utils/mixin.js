import { mapGetters, mapActions } from 'vuex';
import { themeList, addCSS, removeAllCSS } from './book';
import localStorage from './localStorage';

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList() {
      return themeList(this);
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    initGlobalTheme() {
      removeAllCSS();
      switch (localStorage.getTheme(this.fileName)) {
        case 'Default':
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
        case 'Eye':
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break;
        case 'Gold':
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break;
        case 'Night':
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break;
        default:
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation(); // 获取当前展示页面的定位
      this.setSection(currentLocation.start.index); // 设置当前页面的章节
      const startCfi = currentLocation.start.cfi;
      const progress = this.currentBook.locations.percentageFromCfi(startCfi);
      console.log(progress);

      this.setProgress(Math.floor(progress * 100));
      // this.updateProgressBg();
      localStorage.saveLocation(this.fileName, startCfi);
    },
    display(target, cb) {
      if (target) {
        return this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      } else {
        return this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      }
    }
  }
};