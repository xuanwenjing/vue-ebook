<template>
  <div class="hot-search-list">
    <scroll :top='50' :bottom='0' @onScroll="onScroll" ref="searchScroll">
      <hot-search :title="title[0]" :searchList="searchList['hotSearch']"></hot-search>
      <div class="line"></div>
      <hot-search :title="title[1]" :searchList="searchList['searchHistory']"></hot-search>
    </scroll>
  </div>
</template>

<script>
import HotSearch from './HotSearch';
import Scroll from '../common/Scroll';
import { storeHomeMixin } from '../../utils/mixin';
export default {
  mixins: [storeHomeMixin],
  components: {
    Scroll,
    HotSearch
  },
  data() {
    return {
      title: [
        { left: this.$t('home.hotSearch'), right: this.$t('home.change') },
        { left: this.$t('home.historySearch'), right: this.$t('home.clear') }
      ],
      searchList: {
        hotSearch: [
          { icon: 'icon-book', text: 'Self-Reported Population Health', searchNumber: '1.8' },
          { icon: 'icon-book', text: 'Libary and Infomation Sciences', searchNumber: '1.1' },
          { icon: 'icon-book', text: 'Global Business Strategy', searchNumber: '1.3' },
          { icon: 'icon-book', text: 'Corporate Data Quality', searchNumber: '1.0' },
          { icon: 'icon-book', text: 'Verrechnungspreise', searchNumber: '1.8' }
        ],
        searchHistory: [
          { icon: 'icon-search', text: 'Computer Science', searchNumber: '' },
          {
            icon: 'icon-book',
            text: 'Building the Infrastructure for Cloud Security',
            searchNumber: ''
          },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' },
          { icon: 'icon-search', text: 'Nginx', searchNumber: '' },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' },
          { icon: 'icon-search', text: 'Nginx', searchNumber: '' },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' },
          { icon: 'icon-search', text: 'Nginx', searchNumber: '' },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' },
          { icon: 'icon-search', text: 'Nginx', searchNumber: '' },
          { icon: 'icon-search', text: 'ePub', searchNumber: '' },
          { icon: 'icon-search', text: 'Nginx', searchNumber: '' },
          { icon: 'icon-search', text: 'Computer Science', searchNumber: '' }
        ]
      }
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setHotSearchOffsetY(offsetY);
    },
    reset() {
      this.$refs.searchScroll.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.hot-search-list {
  width: 100%;
  height: 100%;
  background: white;
  z-index: 400;
  .line {
    border-bottom: 1px solid rgba(168, 168, 168, 0.459);
    margin: px2rem(10);
  }
}
</style>
