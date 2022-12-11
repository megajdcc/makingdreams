import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

import { onMounted } from 'vue';


export default function useListViaje(entrega_id = null) {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'tipo_viaje', sortable: true, label: "Para entregar o retornar?" },
      { key: 'chofer_id', sortable: true, label: "Chofer" },
      { key: 'fecha', sortable: true, label: "Fecha y Hora del viaje" },
      { key: 'actions', variant: 'primary', },
   ]

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


   const fetchData = (ctx, callback) => {

      store.dispatch('viaje/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         entrega_id:entrega_id,
      })
         .then(({ total: cantidad, viajes }) => {
            total.value = Number(cantidad)
            callback(viajes)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los viajes',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('viaje/eliminar', id).then(({ result }) => {
         if (result) {
            toast.success("El viaje ha sido eliminado con éxito")
            setTimeout(() => {
                  refetchData()
            }, 1000);

         } else {
            toast.error('No se pudo eliminar el viaje, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar el viaje, inténtelo de nuevo mas tarde')
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
      fetchData,
      eliminar,
      tableColumns
   }
}
