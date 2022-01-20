<template>
  <v-row justify="center">
      <!-- TITULO DE LA VISTA-->
      <v-col cols="12" class="py-0">
        <v-card-actions class="pa-0" >
          <v-card-text class="font-weight-black headline">
            COMENTARIOS
          </v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="error" fab small @click="$emit('modal',false)" ><v-icon>clear</v-icon></v-btn>
        </v-card-actions>
      </v-col>

      <v-col cols="12">
        <v-card outlined>
          <v-list-item nine-line>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold "> {{ parametros.creador }} </v-list-item-title>
                <v-card-text class="pa-0 mt-2 subtitle-1">
                  {{ parametros.comentarios}}
                </v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

  </v-row>
</template>

<script>

  // import Vue from 'vue'
  import { mapGetters,mapActions } from 'vuex';
	import metodos   from '@/mixins/metodos.js';
  // import loading   from '@/components/loading.vue'
  // import overlay   from '@/components/overlay.vue'
	// var accounting = require("accounting");

  export default {
    mixins:[metodos],
    props:[
      'parametros',
    ],
    components:{
      // overlay,
      // loading
    },

    data(){
      return {
        componente: 'master',
        
      }
    },

    async created(){

    },
  
    computed:{
      ...mapGetters('Login' ,['getdatosUsuario']), 
      
    },

    methods:{
      ...mapActions('Produccion' ,['obtener_datos_produccion','generar_nueva_entrada']), 

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