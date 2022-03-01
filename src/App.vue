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

      <v-footer absolute  class="pa-0 my-2" v-if="permisos_usuario.develop">
        <v-list-item color= "celeste" :to="{ name:'Configuracion' }">
          <v-list-item-icon>
            <v-icon > mdi-account-cog </v-icon>
          </v-list-item-icon>

          <v-list-item-content >
            <v-list-item-title class="subtitle-2" >
              Configuración
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-footer>
  
    </v-navigation-drawer>

    <v-snackbar v-model="alerta.activo" multi-line vertical top right :color="alerta.color" > 
      <strong> {{alerta.texto}} </strong>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text @click="alerta.activo = false" v-bind="attrs"> Cerrar </v-btn>
      </template>
    </v-snackbar>

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
      
      <v-toolbar-items @click="cerrar_sesion=true" >
        <v-btn text> <v-icon >mdi-exit-to-app</v-icon> </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-overlay v-if="blocked">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-main>
      <v-card  height="100%" style="border-radius: 0px;">
        <v-main class="elevation-0 transparent pa-0" >
          <v-slide-y-transition mode="out-in" >
            <router-view  />
          </v-slide-y-transition>
        </v-main> 
      </v-card>
    </v-main>

    <v-dialog v-model="cerrar_sesion" width="400px">
      <v-card >
        <v-card-title class="font-weight-black text-center text-h5" style="word-break:normal;">
         ¿Estás seguro de que quiere cerrar la sesión?
        </v-card-title>
        <v-divider class="mt-3"></v-divider>
        <v-card-actions>
          <v-btn color="morado"  dark @click="cerrar_sesion=false">no, Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="celeste" dark text  @click="salir()">SÍ, Cerrar Sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
  import store from '@/store'
  import { mapGetters,mapActions } from 'vuex';
  export default {
    name: 'App',

    data: () => ({
      syster_number: 6,
      urlSistemaPrincipal: 'http://producciongama.com/',
      
      alerta: { activo: false, texto:'', color:'error' },
      blocked: true,
      drawer: null,
      cerrar_sesion:false,

      mini: true,
      AppControl: [
        {
          admin: [ 
            { text: 'Inicio'             , icon: 'home'                             , path: '/inicio'},
            { text: 'Proyector Master'   , icon: 'mdi-monitor-screenshot'           , path: '/proyector/master'},
            { text: 'Producción'         , icon: 'mdi-office-building-cog-outline'  , path: '/produccion'},
            { text: 'Ordenes de Trabajo' , icon: 'mdi-clipboard-text'               , path: '/ordenes/de/trabajo'},
            { text: 'Entradas'           , icon: 'mdi-human-dolly'                  , path: '/entradas'},
            { text: 'Salidas'            , icon: 'mdi-truck-fast-outline'           , path: '/salidas'},
            { text: 'Producto Terminados', icon: 'mdi-database-check'               , path: '/productos/terminados'},
            // { text: 'Configuración'      , icon: 'mdi-account-cog'                     , path: '/configuracion/usuarios'},
          ],
        },
      ],
    }),

    async created(){
      this.overlay = true;
      if (typeof(Storage) !== "undefined") {
          // VERIFICO SI EXISTE UN USUARIO ACTIVO 
          if(localStorage.getItem("KeyLogger") != null){
            this.validaSession().then( response =>{ // VERIFICO SI LA SESSION DEL KEYLOGGER ESTA ACTIVA
              const payload = new Object();
                    payload.id       = response.id_usuario
                    payload.sistema  = this.syster_number

              this.ObtenerDatosUsuario(payload).then(response =>{
                this.obtener_permisos_usuario(response.id); // MANDO A CONSULTAR PERMISOS
                this.alerta = { 
                  activo: true, 
                  texto: `HOLA DE NUEVO ${ response.nombre }`, 
                  color :'success', 
                };
                this.blocked = false;  // DESACTIVO BLOCKEO
              }).catch( error=>{       // OBTENGO LA INFORMACION DEL USUARIO
                this.alerta = { activo: true, texto: error.bodyText, color:'error' }
                window.location.href = this.urlSistemaPrincipal;
              });  
            }).catch( error =>{
              window.location.href = this.urlSistemaPrincipal;
            })
            if(this.$router.currentRoute.name != 'Inicio'){  // COMPARO LA RUTA EN LA QUE ME ENCUENTRO 
              this.$router.push({ name: 'Inicio' });         // SI ES DIFERENTE ENRUTO A PAGINA ARRANQUE
            }
          }else{ 
           window.location.href = this.urlSistemaPrincipal;
          }
      } else {
        window.location.href = this.urlSistemaPrincipal;
      }
    },

    computed:{
      ...mapGetters('Login' ,['getLogeado','getdatosUsuario','permisos_usuario']), 
    },


    methods:{
      ...mapActions('Login' ,['salirLogin','ObtenerDatosUsuario','validaSession','obtener_permisos_usuario']), 
      
      salir(){
        this.alerta = { activo: true, texto: `HASTA PRONTO ${ this.getdatosUsuario.nombre }`, color :'success'  };
        this.cerrar_sesion= false;
        this.salirLogin()
        this.$store.dispatch("salir")
      },

    }

  };
</script>


<style >
    ::-webkit-scrollbar {
    width: 5px;
    height : 8px;
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