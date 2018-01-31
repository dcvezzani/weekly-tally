// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// Require the main Sass manifest file
require('./assets/sass/main.scss');

window.Event = new Vue();

// npm install bulma bulma-extensions node-sass sass-loader --save

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
