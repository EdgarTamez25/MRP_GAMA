import Vue from 'vue'
import store from '@/store'

export default{
	namespaced: true,
	state:{
    loading: true,
		parametros:{},
		salidas:[]
	},

	mutations:{
		LOADING(state, data){
			state.loading = data; 
		},
		PARAMETROS(state, data){
			state.parametros = data
		},
		SALIDAS(state,  data){
			state.salidas = data
		}
	},
	actions:{ 
		obtener_salidas_almacen({commit}, payload){
			commit('PARAMETROS', payload);  
      commit('LOADING' , true);  
      commit('SALIDAS', []);
			return new Promise( resolve => {
				Vue.http.post('obtener.salidas.almacen', payload).then(response=>{
					commit('SALIDAS', response.body)
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
		salidas(state){
			return state.salidas
		}
	}
}