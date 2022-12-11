import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function useContenedorList() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'numero', sortable: true, label: "# de Contenedor" },
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

      store.dispatch('contenedor/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({total:cantidad,contenedores}) => {
            total.value = Number(cantidad)
            callback(contenedores)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los contenedores',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            },{
               position:'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('contenedor/eliminar',id).then(({result}) => {
         
         if(result){
            toast.success("El contenedor ha sido eliminado con éxito")
            refetchData();

         }else{
            toast.error('No se pudo eliminar el contenedor, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar el contenedor, inténtelo de nuevo mas tarde')
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
