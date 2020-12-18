<template>
  <div class="home">
    <div id="read" class='text'>DSFSF</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('setTest', 9).then(() => {
      console.log(this.test);
    });
  },
  computed: {
    ...mapGetters(['test'])
  }
};
</script>
<style>
.text {
  font-family: 'Days One';
}
</style>
