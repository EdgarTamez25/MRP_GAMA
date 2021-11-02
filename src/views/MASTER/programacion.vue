<template>
  <v-row class="pa-2">
    <!-- SNACKBAR -->
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
          PROGRAMACIÓN
        </v-card-text>
        <v-spacer></v-spacer>
        <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
      </v-card-actions>
    </v-col>

    <!-- DETALLE DE LA PROGRAMACION SOLICITADA-->
    <v-col cols="12" >
      <v-card outlined>
        <v-simple-table dense >
          <template v-slot:default>
            <tbody >
              <tr>
                <td class="font-weight-black">PRODUCTO</td>
                <td class="subtitle-1"  align="left"> {{ programacion.codigo }}</td>
              </tr>
              
              <tr>
                <td class="font-weight-black">CLIENTE</td>
                <td class="subtitle-1"  align="left"> {{ programacion.nomcli }}</td>
              </tr>
              <tr>
                <td class="font-weight-black">FECHA DE ENTREGA</td>
                <td class="subtitle-1">  {{  moment(programacion.fecha_entrega).format('LL') }} </td>
              </tr>
              <tr>
                <td class="font-weight-black">ORDEN DE COMPRA</td>
                <td class="subtitle-1"  align="left"> {{ programacion.oc ? programacion.oc: 'S/O.C.' }}</td>
              </tr><tr>
                <td class="font-weight-black">ORDEN DE TRABAJO</td>
                <td class="subtitle-1"  align="left"> {{ programacion.id_ot }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
    
    <!-- CANTIDAD SOLICITADA -->
    <v-col cols="6" class=" text-center">
      <v-card class="pa-1 gris">
        <v-card flat>
          <v-card-text class="py-0  gris--text font-weight-black">CANTIDAD SOLICITADA</v-card-text>
          <v-card-text class="py-0  negro--text font-weight-black text-h5">   {{ programacion.cantidad | currency(0) }} </v-card-text>
        </v-card>
      </v-card>
    </v-col>

    <!-- CANTIDAD PROGRAMADA -->
    <v-col cols="6" class=" text-center">
      <v-card class="pa-1" :color="parseInt(TOTAL) >= parseInt(programacion.cantidad)? 'success':'error'">
        <v-card flat>
          <v-card-text class="py-0 black--text font-weight-black">  CANTIDAD PROGRAMADA </v-card-text>
          <v-card-text 
            class="py-0 font-weight-black text-h5"
            :class="[`${parseInt(TOTAL) >= parseInt(programacion.cantidad)? 'green':'error'}--text`]"
          > 
          {{ TOTAL |  currency(0) }}
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
    
    <!-- BOTON AGREGAR NUEVO REGISTRO -->
    <v-col cols="12" sm="6" offset-sm="6" >
      <v-btn 
        block color="celeste"  
        class="white--text"
        @click="detalleModal = true"
      > Agregar  
      </v-btn>
    </v-col>

    <!-- TABLA DE REGISTROS -->
    <v-col cols="12">
      <v-alert outlined  type="warning" prominent border="top" v-if="!Programacion.length">
        Agrega las partidas necesarias para tú programación. Trata de ser eficiente. 
      </v-alert>
      <v-simple-table dense v-else>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center rosa white--text"> SUCURSAL </th>
              <th class="text-center rosa white--text"> DEPARTAMENTO INICIAL </th>
              <th class="text-center rosa white--text"> CANTIDAD A PRODUCIR </th>
              <th class="text-right rosa white--text">  </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,i) in Programacion" :key="i" class="font-weight-black text-center">
              <td clsss="text-h5" >  {{ item.sucursal.nombre }}  </td>
              <td clsss="text-h5" >  {{ item.depto.nombre }}  </td>
              <td clsss="text-h5" >  {{ item.cantidad | currency(0) }} </td>
              <td class="pa-2"> 
                <v-btn fab small color="celeste" class="mx-1" dark @click="abrir_detalle_partida(item)"> <v-icon> mdi-pencil </v-icon>  </v-btn> 
                <v-btn fab small color="error"   class="mx-1" dark @click="abrir_eliminar_partida(item)"> <v-icon> mdi-delete </v-icon>  </v-btn> 
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>

       
    <!-- FOOTER  :disabled="overlay ? true : false" -->
    <v-col class="mt-10" v-if="Programacion.length"/>
    <v-footer absolute fixed>
      <v-spacer></v-spacer>
      <v-btn  
        dark color="success" 
        @click="validar_detalle_partida()" 
        v-if="Programacion.length"
      >
        Generar Programación
      </v-btn> 
    </v-footer>
    
    <!-- MODAL PARA MOSTRAR DETALLE -->
    <v-dialog v-model="detalleModal" transition="dialog-bottom-transition" width="400px">
      <v-card class="pa-4">
        <v-card-actions class="pa-0" >
          <v-card-text class="font-weight-black subtitle-1 pa-0">
            {{ editedIndex == -1? 'AGREGAR':'EDITAR' }} {{ tipo_prog.id === 1 ? 'PARCIALIDAD': 'PROGRAMACIÓN' }} 
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" x-small fab @click="cerrar_detalle()" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>

          <v-row class="mt-3">
          <v-col cols="12" class="py-0 mt-3">
              <v-select
              v-model="editDetalle.sucursal" :items="sucursales" item-text="nombre" item-value="id" color="celeste" 
              outlined  hide-details  placeholder="Sucursales" return-object dense
            ></v-select>
          </v-col>
          <v-col cols="12" class="py-0 mt-3">
              <v-select
              v-model="editDetalle.depto" :items="departamentos" item-text="nombre" item-value="id" color="celeste" 
              outlined  hide-details  placeholder="Departamentos" return-object dense
            ></v-select>
          </v-col>
          <v-col cols="12" >
            <v-text-field
              v-model ="editDetalle.cantidad " label="Cantidad"  outlined type="number" hide-details class="my-1" dense
            ></v-text-field>
            <span class="font-weight-black mx-3" v-if="editDetalle.cantidad"> 
              {{ editDetalle.cantidad | currency(0) }}  
            </span>
          </v-col>
        </v-row>

        <v-card-actions class="pa-0 mt-5" >
          <v-spacer></v-spacer>
          <v-btn color="success"
            :disabled="GUARDAR_DATOS"  
            @click="validar_tipo_de_registro()"> Guardar </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- MODAL ALERTA DE GENERACION DE PROGRAMACION -->
    <v-dialog v-model="alerta_generar_programacion" persistent max-width="500">
      <v-card >
        <v-card-title class="subtitle-1 font-weight-black" style="word-break:normal;" > SE GENERARA LA PROGRAMACIÓN CON LA INFORMACIÓN ACTUAL  </v-card-title>
        <v-card-subtitle class=" mt-1 subtitle-2 font-weight-black">¿ ESTA SEGURO DE QUERER CONTINUAR ?</v-card-subtitle>
        <v-divider class="my-0 py-3" ></v-divider>
        <v-card-subtitle align="center" class="red--text font-weight-bold "> NO SE PODRAN EFECTUAR CAMBIOS POSTERIORES </v-card-subtitle>
        <v-divider class="my-0 py-2 " ></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark outlined color="gris" @click="alerta_generar_programacion = false">Regresar</v-btn>
          <v-btn dark color="error" @click="generar_nueva_programacion()"  >Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- MODAL PARA ALIMINAR REGISTRO -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card class="pa-1" dark>
        <v-card-title class="text-h6 font-weight-bold" style="word-break:normal;"  > ¿Estas seguro de querer eliminar este registro?</v-card-title>
        <v-card-text  class="subtitle-1 font-weight-bold text-center warning--text"> Una vez eliminado no se podra recuperar</v-card-text>
        <v-divider class="verde"></v-divider>
        <v-card-actions>
          <v-btn color="warning darken-1"    @click="cerrar_eliminar_partida()">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text dark @click="eliminar_partida_local()">Sí, Seguro</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  	<overlay v-if="overlay"/>


  </v-row>
</template>

<script>

  import Vue from 'vue'
  import { mapGetters,mapActions } from 'vuex';
	import metodos   from '@/mixins/metodos.js';
  import loading   from '@/components/loading.vue'
  import overlay   from '@/components/overlay.vue'
	var accounting = require("accounting");
  Vue.filter('currency', (val, dec) => { return accounting.formatMoney(val, '', dec) });

  export default {
    mixins:[metodos],
    props:[
      'programacion',
    ],
    components:{
      overlay,
      loading
    },

    data(){
      return {
        tipo_prog: { id:null, nombre:''},

        Programacion :[],
        sucursales   :[],
        departamentos:[],

        detalleModal: false,
        editedIndex : -1,
        editDetalle : {
          id: null,
          sucursal: { id: null, nombre: '' },
          depto   : { id: null, nombre: '' },
          cantidad: null,
        },
        defaultDetalle : {
          id: null,
          sucursal: { id: null, nombre: '' },
          depto   : { id: null, nombre: '' },
          cantidad: null,
        },

        alerta: { 
          activo: false,
          texto: '',
          color: 'error',
        },

        alerta_generar_programacion: false,
        dialogDelete: false,

        overlay: false,
      }
    },

    created(){
      this.init();
    },
  
    computed:{
      ...mapGetters('Login' ,['getLogeado','getdatosUsuario']), 

      GUARDAR_DATOS(){
        if(this.editDetalle.sucursal.id != null && 
           this.editDetalle.cantidad > 0 ) {      
          // && this.editDetalle.depto.id != null){
          return false
        }else{
          return true
        }
      },

      TOTAL(){ 
        let total = 0;
        for(let i=0; i< this.Programacion.length; i++){ 
          total = total + parseInt(this.Programacion[i].cantidad)
        }
        return total ;
      }
    },

    methods:{
      async init(){ 
        this.sucursales = await this.consultar_sucursales(); 
      },

      abrir_detalle_partida(item){
        this.editedIndex = this.Programacion.indexOf(item)
        this.editDetalle = Object.assign({}, item)
        this.detalleModal = true
      },

      validar_tipo_de_registro(){ 
        for(let i=0; i< this.Programacion.length; i++){
          if(this.editDetalle.sucursal.id === this.Programacion[i].sucursal.id &&
             this.editedIndex != i){
            this.alerta = { 
              activo: true,
              texto : 'No puedes programar dos veces en la misma sucursal esté producto.',
              color : 'error'
            };
            this.cerrar_detalle();
            return
          } 
        }
        this.guardar_detalle_partida_local()
      },

      guardar_detalle_partida_local() {
        if (this.editedIndex > -1) {
          Object.assign(this.Programacion[this.editedIndex], this.editDetalle)
        } else {
          this.Programacion.push(this.editDetalle)
        }
        this.cerrar_detalle()
      },

      cerrar_detalle() {
        this.detalleModal = false
        this.$nextTick(() => {
          this.editDetalle = Object.assign({}, this.defaultDetalle)
          this.editedIndex = -1
        })
      },

      abrir_eliminar_partida(item) {
        this.editedIndex = this.Programacion.indexOf(item)
        this.editDetalle = Object.assign({}, item)
        this.dialogDelete = true
      },

      eliminar_partida_local() {
        this.Programacion.splice(this.editedIndex, 1)
        this.cerrar_eliminar_partida()
      },

      cerrar_eliminar_partida() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editDetalle = Object.assign({}, this.defaultDetalle)
          this.editedIndex = -1
        })
      },

      validar_detalle_partida(){
        if(parseInt(this.programacion.cantidad) > parseInt(this.TOTAL)){
          this.alerta = { 
            activo: true,
            texto : 'No puedes programar una cantidad menor que la solicitada.',
            color : 
            'error'
          };
          return ;
        }
         this.alerta_generar_programacion = true;
      },

      generar_nueva_programacion(){
        this.overlay = true; 
        this.alerta_generar_programacion = false;

        const payload = {
          id_det_ot      : this.programacion.id,
          id_producto    : this.programacion.id_producto,
          cant_sol       : this.programacion.cantidad,
          urgencia       : this.programacion.urgencia,
          fecha_entrega  : this.programacion.fecha_entrega,
          id_creador     : this.getdatosUsuario.id,
          creacion       : this.traerFechaActual() + ' ' + this.traerHoraActual(),
          tipo_prog      : this.Programacion.length > 0? 2:1, 
          cant_prog      : this.TOTAL,
          programacion   : this.Programacion
        }

        this.$http.post('agregarproduccion', payload).then( response =>{
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

    }
  }

</script>