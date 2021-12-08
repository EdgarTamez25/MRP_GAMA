<template>
  <v-row justify="center">
      <!-- SNACKBAT -->
      <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
        <strong> {{alerta.texto}} </strong>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
        </template>
      </v-snackbar>

      <!-- TITULO DE LA VISTA-->
      <v-col cols="12" class="py-0 ">
        <v-card-actions class="pa-0" >
          <v-card-text class="font-weight-black text-h6">
            PERMISOS DE USUARIOS 
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>
      </v-col>

      <v-col cols="12" class="mt-10" v-if="Loading">
        <loading v-if="Loading"/>
      </v-col>

      <template v-else>
        <v-col cols="12"  class="py-0 pa-0" >
          <v-card-text class="subtitle-1 font-weight-bold">
            {{ parametros.nombre }}
          </v-card-text>
        </v-col>

        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.leer_datos"
            label="Leer todos los datos"
            disabled
          ></v-checkbox>
        </v-col>
        
        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.master"
            label="Interacción con master"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.produccion"
            label="Interacción con producción"
          ></v-checkbox>
        </v-col>
        
        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.ot"
            label="Interacción con ordenes de trabajo"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.entradas"
            label="Interacción con entradas"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" sm="4" class="py-0" >
          <v-checkbox
            v-model="editarDetalle.pt"
            label="Interacción con producto final"
          ></v-checkbox>
        </v-col>
      </template>

    <!-- FOOTER  -->
    <v-col cols="12" class="mt-10" />

    <v-footer absolute fixed>
      <v-spacer></v-spacer>
      <v-btn  
        dark color="success"
        @click="" 
        :loading="!overlay ? false : true"
        @click="alerta_guardar_informacion = true"
      >
        {{ modoVista == 1 ? 'Guardar Información':'Actualizar Información' }}
      </v-btn> 
    </v-footer>

    <overlay v-if="overlay"/>

    <!-- MODAL ALERTA DE GENERACION DE PROGRAMACION -->
    <v-dialog v-model="alerta_guardar_informacion" persistent max-width="500">
      <v-card >
        <v-card-title 
          class="subtitle-1 font-weight-black" 
          style="word-break:normal;" 
        > 
          SE PROCEDERA A GUARDAR LOS PERMISOS PARA EL USUARIO:  {{ parametros.nombre }}  
        </v-card-title>
        <v-card-subtitle class="mt-1 subtitle-2 font-weight-black"> ¿ ESTA SEGURO DE QUERER CONTINUAR ? </v-card-subtitle>
        <v-divider class="my-0 py-3" ></v-divider>
        <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
        <v-divider class="my-0 py-2 " ></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark outlined color="gris" @click="alerta_guardar_informacion = false">Regresar</v-btn>
          <v-btn dark color="error" @click="validar_proceso()"  >Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>

  import { mapGetters,mapActions } from 'vuex';
	import metodos   from '@/mixins/metodos.js';
  import loading   from '@/components/loading.vue'
  import overlay   from '@/components/overlay.vue'

  export default {
    mixins:[metodos],
    props:[
      'parametros',
    ],
    components:{
      overlay,
      loading
    },

    data(){
      return {
        alerta: { 
          activo: false,
          texto: '',
          color: 'error',
        },

        defaulItem:{ 
          leer_datos: true,
          master: false,
          produccion:false, 
          ot: false,
          pt: false,
          entradas: false
        },

        editarDetalle:{ 
          id_usuario:null,
          leer_datos: true,
          master: false,
          produccion:false, 
          ot: false,
          pt: false,
          entradas: false
        },

        alerta_guardar_informacion: false,
        overlay: false,
        Loading: false,
        modoVista: 1,
      }
    },

    created(){
      this.init();
    },
  
    computed:{
      ...mapGetters('Login' ,['getdatosUsuario']), 
    },

    watch:{
      parametros(){
        this.init();
      }   
    },

    methods:{
      // ...mapActions('Entradas' ,['obtener_entradas']), 

      async init(){
        this.Loading = true;
        this.$http.get('obtener.permisos_usuario/'+ this.parametros.id).then( response =>{
          // console.log('response', response.body);
          if(response.body.length){
            this.modoVista = 2;
            this.editarDetalle = response.body[0]
          }else{
            this.modoVista = 1;
            this.editarDetalle = { ...this.defaulItem, id_usuario: this.parametros.id };
          }
        }).catch( error =>{
          console.log('error', error.body);
        }).finally(()=>{  
          this.Loading = false;
        })
      },

      validar_proceso(){
        this.overlay = true;  // ACTIVO OVERLAY DE GUARDADO
        this.alerta_guardar_informacion = false; // CIERRO MODAL DE CONFIRMACION

        if(this.modoVista == 1){
          this.crear_nuevo_registro();
        }

        if(this.modoVista == 2){
          this.actualizar_permiso_usuario();
        }
      },

      crear_nuevo_registro(){
        // ! FUNCION PARA CREAR NUEVO REGISTRO DE PERMISOS
        this.$http.post('agregar.permisos.usuario', this.editarDetalle).then( response =>{
          //! GENERO ALERTA DE RESPUESTA.
          this.alerta = { 
            activo: true,
            texto : response.bodyText,
            color : 'success'
          };
          this.cerrar_vista();

        }).catch(error =>{
          console.log('error agregar', error);
          this.alerta = { 
            activo: true,
            texto : error.bodyText,
            color : 'error'
          };
        }).finally(()=>{ 
          this.overlay = false;
        });
      },

      actualizar_permiso_usuario(){
        // ! FUNCION QUE PARA ACTUALIZAR PERMISOS
        // console.log('editarDetalle', this.editarDetalle);
        this.$http.put('actualizar.permisos.usuario/'+ this.editarDetalle.id , this.editarDetalle)
        .then( response =>{
          //! GENERO ALERTA DE RESPUESTA.
          this.alerta = { 
            activo: true,
            texto : response.bodyText,
            color : 'success'
          };
          this.cerrar_vista();

        }).catch(error =>{
          console.log('error actualizar', error);
          this.alerta = { 
            activo: true,
            texto : error.bodyText,
            color : 'error'
          };
        }).finally(()=>{ 
          this.overlay = false;
        });
      },

      cerrar_vista(){
        if(this.parametros.id === this.getdatosUsuario.id){
          this.obtener_permisos_usuario(this.getdatosUsuario.id);
        }
        //!DECLARO VARIABLE PARA FUNCION INTERNA DE THIS
        let that = this; 
        //! GENERO UN SET TIMER PARA PODER MOSTRAR LA RESPUESTA
        setTimeout(() => {  that.$emit('modal',false) }, 2000); 
      }
      

    }
  }

</script>