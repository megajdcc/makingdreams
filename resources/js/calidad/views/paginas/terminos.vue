<template>
   <b-container>
      <b-row>
         <b-col cols="12">
            <h3>Términos y Condiciones</h3>
         </b-col>

         <b-col cols="12" >
            <p class="text-justify" v-html="sistema.terminos">
              
            </p>
         </b-col>
      </b-row>
   </b-container>
</template>

<script>

import {
   BContainer,
   BRow,
   BCol,

} from 'bootstrap-vue'

import store from '@/store'
import {toRefs,computed} from 'vue'

export default {
   
   components:{
      BContainer,
      BRow,
      BCol,
   },

   setup(props){

      const {sistema} = toRefs(store.state.sistema)

      return {
         sistema
      }
   }


}

</script>