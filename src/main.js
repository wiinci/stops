// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueGtag from 'vue-gtag';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.performance = true;

Vue.use(
  VueGtag,
  {
    config: { id: 'UA-156061623-1' },
    appName: 'Stops',
    pageTrackerScreenviewEnabled: true,
  },
  router
);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
