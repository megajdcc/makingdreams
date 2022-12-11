import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function useListDestino(compania_id = null) {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'destino', sortable: true, label: "Nombre del destino" },
      { key: 'compania', sortable: true, label: "Compañia" },

      { key: 'pais', sortable: true, label: "Pais" },
      { key: 'estado', sortable: true, label: "Estado" },
      { key: 'ciudad', sortable: true, label: "Ciudad" },

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

      store.dispatch('destino/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         compania_id:compania_id
      })
         .then(({ total: cantidad, destinos }) => {
            total.value = Number(cantidad)
            callback(destinos)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los destinos',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('destino/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("El destino ha sido eliminado con éxito")
            refetchData();

         } else {
            toast.error('No se pudo eliminar el destino, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar el destino, inténtelo de nuevo mas tarde')
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
