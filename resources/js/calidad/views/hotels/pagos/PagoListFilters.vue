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
          <label>Por Boda</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="bodaFilter"
            :options="bodas.map(val => { return {
               id:val.id,
               label:`${val.novios.novia} & ${val.novios.novio}`
            } })"
  
            class="w-100"
            :reduce="val => val.id"
            @input="(val) => $emit('update:bodaFilter', val)"
          />
        </b-col>




      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BRow, BCol } from 'bootstrap-vue'
import vSelect from 'vue-select'
import {mapState} from 'vuex';

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
  }, 

   props: {

    bodaFilter:{
      type:[Number,null],
      default:null
    }

  },

  computed:{
     ...mapState('boda',['bodas'])
  }
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
