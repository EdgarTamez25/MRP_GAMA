<template>
  <v-app id="inspire">
    <v-navigation-drawer 
      v-model="drawer" 
      app
      :mini-variant.sync="mini"
      class="elevation-3 mt-2"
      style="border-radius:12px"
      dark
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line  @click="mini= !mini">
          <v-list-item-avatar size="30px">
            <img src="http://producciongama.com/CRM-GAMA-2020/imagenes/person.png">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ getdatosUsuario.nombre }} </v-list-item-title>
            <!-- <v-list-item-subtitle> {{ niveles[getdatosUsuario.nivel-1] }}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>

      <v-list dense>
        <template v-for="control in AppControl">
          <v-list-item
            v-for="(child, i) in control.admin"
            :key="i"
            :to="child.path"
            color= "rosa"
            @click="mini= !mini"
          >
            <v-list-item-icon>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content >
              <v-list-item-title >
                {{ child.text }} 
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </template>
      </v-list>
  
    </v-navigation-drawer>



    <v-app-bar app color="rosa" dark class="elevation-4 ma-2" style="border-radius:10px">
      <v-img 
        src="http://producciongama.com/CRM-GAMA-2020/imagenes/logo.png" 
        width="65" 
        class="shrink mr-2 "
        @click.stop="drawer = !drawer; mini = false" 
        transition="fab-transition"
        contain
        />
       <!-- hidden-sm-and-down-->
      <v-spacer></v-spacer>
      
      <v-toolbar-items @click="cerrar_sesion=true">
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-card  height="100%" style="border-radius: 0px;">
        <v-main class="elevation-0 transparent pa-0" >
          <v-slide-y-transition mode="out-in" >
            <router-view  />
          </v-slide-y-transition>
        </v-main> 
      </v-card>
    </v-main>

  </v-app>
</template>

<script>
  import store from '@/store'
  import { mapGetters,mapActions } from 'vuex';
  export default {
    name: 'App',

    data: () => ({
      syster_number: 2,
      urlSistemaPrincipal: 'http://producciongama.com/',
      
      blocked: false,
      drawer: null,
      cerrar_sesion:false,

      mini: true,
      AppControl: [
        {
          admin: [ 
            { text: 'Inicio'             , icon: 'home'                             , path: '/inicio'},
            { text: 'Proyector Master'   , icon: 'mdi-monitor-screenshot'           , path: '/proyector/master'},
            { text: 'Producción'         , icon: 'mdi-office-building-cog-outline'  , path: '/solicitudes'},
            { text: 'Producto Final'     , icon: 'mdi-database-check'               , path: '/desarrollo/proyectos'},
            { text: 'Ordenes de Trabajo' , icon: 'mdi-clipboard-text'                ,path: '/ordenes/de/trabajo'},

            ],
        },
      ],
    }),

    created(){
      // this.overlay = true;
      if (typeof(Storage) !== "undefined") {
          // VERIFICO SI EXISTE UN USUARIO ACTIVO 
          if(localStorage.getItem("KeyLogger") != null){
            this.validaSession().then( response =>{ // VERIFICO SI LA SESSION DEL KEYLOGGER ESTA ACTIVA
              const payload = new Object();
                    payload.id       = response.id_usuario
                    payload.sistema  = this.syster_number

              this.ObtenerDatosUsuario(payload).then(response =>{
                this.alerta = { activo: true, texto: `HOLA DE NUEVO ${ response.nombre }`, color :'success', vertical:true  };
                this.blocked = false;  // DESACTIVO BLOCKEO
              }).catch( error=>{       // OBTENGO LA INFORMACION DEL USUARIO
                this.alerta = { activo: true, texto: error.bodyText, color:'error', vertical:true }
                // window.location.href = this.urlSistemaPrincipal;
              });  
            }).catch( error =>{
              // window.location.href = this.urlSistemaPrincipal;
            })
            if(this.$router.currentRoute.name != 'Inicio'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
              this.$router.push({ name: 'Inicio' });         // SI ES DIFERENTE ENRUTO A PAGINA ARRANQUE
            }
          }else{ 
          //  window.location.href = this.urlSistemaPrincipal;
          }
      } else {
        // window.location.href = this.urlSistemaPrincipal;
      }
    },

    computed:{
      ...mapGetters('Login' ,['getLogeado','getdatosUsuario']), 
    },


    methods:{
      ...mapActions('Login' ,['salirLogin','ObtenerDatosUsuario','validaSession']), 

    }

  };
</script>


<style >
    ::-webkit-scrollbar {
    width: 5px;
    height : 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    /* background: transparent; */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #bf1c7f;
  }
</style>