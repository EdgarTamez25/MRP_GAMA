import Vue from 'vue'
import Vuex from 'vuex'
import Login   from '@/modules/AppController/Login'
import Usuarios from '@/modules/Usuarios';

import Master from '@/modules/master';
import OT from '@/modules/OT';
import Produccion from '@/modules/produccion';
import Productos_terminados from '@/modules/productos_terminados';
import Entradas from '@/modules/entradas';
import Salidas from '@/modules/salidas';

import TipoCambio     from '@/modules/TipoCambio';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    salir({commit}){
      setTimeout(()=>{ window.location.href = "http://producciongama.com/"; }, 2000)
    }
  },
  modules: {
    Usuarios,
    Login,
    Master,
    OT,
    Produccion,
    Productos_terminados,
    Entradas,
    Salidas,
    TipoCambio
  }
})
