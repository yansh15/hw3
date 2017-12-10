import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/index').default
    },
    {
      path: '/network-error',
      component: require('@/components/networkerror').default
    }
  ]
})
