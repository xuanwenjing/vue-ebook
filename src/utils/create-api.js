import CreateAPI from 'vue-create-api';
import Vue from 'vue';
import Toast from '../components/common/Toast';
import Popup from '../components/common/Popup';
import ShelfDialog from '../components/shelf/ShelfDialog';

Vue.use(CreateAPI);
Vue.createAPI(Toast, true);
Vue.createAPI(Popup, true);
Vue.createAPI(ShelfDialog, true);

// 全局mixin
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      });
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      });
    },
    simpleToast(text) {
      const toast = this.toast({ text: text });
      toast.show();
      setTimeout(() => {
        toast.remove();
      }, 1500);
    },
    continueToast(text) {
      return this.toast({ text: text });
    },
    shelfDialog() {
      return this.$createShelfDialog();
    }
  }
});
