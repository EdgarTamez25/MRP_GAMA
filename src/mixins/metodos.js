import Vue from 'vue'
import { mapGetters,mapActions } from 'vuex';

export default {
	computed:{
		...mapGetters('Login' ,['getdatosUsuario','permisos_usuario']), 
	},
	methods: {

		traerFechaActual(){
			var f = new Date(); 
			return f.getFullYear() +'-'+ (f.getMonth() + 1 < 10? '0' + (f.getMonth() + 1): f.getMonth() + 1 ) +'-'+ (f.getDate()<10?'0'+f.getDate():f.getDate());
		},
		traerHoraActual(){
			var f = new Date(); 
			return (f.getHours()<10? '0'+f.getHours(): f.getHours()) + ':' + (f.getMinutes()<10? '0'+ f.getMinutes(): f.getMinutes())
		},
    
		verificar_permiso_usuario(componente){
			return new Promise( (resolve) => {
				//* EVALUO SI EL USUARIO TIENE PERMISOS ASIGNADOS
				if(!this.permisos_usuario) {
					// console.log('permisos', this.permisos_usuario)
					resolve(false);
				}

				switch(componente) {
					case 'master':
						this.permisos_usuario.master? resolve(true):resolve(false);
						break;
					case 'producción':
						this.permisos_usuario.produccion ? resolve(true):resolve(false);
						break;
					case 'OT':
						this.permisos_usuario.ot ? resolve(true):resolve(false);
						break;
					case 'entradas':
						this.permisos_usuario.entradas ? resolve(true):resolve(false);
						break;
					case 'producto final':
						this.permisos_usuario.pt ? resolve(true):resolve(false);
						break;
				}
			})
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
		
		consultar_productos_cliente(id_cliente){  // REMPLAZO DE LA VISTA ALTA DE OT
			return new Promise( resolve => {
				this.$http.get('productos.cliente/'+ id_cliente).then((response)=>{
					resolve(response.body);
				}).catch(error =>{
					console.log('error', error)
				})
			})	
		},

		// consulta_prod_por_cliente(payload){  // AUTOCOMPLETE -> CLIENTES
		// 	return new Promise( resolve => {
		// 		this.$http.post('productos.cliente.deptos', payload).then((response)=>{
		// 			resolve(response.body);
		// 		}).catch(error =>{
		// 			console.log('error', error)
		// 		})
		// 	})	
		// },

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