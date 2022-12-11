<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2 ">
            <!-- Table Top -->
            <b-row>
               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />
               </b-col>

               <b-col md="6">

                  <b-input-group size="sm">
                     <b-form-input v-model="searchQuery" placeholder="Buscar... " type="search" />

                     <template #append v-if="$can('write', 'compañias')">
                        <b-button variant="primary" :to="{ name: 'asignar.empleado.compania',params:{id:id} }">
                           <feather-icon size="18" icon="PlusSquareIcon" />
                           Añadir
                        </b-button>
                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

         </div>


         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" :sort-desc.sync="isSortDirDesc"
            sticky-header="700px" :no-border-collapse="false" small :busy="loading" show-empty>

            <template #empty>
               <span class="text-nowrap text-center d-block">
                  No se encontró ningún empleado...
               </span>
            </template>

            <template #table-busy>
               <div class="text-center my-2">
                  <b-spinner class="align-middle" variant="primary"></b-spinner>
                  <strong>Cargando...</strong>
               </div>
            </template>

            <template #cell(nombre)="{ item }">
               <b-media vertical-align="center">
                  <template #aside>
                     <b-avatar size="32" :src="item.avatar"
                        :text="avatarText(`${item.nombre} ${item.apellido}`)" :variant="`light-primary`"
                        :to="{ name: 'mostrar.usuario', params: { id: item.id } }" disabled />
                  </template>
                  <b-link :to="{ name: 'mostrar.usuario', params: { id: item.id } }" disabled
                     class="font-weight-bold d-block text-nowrap">
                     {{ `${item.nombre} ${item.apellido}` }}
                  </b-link>
               </b-media>


            </template>



            <!-- Column: Actions -->
            <template #cell(actions)="{ item }">

               <b-button-group size="sm">

                  <b-button variant="danger" @click="quitarEmpleado({compania_id:id,empleado_id:item.id})" title="Quitar Empleado"
                     v-if="$can('delete', 'compañias')">
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
   BCardText,
   BCardTitle,
   BRow,
   BCol,
   BBadge,
   BFormInput,
   BInputGroup,
   BButton,
   BButtonGroup,
   BSpinner,
   BAvatar,
   BMedia,
   BLink,
   BImg,
   VBTooltip,
   BContainer,
   BTable
} from 'bootstrap-vue'

import { computed } from 'vue';
import store from '@/store';
import useEmpleadosCompaniaList from './useEmpleadosCompaniaList.js';
import { avatarText } from '@core/utils/filter';
import vSelect from 'vue-select'
export default {
   props: ['id'],

   components: {
      BCard,
      BRow,
      BCol,
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
      BCardText,
      BCardTitle,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage: () => import('components/PerPage'),
      BContainer,
      BImg,
      BTable




   },

   directives:{
      'b-tooltip':VBTooltip
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
         tableColumns,
         fetchData,
         quitarEmpleado

      } = useEmpleadosCompaniaList(props.id)

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
         tableColumns,
         fetchData,
         quitarEmpleado,
         loading: computed(() => store.state.loading),
         avatarText
      }


   },
}
</script>


<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.scroll-area {
  position: relative;
  margin: auto;
  width: auto;
  height: 70px;
  overflow-y: auto;
}

</style>

<style lang="scss">
 


@import '~@core/scss/vue/libs/vue-select.scss';

.dark-layout .swal2-popup{
  background: #181d2a;
}

.companias .card-header img{
   border-radius: 0.428rem 0.428rem 0px 0px;
   width:100%;
}

</style>