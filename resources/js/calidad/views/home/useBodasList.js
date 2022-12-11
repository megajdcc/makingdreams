import { ref, watch, computed } from 'vue'
import store from '@/store'

// Notification
export default function useBodasList() {
   const refBodasListTable = ref(null)

   // Table Handlers
   const tableColumns = [
    
      { key: 'novios', sortable: true, label: "Novios" },
      { key: 'fecha', sortable: false, label: "Fecha" },
      { key: 'hab_habilitadas', sortable: false, label: "Contratadas" },
      { key: 'solicitadas', sortable: false, label: "Solicitadas" },
      { key: 'confirmadas', sortable: false, label: "Confirmadas" },
      { key: 'por_confirmar', sortable: false   , label: "Por confirmar" },
      { key: 'disponibles', sortable: false  },
   ]
   const perPage = ref(10)
   const totalBodas = ref(0)
   const currentPage = ref(1)
   const perPageOptions = [10, 25, 50, 100]
   const searchQuery = ref('')
   const sortBy = ref('id')
   const isSortDirDesc = ref(true)
   const bods = ref([]);

   const dataMeta = computed(() => {
      
      const localItemsCount = refBodasListTable.value ? refBodasListTable.value.localItems.length : 0
      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: totalBodas.value,
      }

   })

   const refetchData = () => {
      refBodasListTable.value.refresh()
   }

   watch([currentPage, perPage, searchQuery], () => {
      refetchData()
   })

   const fetchBodas = (ctx, callback) => {

      store.dispatch('dashboard/fetchBodasList', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(response => {
            const { bodas, total } = response.data
           
            callback(bodas)
            bods.value = bodas;
            totalBodas.value = total
         })
         .catch((e) => {


         })
   }



   return {
      fetchBodas,
      tableColumns,
      perPage,
      currentPage,
      totalBodas,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refBodasListTable,
      refetchData,
      bods

   }
}
