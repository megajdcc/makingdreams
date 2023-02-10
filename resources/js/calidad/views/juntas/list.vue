<template>

   <b-card>

      <b-container fluid>
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center">
            <b-button-group >
                
              
                <b-button variant="primary" v-for="(etapa,i) in etapas.sort((a,b) => a.monto  - b.monto)" :key="i" class="mx-1" :disabled="verificarEtapa(etapa)" >
                    Unete a la junta de {{  etapa.monto | currency  }}
                </b-button>
                
            </b-button-group>
          </b-col>
        </b-row>
      </b-container>

      <template #footer>
        <b-button-group size="sm">
          <b-button variant="dark" @click="regresar">
            <feather-icon icon="ArrowLeftIcon" ></feather-icon>
            Regresar
          </b-button>
        </b-button-group>     
      </template>
   </b-card>

</template>

<script>

import store from '@/store'

import {computed,toRefs,ref,onMounted, watch} from 'vue'

import {regresar}  from '@core/utils/utils'


import {
  BButton,
  BButtonGroup,
  BForm,
  BFormGroup,
  BFormInput ,
  BCard,
  BContainer,
  BRow,
  BCol
} from 'bootstrap-vue'

export default {
  
  components:{
    BButton,
    BButtonGroup,
    BForm,
    BFormGroup,
    BFormInput ,
    BCard,
    BContainer,
    BRow,
    BCol


  },


  setup(){
    const {etapas} = toRefs(store.state.etapa)
    const {usuario} = toRefs(store.state.usuario)
    const tableros = computed(() => usuario.value.tableros)

    const cargarForm = () => {

      if(!etapas.value.length){
        store.dispatch('etapa/getAll')
      }


    }

    onMounted(() => cargarForm())

    const verificarEtapa = (etapa) => {
      
      if(tableros.value.length){
        return true;
      }else{
        return etapas.value.sort((a,b) => a.monto - b.monto)[0].id == etapa.id ? false : true
      }

    } 

    return{
      etapas,
      verificarEtapa,
      regresar,
      usuario,
      loading:computed(() => store.state.loading)
    }

  }

}
</script>