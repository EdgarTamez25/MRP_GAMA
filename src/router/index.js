import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Master from '../views/MASTER/master.vue'
import Produccion from '../views/PRODUCCION/produccion.vue'
import Productos_Finales from '../views/PRODUCTOS_FINALES/productos_finales.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home'    ,  component: Home },
  { path: '/proyector/master'  , name: 'Master'              , component: Master },
  { path: '/produccion'        , name: 'Produccion'          , component: Produccion },
  { path: '/productos/finales' , name: 'Productos_Finales'   , component: Productos_Finales },
  { path: '/ordenes/de/trabajo', name:'Ordenes_de_Trabajo'	 , component:()=> import('@/views/OT/ordenes_trabajo.vue')},
]

const router = new VueRouter({
  routes
})

export default router
