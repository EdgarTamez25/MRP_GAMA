import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Inicio from '../views/Inicio.vue'
import Master from '../views/MASTER/master.vue'
import Produccion from '../views/PRODUCCION/produccion.vue'
import Productos_Terminados from '../views/PRODUCTOS_TERMINADOS/productos_terminados.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home'    ,  component: Home },
  { path: '/inicio', name: 'Inicio'    ,  component: Inicio },
  { path: '/proyector/master'  , name: 'Master'              , component: Master },
  { path: '/produccion'        , name: 'Produccion'          , component: Produccion },
  { path: '/productos/terminados' , name: 'Productos_Terminados'   , component: Productos_Terminados },
  { path: '/ordenes/de/trabajo', name: 'Ordenes_de_Trabajo'	 , component:()=> import('@/views/OT/ordenes_trabajo.vue')},
]

const router = new VueRouter({
  routes
})

export default router
