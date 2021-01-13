<template>
  <div class="shelf-item-add-wrapper">
    <div class="icon-add"></div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin';
export default {
  mixins: [storeShelfMixin]
};
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.shelf-item-add-wrapper {
  border: 1px solid rgba(141, 141, 141, 0.418);
  @include center;
  .icon-add {
    font-size: px2rem(36);
    color: rgba(95, 95, 95, 0.452);
  }
}
</style>
