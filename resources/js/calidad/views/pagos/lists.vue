<template>
   <section>
      <listado :actions="actions" isTable>
            <template #contenido>

               <b-card class="mt-1">
                  <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id" :sort-by.sync="sortBy"
                     empty-text="No se encontró ningún pago" :sort-desc.sync="isSortDirDesc" sticky-header="700px"
                     :no-border-collapse="false" small :busy="loading" show-empty >
                  
                  
                     <template #cell(monto)="{item}">
                        {{ item.monto | currency }}
                     </template>
                  
                  
                  
                  
                     <template #cell(usuario)="{item}">
                        <span class="text-nowrap">
                           {{ item.usuario.nombre }} {{ item.usuario.apellido }}
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
                  
                  
                           <b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Pago"
                              v-if="$can('delete','pagos admin')">
                              <feather-icon icon="TrashIcon" />
                           </b-button>

                           <b-button  @click="verComprobante(item.comprobante)" variant="dark" title="Ver Comprobante" v-if="$can('read','pagos admin') && item.metodo === 3">
                             Comprobante
                           </b-button>

                           <b-button @click="aprobar(item.id)" variant="primary" title="Aprobar Pago"
                              v-if="$can('write','pagos admin') && item.metodo === 3 && !item.aprobado">
                              Aprobar
                           </b-button>

                  
                        </b-button-group>
                  
                     </template>
                  
                  </b-table>
               </b-card>
               

            </template>

          
      </listado> 

      <show-imagen :url="urlImagen" :showDialog.sync="showDialog" :tipo="tipoImagen"></show-imagen>

     </section>
</template>


<script>

import Listado from 'components/Listado.vue'
import usePagosList from './usePagosList'

import ShowImagen  from 'components/ShowImagen.vue'
import { getExt } from '@core/utils/utils'
import {
   BTable,
   BButtonGroup,
   BButton,
   BCard
} from 'bootstrap-vue'

import store from '@/store'

import {computed,onMounted,watch,ref} from 'vue'

export default {
   
   components:{
      Listado,
      BTable,
      BButtonGroup,
      BButton,
      BCard,
      ShowImagen
   },


   setup(){


      const actions = usePagosList();
      const urlImagen = ref('')
      const showDialog = ref(false)
      const tipoImagen = ref(null)

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

      const verComprobante = (comprobante) => {

         

         urlImagen.value = `/storage/comprobantes/${comprobante}`
         tipoImagen.value = getExt(comprobante)
         showDialog.value = true
      }

      const aprobar = (pago_id) => {


         store.dispatch('pago/aprobarPago',pago_id).then(({result}) => {

            if(result){
               toast.success('El pago se ha aprobado con éxito')
               refetchData();
            }else{
               toast.info('El pago no se pudo aprobar, inténtelo de nuevo mas tarde')
            }


         })

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
         verComprobante,
         urlImagen,
         showDialog,
         tipoImagen,
         aprobar,
         loading:computed(() => store.state.loading)

      }
   }

}
</script>