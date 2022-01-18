<template>
  <v-main class="pa-0 ma-3">
    <v-row justify="center">
      <v-col cols="12">

        <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
          <strong> {{alerta.texto}} </strong>
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
          </template>
        </v-snackbar>
        
        <!-- CONTENEDOR PRINCIPAL -->
        <v-card outlined class="pa-3">
          <v-row class="pa-1 py-0">

						<v-col cols="12" sm="4" >
							<v-card-actions class="font-weight-black headline   " > PRODUCCIÓN </v-card-actions>
						</v-col>
            
            <v-col cols="12" sm="4" md="2" >
							<v-select
									v-model="depto" :items="departamentos" item-text="nombre" item-value="id" outlined color="celeste"  
									dense hide-details  label="Departamento" return-object placeholder ="Departamento"
                  :disabled="permisos_usuario.develop? false:true" 
							></v-select>
						</v-col>

						<v-col cols="12" sm="4" md="2"  >
							<v-select
                v-model="estatus" :items="Estatus" item-text="nombre" item-value="id"  dense
                 hide-details label="Estatus " return-object outlined append-icon="mdi-circle-slice-5"
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
          <v-card-actions class="mt-1">
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
            :items="Produccion"
            class="font-weight-bold"
            fixed-header
            hide-default-footer
            :height="tamanioPantalla"
            :loading ="Loading"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            locale="es-es"
           >

            <template v-slot:item.cant_sol="{ item }" >
              <!-- <span v-if="item.recibidas > 0">  {{ item.recibidas | currency(0) }}  </span> -->
              <span >  {{ item.cant_sol | currency(0) }}  </span>
            </template>

            <template v-slot:item.recibidas="{ item }">
              <span>  {{ item.recibidas | currency(0) }}  </span>
            </template>
            <template v-slot:item.terminadas="{ item }">
              <span>  {{ item.terminadas | currency(0) }}  </span>
            </template>
            <template v-slot:item.reposicion="{ item }">
              <span>  {{ item.reposicion | currency(0) }}  </span>
            </template>

            <template v-slot:item.codigo="{ item }" >
              <v-btn text class="font-weight-black">  {{ item.codigo  }}  </v-btn>
            </template>

            <template v-slot:item.tipo_prog="{ item }" >
              <span v-if="item.tipo_prog == 0" style="font-size:13px"> COMPLETO </span>
              <span v-else style="font-size:13px"> {{ tipos_envios[item.tipo_prog -1].nombre }} </span>

            </template>
            <!--
            <template v-slot:item.urgencia="{ item }" >
              <span v-if="item.urgencia === 1"> <v-btn fab style="width: 30px; height: 30px" color="white"></v-btn>  </span>
              <span v-if="item.urgencia === 2"> <v-btn fab style="width: 30px; height: 30px" color="orange"></v-btn> </span>
              <span v-if="item.urgencia === 3"> <v-btn fab style="width: 30px; height: 30px" color="error"></v-btn> </span>
            </template>
            -->
            <template v-slot:item.fecha_entrega="{ item }" >
              <span :class="item.dias >= 3? 'success--text':'error--text'" >
                {{ moment(item.fecha_entrega).format('LL') }} 
              </span>

            </template>

            <template v-slot:item.creacion="{ item }">
              <span  > {{ moment(item.creacion).format('LL')  }} </span>
            </template>

            <template v-slot:item.dias="{ item }" v-if="estatus.id == 0 || estatus.id == 1 || estatus.id == 2 ">
              <span :class="[`red--text`, ]" v-if="item.dias === 0 " > 
                HOY SE ENTREGA 
              </span>
              <span :class="item.dias >= 3? 'success--text':'error--text'" v-if="item.dias >= 1 " > 
                {{ item.dias > 1 ?'FALTAN':'FALTA'}}  {{ item.dias }} {{ item.dias > 1 ?'DÍAS':'DÍA'}}  
              </span>
              <span :class="item.dias >= 3? 'success--text':'error--text'" v-if="item.dias < 0 "  > 
                FUERA DE TIEMPO 
              </span>
            </template>

            <template v-slot:item.dias="{ item }" v-else>
              <span class="success--text" v-if="estatus.id === 3 " > TERMINADO </span>
              <span class="success--text" v-if="estatus.id === 4 " > ENVIADO </span>
            </template>

            <template v-slot:item.deptoemisor="{ item }">
              <span style="font-size:13px"> {{ item.deptoemisor ? item.deptoemisor : 'MASTER' }} </span>
            </template>

            <template v-slot:item.action="{ item }">

              <!-- RECIBIR MATERIAL -->
              <v-btn 
                v-if="estatus.id === 0"
                @click="abrir_modal_accion(item)"
                color="celeste" dark small 
              >
                <v-icon > mdi-package-variant </v-icon> 
              </v-btn>

              <!-- INICIAR PARTIDA -->
              <v-btn 
                v-if="estatus.id === 1"
                @click="abrir_modal_accion(item)"
                color="celeste" dark small
              >
                <v-icon > mdi-play-outline </v-icon> 
              </v-btn>

              <!-- BOTON DE ACCION -->
              <v-btn 
                v-if="estatus.id === 2"
                @click="
                  modal_acciones = true; 
                  parametros= item;
                  itemAFinalizar = item;"
                color="rosa" dark small
              >
                <v-icon large> mdi-playlist-edit </v-icon> 
              </v-btn>
              
            </template> 
          </v-data-table>
        </v-card>
        	<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
      </v-col>

       <!--  MODAL DE ACCIONES -->
      <v-dialog v-model="modal_acciones" width="400px" persistent >
        <v-card class="pa-3">
          <v-card-actions class="pa-0" >
            <v-card-text class="font-weight-black text-h6">
              MENÚ DE OPCIONES
            </v-card-text>
            <v-spacer></v-spacer>
            <v-btn color="error" fab small @click="modal_acciones = false" ><v-icon>clear</v-icon></v-btn>
          </v-card-actions>

          <!-- ENVIAR MATERIAL -->
          <v-btn 
            v-if="estatus.id === 2"
            @click="modal_envio_producto = true; modal_acciones = false"
            color="celeste" dark
            class="ma-1"    block large
          >
            <v-icon > mdi-cube-send</v-icon> 
            ENVIAR MATERIAL
          </v-btn>
          <!-- REPOSICION DE MATERIAL-->
          <v-btn 
            v-if="estatus.id === 2"
            @click="modal_reposicion = true; modal_acciones = false"
            color="orange" dark
            class="ma-1" block large
          >
            <v-icon > mdi-database-arrow-left</v-icon>
            REPOSICION DE MATERIAL
          </v-btn>
          <!-- GENERAR MERMA 
          <v-btn 
            v-if="estatus.id === 2"
            @click="abrir_modal_accion(item)"
            color="error" dark
            class="ma-1" block large
          >
            <v-icon > mdi-delete-variant</v-icon> 
            GENERAR MERMA
          </v-btn>
          -->
          <!-- FINALIZAR PARTIDA -->
          <v-btn 
            v-if="estatus.id === 2"
            @click="modal_finalizar_partida = true; modal_acciones = false"
            color="success" 
            class="ma-1" 
            block large dark
          >
            <v-icon > mdi-text-box-check-outline</v-icon> 
            FINALIZAR PARTIDA
          </v-btn>
        </v-card>
      </v-dialog>

      <!-- MODAL RECIBO MATERIAL -->
      <v-dialog v-model="modal_recibo_material" width="600px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <RMATERIAL
            :parametros="parametros"
            @modal="modal_recibo_material = $event"
          />
        </v-card>
      </v-dialog>
      
      <!-- MODAL INICAR PARTIDA -->
      <v-dialog v-model="modal_inciar" width="600px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <INCIARP
            :parametros="parametros"
            @modal="modal_inciar = $event"
          />
        </v-card>
      </v-dialog>

      <!-- MODAL ENVIO DE MATERIAL -->
      <v-dialog v-model="modal_envio_producto" width="600px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <ENVIOP
            :parametros="parametros"
            @modal="modal_envio_producto = $event"
          />
        </v-card>
      </v-dialog>

       <!-- MODAL REPOSICION -->
      <v-dialog v-model="modal_reposicion" width="600px" persistent transition="dialog-bottom-transition">
        <v-card class="pa-3">
          <REPOSICION
            :parametros="parametros"
            @modal="modal_reposicion = $event"
          />
        </v-card>
      </v-dialog>

      <!-- MODAL FINALIZAR PARTIDA -->
      <v-dialog v-model="modal_finalizar_partida" width="600px" persistent >
        <v-card class="pa-3">
          <v-card-subtitle align="center" class="subtitle-1 font-weight-black mt-3 black--text" style="word-break:normal;" > 
            SE FINALIZARA LA PARTIDA NÚMERO {{ itemAFinalizar.id }} DE LA ORDEN DE TRABAJO {{ itemAFinalizar.id_ot }} 
          </v-card-subtitle>
          <v-card-subtitle align="center" class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
          <v-divider class="my-0 py-3" ></v-divider>
          <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
          <v-divider class="my-0 py-2 " ></v-divider>
          
          <div class="mt-12"></div>
          <v-footer absolute fixed>
            <v-btn  
              dark color="error" text
              @click="modal_finalizar_partida = false" 
            >
              No, Cancelar
            </v-btn> 
            <v-spacer></v-spacer>
            <v-btn  
              dark color="success" 
              @click="finalizar_partida()" 
            >
              Sí, finalizar
            </v-btn> 
          </v-footer>
        </v-card>
      </v-dialog>

        
      <overlay v-if="overlay"/>

    </v-row>
  </v-main>
</template>

<script>
  import overlay     from '@/components/overlay.vue';
  // VARIABLES GLOBALES ****************************************
  var moment     = require('moment');     // MOMENT ( FECHAS )
  var accounting = require("accounting"); // ( FORMATO PARA NUMEROS)
  // FUNCIONES EXTERNAS ****************************************
	import  metodos from '@/mixins/metodos.js';  // MIXINS
  import {mapGetters, mapActions} from 'vuex'; // VUEX
  // COMPONENTES *********************************************** 
  import RMATERIAL from '@/views/PRODUCCION/recibo_material.vue'
  import INCIARP from '@/views/PRODUCCION/iniciar_partida.vue'
  import ENVIOP from '@/views/PRODUCCION/envio_producto.vue'
  import REPOSICION from '@/views/PRODUCCION/reposicion.vue'
  
  export default {
		mixins:[metodos],
    components: {
      overlay,
      RMATERIAL,
      INCIARP,
      ENVIOP,
      REPOSICION
		},
    data:() =>({
      componente: 'producción',
      // TABLA PRINCIPAL
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      search: '',
      headers: [
          // { text: 'Urgencia'        , align:'left'  , value: 'urgencia'  },
          { text: 'OT'         , align:'left'    , value: 'id_ot'},
          { text: 'Partida'    , align:'left'    , value: 'id_det_ot'},
          { text: 'Cliente'    , align:'left'    , value: 'nomcli'},
          { text: 'Programado' , align:'left'    , value: 'creacion'},
          { text: 'Entrega'    , align:'left'    , value: 'fecha_entrega'},
          { text: 'Faltantes'  , align:'left'    , value: 'dias'},
          { text: 'Producto'   , align:'left'    , value: 'codigo'   },
          { text: 'Tipo'       , align:'center'  , value: 'tipo_prog'},
          { text: 'Solicitado' , align:'right'   , value: 'cant_sol'},
          { text: 'Recibido'   , align:'right'   , value: 'recibidas'},
          { text: 'Terminado'  , align:'right'   , value: 'terminadas'},
          { text: 'Reposición' , align:'right'   , value: '
          '},
          { text: 'Emisor'     , align:'left'    , value: 'deptoemisor'},
          { text: 'Enviado a'  , align:'left'    , value: 'departamento'},
					{ text: '' 		       , align: 'right'  , value: 'action' , sortable: false },
					{ text: '' 		            , align: 'right'  , value: 'action2' , sortable: false },

      ],
      
      // SELECTORES
      estatus: {  
        id: 1, nombre:'Pendiente'
      },
      Estatus:[ 
        { id: 0, nombre:'Por recibir'},
        { id: 1, nombre:'Pendiente'},
        { id: 2 ,nombre:'Produciendo'},
        { id: 4, nombre:'Enviado'},
        { id: 3, nombre:'Terminado'},
      ],
      urgencias:[
        { id:1, nombre:'NORMAL'   },
        { id:2, nombre:'URGENTE'  },
        { id:3, nombre:'PRIORIDAD'}
      ],
      fecha1:moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD"), 
      fechamodal1:false,
      fecha2: moment().subtract('months').endOf('months').format("YYYY-MM-DD"),
      fechamodal2:false,

      depto: { id:null, nombre:''},
      departamentos:[],
      tipos_envios:[],
      // MODALES 
      parametros: {}, 
      modal_recibo_material: false,
      modal_inciar: false,
      modal_envio_producto: false,
      modal_reposicion: false,
      modal_finalizar_partida: false, 
      itemAFinalizar: {},

      modal_acciones:false,
      
      // ALERTAS
      contador: 0 ,
      color: '',
      colores: ['black','error'], 
      overlay: false,

      alerta: { 
        activo: false,
        texto: '',
        color: 'error',
      },
    }),

    filters:{
      currency(val, dec){
        return accounting.formatMoney(val, '', dec);
      },
    },

    async created(){
      this.departamentos = await this.consultar_deptos_por_suc(this.getdatosUsuario.id_sucursal);
      this.tipos_envios  = await this.consuta_tipos_envios();
      this.depto = { id: this.getdatosUsuario.id_depto }
      this.colorBar();
      // console.log('deptos', this.departamentos);
      this.init();
    },

    watch:{
			fecha1() { this.init(); },
			fecha2() { this.init(); },
      depto(){ this.init()},
			estatus(){ this.init(); },
		},

    computed:{
			...mapGetters('Produccion' ,['Loading','Parametros','Produccion']), // IMPORTANDO USO DE VUEX - (GETTERS)
      ...mapGetters('Login' ,['getdatosUsuario','permisos_usuario']), 

			tamanioPantalla () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs':
          return this.$vuetify.breakpoint.height;
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
      ...mapActions('Produccion' ,['obtener_datos_produccion','obtener_productos_enviados']), 

      async init(){

        const payload = {
          // id_depto  : this.depto.id,
          id_depto  : this.depto.id ? this.depto.id: this.getdatosUsuario.id_depto, 
          estatus: this.estatus.id,
					fecha1 : this.fecha1,
					fecha2 : this.fecha2,
        }

        if(this.estatus.id === 4){
          await this.obtener_productos_enviados(payload);
        }else{
          await this.obtener_datos_produccion(payload);
        }

      },
      
      abrir_modal_accion(item){
        switch (this.estatus.id) {
          case 0:
            this.modal_recibo_material = true;
            this.parametros = item;
            break;
          case 1:
            this.modal_inciar = true;
            this.parametros = item;
            break;
        }
      },

      async finalizar_partida(){
        
        //VALIDACION DE CANTIDADES CONTRA TERMINADOS PARA SABER SI PUEDE FINALIZAR LA PARTIDA
        if(this.itemAFinalizar.terminadas < this.itemAFinalizar.cant_sol){
          this.alerta = { 
            activo: true,
            texto : `Aun no completas la cantidad solicitada, termina el trabajo.`,
            color : 'error'
          };
          return;
        }
        
        // ! VALIDAR PERMISOS DE USUARIOS EN LA INTERFAZ ************************
        let permiso = await this.verificar_permiso_usuario(this.componente);
        this.modal_finalizar_partida = false; // CIERRO MODAL DE CONFIRMACION
        this.overlay = true;  // ACTIVO OVERLAY DE GUARDADO

        if(!permiso){
          this.overlay = false
          this.alerta = { 
            activo: true,
            texto : `Lo sentimos, no tienes permiso de modificar información relacionada con ${ this.componente }`,
            color : 'error'
          };
          return;
        }
        // ! ********************************************************************

        // !GENERO OBJETO QUE MANDARE A INSERTAR
        const payload = {
          id_movim      : this.itemAFinalizar.id,
          id_det_ot     : this.itemAFinalizar.id_det_ot,
          id_produccion : this.itemAFinalizar.id_produccion,
          id_producto   : this.itemAFinalizar.id_producto,
          finalizacion: this.traerFechaActual() + ' ' + this.traerHoraActual(),
        };
        // ! FUNCION QUE MANDA A CREAR LA PROGRAMACION
        this.$http.post('finalizar.partida.movim', payload).then( response =>{
          // console.log('RESPUESTA', response)
          this.init();
          //! GENERO ALERTA DE RESPUESTA.
          this.alerta = { 
            activo: true,
            texto : response.bodyText,
            color : 'success'
          };

        }).catch(error =>{
          this.alerta = { 
            activo: true,
            texto : error.bodyText,
            color : 'error'
          };
        }).finally(()=>{ 
          this.overlay = false;
        });

      },

      colorBar(){
        this.color = this.colores[this.contador]  
        this.contador++
        if(this.contador <= 2){
          setTimeout(this.colorBar,500);
        }
        if(this.contador == 2){
          this.contador = 0
        }
      },
    },

  }
</script>

<style scoped >
  
</style>