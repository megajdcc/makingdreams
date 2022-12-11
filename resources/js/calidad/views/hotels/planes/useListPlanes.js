

import {ref,computed,watch} from 'vue'
import store from '@/store'

import {Notification} from 'element-ui';


export default function useListPlanes(idhotel){

   const planes = ref([])
   const totalPlanes = ref(0)
   const perPage = ref(10)
   const currentPage = ref(1)
   const searchQuery = ref('')
   const perPageOptions = ref([10,25])

   const dataMeta = computed(() => {

      const localItemsCount = (planes.value) ? planes.value.length : 0

      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: totalPlanes.value,
      }

   })


   const refetchData = () => {
     fetchPlanes((total) => planes.value = total)
   }

   watch([currentPage, perPage, searchQuery], () => {
      refetchData()
   })

   const fetchPlanes = (callback) => {

      store.dispatch('hotel/fetchPlanes',{
         hotel      : idhotel,
         currentPage: currentPage.value,
         perPage    : perPage.value,
         search     : searchQuery.value
      }).then(({data}) => {
         totalPlanes.value = data.total
         callback(data.planes)

      }).catch(e => {

         Notification.info('Error capturando datos...')

      }).then(() => {
      })


   } 



   return {
      planes,
      refetchData,
      fetchPlanes,
      dataMeta,
      totalPlanes,
      perPageOptions,
      searchQuery,
      perPage,
      currentPage,

      

   }


}

