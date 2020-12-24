<template>
  <div class="bookmark" ref='bookmark' :style="style"></div>
</template>

<script>
import { px2rem } from '../../utils/utils';
export default {
  props: {
    color: {
      type: String,
      default: 'white'
    },
    height: {
      type: Number,
      default: 30
    },
    width: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {};
  },
  computed: {
    style() {
      return {
        borderColor: `${this.color} ${this.color} transparent ${this.color}`,
        borderWidth: `${px2rem(this.height - 10)}rem ${px2rem(this.width / 2)}rem ${px2rem(
          10
        )}rem ${px2rem(this.width / 2)}rem`
      };
    }
  },
  methods: {
    refresh() {
      this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 10)}rem ${px2rem(
        this.width / 2
      )}rem ${px2rem(10)}rem ${px2rem(this.width / 2)}rem`;

      this.$refs.bookmark.style.borderColor = `${this.color} ${this.color} transparent ${
        this.color
      }`;
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(30) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: white white transparent white;
}
</style>
