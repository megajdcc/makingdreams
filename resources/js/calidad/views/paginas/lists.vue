<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2">
            <!-- Table Top -->
            <b-row>
               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />
               </b-col>

               <b-col md="6">

                  <b-input-group size="sm">
                     <b-form-input v-model="searchQuery" placeholder="Buscar... " type="search" />

                     <template #append v-if="$can('write','paginas')">
                        <b-button variant="primary" :to="{name:'create.pagina'}">
                           <feather-icon size="18" icon="PlusSquareIcon" />
                           Añadir
                        </b-button>
                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

         </div>

         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" :sort-desc.sync="isSortDirDesc" sticky-header="700px" :no-border-collapse="false"
            small show-empty :busy="loading">

            <template #empty>
               <span class="text-nowrap text-center d-block">
                  No se encontró ninguna pagina...
               </span>
            </template>

            <template #table-busy>
               <div class="text-center my-2">
                  <b-spinner class="align-middle" variant="primary"></b-spinner>
                  <strong>Cargando...</strong>
               </div>
            </template>

            <template #cell(categorias)="{item}">
               <span class="tex-nowrap">
                  {{ item.categorias.map(val => val.nombre).toString() }}
               </span>
            </template>

            <template #cell(usuario_id)="{item}">
               <span class="tex-nowrap">
                  {{ item.usuario ?  item.usuario.nombre : 'Sin definir' }}
               </span>
            </template>

            <!-- Column: Actions -->
            <template #cell(actions)="{item}">

               <b-button-group size="sm">

                  <b-button variant="primary" title="Editar" :to="{name:'edit.pagina',params:{id:item.id}}"
                     v-if="$can('update','paginas')">
                     <feather-icon icon="EditIcon" />
                  </b-button>

                  <b-button variant="danger" @click="eliminar(item.id)" title="Eliminar pagina"
                     v-if="$can('delete', 'paginas')">
                     <feather-icon icon="Trash2Icon" />
                  </b-button>
               </b-button-group>

            </template>

         </b-table>

         <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage" :total="total" />

      </b-card>

   </div>

</template>

<script>

import {
   BCard,
   BRow,
   BCol,
   BTable,
   BBadge,
   BFormInput,
   BInputGroup,
   BButton,
   BButtonGroup,
   BSpinner
} from 'bootstrap-vue';

import { computed,onMounted } from 'vue';
import store from '@/store';
import usePaginasList from './usePaginasList';

import vSelect from 'vue-select'

export default {
   props: ['id'],

   components: {
      BCard,
      BRow,
      BCol,
      BTable,
      BInputGroup,
      BBadge,
      BFormInput,
      vSelect,
      BButton,
      BButtonGroup,
      BSpinner,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage:() => import('components/PerPage'),

   },


   setup(props) {



      const {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refTable,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData

      } = usePaginasList()


      return {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refTable,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData,
         paginas: computed(() => store.state.pagina.paginas),
         loading:computed(() => store.state.loading)
      }


   },
}
</script>