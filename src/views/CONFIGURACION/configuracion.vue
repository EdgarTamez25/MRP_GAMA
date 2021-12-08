<template>
  <v-main class="pa-0 ma-3">
  	<v-row class="justify-center" >
  		<v-col cols="12">
				<v-card class="pa-3" outlined>
					<v-card-actions class="font-weight-black headline"> CONFIGURACIÓN DE USUARIOS </v-card-actions>

					<v-card-actions>
			      <v-text-field
			        v-model="search"
			        append-icon="search"
			        label="Buscar"
			        single-line
			        hide-details
							filled dense 
			      ></v-text-field>
			      <v-spacer></v-spacer>
			      <!--<v-btn  class="celeste" @click="abrirModal(1)" dark>Agregar  </v-btn> -->
			      <v-btn 
              small icon dark
              class="gris"  
              @click="consultaUsuarios" 
            >
            <v-icon>refresh</v-icon> 
            </v-btn>
			    </v-card-actions>
					
			    <v-data-table
			      :headers="headers"
			      :items="getUsuarios"
			      :search="search"
			      fixed-header
				    :height="tamanioPantalla"
				    hide-default-footer
						:loading ="Loading"
						loading-text="Cargando... Por favor espere."
						:page.sync="page"
      			:items-per-page="itemsPerPage"
						@page-count="pageCount = $event"
						dense
			    >
			    	<template v-slot:item.action="{ item }" > 
			    		<v-btn  
                class="celeste" icon dark 
                @click="
                  parametros= item;
                  modoVista = 2;
                  permisosModal = true;"
              >
                <v-icon> mdi-cog </v-icon>
              </v-btn> 
				    </template>

            
						<template v-slot:item.estatus="{ item }" > 
			    		<v-btn 
                class="green" icon dark  
                v-if="item.estatus===1"
                @click="cambiaEstatus(item)"
              >
								<v-icon> person </v-icon>
							</v-btn> 
							<v-btn 
                class="error" icon dark 
                v-else
                @click="cambiaEstatus(item)"
              >
								<v-icon> mdi-account-off </v-icon>
							</v-btn> 
				    </template>
            
			    </v-data-table>

			  </v-card>
				
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>

				 <v-dialog v-model="permisosModal" width="700px" persistent transition="dialog-bottom-transition" >	
					<v-card class="pa-4">
		    		<PERMISOS 
              :parametros="parametros" 
              @modal="permisosModal = $event" 
            />
		    	</v-card>
		    </v-dialog>
  		</v-col>
  	</v-row>
  </v-main >
</template>

<script>
	import PERMISOS  from '@/views/CONFIGURACION/control_permisos.vue';
	import {mapGetters, mapActions} from 'vuex';

	export default {
		components: {
			PERMISOS
		},
		data () {
			return {
				page: 1,
				pageCount: 0,
				itemsPerPage: 20,
				search: '',
				
        permisosModal: false,
				parametros: {},
				modoVista:'',
			
				headers:[
					{ text: '# '  		    , align: 'left'  , value: 'id'		  },
					{ text: 'N° Empleado' , align: 'left'  , value: 'empleado'},
					{ text: 'Nombre'	    , align: 'left'  , value: 'nombre' },
					{ text: 'Usuario'	    , align: 'left'  , value: 'usuario'},
					{ text: 'Correo'      , align: 'left'  , value: 'correo' },
					{ text: 'Sucursal'    , align: 'left'  , value: 'nomsuc' },
					{ text: 'Depto'       , align: 'left'  , value: 'nomdepto'},
					{ text: 'Puesto'      , align: 'left'  , value: 'nompuesto'},
					{ text: 'Estatus'     , align: 'left'  , value: 'estatus'},
					{ text: ' '           , align: 'right' , value: 'action', sortable: false },
				],
			}
		},

		created(){
			this.consultaUsuarios()// CONSULTAR CLIENTES A VUEX
		},

		computed:{
			...mapGetters('Usuarios' ,['Loading','getUsuarios']), // IMPORTANDO USO DE VUEX  (GETTERS)
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

    watch:{
      permisosModal(){
        if(!this.permisosModal){
         this.parametros = {}
        }
      }
    },

		methods:{
			...mapActions('Usuarios'  ,['consultaUsuarios']), // IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)

			abrirModal(action, items){
				this.parametros = action;
				this.modoVista = items;
				this.dialog = true;
			},

      cambiaEstatus(data){
				const payload = { id: data.id, estatus: !data.estatus };
				this.$http.post('estatus.user',payload).then((res)=>{
					this.consultaUsuarios();
				}).catch((err)=>{
					console.log('err', err)
				})
			}

		}
	}
</script>
