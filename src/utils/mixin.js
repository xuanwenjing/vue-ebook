import { mapGetters, mapActions } from 'vuex';
import { themeList, addCSS, removeAllCSS } from './book';
import localStorage from './localStorage';
import {
  gotoBookDetail,
  appendAddToShelf,
  refreshAllShelfId
} from '../utils/store';
import { shelf } from '../api/store';

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'isCategory',
      'categoryData',
      'categoryName'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setIsCategory',
      'setCategoryData',
      'setCategoryName'
    ]),
    goToStoreHome() {
      this.$router.push('/store/home');
    },
    showBookDetail(item) {
      gotoBookDetail(this, item);
    },
    getShelfList() {
      let shelfList = localStorage.getBookShelf();
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200) {
            if (response.data && response.data.bookList) {
              shelfList = appendAddToShelf(response.data.bookList);
              shelfList = this.refreshShelfListId(shelfList);
              localStorage.saveBookShelf(shelfList);
              this.setShelfList(shelfList);
            }
          }
        });
      } else {
        this.setShelfList(shelfList);
      }
    },
    clearSelectedList() {
      while (this.shelfSelected.length) {
        this.shelfSelected.shift().selected = false;
      }
    },
    refreshShelfListId(shelfList) {
      if (!shelfList) {
        shelfList = this.shelfList;
      }
      shelfList = refreshAllShelfId(shelfList);
      return shelfList;
    }
  }
};

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible',
      'isEditMode'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible',
      'setIsEditMode'
    ]),
    showBookDetail([item, vue]) {
      vue.$router.push({
        path: '/store/detail',
        query: {
          fileName: item.fileName,
          category: item.category
        }
      });
    }
  }
};
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
    },
    getSectionName() {
      if (this.section) {
        const section = this.currentBook.section(this.section);
        if (
          section &&
          section.href &&
          this.currentBook &&
          this.currentBook.navigation
        ) {
          // return this.currentBook.navigation.get(section.href).label
          return this.navigation[this.section].label;
        }
      }
      return '';
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
      if (currentLocation && currentLocation.start) {
        this.setSection(currentLocation.start.index); // 设置当前页面的章节
        const startCfi = currentLocation.start.cfi;
        const progress = this.currentBook.locations.percentageFromCfi(startCfi);

        this.setProgress(Math.floor(progress * 100));
        // this.updateProgressBg();
        localStorage.saveLocation(this.fileName, startCfi);
        const bookmark = localStorage.getBookmark(this.fileName);
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true);
          } else {
            this.setIsBookmark(false);
          }
        } else {
          this.setIsBookmark(false);
        }
        if (this.pagelist) {
          this.setPaginate(
            `${currentLocation.start.location} / ${this.pagelist.length}`
          );
        } else {
          this.setPaginate('');
        }
      }
    },
    toggleTitleAndMenu() {
      this.setMenuVisible(!this.menuVisible);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation();
          if (cb) cb();
        });
      }
    },
    getReadTimeText() {
      let readTime = localStorage.getReadTime(this.fileName);

      readTime = readTime ? Math.floor(readTime / 60) + 1 : 1;
      return this.$t('book.haveRead').replace('$1', readTime);
    }
  }
};
