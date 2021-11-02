import Vue from 'vue'
import Vuex from 'vuex'
import Login   from '@/modules/AppController/Login'

import Master from '@/modules/master';

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
    Login,
    Master
  }
})
