import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import tcp from './util/tcp.js'

Vue.use(ElementUI)
Vue.prototype.$tcp = tcp

tcp.client.on('data', function (data) {
})

tcp.client.on('close', function () {
  store.commit('setConnect', {connect: false})
})

tcp.client.connect(store.state.tcp.port, store.state.tcp.host, function () {
  store.commit('setConnect', {connect: true})
})

tcp.client.on('error', function (error) {
  console.log(error.message)
  store.commit('setConnect', {connect: false})
  router.push('/network-error')
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
