import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Master from '../views/MASTER/master.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home',  component: Home },
  { path: '/proyecto/master', name: 'Master',  component: Master },

]

const router = new VueRouter({
  routes
})

export default router
