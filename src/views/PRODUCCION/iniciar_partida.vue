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
            INICIAR PARTIDA
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>
      </v-col>

     <!-- DETALLE DE LA PROGRAMACION SOLICITADA-->
    <v-col cols="12" >
      <v-card outlined class="py-0" >
      <v-card-text class="py-0  font-weight-black text-h6"> DATOS DE LA PARTIDA</v-card-text>
      <v-divider></v-divider>
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
                <td class="font-weight-black">CANT. RECIBIDA</td>
                <td class="subtitle-1"  align="left"> {{ parametros.recibidas | currency(0) }}</td>
              </tr>
              <tr>
                <td class="font-weight-black">FECHA DE ENTREGA</td>
                <td class="subtitle-1">  {{  moment(parametros.fecha_entrega).format('LL') }} </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>

    <v-col>
       <v-card class="text-center " outlined>
        <v-card-subtitle   align="center"  > 
          <span class="text-h5 font-weight-black" style="word-break:normal;"> SE AUTORIZARA EL COMIENZO DE LA PARTIDA   </span> <br>
          <span class="subtitle-2 error--text font-weight-black"> RECUERDE QUE NO SE PODRAN EFECTUAR CAMBIOS POSTERIORMENTE  </span>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-subtitle class="subtitle-1 font-weight-black info--text"> SI ESTA SEGURO DE QUERER CONTINUAR PRESIONE EL BOTON  INICIAR </v-card-subtitle>
      </v-card>
    </v-col>

  
    <!-- FOOTER  -->
    <v-col cols="12" class="mt-8" />

    <v-footer absolute fixed>
      <v-spacer></v-spacer>
      <v-btn  
        dark color="success" 
        @click="" 
        @click="iniciar_partida()"
      >
        Iniciar
      </v-btn> 
    </v-footer>

    <overlay v-if="overlay"/>

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


      iniciar_partida(){
        this.overlay = true;  // ACTIVO OVERLAY DE GUARDADO

        // !GENERO OBJETO QUE MANDARE A INSERTAR
        const payload = {
          id_movim      : this.parametros.id,
          fecha_inicio  : this.traerFechaActual(),
          estatus_prod  : 2,
        };
        
        // ! FUNCION QUE MANDA A CREAR LA PROGRAMACION
        this.$http.post('iniciar.partida.movim', payload).then( response =>{
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
        this.obtener_datos_produccion(this.Parametros)
        //!DECLARO VARIABLE PARA FUNCION INTERNA DE THIS
        let that = this; 
        //! GENERO UN SET TIMER PARA PODER MOSTRAR LA RESPUESTA
        setTimeout(() => {  that.$emit('modal',false) }, 2000); 
      }

    }
  }

</script>