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

                     <template #append v-if="$can('write', 'atraques')">
                        <b-button variant="primary" :to="{ name: 'create.atraque' }">
                           <feather-icon size="18" icon="PlusSquareIcon" />
                           Añadir
                        </b-button>
                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

         </div>

         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ninguna atraque" :sort-desc.sync="isSortDirDesc"
            sticky-header="700px" :no-border-collapse="false" small :busy="loading" show-empty>

            <template #empty>
               <span class="text-nowrap text-center d-block">
                  No se encontró níngún atraque...
               </span>
            </template>

            <template #table-busy>
               <div class="text-center my-2">
                  <b-spinner class="align-middle" variant="primary"></b-spinner>
                  <strong>Cargando...</strong>
               </div>
            </template>

            <template #cell(llegada)="{item}">
               {{ item.llegada | fecha('LL') }}
            </template>

            <template #cell(puerto)="{item}">
               {{ item.puerto ? item.puerto.nombre : 'Sin definir' }}
            </template>

            <template #cell(barco)="{item}">
               {{ item.barco ? item.barco.nombre : 'Sin definir' }}
            </template>


            <!-- Column: Actions -->
            <template #cell(actions)="{ item }">

               <b-button-group size="sm">

                  <b-button variant="primary" title="Editar" :to="{ name: 'edit.atraque', params: { id: item.id } }"
                     v-if="$can('update', 'atraques')">
                     <feather-icon icon="EditIcon" />
                  </b-button>

                  <b-button variant="danger" @click="eliminar(item.id)" title="Eliminar atraque"
                     v-if="$can('delete', 'atraques')">
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
   BSpinner,
   BAvatar,
   BMedia,
   BLink
} from 'bootstrap-vue';

import { computed } from 'vue';
import store from '@/store';
import useListAtraques from './useListAtraques';

import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter';
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
      BAvatar,
      BMedia,
      BLink,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage: () => import('components/PerPage'),

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

      } = useListAtraques()

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
         camiones: computed(() => store.state.camion.camiones),
         loading: computed(() => store.state.loading),
         avatarText
      }


   },
}
</script>