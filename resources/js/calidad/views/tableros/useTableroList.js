
import {ref,computed,onMounted,watch} from 'vue'
import store from '@/store'


export default function useTableroList(etapa){


   const isSortDirDesc = ref(false)
   const sortBy = ref('ubicacion')
   const searchQuery = ref('')
   const perPage = ref(15)
   const currentPage = ref(1)
   const total = ref(0);
   const items = ref([]);


   const perPageOptions = ref([
      {
         label: '1',
         value: 1,
      },
   ])

   const dataMeta = computed(() => {

      const localItemsCount = items.value.length
      
      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: total.value,
      }

   })

   const refetchData = () => {

      fetchData((puestos) => items.value = puestos )
    
     
   }

   watch([currentPage, perPage, searchQuery,etapa], () => {
      refetchData()
   })

   const fetchData = (next) => {
      store.dispatch('tablero/fetchData',{
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        isSortDirDesc: isSortDirDesc.value,
        etapa:etapa.value
      }).then(({total:all,puestos}) => {

        total.value = all
        next(puestos)
      }).catch(e => {
        toast.info('Error trayendo data',{position:'bottom-right'})
      })
   }

   // onMounted(() => refetchData())

   return {

      perPageOptions,
      currentPage,
      perPage,
      searchQuery,
      sortBy,
      isSortDirDesc,
      total,
      dataMeta,
      refetchData,
      fetchData,
      items,

      
   }

}