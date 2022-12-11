import { ref, watch, computed } from 'vue'
import store from '@/store'
import { title } from '@core/utils/filter'

// Notification
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import useFilterTable from '@core/utils/useFilterTable'
export default function useBodasList() {


   // Table Handlers
   const tableColumns = [
      { key: 'show_details', sortable: false, label: '#', width: '50px',isRowHeader: true, },
      { key: 'invitado', sortable: true, label: "Invitado" },
      { key: 'created_at', sortable: true, label: "Fecha" },
      { key: 'boda', sortable: false, label: "Boda " },
      { key: 'total_pagar', sortable: false, label: "Total" },
      { key: 'actions', stickyColumn: false, isRowHeader: true, variant: 'primary' },
   ]

   const statusFilter = ref(null)
   const bodasFilter = ref(null)
   const hotelFilter = ref(null)
   const eliminadoFilter = ref(2);



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
   } = useFilterTable();

   watch([statusFilter, bodasFilter, hotelFilter,eliminadoFilter], () => {
      refetchData()
   })

   const fetchReservas = (ctx, callback) => {
      store.dispatch('reserva/fetchReservas', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         hotel: hotelFilter.value,
         status: statusFilter.value,
         boda: bodasFilter.value,
         eliminado : eliminadoFilter.value
      })
         .then(response => {
            const { reservaciones, total:to } = response.data
            callback(reservaciones)
            total.value = Number(to)
         })
         .catch(() => {
            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las reservaciones',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            })
         })
   }



   return {
      fetchReservas,
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
      // Extra Filters
      hotelFilter,
      statusFilter,
      bodasFilter,
      eliminadoFilter
   }
}
