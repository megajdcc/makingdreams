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
          <label>Por forma de pago</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="formaPagoFilter"
            :options="formas"
  
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:formaPagoFilter', val)"
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
      formas:[
        {
          id:1,// Transferencia
          label:'Transferencia bancaria'
        },
         {
          id:2,// Agencia
          label:'Pago en agencia'
        },
         {
          id:3,// Paypal
          label:'Paypal'
        },
         {
          id:4,// Conekta
          label:'Conekta'
        }
      ]
    }
  },

  props: {

    formaPagoFilter:{
      type:[Number,null],
      default:null
    }

  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
