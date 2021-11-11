<template>
  <v-main class="pa-0 ma-3">
    <v-data-table
      :headers="dessertHeaders"
      :items="desserts"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Expandable Table</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch
            v-model="singleExpand"
            label="Single expand"
            class="mt-2"
          ></v-switch>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" >
         <v-row class="my-2">
          <v-col cols="12"  class="pa-4 ">
            <v-card >
              <v-simple-table dense >
                <template v-slot:default>
                <thead>
                  <tr>
                    <th class="font-weight-black text-left"> # </th>
                    <th class="font-weight-black text-right"> RECIBIDO </th>
                    <th class="font-weight-black text-right"> PRODUCIDO </th>
                    <th class="font-weight-black text-center"> FECHA RESEPCIÓN </th>
                    <th class="font-weight-black text-center"> ESTATUS </th>

                    <th class="font-weight-black text-left">  </th>

                  </tr>
                </thead>
                  <tbody >
                    <tr v-for="(i, item) in 5" key="i">
                      <td class="">1</td>
                      <td class=" subtitle-1"  align="right"> 3,000 </td>
                      <td class=" subtitle-1"  align="right"> 0 </td>
                      <td class=" subtitle-1"  align="center"> 21 de Enero </td>
                      <td class=" subtitle-1"  align="center"> Pendiente de recibir </td>

                      <td class=" subtitle-1"  align="left"> 
                        <v-btn fab small dark color="celeste"> <v-icon> mdi-send </v-icon> </v-btn>
                      </td>

                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>

          </v-col>
         </v-row>
        </td>
      </template>
    </v-data-table>
  </v-main>
</template>

<script>
  export default {
    data () {
      return {
        expanded: [],
        singleExpand: false,
        dessertHeaders: [
          {
            text: 'Dessert (100g serving)',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
          { text: '', value: 'data-table-expand' },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
      }
    },
  }
</script>