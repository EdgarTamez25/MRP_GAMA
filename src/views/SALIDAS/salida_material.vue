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
          SALIDA DE PRODUCTO
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
              <!--<tr>
                <td class="font-weight-black">PRODUCTO</td>
                <td class="subtitle-1"  align="left"> {{ parametros.codigo }}</td>
              </tr> 
              <tr>
                <td class="font-weight-black">CANTIDAD EXISTENTE</td>
                <td class="subtitle-1"  align="left"> {{ parametros.cantidad | currency(0)}} {{ parametros.unidad}}</td>
              </tr> -->
              <tr>
                <td class="font-weight-black">SUCURSAL</td>
                <td class="subtitle-1"  align="left"> {{ parametros.nomsucursal}}</td>
              </tr>
              <tr>
                <td class="font-weight-black"> ULTIMA ACTUALIZACIÓN </td>
                <td class="subtitle-1">  {{  moment(parametros.fecha_actualiza).format('LL') }} </td>
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

    <!-- CANTIDAD ENVÍADA  --> 
    <v-col cols="6" class=" text-center">
      <v-card class="pa-1 negro">
        <v-card flat>
          <v-card-text class="py-0  negro--text font-weight-black"> CANTIDAD EXISTENTE </v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">  {{ parametros.cantidad | currency(0)}}</v-card-text>
        </v-card>
      </v-card>
    </v-col>

     <v-col cols="6" class=" text-center">
      <v-card-text class="py-0 negro--text font-weight-black"> ORDEN DE COMPRA </v-card-text>
      <v-text-field 
        v-model="referencia"
        outlined
        class="font-weight-black text-h6"
        color="success"
      >
      </v-text-field>
    </v-col>

    <v-col cols="6" class=" text-center">
      <v-card-text class="py-0 negro--text font-weight-black"> CANTIDAD A SALIR </v-card-text>
      <v-text-field 
        v-model.number="cantidad_salir"
        outlined
        class="font-weight-black text-h6"
        type="number"
        color="success"
        :hint="cantidad_salir | currency(0)"
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
        :disabled="cantidad_salir > 0 && referencia ? false : true"
        @click="validar_cantidad_salida()"
      >
        Generar salida
      </v-btn> 
    </v-footer>

    <overlay v-if="overlay"/>

    <!-- MODAL ALERTA DE GENERACION DE PROGRAMACION -->
    <v-dialog v-model="alerta_salida_producto" persistent max-width="500">
      <v-card >
        <v-card-title class="subtitle-1 font-weight-black" style="word-break:normal;" > SE AUTORIZARÁ LA SALIDA DEL PRDUCTO CON LA CANTIDAD ACTUAL DE {{ cantidad_salir | currency(0) }}  </v-card-title>
        <v-card-subtitle class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
        <v-divider class="my-0 py-3" ></v-divider>
        <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
        <v-divider class="my-0 py-2 " ></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark outlined color="gris" @click="alerta_salida_producto = false">Regresar</v-btn>
          <v-btn dark color="error" @click="generar_salida_producto()"  >Continuar</v-btn>
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
        componente:'producto final',
        cantidad_salir: 0,
        referencia:'',
        
        alerta: { 
          activo: false,
          texto: '',
          color: 'error',
        },

        alerta_salida_producto: false,
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
      ...mapGetters('Productos_terminados' ,['Parametros']), 
    },

    watch:{},

    methods:{
      ...mapActions('Productos_terminados' ,['obtener_productos_terminados']), 


      validar_cantidad_salida(){
        if(!this.referencia){
          this.alerta = { activo: true, texto:'DEBES AGREGAR UNA REFERENCIA', color:'error'};
          return;
        }

        if(this.cantidad_salir > this.parametros.cantidad){
          this.alerta = { activo: true, texto:'NO PUEDES DAR SALIDA A UNA CANTIDAD MAYOR A LA EXISTENTE', color:'error'};
          return;
        }
        this.alerta_salida_producto = true;
      },

      async generar_salida_producto(){

        let permiso = await this.verificar_permiso_usuario(this.componente);
        this.alerta_salida_producto = false; // CIERRO MODAL DE CONFIRMACION
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
        
        // !GENERO OBJETO QUE MANDARE A INSERTAR
        const payload = {
          id_sucursal : this.parametros.id_sucursal,
          id_producto : this.parametros.id_producto,
          cantidad    : this.cantidad_salir,
          referencia  : this.referencia,
          id_creador  : this.getdatosUsuario.id,
          id_pt       : this.parametros.id  // ID PARA ACTUALIZAR EN PRODUCTO TERMINADO
        };
        
        // ! FUNCION QUE MANDA A CREAR LA PROGRAMACION
        this.$http.post('generar.nueva.salida', payload).then( response =>{
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
        this.cantidad_salir = 0;
        this.obtener_productos_terminados(this.Parametros)
        //!DECLARO VARIABLE PARA FUNCION INTERNA DE THIS
        let that = this; 
        //! GENERO UN SET TIMER PARA PODER MOSTRAR LA RESPUESTA
        setTimeout(() => {  that.$emit('modal',false) }, 2000); 
      }

    }
  }

</script>