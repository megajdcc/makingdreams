
import { ref, watch, computed, onMounted } from 'vue'
import store from '@/store';
import useFilterTable from '@core/utils/useFilterTable';

export default function useCuentaList() {

   const items = ref([])
   const tableColumns = ref([
      { key: 'id', label: '#', sortBy: 'id', sortable: true },
      { key: 'created_at', label: 'Fecha', sortable: true },
      { key: 'concepto', label: 'Concepto', sortable: true, sortBy: 'concepto' },
      { key: 'monto', label: 'Monto', sortable: true },
      { key: 'balance', label: 'Balance', sortable: true },
   ]);

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


   watch([currentPage, perPage], () => {
      refetchData()
   })

   const fetchData = (ctx, next) => {

      store.dispatch('movimiento/fetchData', {
         sortBy       : sortBy.value,
         isSortDirDesc: isSortDirDesc.value,
         perPage      : perPage.value,
         currentPage  : currentPage.value,
         q            : searchQuery.value
      }).then(({ movimientos, total: all }) => {

         total.value = all
         items.value = movimientos
         next(movimientos)



      }).catch(e => {
         toast.error('Error cargando data')
      })


   }


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
      items,
      tableColumns,
      fetchData

   }

}
