<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex';
import { ebookMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
import Epub from 'epubjs';
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  mounted() {
    const fileName = this.$route.params.fileName.split('|').join('/') + '.epub';

    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  },
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
      }

      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
      }

      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    toggleTitleAndMenu() {
      this.setMenuVisible(!this.menuVisible);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },

    initThemes() {
      // 初始化字体大小
      if (this.rendition.themes) {
        const fontSize = localStorage.getFontSize(this.fileName);
        if (fontSize) {
          this.rendition.themes.fontSize(fontSize);
          this.setDefaultFontSize(fontSize);
        } else {
          localStorage.saveFontSize(this.fileName, this.defaultFontSize);
        }
        // 初始化字体样式
        const fontFamily = localStorage.getFontFamily(this.fileName);
        if (fontFamily) {
          this.rendition.themes.font(fontFamily);
          this.setDefaultFontFamily(fontFamily);
        } else {
          localStorage.saveFontSize(this.fileName, this.defaultFontFamily);
        }

        // 初始化主题
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style);
        });
        const theme = localStorage.getTheme(this.fileName);
        if (theme) {
          this.rendition.themes.select(theme);
          this.setDefaultTheme(theme);
        } else {
          localStorage.saveTheme(this.fileName, this.defaultTheme);
        }

        // 初始化全局样式
        this.initGlobalTheme();

        // // 初始化阅读位置
        // this.refreshLocation();
      }
    },
    initEpub() {
      const baseUrl = `${process.env.VUE_APP_RES_URL}/epub/`;
      const url = baseUrl + this.fileName;
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      });
      const location = localStorage.getLocation(this.fileName);
      this.display(location, () => {
        this.initThemes();
      });
      // this.rendition.display().then(() => {
      //   this.initThemes();
      // });
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;

        if (offsetX > 40 && time < 500) {
          this.prevPage();
        } else if (offsetX < -40 && time < 500) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // event.preventDefault();
        event.stopPropagation();
      });

      // 注册字体文件
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {});
      });

      // 分页算法
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (localStorage.getFontSize(this.fileName) / 16)
          );
        })
        .then(() => {
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.book-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
