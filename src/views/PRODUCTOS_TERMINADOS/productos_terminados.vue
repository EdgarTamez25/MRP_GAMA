<template>
  <v-main class="pa-0 ma-3">
    <v-row justify="center">
      <v-col cols="12">

        <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
          <strong> {{alerta.text}} </strong>
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
          </template>
        </v-snackbar>
        
        <!-- CONTENEDOR PRINCIPAL -->
        <v-card outlined class="pa-3">
          <v-row class="pa-1 mt-1 ">
						<v-col cols="12"  md="8" >
							<v-card-actions class="font-weight-black headline  py-0 mt-1 " > PRODUCTOS TERMINADOS </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
                v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense label="Estatus"
                 hide-details  placeholder="Estatus" return-object outlined append-icon="mdi-circle-slice-5"
              ></v-select> 
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
									v-model="sucursal" :items="sucursales" item-text="nombre" item-value="id" outlined color="celeste"  
									dense hide-details  label="Sucursales" return-object placeholder ="Sucursales"  
							></v-select>
						</v-col> 
					</v-row>

          <!-- BOTONES DE ACCION *BUSCAR + RECARGAR-->
          <v-card-actions class="">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              hide-details
              filled dense
            ></v-text-field>
            <v-spacer></v-spacer>
           <!--  <v-btn  dark color="rosa" @click="validaInformacion()" v-if="estatus.id === 1"> PROCESAR INFORMACIÓN </v-btn>
            <v-btn  dark color="green" @click="ImprimirExcel()"> <v-icon >mdi-microsoft-excel </v-icon> </v-btn> -->
            <v-btn  class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
          </v-card-actions>
          <!-- TABLA DE DATOS -->
          <v-data-table
            :headers="headers"
            :items="productos_terminados"
            :search="search"
            class="font-weight-black"
            fixed-header
            hide-default-footer
            :height="tamanioPantalla"
            :loading ="Loading"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            locale="es-es"
           >
            <template v-slot:item.oc="{ item }">
              <span v-if="item.oc" class="morado--text"> {{ item.oc }} </span>
              <span v-else class="morado--text"> S/O.C. </span>
            </template>
            
            <template v-slot:item.cantidad="{ item }">
              <span class="black--text"> {{ item.cantidad | currency(0) }} </span>
            </template>
            
            <template v-slot:item.creacion="{ item }">
              <span class="black--text"> {{ moment(item.fecha_entrega).format('LL') }} </span>
            </template>
          </v-data-table>
        </v-card>
        	<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
      </v-col>

      <overlay v-if="overlay"/>


    </v-row>
  </v-main>
</template>

<script>
  // import overlay     from '@/components/overlay.vue';
  import {mapGetters, mapActions} from 'vuex';
	import  metodos from '@/mixins/metodos.js';
  import PROGRAMACION from '@/views/MASTER/programacion.vue'
  var moment     = require('moment'); 
  var accounting = require("accounting");

  export default {
		mixins:[metodos],
    components: {
      // overlay,
      PROGRAMACION
		},
    data:() =>({
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
      
      estatus: {  
        id: 1, nombre:'ACTIVO'
      },
      Estatus:[ 
        { id: 1, nombre:'ACTIVO'},
        { id: 0 ,nombre:'INACTIVO'},
      ],

      sucursal:{ id:null, nombre:''},
      sucursales:[],

      overlay: false ,
      alerta: { 
        activo: false,
        text: '',
        color: 'error',
      },
      headers: [
          { text: 'Producto'   , align: 'start' , value: 'codigo'   },
          { text: 'Unidad'     , align: 'left'  , value: 'unidad'   },
          { text: 'Cantidad'   , align: 'left'  , value: 'cantidad' },
          { text: 'Cliente'    , align: 'left'  , value: 'nomcli'   },
          { text: 'OC'         , align: 'left' , value: 'oc'       },
          { text: 'OT'         , align: 'left'  , value: 'id_ot'    },
          { text: 'Sucursal'   , align: 'left'  , value: 'nomsucursal' },
          { text: 'Creación'   , align: 'left'  , value: 'creacion' },
					{ text: '' 		      , align: 'right' , value: 'action' , sortable: false },
      ],
      
    }),

    filters:{
      currency(val, dec){
        return accounting.formatMoney(val, '', dec) 
      }
    },

    async created(){
			this.sucursales = await this.consultar_sucursales(); //MANDO A CONSULTAR SUCURSALES A MIXINS
      this.sucursal   = { id: this.getdatosUsuario.id_sucursal }
      this.init();
    },

    watch:{
			estatus() { this.init();  },
			sucursal() { this.init(); },
		},

    computed:{
			...mapGetters('Productos_terminados' ,['Loading','Parametros','productos_terminados']), // IMPORTANDO USO DE VUEX - (GETTERS)
      ...mapGetters('Login' ,['getdatosUsuario']), 

			tamanioPantalla () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'sm': 
						return this.$vuetify.breakpoint.height -300
					break;
					case 'md':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'lg':
						return this.$vuetify.breakpoint.height -300
					break;
					case 'xl':
						return this.$vuetify.breakpoint.height -300
					break;
				}
			},
		},

    methods:{ 
      ...mapActions('Productos_terminados' ,['obtener_productos_terminados']), 

      async init(){
        const payload = {
          estatus: this.estatus.id,
					id_sucursal: this.sucursal.id
        }
        await this.obtener_productos_terminados(payload);
      },
    }




  }
</script>