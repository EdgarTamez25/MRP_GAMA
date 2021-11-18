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
            RECIBO DE MATERIAL
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>
      </v-col>

     <!-- DETALLE DE LA PROGRAMACION SOLICITADA-->
    <v-col cols="12" >
      <v-card outlined class="py-0" >
      <v-card-text class="py-0  font-weight-black text-h6"> EMITIDO</v-card-text>
      <v-divider></v-divider>
        <v-simple-table dense >
          <template v-slot:default>
            <tbody >
              <tr>
                <td class="font-weight-black">DEPARTAMENTO</td>
                <td class="subtitle-1"  align="left"> {{ parametros.deptoemisor }}</td>
              </tr>
              
              <tr>
                <td class="font-weight-black">EMISOR</td>
                <td class="subtitle-1"  align="left"> {{ parametros.nomemisor }}</td>
              </tr>
              <tr>
                <td class="font-weight-black">FECHA DE EMISIÓN</td>
                <td class="subtitle-1">  {{  moment(parametros.creacion).format('LL') }} </td>
              </tr>
              
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>

    <!-- PRODUCTO -->
    <v-col cols="6" class=" text-center">
      <v-card class="pa-1 negro">
        <v-card flat>
          <v-card-text class="py-0  negro--text font-weight-black">PRODUCTO</v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">   {{ parametros.codigo  }} </v-card-text>
        </v-card>
      </v-card>
    </v-col>

    <!-- CANTIDAD ENVÍADA -->
    <v-col cols="6" class=" text-center">
      <v-card class="pa-1 negro">
        <v-card flat>
          <v-card-text class="py-0  negro--text font-weight-black">CANTIDAD A ENTREGAR </v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">   {{ parametros.enviadas | currency(0) }} </v-card-text>
        </v-card>
      </v-card>
    </v-col>


    <v-col cols="6" class=" text-center">
      <v-card-text class="py-0 negro--text font-weight-black">CANTIDAD A RECIBIR </v-card-text>
      <v-text-field 
        v-model.number="cantidad_recibida"
        outlined
        class="font-weight-black text-h6"
        type="number"
        color="success"
        :hint="cantidad_recibida | currency(0)"
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
        :disabled="cantidad_recibida > 0 ? false : true"
        @click="alerta_recibir_material = true"
      >
        Recibir material
      </v-btn> 
    </v-footer>

    <overlay v-if="overlay"/>

    <!-- MODAL ALERTA DE GENERACION DE PROGRAMACION -->
    <v-dialog v-model="alerta_recibir_material" persistent max-width="500">
      <v-card >
        <v-card-title class="subtitle-1 font-weight-black" style="word-break:normal;" > SE AUTORIZARÁ EL RECIBO DE MATERIAL CON LA CANTIDAD ACTUAL DE {{ cantidad_recibida | currency(0) }}  </v-card-title>
        <v-card-subtitle class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
        <v-divider class="my-0 py-3" ></v-divider>
        <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
        <v-divider class="my-0 py-2 " ></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark outlined color="gris" @click="alerta_recibir_material = false">Regresar</v-btn>
          <v-btn dark color="error" @click="recibir_material()"  >Continuar</v-btn>
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
        cantidad_recibida: 0,
        
        alerta: { 
          activo: false,
          texto: '',
          color: 'error',
        },

        alerta_recibir_material: false,
        overlay: false,
      }
    },

    filters:{
      currency(val, dec){
        return accounting.formatMoney(val, '', dec);
      },
    },

    created(){
    },
  
    computed:{
      ...mapGetters('Login' ,['getdatosUsuario']), 
      ...mapGetters('Produccion' ,['Parametros']), 
    },

     watch:{
     
    },

    methods:{
      ...mapActions('Produccion' ,['obtener_datos_produccion']), 


      recibir_material(){
        this.overlay = true;  // ACTIVO OVERLAY DE GUARDADO
        this.alerta_recibir_material = false; // CIERRO MODAL DE CONFIRMACION

        // !GENERO OBJETO QUE MANDARE A INSERTAR
        const payload = {
          id_movim      : this.parametros.id,
          recibidas     : this.cantidad_recibida,
          id_usr_receptor : this.getdatosUsuario.id,
          receptor      : this.getdatosUsuario.id_depto,
          estatus_prod  : 1,
        };
        
        // ! FUNCION QUE MANDA A CREAR LA PROGRAMACION
        this.$http.post('autorizar.recibo.material', payload).then( response =>{
          //! GENERO ALERTA DE RESPUESTA.
          this.alerta = { 
            activo: true,
            texto : response.bodyText,
            color : 'success'
          };
          this.cerrar_vista();

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

      cerrar_vista(){
        this.cantidad_recibida = 0;
        this.obtener_datos_produccion(this.Parametros)
        //!DECLARO VARIABLE PARA FUNCION INTERNA DE THIS
        let that = this; 
        //! GENERO UN SET TIMER PARA PODER MOSTRAR LA RESPUESTA
        setTimeout(() => {  that.$emit('modal',false) }, 2000); 
      }

    }
  }

</script>