
import store from "@/store";

import {computed,ref,watch} from 'vue'

export  default function useListManual(){
   
   const isSortDirDesc = ref(true)
   const sortBy = ref('id')
   const searchQuery = ref('')
   const perPage = ref(25)
   const currentPage = ref(1)
   const total = ref(0);
   const paginas = ref([])
   const categoria_id = ref(null)


   const perPageOptions = ref([
      {
         label: '10',
         value: 10,
      },
      {
         label: '25',
         value: 25,
      },
      {
         label: '50',
         value: 50,
      },
      {
         label: '100',
         value: 100,
      },
      {
         label: 'Todas',
         value: 0,
      }
   ])


   const dataMeta = computed(() => {

      const localItemsCount = paginas.value.length

      return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: total.value,
      }

   })


   const refetchData = () => {
      fetchData(establecerPaginas);
   }

   watch([currentPage, perPage, searchQuery,categoria_id], () => {
      refetchData()
   })

   const establecerPaginas = (pages) => {
      paginas.value = pages
   }


   const fetchData = (next) => {

      store.dispatch('pagina/fetchData',{
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         categoria_id:categoria_id.value
      }).then(({total:cantidad,paginas}) => {
         
         total.value = cantidad
         next(paginas)

      }).catch(e => {
         toast.error('No se pudo cargar la data ')
      })

   } 

   return {
      perPageOptions,
      currentPage,
      perPage,
      searchQuery,
      sortBy,
      isSortDirDesc,
      total,
      dataMeta,
      fetchData,
      refetchData,
      paginas,
      categoria_id
   }

}

