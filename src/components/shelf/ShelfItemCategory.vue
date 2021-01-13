<template>
  <div class="shelf-item-category-wrapper">
    <div class="shelf-item-category-list" v-if="data.itemList.length>0">
      <div class="shelf-category-item" v-for="item in data.itemList.slice(0,9)" :key="item.id">
        <img :src="item.cover" alt="">
      </div>
    </div>
    <div class="shelf-item-category-empty" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-item-category-wrapper {
  width: 100%;
  height: 100%;
  .shelf-item-category-list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    padding: px2rem(2);
    box-sizing: border-box;
    .shelf-category-item {
      flex: 0 0 33.33%;
      height: 33.33%;
      padding: px2rem(2);
      box-sizing: border-box;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shelf-item-category-empty {
    width: 100%;
    height: 100%;
    @include center;
    font-size: px2rem(25);
    color: rgba(0, 0, 0, 0.322);
    span {
      @include center;
    }
  }
}
</style>
