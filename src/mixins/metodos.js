import Vue from 'vue'

export default {
	methods: {
		traerFechaActual(){
			var f = new Date(); 
			return f.getFullYear() +'-'+ (f.getMonth() + 1 < 10? '0' + (f.getMonth() + 1): f.getMonth() + 1 ) +'-'+ (f.getDate()<10?'0'+f.getDate():f.getDate());
		},
		traerHoraActual(){
			var f = new Date(); 
			return (f.getHours()<10? '0'+f.getHours(): f.getHours()) + ':' + (f.getMinutes()<10? '0'+ f.getMinutes(): f.getMinutes())
		},
    
    // SUCURSALES 
		consultar_sucursales(){ 
			return new Promise( (resolve) => {
				this.$http.get('sucursales').then((response)=>{
					resolve(response.body)
				}).catch(error =>{
					console.log('error clixdpto', error)
				})
			})
		},

		consultar_deptos_por_suc(id_sucursal){ 
			return new Promise( (resolve) => {
				this.$http.get('obtener.deptos.por.suc/' + id_sucursal).then((response)=>{
					console.log("Response deptos x suc", response)
					resolve(response.body)
				}).catch(error =>{
					console.log('error depto_por_suc', error)
				})
			})
		},

		consultar_Clientes(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('clientes').then((response)=>{
					resolve(response.body);
				}).catch(error =>{
					console.log('error', error)
				})
			})	
		},

		consultar_Usuarios(){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.get('catusuarios').then((response)=>{
					resolve(response.body);
				}).catch(error =>{
					console.log('error', error)
				})
			})	
		},

		consulta_prod_por_cliente(payload){  // AUTOCOMPLETE -> CLIENTES
			return new Promise( resolve => {
				this.$http.post('productos.cliente.deptos', payload).then((response)=>{
					resolve(response.body);
				}).catch(error =>{
					console.log('error', error)
				})
			})	
		},

		consuta_tipos_envios(){  // TIPO DE ENVIOS
			return new Promise( resolve => {
				let tipos_envios = [
					{ id:1, nombre:'COMPLETO'},
					{ id:2, nombre:'PARCIAL' }
				];

				resolve(tipos_envios);
				
			})	
		},
		


		


		




  }
}