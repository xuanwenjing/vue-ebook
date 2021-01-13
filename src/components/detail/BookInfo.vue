<template>
  <div class="book-info-wrapper">
    <div class="cover">
      <img :src="cover" alt="">
    </div>
    <div class="book-info-content">
      <div class="title">{{title}}</div>
      <div class="author">{{author}}</div>
      <div class="desc">{{title+author}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    cover: String,
    author: String
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.book-info-wrapper {
  padding: px2rem(10);
  box-sizing: border-box;
  display: flex;
  width: 100%;
  .cover {
    flex: 0 0 25%;
    @include center;
    margin-right: px2rem(10);
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .book-info-content {
    flex: 1;
    .title {
      font-size: px2rem(18);
      font-weight: bold;
    }
    .author {
      font-size: px2rem(14);
      color: rgba(10, 189, 243, 0.582);
      margin: px2rem(10) 0;
    }
    .desc {
      font-size: px2rem(14);
      color: rgba(92, 92, 92, 0.582);
    }
  }
}
</style>
