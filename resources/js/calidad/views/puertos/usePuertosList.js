import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function usePuertosList() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'nombre', sortable: true, label: "Nombre del puerto" },
      { key: 'direccion', sortable: true, label: "Dirección" },
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

      store.dispatch('puerto/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({ total: cantidad, puertos }) => {
            total.value = Number(cantidad)
            callback(puertos)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los puertos',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('puerto/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("El puerto ha sido eliminado con éxito")
            refetchData();

         } else {
            toast.error('No se pudo eliminar el puerto, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar el puerto, inténtelo de nuevo mas tarde')
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
