<template>
   <listado :actions="actions" hideFooter>
      <template #btn-action>
          <b-button variant="dark" :to="{ name: 'create.ciudad' }">
            <feather-icon size="18" icon="PlusSquareIcon" />
            Añadir
         </b-button>
      </template>
      <template #contenido="{fetchData,tableColumns,sortBy,isSortDirDesc,eliminar}">
         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id" :sort-by="sortBy"
            empty-text="No se encontró ningúna Ciudad" :sort-desc="isSortDirDesc" sticky-header="700px"
            :no-border-collapse="false" small :busy="loading" show-empty>


               <template #empty>
                  <span class="text-nowrap text-center d-block">
                     No se encontró níngúna Ciudad...
                  </span>
               </template>

               <template #table-busy>
                  <div class="text-center my-2">
                     <b-spinner class="align-middle" variant="primary"></b-spinner>
                     <strong>Cargando...</strong>
                  </div>
               </template>

               <template #cell(pais)="{ item }">
                  <span class="text-nowrap">
                     {{ item.estado.pais.pais }}
                  </span>

               </template>

               <template #cell(estado)="{ item }">
                  <span class="text-nowrap">
                     {{ item.estado.estado }}
                  </span>
            
               </template>

               <!-- Column: Actions -->
               <template #cell(actions)="{ item }">

                  <b-button-group size="sm">

                     <b-button :to="{ name: 'edit.ciudad', params: { id: item.id } }" variant="primary" title="Editar Ciudad" v-if="$can('update', 'estado')">
                        <feather-icon icon="EditIcon" />
                     </b-button>

                     <b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Ciudad" v-if="$can('delete', 'ciudad')">
                        <feather-icon icon="TrashIcon" />
                     </b-button>

                  </b-button-group>

               </template>

            </b-table>
      </template>
   </listado>

</template>

<script>

import useCiudadList from './useCiudadList.js'
import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BTable,
   BButtonGroup,
   BButton,
   BInputGroup,
   BFormInput,
   BSpinner

} from 'bootstrap-vue'

import { computed, onMounted } from 'vue'

import store from '@/store'

export default {

   components: {
      BCard,
      BContainer,
      BRow,
      BCol,
      BTable,
      BButtonGroup,
      BButton,
      Listado:() =>import('components/Listado.vue'),
      BInputGroup,
      BFormInput,
      BSpinner

   },

   setup(props) {

      const actions = useCiudadList();
      onMounted(() => {
         setTimeout(() => {
            actions.refetchData()
         }, 400)
      })


      return {
         refTable:actions.refTable,
         loading: computed(() => store.state.loading),
         actions
      }
   }
}

</script>