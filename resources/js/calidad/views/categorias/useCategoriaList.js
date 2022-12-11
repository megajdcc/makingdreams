import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function usePagosLists() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'nombre', sortable: true, label: "Nombre" },
      { key: 'categoria', sortable: true, label: "Categoría padre" },
      { key: 'sub_categorias', sortable: true, label: "Sub Categorías" },
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

      store.dispatch('categoria/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({total:cantidad,categorias:categories}) => {
            total.value = Number(cantidad)
            callback(categories)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las categorias',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            },{
               position:'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('categoria/eliminar',id).then(({result}) => {
         
         if(result){
            toast.success("La categoria ha sido eliminada con éxito")
            refetchData();

         }else{
            toast.error('No se pudo eliminar la categoria, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar la categoria, inténtelo de nuevo mas tarde')
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
