
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from "@core/utils/useFilterTable"
import store from '@/store'
import { ref } from 'vue'

export default function useEmpleadosCompaniaList(compania_id) {


   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'nombre', sortable: true, label: "nombre" },
      { key: 'email', sortable: true, label: "Email" },
      { key: 'telefono', sortable: true, label: "Teléfono" },
      { key: 'puesto', sortable: true, label: "Puesto en la compañia" },
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
   } = useFilterTable()

    const fetchData = (ctx, callback) => {

      store.dispatch('compania/fetchEmpledos', {
         q         : searchQuery.value,
         perPage   : perPage.value,
         page      : currentPage.value,
         sortBy    : sortBy.value,
         sortDesc  : isSortDirDesc.value,
         companiaId: compania_id
      })
         .then(({total:cantidad,empleados}) => {
            total.value = Number(cantidad)
            callback(empleados)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo los empleados',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            },{
               position:'bottom-right'
            })

         })
   }


   const quitarEmpleado = (data) => {

      store.dispatch('compania/quitarEmpleado', data).then((result) => {
         
         if(result){
            toast.success("El registro del empleado ha sido eliminado")
            
            setTimeout(() => {
               refTable.value.refresh();
            }, 1000);
         }else{
            toast.error('No se pudo eliminar el registro, inténtelo de nuevo mas tarde')
         }

       

      }).catch(e => {
         toast.error('No se pudo eliminar el registro, inténtelo de nuevo mas tarde')
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
      tableColumns,
      fetchData,
      quitarEmpleado
   }

}