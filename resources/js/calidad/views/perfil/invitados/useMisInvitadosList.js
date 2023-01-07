
import { ref, watch, computed, onMounted } from 'vue'
import store from '@/store';
import useFilterTable from '@core/utils/useFilterTable';

export default function useMisInvitadosList(){


   const tableColumns = ref([

      { key:'username',label:'Usuario',sortBy:'username',sortKey:'username',sortable:true},
      { key: 'email', label: 'Email', sortBy: 'email', sortKey: 'email', sortable: true },


   ])

   const {
      perPageOptions,
      currentPage,
      perPage,
      sortBy,
      isSortDirDesc,
      refTable,
      total,
      dataMeta,
      refetchData,
   } = useFilterTable();

   onMounted(() => refetchData())

   const fetchData = (_,next) => {

      store.dispatch('usuario/misReferidos',{
         perPage:perPage.value,
         currentPage:currentPage.value,
         sortBy:sortBy.value,
         isSortDirDesc:isSortDirDesc.value
      }).then(({usuarios,total:all}) => {

       
         total.value = all
         next(usuarios)

      }).catch(e => {
         toast.error('Error cargando data')
      })

   } 

   return {
      perPageOptions,
      currentPage,
      perPage,
      total,
      dataMeta,
      refetchData,
      fetchData,
      refTable,
      tableColumns,
      sortBy,
      isSortDirDesc

   }

}
