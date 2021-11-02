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
  }
}