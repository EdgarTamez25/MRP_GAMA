import Vue from 'vue'
import store from '@/store'

export default{
	namespaced: true,
	state:{
    loading: true,
		parametros:[],
		produccion:[]
	},

	mutations:{
		LOADING(state, data){
			state.loading = data; 
		},
		PARAMETROS(state, data){
			state.parametros = data
		},
		PRODUCCION(state,  data){
			state.produccion = data
		}
	},
	actions:{ 
		obtener_datos_produccion({commit}, payload){
			commit('PARAMETROS', payload); commit('LOADING',true); commit('PRODUCCION', []);
			return new Promise( resolve => {
				Vue.http.post('obtener.datos.produccion', payload).then(response=>{
					commit('PRODUCCION', response.body)
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

		Produccion(state){
			return state.produccion
		}
	}
}