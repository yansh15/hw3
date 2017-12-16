import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Tcp from './util/tcp.js'

Vue.use(ElementUI)
Vue.prototype.$tcp = new Tcp()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
let app = new Vue({
  router,
  store,
  components: { App },
  template: '<App/>'
})

app.$mount('#app')

app.$tcp.setSocketCloseListener(function () {
  store.commit('setConnect', {connect: false})
})

app.$tcp.setSocketErrorListener(function (error) {
  console.log(error)
  store.commit('setConnect', {connect: false})
  router.push('/network-error')
})

app.$tcp.setServerMessageListener(function (message) {
  switch (message.action) {
    case this.ADDOP:
      app.$store.commit('addFriend', {
        username: message.username
      })
      break
    case this.SENDMESSAGEOP:
      message.message.direction = 'object'
      app.$store.commit('addMessage', message.message)
      break
  }
});

(async function () {
  await app.$tcp.connectToServer(store.state.tcp.port, store.state.tcp.host)
  store.commit('setConnect', {connect: true})
})()
