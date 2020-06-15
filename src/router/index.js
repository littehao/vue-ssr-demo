import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

//为什么不导出一个router实例?
//每次用户请求都需要创建一个router实例 
export default function createRouter() {
	return  new VueRouter({
		mode:'history',
		routes
	})
}
