import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {ref,computed,watch,onMounted} from 'vue';

export default function useCompaniasList() {

   const searchQuery = ref('')
   const perPage = ref(100)
   const currentPage = ref(1)
   const total = ref(0);
   const sortBy = ref('id');
   const data = ref([])
   const isSortDirDesc = ref(true);

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
      },

   ])

   const dataMeta = computed(() => {

      const localItemsCount = data.length ? data.length : 0
      
      return {
         from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
         to: perPage.value * (currentPage.value - 1) + localItemsCount,
         of: total.value,
      }

   })


   const refetchData = () => {
     fetchData((companias) => data.value = companias)
   }

   watch([currentPage, perPage, searchQuery], () => {
      refetchData()
   })




   const fetchData = (callback) => {

      store.dispatch('compania/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({ total: cantidad, companias }) => {
            total.value = Number(cantidad)
            callback(companias)
         })
         .catch((e) => {
            console.log(e)
            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las compañias',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   onMounted(() => {
      refetchData()
   })



   const eliminar = (id) => {

      store.dispatch('compania/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("La compañia ha sido eliminada con éxito")
            refetchData();

         } else {
            toast.error('No se pudo eliminar la compañia, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar la compañia, inténtelo de nuevo mas tarde')
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
      refetchData,
      fetchData,
      eliminar,
      data,
   }
}
