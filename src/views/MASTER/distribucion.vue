<template>
  <v-row class="pa-2">

    <v-col cols="12" class="py-0">
      <v-card-actions class="pa-0" >
        <v-card-text class="font-weight-black text-h6">
          DISTRIBUCIÓN
        </v-card-text>
        <v-spacer></v-spacer>
        <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
      </v-card-actions>
      <v-divider></v-divider>
    </v-col>
    
    <v-col cols="12" class="my-12" v-if="Loading ">
      <loading />
    </v-col>
    
    <v-col cols="12" class="my-4" v-if="!Loading">
       <v-card-text class="font-weight-black text-h6  py-0">
         PRODUCTO: <span class="rosa--text">{{ distribucion.codigo }} </span>
      </v-card-text>
      <v-card  flat v-for="(item, i) in programacion" :key ="i" >
        <v-btn 
          dark absolute bottom color="rosa" right fab small 
          :loading="loading_movim" 
          @click="item.show = !item.show; consulta_movimientos(item)" 
        > 
          <v-icon> {{ !item.show?'expand_more': 'expand_less' }} </v-icon>
        </v-btn>

        <v-card  class="mt-5 "outlined>
          <v-list three-line >
            <!-- <v-list-item v-for="item in items" :key="item.title" > -->
            <v-list-item >

              <v-list-item-content>
                <v-list-item-title    class="text-h6"> SUCURSAL</v-list-item-title>
                <v-list-item-subtitle class=" text-h6"> {{ item.nomsucursal }}  </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content >
                <v-list-item-title    class="text-h6" align="right"> PROGRAMADO </v-list-item-title>
                <v-list-item-subtitle class="text-h6" align="right"> {{ item.cant_prog | currency(0) }} </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content>
                <v-list-item-title    class="text-h6" align="right"> TERMINADO</v-list-item-title>
                <v-list-item-subtitle class="text-h6" align="right"> {{ item.total | currency(0) }} </v-list-item-subtitle>
              </v-list-item-content>

            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          
          <v-expand-transition >
            <div v-show="item.show" >
              <v-list two-line v-for="(item, i) in item.movimientos" :key="i" outlined>
                <v-list-item class="pa-2" > 
                  <v-list-item-content>
                    <v-list-item-title    class="font-weight-black subtitle-1"> DEPARTAMENTO</v-list-item-title>
                    <v-list-item-subtitle class=" subtitle-1"> {{ item.departamento }}  </v-list-item-subtitle>
                  </v-list-item-content>

                   <v-list-item-content>
                    <v-list-item-title    align="center" class="font-weight-black subtitle-1"> ESTATUS</v-list-item-title>
                    <v-list-item-subtitle align="center" class=" subtitle-1"> {{ estatus[item.estatus_prod].nombre  }}  </v-list-item-subtitle>
                  </v-list-item-content>

                   <v-list-item-content>
                    <v-list-item-title    align="right" class="font-weight-black subtitle-1"> TERMINADO </v-list-item-title>
                    <v-list-item-subtitle align="right" class=" subtitle-1"> {{ item.terminadas | currency(0) }}  </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>



        </v-card>
      </v-card>
    </v-col>

  </v-row>
</template>

<script>
  var accounting = require("accounting");
  import { mapGetters,mapActions } from 'vuex';
	import metodos   from '@/mixins/metodos.js';
  import loading   from '@/components/loading.vue'
  import overlay   from '@/components/overlay.vue'

  export default {
    mixins:[metodos],
    props:[
      'distribucion',
    ],
    components:{
      overlay,
      loading
    },

    data(){
      return {
        programacion:[],
        estatus:[ 
          { id: 0, nombre:'POR RECIBIR'},
          { id: 1, nombre:'PENDIENTE'},
          { id: 2 ,nombre:'PRODUCIENDO'},
          { id: 3, nombre:'TERMINADO'},
          { id: 4, nombre:'ENVIADO'},
        ],

        Loading: true,
        loading_movim: false
      }
    },

    filters:{
      currency(val, dec){
        return accounting.formatMoney(val, '', dec)
      }
    },

    watch:{
      distribucion(){ 
        this.Loading = true;
        this.init();
      }
    },

    created(){
      this.init();
    },

    methods:{
      async init(){ 
        this.programacion = [];
        const payload = {
          id_producto: this.distribucion.id_producto ,
          id_det_ot  : this.distribucion.id
        }

        this.$http.post('obtener.distribucion.programacion', payload).then( response =>{
          for( const item of response.body ){
            this.programacion.push({ ...item, show: false, movimientos:[] })
          }
        }).catch( error =>{
          console.log('Error', error);
        }).finally( () =>{
          this.Loading = false
        })
        

      },

      consulta_movimientos(item){
        if(!item.show){ return };
        this.loading_movim = true;

        let index = this.programacion.indexOf(item);
        this.$http.post('obtener.distribucion.movimientos', item).then( response =>{
          this.programacion[index].movimientos = response.data;
        }).catch( error =>{
          console.log('error', error);
        }).finally(()=>{
          this.loading_movim = false;
        });
      }
    }
  }
</script>