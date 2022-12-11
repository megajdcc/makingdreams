import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'
import { watch,ref } from 'vue'

export default function usePaginasList() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'titulo', sortable: true, label: "Título" },
      { key: 'categorias', sortable: true, label: "Categorías",sortBy:'id' },
      { key: 'usuario_id', sortable: true, label: "Registrante" },
      { key: 'actions', variant: 'primary', },
   ]

   const categoria_id = ref(null)

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


   watch([categoria_id],() => refetchData());


   const fetchData = (ctx, callback) => {

      store.dispatch('pagina/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         categoria_id:categoria_id.value
      })
         .then(({total:cantidad,paginas}) => {
            total.value = Number(cantidad)
            callback(paginas)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las paginas',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            },{
               position:'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('pagina/eliminar',id).then(({result}) => {
         
         if(result){
            toast.success("La pagina ha sido eliminada con éxito")
            refetchData();

         }else{
            toast.error('No se pudo eliminar la pagina, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar la pagina, inténtelo de nuevo mas tarde')
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
      tableColumns,
      categoria_id
   }
}
