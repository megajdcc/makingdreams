<template>
  <listado :actions="actions" hideFooter hidePerPage>

    <template #filter>
      <v-select v-model="etapa" :options="etapas" label="nombre" :reduce="option => option.id"  class="w-100 form-control-lg"></v-select>
    </template>

    <template #contenido="{items,refetchData}">
        <tablero   :puestos="items" :tableroId="getTablero" @reload="refetchData" :etapa="etapa" />      
    </template>



  </listado>
</template>

<script>

import store from '@/store'

import {toRefs,ref,computed,onMounted,watch} from 'vue'

import useTableroList from './useTableroList';
import vSelect from 'vue-select'

import {
  BButton,
  BCard,
  BAvatar,
  BCardTitle
} from 'bootstrap-vue'

export default {

  components:{

    Listado:() => import('components/Listado.vue'),
    BButton,
    BCard,
    BAvatar,
    BCardTitle,
    Tablero:() => import('components/Tablero.vue'),
    vSelect

  },


  setup(){

   
    const {etapas} = toRefs(store.state.etapa)
    const etapa = ref(null)

    const actions = useTableroList(etapa);

    const cargar  = () => {
      if(etapas.value.length){
        etapa.value = etapas.value.at(0) ? etapas.value.at(0).id : null
        actions.refetchData();
      }else{
        store.dispatch('etapa/getAll').then(() => {
           etapa.value = etapas.value.at(0) ? etapas.value.at(0).id : null
          actions.refetchData();
        })
      }

    }
    onMounted(() => cargar())
  
    return {

      loading:computed(() => store.state.loading),
      actions,
      etapas,
      etapa,
      getTablero:computed(() => {
        return etapas.value.find(val => val.id == etapa.value) ? etapas.value.find(val => val.id == etapa.value).tablero.id : null
      })


    }
  }

}

</script>

