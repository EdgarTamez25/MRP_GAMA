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
						<v-col cols="12"  sm="6"  >
							<v-card-actions class="font-weight-black headline  py-0 mt-1 " > SALIDAS </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
									v-model="sucursal" :items="sucursales" item-text="nombre" item-value="id" outlined color="celeste"  
									dense hide-details  label="Sucursales" return-object placeholder ="Sucursales"  
							></v-select>
						</v-col> 

            <v-col cols="6" sm="4" md="2" > <!-- FECHA DE COMPROMISO -->
							<v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="fecha1" label="Fecha Inicio" append-icon="event" readonly v-on="on"
										 dense hide-details color="celeste" outlined
									></v-text-field>
								</template>
								<v-date-picker v-model="fecha1" locale="es-es" color="rosa"  scrollable>
									<v-spacer></v-spacer>
									<v-btn text small color="gris" @click="fechamodal1 = false">Cancelar</v-btn>
									<v-btn dark small color="rosa" @click="$refs.fecha1.save(fecha1)">OK</v-btn>
								</v-date-picker>
							</v-dialog>
						</v-col>

						<v-col cols="6" sm="4" md="2"  > <!-- FECHA DE COMPROMISO -->
							<v-dialog ref="fecha2" v-model="fechamodal2" :return-value.sync="fecha2" persistent width="290px">
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="fecha2" label="Fecha fin" append-icon="event" readonly v-on="on"
									  dense hide-details color="celeste" outlined
									></v-text-field>
								</template>
								<v-date-picker v-model="fecha2" locale="es-es" color="rosa"  scrollable>
									<v-spacer></v-spacer>
									<v-btn text small color="gris" @click="fechamodal2 = false">Cancelar</v-btn>
									<v-btn dark small color="rosa" @click="$refs.fecha2.save(fecha2)">OK</v-btn>
								</v-date-picker>
							</v-dialog>
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
            :items="salidas"
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
              <span class="black--text"> {{ moment(item.fecha_entrega).format('LLLL') }} </span>
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
  import overlay     from '@/components/overlay.vue';
  import {mapGetters, mapActions} from 'vuex';
	import  metodos from '@/mixins/metodos.js';
  // import PROGRAMACION from '@/views/MASTER/programacion.vue'

  var moment     = require('moment'); 
  var accounting = require("accounting");

  export default {
		mixins:[metodos],
    components: {
      overlay,
		},
    data:() =>({
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
     
      sucursal:{ id:null, nombre:''},
      sucursales:[],

      fecha1:moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"), 
      fechamodal1:false,
      fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
      fechamodal2:false,

      overlay: false ,
      alerta: { 
        activo: false,
        text: '',
        color: 'error',
      },
      headers: [
          { text: 'Producto'   , align: 'start' , value: 'codigo'   },
          { text: 'Cantidad'   , align: 'left'  , value: 'cantidad' },
          { text: 'Unidad'     , align: 'left'  , value: 'unidad'   },
          { text: 'Sucursal'   , align: 'left'  , value: 'nomsucursal' },
          { text: 'Referencia'   , align: 'left'  , value: 'referencia' },
          { text: 'Creación'   , align: 'left'  , value: 'creacion' },
					// { text: '' 		      , align: 'right' , value: 'action' , sortable: false },
      ],

      // modal_recibo_material: false,
      // parametros:{}
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
			fecha1() { this.init();  },
			fecha2() { this.init();  },
			sucursal() { this.init(); },
		},

    computed:{
			...mapGetters('Salidas' ,['Loading','Parametros','salidas']), // IMPORTANDO USO DE VUEX - (GETTERS)
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
      ...mapActions('Salidas' ,['obtener_salidas_almacen']), 

      async init(){
        const payload = {
					id_sucursal: this.sucursal.id,
          fecha1: this.fecha1,
          fecha2: this.fecha2
        }
        await this.obtener_salidas_almacen(payload);
      },
    }




  }
</script>