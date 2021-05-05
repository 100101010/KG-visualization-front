import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import 'bootstrap';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/alert';


import axios from 'axios'
import VueAxios from "vue-axios";

axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true
Vue.use(VueAxios,axios);
// Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
