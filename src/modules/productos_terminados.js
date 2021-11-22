import Vue from 'vue'
import store from '@/store'

export default{
	namespaced: true,
	state:{
    loading: true,
		parametros:{},
		productos_terminados:[]
	},

	mutations:{
		LOADING(state, data){
			state.loading = data; 
		},
		PARAMETROS(state, data){
			state.parametros = data
		},
		PRODUCTOS_TERMINADOS(state,  data){
			state.productos_terminados = data
		}
	},
	actions:{ 
		obtener_productos_terminados({commit}, payload){
			commit('PARAMETROS', payload); commit('LOADING',true); commit('PRODUCTOS_TERMINADOS', []);
			return new Promise( resolve => {
				Vue.http.post('obtener.productos.terminados', payload).then(response=>{
					commit('PRODUCTOS_TERMINADOS', response.body)
					resolve(true);
				}).catch((error)=>{
					console.log('error',error)
					resolve(false)
				}).finally(() => commit('LOADING', false)) 
			})
		},

		
  },

	getters:{
		Loading(state){
			return state.loading
		},
		Parametros(state){
			return state.parametros
		},
		productos_terminados(state){
			return state.productos_terminados
		}
	}
}