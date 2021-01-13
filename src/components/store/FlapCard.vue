<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation':runFalpCardAnimation,'hide-flap-card-bg':hideFlapCardBG}">
      <div class="flap-card">
        <div class="flap-card-circle" :style="{'zIndex':item.zIndex}" v-for="(item,index) in flapCardList" :key='index'>
          <div class="flap-card-circle-left" :style="simiCircle(item,'left')" ref='left'></div>
          <div class="flap-card-circle-right" :style="simiCircle(item,'right')" ref='right'></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point" :class="{'animation':startPointAnimation}" v-for="(item,index) in pointList" :key="index"></div>
      </div>
    </div>
    <div class="book-card">
      <div class="book-card-wrapper" v-show="bookCardVisible" :class="{'animation':bookCardVisible}">
        <div class="book-card-content">
          <div class="book-cover">
            <img :src="data? data.cover:''" alt="">
          </div>
          <div class="book-title">{{data? data.title:''}}</div>
          <div class="book-author">{{data? data.author:''}}</div>
        </div>
        <div class="book-card-btn" @click="showDetailPage(data)">
          <span class='text'>{{$t('home.readNow')}}</span>
        </div>
      </div>
    </div>

    <div class="cancel-btn-wrapper">
      <div class="icon-close" @click='closeFlapCard'></div>
    </div>
  </div>
</template>

<script>
import { flapCardList } from '../../utils/store';
import { storeHomeMixin } from '../../utils/mixin';
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      qian: 0,
      hou: 1,
      runFalpCardAnimation: false,
      pointList: [],
      hideFlapCardBG: false,
      startPointAnimation: false,
      bookCardVisible: false,
      randomBookData: null
    };
  },
  watch: {
    flapCardVisible(v) {
      if (v) {
        this.hideFlapCardBG = false;
        this.runFalpCardAnimation = true;
        this.timer2 = setTimeout(() => {
          this.startRotateFlapCard();
          this.startPointAnimation = true;
        }, 300);
        this.timer1 = setTimeout(() => {
          this.hideFlapCardBG = true;
          this.startPointAnimation = false;
          if (this.timer) {
            clearInterval(this.timer);
          }
          this.timer3 = setTimeout(() => {
            this.bookCardVisible = true;
          }, 100);
        }, 1500);
      }
    }
  },
  methods: {
    closeFlapCard() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.timer1) {
        clearTimeout(this.timer1);
      }
      if (this.timer2) {
        clearTimeout(this.timer2);
      }
      if (this.timer3) {
        clearTimeout(this.timer3);
      }

      this.reset();
      this.setFlapCardVisible(false);
      this.bookCardVisible = false;
    },
    reset() {
      this.qian = 0;
      this.hou = 1;
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotateCircle(index, 'front');
        this.rotateCircle(index, 'back');
      });
    },
    simiCircle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight,
        backgroundSize: item.backgroundSize
      };
    },
    rotateCircle(index, dir) {
      let dom;
      if (dir === 'front') {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${this.flapCardList[index].rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${this.flapCardList[index].r},${
        this.flapCardList[index]._g
      },${this.flapCardList[index].b})`;
    },
    startRotateFlapCard() {
      const len = this.flapCardList.length;
      this.timer = setInterval(() => {
        const front = this.flapCardList[this.qian];
        const back = this.flapCardList[this.hou];

        if (front.rotateDegree === 0) {
          back._g = back._g - 5 * 9;
          back.rotateDegree = 180;
        }
        front.rotateDegree += 10;
        back.rotateDegree += 10;
        front._g -= 5;
        if (back.rotateDegree >= 270) {
          back._g += 5;
        }
        if (front.rotateDegree === 90 && back.rotateDegree === 270) {
          back.zIndex = front.zIndex + 2;
        }
        this.rotateCircle(this.qian, 'front');
        this.rotateCircle(this.hou, 'back');
        if (front.rotateDegree === 180) {
          front.rotateDegree = 0;
          back.rotateDegree = 0;
          front._g = front.g;
          back._g = back.g;
          this.rotateCircle(this.qian, 'front');
          this.rotateCircle(this.hou, 'back');

          this.qian += 1;
          this.hou += 1;
          if (this.qian >= len) {
            this.qian = 0;
          }
          if (this.hou >= len) {
            this.hou = 0;
          }
          this.flapCardList.forEach((item, index) => {
            item.zIndex =
              100 - ((index - this.qian + this.flapCardList.length) % this.flapCardList.length);
          });
        }
      }, 20);
    },
    showDetailPage(data) {
      this.showBookDetail([data, this]);
      this.setFlapCardVisible(false);
    }
  },
  created() {
    for (let i = 0; i < 18; i++) {
      this.pointList.push('point' + i);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
@import '../../assets/styles/flapCard';
.flap-card-wrapper {
  position: absolute;
  left: 0;
  z-index: 500;
  top: 0;
  background: rgba(27, 26, 26, 0.61);
  width: 100%;
  height: 100%;
  @include center;
  .flap-card-bg {
    width: px2rem(100);
    height: px2rem(100);
    border-radius: px2rem(5);
    background: white;
    position: relative;
    &.hide-flap-card-bg {
      transform: scale(0);
      transition: all 0.1s linear;
      opacity: 0;
    }
    &.animation {
      animation: flap-card-move 0.3s ease-in;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card-circle {
      width: px2rem(70);
      height: px2rem(70);
      display: flex;
      @include absCenter;
      .flap-card-circle-left {
        width: 50%;
        height: 100%;
        border-radius: px2rem(35) 0 0 px2rem(35);
        background: no-repeat;
        background-position: center right;
        transform-origin: right;
      }
      .flap-card-circle-right {
        width: 50%;
        height: 100%;
        border-radius: 0 px2rem(35) px2rem(35) 0;
        background: no-repeat;
        background-position: center left;
        transform-origin: left;
      }
    }
    .point-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2000;
      @include center;
      .point {
        @include absCenter;
        z-index: 3000;
        border-radius: 50%;
        transform: scale(0);
        &.animation {
          @for $i from 1 to length($moves) + 1 {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    @include center;
    .book-card-wrapper {
      width: px2rem(300);
      background: rgb(253, 253, 253);
      border-radius: px2rem(16);
      display: flex;
      flex-direction: column;
      &.animation {
        animation: show 0.2s ease;
        @keyframes show {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-content {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .book-cover {
          flex: 1;
          margin: px2rem(20) 0;
          @include center;
          img {
            width: px2rem(130);
            height: px2rem(150);
          }
        }
        .book-title {
          flex: 1;
          font-size: px2rem(18);
          font-weight: bold;
          text-align: center;
          line-height: px2rem(22);
          margin: 0 0 px2rem(10) 0;
          @include center;
        }
        .book-author {
          flex: 1;
          text-align: center;
          margin: 0 0 px2rem(10) 0;
          font-size: px2rem(16);
          color: rgb(133, 133, 133);
          @include center;
        }
      }
      .book-card-btn {
        height: px2rem(51);
        background: rgb(2, 150, 248);
        border-radius: 0 0 px2rem(16) px2rem(16);
        overflow: hidden;
        @include center;
        .text {
          color: white;
          font-size: px2rem(16);
        }
      }
    }
  }

  .cancel-btn-wrapper {
    width: 100%;
    position: absolute;
    bottom: px2rem(60);
    left: 0;
    @include center;
    .icon-close {
      @include center;
      color: white;
      width: px2rem(60);
      height: px2rem(60);
      font-size: px2rem(30);
      border-radius: 50%;
      background: rgba(56, 52, 52, 0.986);
    }
  }
}
</style>
