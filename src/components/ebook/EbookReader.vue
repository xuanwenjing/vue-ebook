<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick" @touchend="touchend" @touchmove="move"></div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex';
import { ebookMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
import Epub from 'epubjs';
import { flatten } from '../../utils/book';
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
    touchend(e) {
      this.firstTouchY = null;
      this.setOffsetY(0);
    },
    move(e) {
      let offsetY = 0;
      if (this.firstTouchY) {
        offsetY = e.targetTouches[0].clientY - this.firstTouchY;
      } else {
        this.firstTouchY = e.targetTouches[0].clientY;
      }
      this.setOffsetY(offsetY);
    },
    onMaskClick(e) {
      const winWidth = window.innerWidth;
      if (e.offsetX > 0 && e.offsetX < winWidth * 0.3) {
        this.prevPage();
      } else if (e.offsetX > 0 && e.offsetX > winWidth * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
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

    parseBookInfo() {
      // 获取封面
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      // 获取标题作者信息
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata);
      });
      // 获取目录信息（将树状目录转为1维数组）
      this.book.loaded.navigation.then(nav => {
        const navigation = flatten(nav.toc);
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level);
        }
        navigation.forEach(item => {
          item.level = find(item);
        });
        this.setNavigation(navigation);
      });
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

      // 解析书本信息
      this.parseBookInfo();
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
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .ebook-reader-mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
