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
						<v-col cols="12" sm="2" md="4" >
							<v-card-actions class="font-weight-black headline  py-0 mt-1 " > ENTRADAS </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2" >
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
            :items="entradas"
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

            <template v-slot:item.action="{ item }">
              <v-btn color="celeste" dark v-if="estatus.id == 0" @click="modal_recibo_material= true; parametros= item"> Autorizar</v-btn>
              <v-btn color="success" text  v-if="estatus.id == 1"> Autorizado</v-btn>
            </template>
          </v-data-table>

          
        </v-card>
        	<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
      </v-col>

      <!-- MODAL RECIBO MATERIAL -->
      <v-dialog v-model="modal_recibo_material" width="600px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <RMATERIAL
            :parametros="parametros"
            @modal="modal_recibo_material = $event"
          />
        </v-card>
      </v-dialog>

      <overlay v-if="overlay"/>


    </v-row>
  </v-main>
</template>

<script>
  // import overlay     from '@/components/overlay.vue';
  import {mapGetters, mapActions} from 'vuex';
	import  metodos from '@/mixins/metodos.js';
  // import PROGRAMACION from '@/views/MASTER/programacion.vue'
  import RMATERIAL from '@/views/ENTRADAS/recibo_material_alm.vue'

  var moment     = require('moment'); 
  var accounting = require("accounting");

  export default {
		mixins:[metodos],
    components: {
      // overlay,
      // PROGRAMACION,
      RMATERIAL
		},
    data:() =>({
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
      
      estatus: {  
        id: 0, nombre:'PENDIENTE POR RECIBIR'
      },
      Estatus:[ 
        { id: 0, nombre:'PENDIENTE POR RECIBIR'},
        { id: 1 ,nombre:'ENTRADAS AUTORIZADAS'},
      ],

      sucursal:{ id:null, nombre:''},
      sucursales:[],

      fecha1:moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"), 
      fechamodal1:false,
      fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),

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
          { text: 'Cliente'    , align: 'left'  , value: 'nomcli'   },
          { text: 'OC'         , align: 'center' , value: 'oc'       },
          { text: 'OT'         , align: 'center'  , value: 'id_ot'    },
          { text: 'Producción' , align: 'center'  , value: 'id_produccion'},
          { text: 'Sucursal'   , align: 'left'  , value: 'nomsucursal' },
          { text: 'Creación'   , align: 'left'  , value: 'creacion' },
					{ text: '' 		      , align: 'right' , value: 'action' , sortable: false },
      ],

      modal_recibo_material: false,
      parametros:{}
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
			sucursal(){ this.init(); },
			fecha1()  { this.init(); },
			fecha2()  { this.init(); },

		},

    computed:{
			...mapGetters('Entradas' ,['Loading','Parametros','entradas']), // IMPORTANDO USO DE VUEX - (GETTERS)
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
      ...mapActions('Entradas' ,['obtener_entradas']), 

      async init(){
        const payload = {
          estatus: this.estatus.id,
					id_sucursal: this.sucursal.id,
          fecha1: this.fecha1,
          fecha2: this.fecha2
        }
        await this.obtener_entradas(payload);
      },
    }




  }
</script>