import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Tcp from './util/tcp'
import ReceiveFileTcp from './util/receivefiletcp'

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

app.$tcp.setServerMessageListener(async function (message) {
  switch (message.action) {
    case this.ADDOP:
      app.$store.commit('addFriends', {
        list: [message.username]
      })
      break
    case this.SENDMESSAGEOP:
      message.message.direction = 'object'
      app.$store.commit('addMessage', message.message)
      break
    case this.SENDFILEOP:
      console.log('send file op')
      message.file.direction = 'object'
      app.$store.commit('addFile', message.file)
      let filetcp = new ReceiveFileTcp()
      filetcp.setUpdateFSizeListener(function (fsize) {
        app.$store.commit('updateFileFSize', {
          username: message.file.username,
          uuid: message.file.uuid,
          fsize: fsize
        })
      })
      await filetcp.connectToServer(app.$store.state.tcp.port, app.$store.state.tcp.host)
      filetcp.receive(message.file.filename, message.file.size, message.file.uuid)
      break
  }
});

(async function () {
  await app.$tcp.connectToServer(store.state.tcp.port, store.state.tcp.host)
  store.commit('setConnect', {connect: true})
})()
