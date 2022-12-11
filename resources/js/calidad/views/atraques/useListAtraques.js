import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function useListAtraques() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'barco', sortable: true, label: "Nombre del barco",sortKey:'barco_id' },
      { key: 'llegada', sortable: true, label: "Llegada del barco"},
      { key: 'puerto', sortable: true, label: "Puerto Marítimo", sortKey: 'puerto_id' },
      { key: 'viaje', sortable: true, label: "# Viaje" },
      { key: 'actions', variant: 'primary', sortKey: 'id' },
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

      store.dispatch('atraque/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({ total: cantidad, atraques }) => {
            total.value = Number(cantidad)
            callback(atraques)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los atraques',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('atraque/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("El atraque ha sido eliminado con éxito")
            refetchData();

         } else {
            toast.error('No se pudo eliminar el atraque, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar el atraque, inténtelo de nuevo mas tarde')
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
