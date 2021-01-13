<template>
  <div class="ebook-header">{{getSectionName}}</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin';
export default {
  mixins: [ebookMixin]
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-header {
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  font-size: px2rem(14);
  padding: px2rem(14);
  box-sizing: border-box;
}
</style>
