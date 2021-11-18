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
          <v-row class="pa-1 py-0">
						<v-col cols="12"  md="6" >
							<v-card-actions class="font-weight-black headline  py-0 mt-1 " > PROYECTOR MASTER </v-card-actions>
						</v-col>

						<v-col cols="12" sm="4" md="2">
							<v-select
                v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense
                 hide-details  placeholder="Estatus " return-object outlined append-icon="mdi-circle-slice-5"
              ></v-select> 
						</v-col>

						<!--<v-col cols="12" sm="4" md="2">
							<v-select
									v-model="depto" :items="deptos" item-text="nombre" item-value="id" outlined color="celeste"  
									dense hide-details  label="Departamentos" return-object placeholder ="Departamentos"  
							></v-select>
						</v-col> -->

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
            ></v-text-field>
            <v-spacer></v-spacer>
           <!--  <v-btn  dark color="rosa" @click="validaInformacion()" v-if="estatus.id === 1"> PROCESAR INFORMACIÓN </v-btn>
            <v-btn  dark color="green" @click="ImprimirExcel()"> <v-icon >mdi-microsoft-excel </v-icon> </v-btn> -->
            <v-btn  class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
          </v-card-actions>
          <!-- TABLA DE DATOS -->
          <v-data-table
            :headers="headers"
            :items="Master"
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
            <template v-slot:item.id_ot="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.id_ot }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.id_ot}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.id_ot}} </span>
            </template>
            <template v-slot:item.codigo="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.codigo }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.codigo}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.codigo}} </span>
            </template>
            <template v-slot:item.cantidad="{ item }">
              <span v-if="item.urgencia === 1" class="black--text">  {{ item.cantidad | currency(0) }}  </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.cantidad | currency(0) }} </span>
              <span v-if="item.urgencia === 3" class="error--text">  {{ item.cantidad | currency(0) }} </span>
            </template>
            <template v-slot:item.unidad="{ item }">
              <span v-if="item.urgencia === 1" class="black--text"> {{ item.unidad }}  </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.unidad}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.unidad}} </span>
            </template>
            <template v-slot:item.nomcli="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.nomcli }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.nomcli}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.nomcli}} </span>
            </template>
            <template v-slot:item.concepto="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.concepto === 1 ? 'PRODUCCIÓN':'STOCK'}} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.concepto === 1 ? 'PRODUCCIÓN':'STOCK'}} </span>
              <span v-if="item.urgencia === 3" class="error--text">  {{ item.concepto === 1 ? 'PRODUCCIÓN':'STOCK'}} </span>
            </template>
            <template v-slot:item.solicitante="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ item.solicitante }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ item.solicitante}} </span>
              <span v-if="item.urgencia === 3" class="error--text"> {{ item.solicitante}} </span>
            </template>
            <template v-slot:item.urgencia="{ item }" v-if="estatus.id != 1">
              <v-btn text v-if="item.urgencia === 1" class="black--text" align="lef"> NORMAL </v-btn>
              <v-btn text v-if="item.urgencia === 2" color="orange"> URGENTE </v-btn>
              <v-btn text v-if="item.urgencia === 3" color="error"> PRIORIDAD </v-btn>
            </template>
            <template v-slot:item.urgencia="props" v-else >
                <v-edit-dialog 
                  :return-value.sync="props.item.urgencia"
                   @save="guardarUrgencia(props.item)"
                   large 
                   save-text="Guardar"
                   cancel-text="Cancelar"
                >
                  <v-btn text v-if="props.item.urgencia === 1" class="black--text"> NORMAL </v-btn>
                  <v-btn text v-if="props.item.urgencia === 2" color="orange"> URGENTE </v-btn>
                  <v-btn text v-if="props.item.urgencia === 3" color="error"> PRIORIDAD </v-btn>

                  <template v-slot:input >
                    <v-card-text class="pa-0 mt-5" >
                      <v-select
                        :items="urgencias"
                        item-text="nombre"
                        item-value="id"
                        label="Urgencia"
                        hide-details
                        v-model="props.item.urgencia"
                      ></v-select>

                      <v-textarea
                        filled
                        v-model="props.item.razon"
                        label="Razon de urgencia"
                        rows="2"
                        v-if="props.item.razon"
                        disabled
                      ></v-textarea>
                    </v-card-text >
                    
                  </template>
                </v-edit-dialog>
              </template>

            
            <template v-slot:item.fecha_entrega="{ item }">
              <span v-if="item.urgencia === 1"  class="black--text"> {{ moment(item.fecha_entrega).format('LL') }} </span>
              <span v-if="item.urgencia === 2" class="orange--text"> {{ moment(item.fecha_entrega).format('LL') }} </span>
              <span v-if="item.urgencia === 3" class="error--text">  {{ moment(item.fecha_entrega).format('LL') }} </span>
            </template>

            <template v-slot:item.action="{ item }">
              <v-btn 
                color="morado" 
                dark fab small 
                @click="programacionModal=true; programacion=item;"
              >
                <v-icon> mdi-desktop-mac-dashboard</v-icon> 
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
        	<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
      </v-col>

      <!-- MODAL PROGRAMACION -->
      <v-dialog v-model="programacionModal" width="700px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <PROGRAMACION
            :programacion="programacion"
            @modal="programacionModal = $event"
          />
        </v-card>
      </v-dialog>


      <v-dialog v-model="ModalSucursal" persistent width="500px">
        <v-card class="pa-4">
          <v-card-text class="font-weight-black subtitle-1">
            SELECCIONE LA SUCURSAL EN LA CUAL SE PROGRAMARAN LOS PRODUCTOS
          </v-card-text>
          <v-card-text>
            <v-select
							:items="sucursales"
							item-text="nombre"
							item-value="id"
							label="Sucursal"
							placeholder="Sucursal"
							append-icon="store"
							hide-details
							v-model="sucursal"
							filled
							return-object
						></v-select>
          </v-card-text>
          <div class="mt-10"></div>
          <v-footer absolute>
            <v-btn color="error" outlined  @click="ModalSucursal = false">Cancelar </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="green" dark @click="PrepararDatos()"> Procesar Información</v-btn>
          </v-footer>
        </v-card>
        
      </v-dialog>

      <overlay v-if="overlay"/>


    </v-row>
  </v-main>
</template>

<script>
	// import  metodos from '@/mixins/metodos.js';
  // import overlay     from '@/components/overlay.vue';

  import Vue from 'vue'
  var moment = require('moment'); 
  import {mapGetters, mapActions} from 'vuex';
  import PROGRAMACION from '@/views/MASTER/programacion.vue'
  
  var accounting = require("accounting");
  Vue.filter('currency', (val, dec) => { return accounting.formatMoney(val, '', dec) });

  export default {
		// mixins:[metodos],
    components: {
      // overlay,
      PROGRAMACION
		},
    data:() =>({
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
      singleSelect: false,
      selected: [],

      depto : { 
        id:1, nombre:'FLEXOGRAFÍA'
      },
      deptos: [],	
      estatus: {  
        id: 1, nombre:'Pendiente'
      },
      Estatus:[ 
        { id: 1, nombre:'Pendiente'},
        { id: 2 ,nombre:'Programado'},
        { id: 3, nombre:'Terminado'},
      ],
      sucursal:{ id:null, nombre:''},
      sucursales:[],	
      urgencias:[
        { id:1, nombre:'NORMAL'   },
        { id:2, nombre:'URGENTE'  },
        { id:3, nombre:'PRIORIDAD'}
      ],
      fecha1:moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"), 
      fechamodal1:false,
      fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
      fechamodal2:false,

      ModalSucursal: false,
      overlay: false,
      alerta: { 
        activo: false,
        text: '',
        color: 'error',
      },
      headers: [
          { text: 'OC'         , align: 'start' , value: 'oc'       },
          { text: 'OT'         , align: 'left'  , value: 'id_ot'    },
          { text: 'Producto'   , align: 'start' , value: 'codigo'   },
          { text: 'Cantidad'   , align: 'left'  , value: 'cantidad' },
          { text: 'Unidad'     , align: 'left'  , value: 'unidad'   },
          { text: 'Cliente'    , align: 'left'  , value: 'nomcli'   },
          { text: 'Concepto'   , align: 'left'  , value: 'concepto' },
          { text: 'Solicitante', align: 'left'  , value: 'solicitante'},
          { text: 'Urgencia'   , align: 'left'  , value: 'urgencia'  },
          { text: 'Fecha de entrega'      , align: 'left'  , value: 'fecha_entrega'     },
					{ text: '' 		      , align: 'right' , value: 'action' , sortable: false },
      ],
      programacionModal: false,
      programacion: {},
      
    }),

    created(){
      // this.consultaDepartamentos();
			// this.consultarSucursales(); //MANDO A CONSULTAR SUCURSALES A MIXINS
      // console.log('datos', this.getdatosUsuario)

      this.init();
    },

    watch:{
			fecha1() { this.init(); },
			fecha2() { this.init(); },
			estatus(){ this.init(); },
		},

    computed:{
			...mapGetters('Master' ,['Loading','Parametros','Master']), // IMPORTANDO USO DE VUEX - (GETTERS)
      // ...mapGetters('Login' ,['getdatosUsuario']), 

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
      ...mapActions('Master' ,['obtenerDatosMonitor','programaProductos']), 

      init(){
        const payload = {
          estatus: this.estatus.id,
					fecha1 : this.fecha1,
					fecha2 : this.fecha2
        }
        this.obtenerDatosMonitor(payload);
      },

      validaInformacion(){
        // console.log('selected', this.selected);
        if(!this.selected.length){
          this.alerta = { activo: true, text:'DEBES SELECCIONAR LOS PRODUCTOS QUE SE PROGRAMARAN', color:'error'}; return ;
        }
        this.ModalSucursal = true;
        // this.programarProductos()
      },

      PrepararDatos(){
        this.ModalSucursal = false; this.overlay = true
        const payload = new Object({
          creacion   : this.traerFechaActual() + ' ' + this.traerHoraActual(),   
          id_creador : this.getdatosUsuario.id,
          id_sucursal: this.sucursal.id,
          detalle    : this.selected
        })

        this.programarProductos(payload);
      },

      programarProductos(data){

        this.programaProductos(data).then(response =>{
          this.alerta = { activo: true, text:response.bodyText, color:'green'};
          this.init(); this.selected = [];
        }).catch(error =>{
          this.alerta = { activo: true, text:error.bodyText, color:'error'};
        }).finally(()=>{
          this.overlay = false
        })
      },

      guardarUrgencia(item){
        this.$http.put('actualiza.urgencia.det.ot/'+ item.id, item);
      }
    }




  }
</script>