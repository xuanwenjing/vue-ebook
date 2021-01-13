<template>
  <div class="store-list-wrapper">
    <title-view @onClickBack="back" @onClickShelf="showShelf" :length="getLength" :boxShadowVisible="boxShadowVisible"></title-view>
    <scroll :top='50' :bottom='0' @onScroll="scroll">
      <div class="unique-featured" v-if="categoryData.length">
        <featured :titleLeft="getCategoryFromId" :titleRightVisible="false" :featuredList="categoryData" @onClick="showBookDetail($event)"></featured>
      </div>
      <div class="all-featured" v-else>
        <featured v-for="(item,index) in Object.keys(categoryData)" :key="index" :titleLeft="`${getCategoryId(item)}（${categoryData[item].length}）`" :titleRightVisible="false" :featuredList="categoryData[item]" @onClick="showBookDetail($event)"></featured>
      </div>
    </scroll>
  </div>
</template>

<script>
import TitleView from '../../components/list/Title';
import { list } from '../../api/store';
import { storeHomeMixin } from '../../utils/mixin';
import { getCategoryName, getCategoryFromId, getCategoryFromName } from '../../utils/store';
import Featured from '../../components/store/Featured';
import Scroll from '../../components/common/Scroll';
export default {
  mixins: [storeHomeMixin],
  components: {
    TitleView,
    Featured,
    Scroll
  },
  data() {
    return {
      data: null,
      categoryText: '',
      cateId: null,
      keywords: null,
      currentPageoffsetY: 0,
      boxShadowVisible: false
    };
  },
  watch: {
    currentPageoffsetY(v) {
      if (v > 0) {
        this.boxShadowVisible = true;
      } else {
        this.boxShadowVisible = false;
      }
    }
  },
  computed: {
    categoryData() {
      if (this.data) {
        return this.data;
      } else {
        return [];
      }
    },
    getLength() {
      if (this.categoryData.length) {
        return this.categoryData.length;
      } else {
        let count = 0;
        Object.keys(this.categoryData).forEach(item => {
          count += this.categoryData[item].length;
        });
        return count;
      }
    },
    getCategoryFromId() {
      if (this.cateId) {
        return getCategoryFromId(Number(this.cateId), this);
      } else {
        return '';
      }
    },
    getCategoryId() {
      return function(item) {
        return getCategoryFromName(item, this);
      };
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    scroll(offsetY) {
      this.currentPageoffsetY = offsetY;
    },
    showShelf() {}
  },
  mounted() {
    this.cateId = this.$route.query.category;
    this.keywords = this.$route.query.keyword;

    this.categoryText = getCategoryName(Number(this.cateId));
    list().then(response => {
      if (response.data.error_code === 0) {
        if (this.cateId !== '-1' && this.categoryText) {
          this.data = response.data.data[this.categoryText];
        } else if (this.cateId === '-1') {
          this.data = response.data.data;
        } else if (this.keywords) {
          const tempData = {};
          Object.keys(response.data.data).forEach(item => {
            const re = new RegExp(`${this.keywords}`, 'ig');
            const tempSub = response.data.data[item].filter(subItem => {
              if (subItem.title.search(re) !== -1) {
                return true;
              } else {
                return false;
              }
            });
            if (tempSub.length) {
              tempData[item] = tempSub;
            }
            this.data = tempData;
          });
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
</style>
