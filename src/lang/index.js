import Vue from 'vue';
import VueI18N from 'vue-i18n';
import cn from './cn';
import en from './en';
import localStorage from '../utils/localStorage';

Vue.use(VueI18N);
const messages = {
  cn,
  en
};
let locale = localStorage.getLocale();
if (!locale) {
  locale = 'en';
  localStorage.saveLocale(locale);
}
const i18n = new VueI18N({
  locale,
  messages
});

export default i18n;
