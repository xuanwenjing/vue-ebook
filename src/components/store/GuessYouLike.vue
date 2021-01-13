<template>
  <div class="guess-you-like-wrapper">
    <!-- <div class="title">
      <span class="title-left">{{$t('home.guessYouLike')}}</span>
      <span class="title-right" @click='change'>{{$t('home.change')}}</span>
    </div> -->
    <title-view :titleLeft="$t('home.guessYouLike')" :titleRight="$t('home.change')" @onClick="change"></title-view>
    <div class="book-info-list-wrapper">
      <div class="book-info-item" v-for="(item,index) in getRandomList" :key="index" @click="goToDetail(item)">
        <div class="book-info-cover">
          <img class="img" :src="item.cover" alt="">
        </div>
        <div class="book-info-content-wrapper">
          <div class="book-title">{{item.title}}</div>
          <div class="book-author">{{item.author}}</div>
          <div class="book-result">{{resultTest(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleView from './Title';
export default {
  components: {
    TitleView
  },
  props: {
    guessYouLikeList: Array
  },
  data() {
    return {
      index: 0
    };
  },
  computed: {
    getRandomList() {
      if (this.guessYouLikeList.length) {
        return [
          this.guessYouLikeList[this.index],
          this.guessYouLikeList[this.index + 1],
          this.guessYouLikeList[this.index + 2]
        ];
      } else {
        return [];
      }
    }
  },
  methods: {
    resultTest(item) {
      if (item && item.type && item.result) {
        switch (item.type) {
          case 1:
            return this.$t('home.sameAuthor').replace('$1', item.result);
          case 2:
            return this.$t('home.sameReader').replace('$1', item.result);
          case 3:
            return this.$t('home.readPercent')
              .replace('$2', item.result)
              .replace('$1', item.percent);
          default:
            return this.$t('home.sameAuthor').replace('$1', item.result);
        }
      }
    },
    change() {
      if (this.index >= this.guessYouLikeList.length - 3) {
        this.index = 0;
      } else {
        this.index++;
      }
    },
    init() {
      // this.randomList = [];
      // if (this.guessYouLikeList.length) {
      //   while (this.randomList.length < 3) {
      //     const index = Math.floor(Math.random() * this.guessYouLikeList.length);
      //     if (!this.randomList.includes(index)) {
      //       this.randomList.push(index);
      //     }
      //   }
      // } else {
      //   setTimeout(() => this.init(), 100);
      // }
    },
    goToDetail(item) {
      this.$emit('onClick', [item, this]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.guess-you-like-wrapper {
  width: 100%;
  padding: px2rem(10);
  box-sizing: border-box;
  .book-info-list-wrapper {
    margin-top: px2rem(-20);
    .book-info-item {
      display: flex;
      margin: px2rem(40) 0;
      .book-info-cover {
        flex: 0 0 25%;
        // height: px2rem(140);
        // width: px2rem(100);
        @include center;
        margin-right: px2rem(10);
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .book-info-content-wrapper {
        flex: 75%;
        .book-title {
          font-size: px2rem(18);
          font-weight: bold;
          margin-bottom: px2rem(15);
        }
        .book-author {
          font-size: px2rem(14);
          margin-bottom: px2rem(10);
          color: rgba(97, 95, 95, 0.795);
        }
        .book-result {
          font-size: px2rem(14);
          color: rgba(165, 164, 164, 0.781);
        }
      }
    }
  }
}
</style>
