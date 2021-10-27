<template>
  <v-app>
    <v-app-bar app color="rosa" dark class="elevation-4 ma-2" style="border-radius:10px">
      <v-img 
        src="http://producciongama.com/CRM-GAMA-2020/imagenes/logo.png" 
        width="65" 
        class="shrink mr-2 hidden-sm-and-down"
        @click.stop="drawer = !drawer; mini = false" 
        transition="fab-transition"
        contain
        />
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

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
