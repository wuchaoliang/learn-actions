import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAxios from "./api";
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
Sentry.init({
  dsn: 'http://f7196221cefa437d9eb7abf27aecc8f4@35.220.157.201/2',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
});
Vue.use(VueAxios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
