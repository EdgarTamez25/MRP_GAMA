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
      <v-col cols="12" class="py-0">
        <v-card-actions class="pa-0" >
          <v-card-text class="font-weight-black text-h6">
            REPOSICIÓN DE MATERIAL
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>
      </v-col>

     <!-- DETALLE DE LA PROGRAMACION SOLICITADA-->
    <v-col cols="12" >
      <v-card outlined class="py-0" >
        <v-simple-table dense >
          <template v-slot:default>
            <tbody >
              <tr>
                <td class="font-weight-black">PRODUCTO</td>
                <td class="subtitle-1"  align="left"> {{ parametros.codigo }}</td>
              </tr>
              
              <tr>
                <td class="font-weight-black">CLIENTE</td>
                <td class="subtitle-1"  align="left"> {{ parametros.nomcli }}</td>
              </tr>
              <tr>
                <td class="font-weight-black">CANT. SOLICITADA</td>
                <td class="subtitle-1"  align="left"> {{ parametros.cant_sol | currency(0)}}</td>
              </tr>
              <tr>
                <td class="font-weight-black">FECHA DE ENTREGA</td>
                <td class="subtitle-1">  {{  moment(parametros.fecha_entrega).format('LL') }} </td>
              </tr>
              <tr>
                <td class="font-weight-black"> TIPO DE ENVÍO</td>
                <td class="subtitle-1">  {{ parametros.tipo_prog === 1? 'COMPLETO':'PARCIALIDAD' }} </td>
              </tr>
              
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>

    <!-- PRODUCTO -->
    <v-col cols="12" sm="6" class=" text-center">
      <v-card class="pa-1 negro">
        <v-card flat>
          <v-card-text class="py-0  negro--text font-weight-black">RECIBIDO</v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">   {{ parametros.recibidas |
           currency(0)}} </v-card-text>
        </v-card>
      </v-card>
    </v-col>

    <!-- PRODUCTO -->
    <v-col cols="12" sm="6" class=" text-center">
      <v-card class="pa-1 negro">
        <v-card flat>
          <v-card-text class="py-0  negro--text font-weight-black">TERMINADO </v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">   {{ parametros.terminadas | currency(0)   }} </v-card-text>
        </v-card>
      </v-card>
    </v-col>
    

    <v-col cols="12" sm="6" class=" text-center">
      <v-text-field 
        v-model.number="datos.cantidad_enviar"
        outlined
        label="CANTIDAD A REPONER"
        class="font-weight-black text-h6"
        type="number"
        color="success"
        :hint="datos.cantidad_enviar | currency(0)"
        persistent-hint

      >
      </v-text-field>
    </v-col>

    <!-- FOOTER  -->
    <v-col cols="12" class="mt-8" />

    <v-footer absolute fixed>
      <v-spacer></v-spacer>
      <v-btn  
        dark color="success" 
        @click="" 
        :disabled="!VALIDA_DATOS"
        @click="validar_datos_envio()"
      >
        SOLICITAR REPOSICIÓN
      </v-btn> 
    </v-footer>

    <overlay v-if="overlay"/>



    <!-- MODAL ALERTA DE GENERACION DE PROGRAMACION -->
    <v-dialog v-model="alerta_reposicion" persistent max-width="500">
      <v-card >
        <v-card-title class="subtitle-1 font-weight-black" style="word-break:normal;" > SE AUTORIZARÁ LA SOLCITUD DE REPOSICIÓN CON LA CANTIDAD DE {{ datos.cantidad_enviar | currency(0) }}  </v-card-title>
        <v-card-subtitle class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
        <v-divider class="my-0 py-3" ></v-divider>
        <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
        <v-divider class="my-0 py-2 " ></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark outlined color="gris" @click="alerta_reposicion = false">Regresar</v-btn>
          <v-btn dark color="error" @click="evaluar_envio_de_reposicion()"  >Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

  // import Vue from 'vue'
  import { mapGetters,mapActions } from 'vuex';
	import metodos   from '@/mixins/metodos.js';
  import loading   from '@/components/loading.vue'
  import overlay   from '@/components/overlay.vue'
	var accounting = require("accounting");
  // Vue.filter('currency', (val, dec) => { return accounting.formatMoney(val, '', dec) });

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
        componente: 'producción',
        cantidad_recibida: 0,

        detosDefault:{
          tipo_envio: {id: null, nombre:''},
          deptos: {id: null, nombre:''},
          cantidad_enviar: 0,
        },

        datos:{
          tipo_envio: {id: null, nombre:''},
          deptos: {id: null, nombre:'', empaque: 0},
          cantidad_enviar: 0,
        },

        departamentos:[],
        tipos_envios: [],

        alerta: { 
          activo: false,
          texto: '',
          color: 'green',
        },

        alerta_reposicion: false,
        overlay: false,
      }
    },

    filters:{
      currency(val, dec){
        return accounting.formatMoney(val, '', dec);
      },
    },

    async created(){
      this.departamentos = await this.consultar_deptos_por_suc(this.getdatosUsuario.id_sucursal);
      this.tipos_envios  = await this.consuta_tipos_envios();
    },
  
    computed:{
      ...mapGetters('Login' ,['getdatosUsuario']), 
      ...mapGetters('Produccion' ,['Parametros']),

      VALIDA_DATOS(){
          return this.datos.cantidad_enviar != 0;
      } 
    },

    //  watch:{
    //   'datos.tipo_envio'(){
    //     this.evaluar_tipo_envio()
    //   }
    // },

    methods:{
      ...mapActions('Produccion' ,['obtener_datos_produccion','generar_nueva_entrada']), 

      validar_datos_envio(){
        if(this.getdatosUsuario.id_depto === this.datos.deptos.id){
           this.alerta = { 
            activo: true,
            texto : 'EY QUE ONDA, NO PUEDES ENVÍAR PRODUCTO A TU MISMO DEPARTAMENTO',
            color : 'error'
          };
          return
        }

        this.alerta_reposicion = true;
      },

      async evaluar_envio_de_reposicion(){
        // EVALUAR SI EXISTE UN DEPARTAMENTO ANTERIOR. 
         if(this.parametros.id_movim_ant === 0){
          this.alerta_reposicion = false; // CIERRO MODAL DE CONFIRMACION
          this.alerta = { 
            activo: true,
            texto : `No se puede generar una reposición ya que no hay un departamento anterior.`,
            color : 'error'
          };
          return;
        }
        
        // ! VALIDACION DE PERMISOS DE USUSARIO ****************
        let permiso = await this.verificar_permiso_usuario(this.componente);
        this.alerta_reposicion = false; // CIERRO MODAL DE CONFIRMACION
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
        // ! ***************************************************
       

        // !GENERO OBJETO QUE MANDARE A INSERTAR
        const payload = {
          id_movim_ant: this.parametros.id_movim_ant, // ID PARA ACTUALIZAR EL REGISTRO ANTERIOR
          id_usuario: this.getdatosUsuario.id, // USUSARIO RESPONSABLE DE LA ACTUALIZACIÓN
          reposicion: this.datos.cantidad_enviar   // CANTIDAD DE PRODUCTO A REPONER
        };

          this.generar_reposicion(payload);
      },

      generar_reposicion(payload){
        // ! FUNCION QUE MANDA A CREAR LA PROGRAMACION
        this.$http.post('autorizar.reposicion.material', payload).then( response =>{
          //! GENERO ALERTA DE RESPUESTA.
          this.alerta = { activo: true, texto : response.bodyText, color : 'green' };
          this.cerrar_vista();
        }).catch(error =>{
          this.alerta = { activo: true, texto : error.bodyText, color : 'error'  };
        }).finally(()=>{ 
          this.overlay = false;
        });
      },

      // evaluar_tipo_envio(){
      //   if(this.datos.tipo_envio.id === 1 ){
      //     if(parseInt(this.parametros.recibidas) != 0){
      //      this.datos.cantidad_enviar = parseInt(this.parametros.recibidas) - parseInt(this.parametros.terminadas);
      //     }else{
      //       this.datos.cantidad_enviar = parseInt(this.parametros.cant_sol) - parseInt(this.parametros.terminadas);
      //     }
      //   }else{
      //     this.datos.cantidad_enviar = 0;
      //   }
      // },

      cerrar_vista(){
        this.cantidad_recibida = 0;
        this.datos = this.detosDefault;
        this.obtener_datos_produccion(this.Parametros)
        //!DECLARO VARIABLE PARA FUNCION INTERNA DE THIS
        let that = this; 
        //! GENERO UN SET TIMER PARA PODER MOSTRAR LA RESPUESTA
        setTimeout(() => {  that.$emit('modal',false) }, 2000); 
      }

    }
  }

</script>