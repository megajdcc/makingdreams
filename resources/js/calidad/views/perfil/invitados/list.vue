<template>
   <b-card>

      <b-container fluid class="px-0">
         <b-row class="my-1">

            <b-col cols="12" md="6">
               <per-page v-model="perPage" :perPageOptions="perPageOptions" />
            </b-col>
         
         </b-row>

         <b-row>
            <b-col cols="12">
               <b-table ref="refTable" class="position-relative" :items="fetchData" responsive :fields="tableColumns"
                  primary-key="id" :sort-by.sync="sortBy" show-empty empty-text="No matching records found"
                  :sort-desc.sync="isSortDirDesc" :busy="loading">
               
                  <template #empty>
                     <span class="text-nowrap text-center d-block">
                        No se encontró níngún invitado...
                     </span>
                  </template>
               
                  <template #table-busy>
                     <div class="text-center my-2">
                        <b-spinner class="align-middle" variant="primary"></b-spinner>
                        <strong>Cargando...</strong>
                     </div>
                  </template>
               
               
                  <!-- Column: User -->
                  <template #cell(username)="{item}">
                     <b-media vertical-align="center">
                        <template #aside>
                           <b-avatar size="32" :src="item.avatar" :text="avatarText(item.usuario)" disabled />
                        </template>
                        <b-link disabled class="font-weight-bold d-block text-nowrap">
                           {{ `${item.nombre} ${item.apellido}` }}
                        </b-link>
                        <small class="text-muted" v-if="item.username">{{ item.username }}</small>
                     </b-media>
                  </template>
               
               </b-table>
            </b-col>
         </b-row>
      
         <b-row>
            <b-col cols="12">
               <paginate-table :dataMeta="dataMeta" :perPage.sync="perPage" :total="total" :currentPage="currentPage" />
            </b-col>
         </b-row>
      </b-container>

   </b-card>

</template>

<script>

import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BMedia,
   BAvatar,
   BTable,
   BSpinner,
   BLink,
} from 'bootstrap-vue'

import useMisInvitadosList from './useMisInvitadosList'
import {toRefs,computed} from 'vue'
import store from '@/store'
import { avatarText } from '@core/utils/filter'

export default {
   components:{
      BCard,
      BContainer,
      BRow,
      BCol,
      BMedia,
      BSpinner,
      BAvatar,
      BLink,
      BTable,
      PerPage:()       => import('components/PerPage'),
      PaginateTable:() => import('components/PaginateTable'),
   },

   setup() {

      const {
         perPageOptions,
         currentPage,
         perPage,
         total,
         dataMeta,
         refetchData,
         fetchData,
         refTable,
         tableColumns,
         sortBy,
         isSortDirDesc
      } = useMisInvitadosList()

      return {
         loading:computed(() => store.state.loading),
         perPageOptions,
         currentPage,
         perPage,
         total,
         dataMeta,
         refetchData,
         fetchData,
         refTable,
         tableColumns,
         avatarText,
         sortBy,
         isSortDirDesc
      }
      
   }
}
</script>