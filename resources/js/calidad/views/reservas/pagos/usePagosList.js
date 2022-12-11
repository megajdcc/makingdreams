import { ref, watch, computed } from 'vue'
import store from '@/store'

// Notification
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function usePagosList(reservacion_id) {
   // Use toast

   const refPagosListTable = ref(null)

   // Table Handlers
   const tableColumns = [
      { key: 'show_details', sortable: false, label: '#', width: '50px', stickyColumn: true, isRowHeader: true, },
      { key: 'forma', sortable: true, label: "Forma de pago" },
      { key: 'status', sortable: true, label: "Status" },
      { key: 'nro_referencia', sortable: true, label: "Nro de pago" },
      { key: 'monto', sortable: false, label: "Monto" },
      { key: 'status_pago', sortable: false, label: "Status" },
      { key: 'actions', variant: 'primary', },
   ]
   const perPage = ref(10)
   const totalPagos = ref(0)
   const currentPage = ref(1)
   const perPageOptions = ref([10, 25, 50, 100])
   const searchQuery = ref('')
   const sortBy = ref('id')
   const isSortDirDesc = ref(true)
   const formaPagoFilter = ref(null)

   const dataMeta = computed(() => {
      const localItemsCount = refPagosListTable.value ? refPagosListTable.value.localItems.length : 0

      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: totalPagos.value,
      }

   })

   const refetchData = () => {
      refPagosListTable.value.refresh()
   }

   watch([currentPage, perPage, searchQuery, formaPagoFilter], () => {
      refetchData()
   })

   const fetchPagos = (ctx, callback) => {

      store.dispatch('pago/fetchPagosListReserva', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         formaPago:formaPagoFilter.value,
         reserva:reservacion_id
      })
         .then(response => {
            const { pagos, total } = response.data
            callback(pagos)
            
            store.commit('pago/setPagos',pagos)

            totalPagos.value = total
            if (!perPageOptions.value.includes(total)) {
               perPageOptions.value.push(total)
            }
            
         })
         .catch((e) => {

            // console.log(e)
            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los pagos',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            })

         })
   }



   return {
      fetchPagos,
      tableColumns,
      perPage,
      currentPage,
      totalPagos,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPagosListTable,
      refetchData,
      formaPagoFilter
   }
}
