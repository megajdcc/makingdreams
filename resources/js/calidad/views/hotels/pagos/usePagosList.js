import { ref, watch, computed } from 'vue'
import store from '@/store'

import useFilterTable from '@core/utils/useFilterTable'
export default function usePagosList(hotel_id) {
   // Table Handlers
   const tableColumns = [
      { key: 'show_details', sortable: true, label: '#', width: '50px', stickyColumn: true, isRowHeader: true, },
      { key: 'novios', sortable: true, label: "Boda" },
      { key: 'monto', sortable: true, label: "Monto" },
      { key: 'nro_referencia', sortable: true, label: "Nro Referencia" },
      { key: 'fecha_registro', sortable: true, label: "fecha" },
      { key: 'actions', variant: 'primary', },
   ]
   const bodaFilter = ref(null)

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
      refetchData
   } = useFilterTable();


   watch([bodaFilter], () => {
      refetchData()
   })

   const fetchPagos = (ctx, callback) => {

      store.dispatch('pagoHotel/fetchPagosList', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         boda: bodaFilter.value,
         hotel: hotel_id
      })
         .then(response => {
            const { pagos, total:t } = response.data
            callback(pagos)
            total.value = t
         })
         .catch((e) => {

          
         })
   }



   return {
      fetchPagos,
      tableColumns,
      perPage,
      currentPage,
      total,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refTable,
      refetchData,
      bodaFilter
   }
}
