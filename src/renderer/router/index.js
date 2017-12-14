import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: require('@/components/index').default
    },
    {
      path: '/network-error',
      component: require('@/components/networkerror').default
    },
    {
      path: '/main',
      component: require('@/components/main').default,
      children: [
        {
          path: 'chat',
          component: require('@/components/main/chat').default
        },
        {
          path: 'profile',
          component: require('@/components/main/profile').default
        }
      ]
    }
  ]
})
