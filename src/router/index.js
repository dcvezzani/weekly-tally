import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Week from '@/components/Week2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    }, 
    {
      path: '/',
      name: 'Week',
      component: Week
    }, 
    {
      path: '/week',
      name: 'Week',
      component: Week
    }
  ]
})
