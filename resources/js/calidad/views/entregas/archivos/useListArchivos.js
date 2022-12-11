

import { ref, computed, watch } from 'vue'
import store from '@/store'


export default function useListArchivos(entrega_id) {

   const archivos = computed(() => store.state.archivo.archivos)

   const totalArchivos = ref(0)
   const sortBy = ref('id');
   const isSortDesc = ref(true)
   const perPage = ref(10)
   const currentPage = ref(1)
   const searchQuery = ref('')
   const perPageOptions = ref([10, 25,50,100])

   const dataMeta = computed(() => {

      const localItemsCount = archivos.value.length

      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: totalArchivos.value,
      }

   })


   const refetchData = () => {
      fetchArchivos((data) => {

         // esto ya no es necesario, se agrega desde el manejador de estado 
         // archivos.value = total
         totalArchivos.value = data.total
      })
   }

   watch([currentPage, perPage, searchQuery], () => {
      refetchData()
   })

   const fetchArchivos = (callback) => {

      store.dispatch('archivo/fetchArchivos', {
         entrega_id: entrega_id,
         currentPage: currentPage.value,
         perPage: perPage.value,
         q: searchQuery.value,
         sortBy: sortBy.value,
         isSortDesc:isSortDesc.value
      }).then(({ data }) => callback(data)).catch(e => {

         ToastInterface.error('Error cargados archivos')

      }).then(() => {
      })


   }



   return {
      archivos,
      refetchData,
      fetchArchivos,
      dataMeta,
      totalArchivos,
      perPageOptions,
      searchQuery,
      perPage,
      currentPage,
      sortBy,
      isSortDesc,
   }


}

