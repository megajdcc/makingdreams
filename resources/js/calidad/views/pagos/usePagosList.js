import { ref, watch, computed,onMounted } from 'vue'
import store from '@/store'
import useFilterTable from '@core/utils/useFilterTable'

export default function usePagosList() {

   // Table Handlers
   const tableColumns = [
      { key:'id', label:'#'},
      { key: 'concepto', sortable: true, label: "Concepto" },
      { key: 'monto', sortable: true, label: "Monto del pago" },
      { key: 'status', sortable: true, label: "Status" },
      { key: 'metodo', sortable: true, label: "Metodo de pago" },
      { key: 'usuario', sortable: false, label: "Usuario",sortBy:'id' },
      { key: 'actions', sortable:false, variant: 'primary', },
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


   const fetchData = (ctx, next) => {

      store.dispatch('pago/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         isSortDirDesc: isSortDirDesc.value,
      })
         .then(({total: all, pagos}) => {
            total.value = all
            next(pagos)
    
         })
         .catch((e) => {

               toast.info('Error Trayendo Data')

         })
   }

   
   const eliminar = (pago_id) => {

    

      store.dispatch('pago/eliminar',pago_id).then(({result}) => {

         if(result){
            toast.success('Se ha eliminado con éxito el pago', {position:'bottom-right'})

            refetchData()
         }else{
            toast.info('No se pudo eliminar el pago , inténte de nuevo', { position: 'bottom-right' })

         }
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
      tableColumns,
      eliminar


   }
}
