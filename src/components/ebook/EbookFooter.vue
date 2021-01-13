<template>
  <div class="ebook-footer">{{paginate}}</div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin';
export default {
  mixins: [ebookMixin]
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-footer {
  z-index: 10;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: px2rem(14);
  padding: px2rem(14);
  box-sizing: border-box;
}
</style>
