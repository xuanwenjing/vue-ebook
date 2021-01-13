<template>
  <div class="home">
    <search-bar></search-bar>
    <flap-card :data="randomBook"></flap-card>
    <scroll :top='scrollTop' :bottom='0' @onScroll='onScroll' ref='scroll'>
      <div class="book-list-wrapper">
        <div class="banner-wrapper">
          <img :src="bannerUrl" alt="">
        </div>
        <guess-you-like @onClick="showBookDetail($event)" :guessYouLikeList="guessYouLikeList"></guess-you-like>
        <recommend @onClick="showBookDetail($event)" :recommendList="recommendList"></recommend>
        <featured :titleLeft="$t('home.featured')" :titleRightVisible="true" @onClick="showBookDetail($event)" :featuredList="featuredList"></featured>
        <div class="catagory-list-wrapper" v-for="(item,index) in categoryList" :key="index">
          <category-book @onClick="showBookDetail($event)" @showAllFromCate="seeAll($event)" :categroyItem="item"></category-book>
        </div>
        <category :category="category" @showAllFromCate="seeAll($event)"></category>
      </div>

    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/store/SearchBar';
import Scroll from '../../components/common/Scroll';
import FlapCard from '../../components/store/FlapCard';
import { storeHomeMixin } from '../../utils/mixin';
import GuessYouLike from '../../components/store/GuessYouLike';
import Recommend from '../../components/store/Recommend';
import Featured from '../../components/store/Featured';
import CategoryBook from '../../components/store/CategoryBook';
import Category from '../../components/store/Category';
import { home } from '../../api/store';
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data() {
    return {
      scrollTop: 90,
      randomBook: null,
      bannerUrl: null,
      guessYouLikeList: [],
      recommendList: [],
      featuredList: [],
      categoryList: [],
      category: []
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 50;
      } else {
        this.scrollTop = 90;
      }
      this.$refs.scroll.refresh();
    },
    seeAll([categoryId, vue]) {
      vue.$router.push({
        path: '/store/list',
        query: {
          category: categoryId
        }
      });
    }
  },
  mounted() {
    // console.log(this.offsetY);
    setTimeout(() => {
      this.$refs.scroll.scrollTo(0, this.offsetY);
      this.$refs.scroll.refresh();
    }, 10);

    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data;
        const random = Math.floor(Math.random() * data.random.length);
        this.randomBook = data.random[random];
        this.bannerUrl = data.banner;
        this.guessYouLikeList = data.guessYouLike;
        this.recommendList = data.recommend;
        this.featuredList = data.featured;
        this.categoryList = data.categoryList;
        this.category = data.categories;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.home {
  width: 100%;
  height: 100%;
  .book-list-wrapper {
    .banner-wrapper {
      padding: px2rem(10);
      box-sizing: border-box;
      width: 100%;
      height: px2rem(150);
      img {
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
