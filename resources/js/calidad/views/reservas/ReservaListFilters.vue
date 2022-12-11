<template>
  <b-card no-body>
    <b-card-header class="pb-50">
      <h5>
        Filtros
      </h5>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Por Hotel</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="hotelFilter"
            :options="hoteles"
  
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:hotelFilter', val)"
          />
        </b-col>

         <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Por Boda</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="bodasFilter"
            :options="bodas"
  
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:bodasFilter', val)"
          />
        </b-col>

        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Por status</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="statusFilter"
            :options="status"
  
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:statusFilter', val)"
          />
        </b-col>



      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BRow, BCol } from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
  },

  data(){
     return{
        status:[{
           id:0,
           label:'Sin Pagar',
        },{
           id:1,
           label:'Pagadas'
        }],

     }
  },

  props: {
    hotelFilter: {
      type: [Number, null],
      default: null,
    },
   
      statusFilter: {
      type: [Number, null],
      default: null,
    },

    hoteles: {
      type: Array,
      required: true,
    },

   bodasFilter: {
      type: [Number, null],
      default: null,
    },
    bodas: {
      type: Array,
      required: true,
    },

  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
