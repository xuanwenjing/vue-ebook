<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick" @touchend="touchend" @touchmove="move" @mousedown.left="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"></div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex';
import { ebookMixin } from '../../utils/mixin';
import localStorage from '../../utils/localStorage';
import Epub from 'epubjs';
import { flatten } from '../../utils/book';
import { getLocalForage } from '../../utils/localForage';
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  mounted() {
    const book = this.$route.params.fileName.split('|');
    const fileName = book[1];

    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        // console.log('找到离线电子书');
        this.setFileName(book.join('/')).then(() => {
          this.initEpub(blob);
        });
      } else {
        // console.log('在线获取电子书');
        const baseUrl = `${process.env.VUE_APP_EPUB_URL}/`;
        const url = baseUrl + book.join('/') + '.epub';
        this.setFileName(book.join('/')).then(() => {
          this.initEpub(url);
        });
      }
    });
  },
  methods: {
    // 1 点击了
    // 2 点击之后移动了
    // 3 点击了未移动就松手
    // 4 点击了移动后松手
    onMouseDown(e) {
      if (!this.menuVisible) {
        this.mouseState = 1;
        this.mouseStartTime = e.timeStamp;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseMove(e) {
      if (this.mouseState === 1) {
        this.mouseState = 2;
      } else if (this.mouseState === 2) {
        let offsetY = 0;
        if (this.firstTouchY) {
          offsetY = e.clientY - this.firstTouchY;
        } else {
          this.firstTouchY = e.clientY;
        }
        this.setOffsetY(offsetY);
      }

      e.preventDefault();
      e.stopPropagation();
    },
    onMouseUp(e) {
      const time = e.timeStamp - this.mouseStartTime;
      if (this.mouseState === 1) {
        this.mouseState = 3;
      } else if (this.mouseState === 2) {
        this.mouseState = 4;
        this.setOffsetY(0);
        this.firstTouchY = null;
      }
      if (time < 100) {
        this.mouseState = 3;
      }
      e.preventDefault();
      e.stopPropagation();
    },
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
      e.preventDefault();
      e.stopPropagation();
    },
    onMaskClick(e) {
      if (this.mouseState && this.mouseState === 4) {
        return;
      }
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
          // console.log('fontSIZE1:', this.defaultFontSize);
          this.setDefaultFontSize(fontSize);
        } else {
          // console.log('fontSIZE:', this.defaultFontSize);
          localStorage.saveFontSize(this.fileName, this.defaultFontSize);
        }
        // 初始化字体样式
        const fontFamily = localStorage.getFontFamily(this.fileName);
        if (fontFamily) {
          this.rendition.themes.font(fontFamily);
          this.setDefaultFontFamily(fontFamily);
        } else {
          localStorage.saveFontFamily(this.fileName, this.defaultFontFamily);
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
          this.rendition.themes.select(this.defaultTheme);
          localStorage.saveTheme(this.fileName, this.defaultTheme);
        }

        // 初始化全局样式
        this.initGlobalTheme();

        // // 初始化阅读位置
        // this.refreshLocation();
      }
    },
    initEpub(url) {
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 如果不加，在微信端显示不成功
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
        .then(locations => {
          this.navigation.forEach(nav => {
            nav.pageList = [];
          });

          locations.forEach(item => {
            const page = item.match(/\[(.*)\]!/)[1];
            this.navigation.forEach(nav => {
              const currentChapter = nav.href.match(/^(.*)\.x?html$/)[1];
              if (currentChapter && currentChapter === page) {
                nav.pageList.push(page);
              }
            });
          });
          let curLength = 1;
          this.navigation.forEach(nav => {
            if (curLength === 0) {
              nav.page = 1;
            } else {
              nav.page = curLength;
            }
            curLength += nav.pageList.length + 1;
          });
          this.setPagelist(locations);
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
