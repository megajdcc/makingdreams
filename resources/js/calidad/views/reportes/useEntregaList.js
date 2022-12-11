import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'
import { watch, ref } from 'vue'

export default function useCamionList() {

   const estatus = ref(null)
   const entregas = ref([])
   const estatusOptions = ref([
      { value: 1, label: 'Importado' },
      { value: 2, label: 'Por asignar' },
      { value: 3, label: 'Asignado' },
      { value: 4, label: 'En ruta' },
      { value: 5, label: 'Entregado' },
      { value: 6, label: 'En espera' },
   ])

   const cliente_id = ref(null)

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'status', sortable: true, label: "Status", sortKey: 'situacion' },
      { key: 'contenedor', sortable: true, label: "Container", sortKey: 'container' },
      { key: 'fecha_llegada', sortable: true, label: "Fecha llegada", class: 'text-nowrap' },
      { key: 'origen', sortable: true, label: "Origen" },
      { key: 'destino', sortable: true, label: "Pueblo/Destino", class: 'text-nowrap' },
      { key: 'destinatario', sortable: true, label: "Entregar a", class: 'text-nowrap', sortKey: 'id' },
      // { key: 'fecha_entrega', sortable:true, label:"Fecha Entrega", class: 'text-nowrap' },
      // { key: 'fecha_sacado', sortable:true, label:"Fecha sacado", class: 'text-nowrap' },
      // { key: 'fecha_devuelto', sortable:true, label:"Fecha devuelto", class: 'text-nowrap' },
      // { key: 'fecha_recogido', sortable:true, label:"Fecha recogido", class: 'text-nowrap' },
      { key: 'actions', variant: 'primary', stickyColumn: true, sortKey: "id" },
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

   watch([cliente_id, estatus], () => refetchData())

   const fetchData = (ctx, callback) => {

      store.dispatch('entrega/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
         cliente_id: cliente_id.value,
         status: estatus.value,
         procesada:true

      })
         .then(({ total: cantidad, entregas: despachos }) => {
            total.value = Number(cantidad)
            entregas.value = despachos
            callback(despachos)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las Entregas',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('entrega/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("EL registro se ha eliminado con éxito")
            refetchData();

         } else {
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
      fetchData,
      eliminar,
      tableColumns,
      estatus,
      cliente_id,
      estatusOptions,
      entregas
   }
}
