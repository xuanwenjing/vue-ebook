<template>
  <div class="store-speaking-wrapper">
    <div class="store-speaking-title-wrapper">
      <div class="title-left-wrapper">
        <div class="icon-back" @click="back"></div>
      </div>
      <div class="title-right-wrapper">
        <div class="icon-shelf" @click="goToShelf"></div>
      </div>
    </div>
    <scroll class="store-speaking-scroll" :top="32" :bottom="40">
      <div class="store-speaking-book-info-wrapper">
        <book-info :title="getBookInfo.title" :cover="getBookInfo.cover" :author="getBookInfo.author"></book-info>
      </div>
      <div class="store-speaking-icon-wrapper">
        <div class="icon-wrapper">
          <span class="icon-speak"></span>
          <span>{{$t('speak.voice')}}</span>
        </div>
      </div>
      <div class="store-speaking-book-section-wrapper">
        <div class="book-section-list" @click="sectionClick(item,index)" v-for="(item,index) in navigationData" :key="index">
          <speak-playing ref="speakPlaying" v-show="currentSelected === item.id"></speak-playing>
          <div class="book-section-item" :class="{'indent':item.parent,'selected':currentSelected === item.id}">{{item.label}}</div>
        </div>
      </div>

      <audio src="" ref='audio' @canplay="onCanPlay" @ended="onEnded" @timeupdate="onTimeUpdate"></audio>
    </scroll>
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
    <speak-bottom :bottomTabVisible="showBottomTab" :currentSectionText="currentSection" :currentStatus="currentStatus" @playPause="playPause" @playGo="playGo" :currentSectionIndex="currentSectionIndex" :currentSectionTotal="currentSectionTotal" :playDuration="duration" :playCurrentTime="currentTime">
    </speak-bottom>
    <div class="store-speaking-bottom-wrapper">
      <div class="bottom-btn" @click="addToShelf">
        <span class="icon-check" v-show="inBookShelf"></span>
        <span v-show="!inBookShelf">{{$t('detail.addOrRemoveShelf')}}</span>
        <span v-show="inBookShelf">{{$t('detail.isAddedToShelf')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from '../../components/common/Scroll';
import BookInfo from '../../components/detail/BookInfo';
import { detail } from '../../api/store';
import { addToBookShelf, removeFromBookShelf } from '../../utils/store';
import SpeakBottom from '../../components/speak/SpeakBottom';
import Epub from 'epubjs';
// import { realPx } from '../../utils/utils';
import SpeakPlaying from '../../components/speak/SpeakPlaying';
import { storeShelfMixin } from '../../utils/mixin';
global.ePub = Epub;
export default {
  mixins: [storeShelfMixin],
  components: {
    Scroll,
    BookInfo,
    SpeakBottom,
    SpeakPlaying
  },
  data() {
    return {
      book: null,
      rendition: null,
      fileName: '',
      bookInfo: null,
      navigation: null,
      currentSection: '',
      showBottomTab: false,
      currentSelected: '',
      chapter: null,
      currentSectionIndex: 0,
      currentSectionTotal: 0,
      para: '',
      currentStatus: -1,
      metadata: null,
      currentIndex: 0,
      isPlaying: false,
      canPlay: false,
      currentTime: 0,
      duration: 0
    };
  },
  computed: {
    inBookShelf() {
      let res = false;
      if (this.shelfList && this.getBookInfo) {
        this.shelfList.forEach(item => {
          if (item.type === 1 && item.fileName === this.getBookInfo.fileName) {
            res = true;
          } else if (item.type === 2 && item.itemList) {
            item.itemList.forEach(subItem => {
              if (subItem.type === 1 && subItem.fileName === this.getBookInfo.fileName) {
                res = true;
              }
            });
          }
        });
      }
      return res;
    },
    getBookInfo() {
      if (this.bookInfo) {
        return this.bookInfo;
      } else {
        return {};
      }
    },
    navigationData() {
      if (this.navigation) {
        var res = [];
        [...this.navigation.toc].forEach(item => {
          res.push(item);
          res = [].concat(...res, ...item.subitems);
        });

        return res;
      } else {
        return '';
      }
    },
    paragraph() {
      if (this.para) {
        return this.para;
      } else {
        return '';
      }
    },
    lang() {
      return this.metadata ? this.metadata.language : '';
    }
  },
  methods: {
    goToShelf() {
      this.$router.push('/store/shelf');
    },
    addToShelf() {
      if (this.inBookShelf) {
        this.setShelfList(removeFromBookShelf(this.getBookInfo));
      } else {
        this.setShelfList(addToBookShelf(this.getBookInfo));
      }
    },
    onCanPlay() {
      this.canPlay = true;
    },
    onEnded() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.currentStatus = 2;
      this.canPlay = false;
    },
    onTimeUpdate() {
      if (this.canPlay) {
        this.currentTime = this.$refs.audio.currentTime;
        this.duration = this.$refs.audio.duration;
      }
    },
    playPause() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.$refs.audio.pause();
      this.currentTime = 0;
      this.duration = 0;
      this.currentStatus = 1;
    },
    playGo() {
      if (this.isPlaying) {
        this.continuePlay();
      } else {
        this.createVoice(this.paragraph);
      }
      this.currentStatus = 2;
    },
    back() {
      this.playPause();
      this.$router.go(-1);
    },
    sectionClick(item, index) {
      this.showBottomTab = true;
      this.currentSection = item.label;
      this.currentSelected = item.id;
      this.chapter = item;
      this.currentIndex = index;
      this.$refs.speakPlaying[this.currentIndex].randomHeight();
      this.isPlaying = false;
      this.canPlay = false;
      this.playPause();
      this.currentStatus = 1;
      this.getParagraph();
    },
    getParagraph() {
      if (this.chapter) {
        const section = this.book.spine.get(this.chapter.href);
        this.rendition.display(section.href).then(sec => {
          // const currentPage = this.rendition.currentLocation();
          new Promise(resolve => {
            setTimeout(() => {
              const currentPage = this.rendition.currentLocation();
              resolve(currentPage);
            }, 100);
          }).then(currentPage => {
            const cfibase = sec.cfiBase;
            const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '');
            const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '');
            this.currentSectionIndex = currentPage.start.displayed.page;
            this.currentSectionTotal = currentPage.start.displayed.total;
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`;
            // console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            this.book.getRange(cfi).then(range => {
              let text = range.toLocaleString();
              text = text.replace(/\s(2,)/g, '');
              text = text.replace(/\r/g, '');
              text = text.replace(/\n/g, '');
              text = text.replace(/\t/g, '');
              text = text.replace(/\f/g, '');
              this.para = text;
            });
          });
        });
      }
    },
    display1() {
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        method: 'default'
      });
      this.rendition.display();
    },
    continuePlay() {
      this.$refs.audio.play().then(() => {
        this.timer = null;
        this.timer = setInterval(() => {
          this.$refs.speakPlaying[this.currentIndex].randomHeight();
        }, 500);
        this.isPlaying = true;
      });
    },

    createVoice(text) {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open(
        'GET',
        // `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`,
        `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}`,
        false
      );
      xmlhttp.send();
      const xmlDoc = xmlhttp.responseText;
      // console.log(xmlDoc);

      if (xmlDoc) {
        const json = JSON.parse(xmlDoc);
        if (json.path) {
          this.$refs.audio.src = json.path;
          this.continuePlay();
        } else {
          this.simpleToast('播放失败，未生成链接');
        }
      } else {
        this.simpleToast('播放失败');
      }
    }
  },

  mounted() {
    this.fileName = this.$route.query.fileName;
    if (this.fileName) {
      detail(this.fileName).then(res => {
        if (res.status === 200 && res.data.error_code === 0) {
          this.bookInfo = res.data.data;
          let rootFile = res.data.data.rootFile;
          if (rootFile.startsWith('/')) {
            rootFile = rootFile.substring(1, rootFile.length);
          }
          const opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`;
          this.book = new Epub(opf);

          this.book.loaded.metadata.then(metadata => {
            this.metadata = metadata;
          });
          this.book.loaded.navigation.then(nav => {
            this.navigation = nav;
          });
          this.display1();
        } else {
          this.simpleToast(res.data.msg);
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.store-speaking-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .store-speaking-title-wrapper {
    padding: px2rem(10);
    box-sizing: border-box;
    width: 100%;
    height: px2rem(32);
    display: flex;
    justify-content: space-between;
    font-size: px2rem(16);
  }
  .store-speaking-scroll {
    padding: px2rem(10);
    box-sizing: border-box;
    .store-speaking-icon-wrapper {
      border-top: 1px solid rgba(187, 186, 186, 0.589);
      font-weight: bold;
      .icon-wrapper {
        line-height: px2rem(36);
        font-size: px2rem(14);
        display: flex;
        align-items: center;
        .icon-speak {
          font-size: px2rem(18);
          margin-right: px2rem(16);
        }
      }
    }
    .store-speaking-book-section-wrapper {
      .book-section-list {
        display: flex;
        font-size: px2rem(14);
        line-height: px2rem(45);
        align-items: center;
        border-top: 1px solid rgba(126, 126, 126, 0.356);
        .book-section-item {
          @include ellipsis;
          &.indent {
            margin-left: px2rem(16);
          }
        }
      }
    }
  }
  .book-wrapper {
    position: absolute;
    left: 0;
    bottom: -100%;
  }
  .store-speaking-bottom-wrapper {
    width: 100%;
    height: px2rem(40);
    // position: absolute;
    // left: 0;
    // bottom: 0;
    @include center;
    font-size: px2rem(16);
    color: rgb(4, 184, 255);
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(4) rgba(180, 180, 180, 0.322);
  }
}
</style>
