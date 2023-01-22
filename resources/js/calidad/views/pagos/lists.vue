<template>
   <listado :actions="actions" isTable>
         <template #contenido="{eliminar}">

            <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id" :sort-by.sync="sortBy"
               empty-text="No se encontró ningún pago" :sort-desc.sync="isSortDirDesc" sticky-header="700px"
               :no-border-collapse="false" small :busy="loading" show-empty class="mt-1">


               <template #cell(monto)="{item}">
                  {{  item.monto | currency  }}
               </template>

              


               <template #cell(usuario)="{item}">
                  <span class="text-nowrap">
                     {{ item.usuario.nombre  }} {{ item.usuario.apellido }}
                  </span>
               </template>

               <template #cell(status)="{item}">
                  <span class="text-nowrap">
                     {{ getStatusPago(item.status) }}
                  </span>
               </template>

               <template #cell(metodo)="{item}">
                  <span class="text-nowrap">
                     {{ getMetodoPago(item.metodo) }}
                  </span>
               </template>




               <!-- Column: Actions -->
               <template #cell(actions)="{ item }">
            
                  <b-button-group size="sm">
         
            
                     <b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Pago" v-if="$can('delete','pagos admin')">
                        <feather-icon icon="TrashIcon" />
                     </b-button>
            
                  </b-button-group>
            
               </template>
            
            </b-table>

         </template>
   </listado>   
</template>


<script>

import Listado from 'components/Listado.vue'
import usePagosList from './usePagosList'

import {
   BTable,
   BButtonGroup,
   BButton
} from 'bootstrap-vue'

import store from '@/store'

import {computed,onMounted,watch} from 'vue'

export default {
   
   components:{
      Listado,
      BTable,
      BButtonGroup,
      BButton
   },


   setup(){


      const actions = usePagosList();

     
      const {
         isSortDirDesc,
         sortBy,
         searchQuery,
         perPage,
         currentPage,
         total,
         perPageOptions,
         dataMeta,
         refetchData,
         fetchData,
         eliminar,
         tableColumns,
         refTable
      } = actions;

      onMounted(() => setTimeout(() => {
         refetchData()
      }, 2000))


      const getStatusPago = (status) => {
         const estados = ['Sin Aprobar','Aprobado','Rechazado','Devuelto']
         return estados[status - 1 ]
      } 

      const getMetodoPago = (metodo) => {
         const metodos = ['Paypal', 'Wompi', 'Transferencia']
         return metodos[metodo - 1]
      } 

      return {
         isSortDirDesc,
         sortBy,
         searchQuery,
         perPage,
         currentPage,
         total,
         perPageOptions,
         dataMeta,
         refetchData,
         fetchData,
         eliminar,
         tableColumns,
         refTable,
         actions,
         getStatusPago,
         getMetodoPago,
         loading:computed(() => store.state.loading)

      }
   }

}
</script>