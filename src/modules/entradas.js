import Vue from 'vue'
import store from '@/store'

export default{
	namespaced: true,
	state:{
    loading: true,
		parametros:{},
		entradas:[]
	},

	mutations:{
		LOADING(state, data){
			state.loading = data; 
		},
		PARAMETROS(state, data){
			state.parametros = data
		},
		ENTRADAS(state,  data){
			state.entradas = data
		}
	},
	actions:{ 
		obtener_entradas({commit}, payload){
			commit('PARAMETROS', payload);  
      commit('LOADING' , true);  
      commit('ENTRADAS', []);
			return new Promise( resolve => {
				Vue.http.post('obtener.entradas', payload).then(response=>{
					commit('ENTRADAS', response.body)
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
		entradas(state){
			return state.entradas
		}
	}
}