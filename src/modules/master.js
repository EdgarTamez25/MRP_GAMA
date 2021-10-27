import Vue from 'vue'
import store from '@/store'

export default{
	namespaced: true,
	state:{
		ot: [],
    loading: true,
		parametros:[],
		master:[]
	},

	mutations:{
		LOADING(state, data){
			state.loading = data; 
		},
		PARAMETROS(state, data){
			state.filtros = data
		},
		MASTER(state,  data){
			state.master = data
		}
		
	},
	actions:{ 
		obtenerDatosMonitor({commit}, payload){
			commit('PARAMETROS', payload); commit('LOADING',true); commit('MASTER', []);
			return new Promise( resolve => {
				Vue.http.post('obtener.datos.monitor', payload).then(response=>{
					commit('MASTER', response.body)
					resolve(true);
				}).catch((error)=>{
					console.log('error',error)
					resolve(false)
				}).finally(() => commit('LOADING', false)) 
			})
		},

		programaProductos({commit}, payload){
			return new Promise( resolve => {
				Vue.http.post('programar.producto', payload).then(response=>{
					console.log('monitor', response.body)
					resolve(response);
				}).catch((error)=>{
					console.log('error',error)
					resolve(error)
				})
			})
		}
  },

	getters:{
		Loading(state){
			return state.loading
		},
		Parametros(state){
			return state.filtros
		},

		Master(state){
			return state.master
		}
	}
}