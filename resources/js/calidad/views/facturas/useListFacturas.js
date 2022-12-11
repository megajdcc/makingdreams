import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'

export default function useListFacturas() {

   const tableColumns = [
      { key: 'id', sortable: true, label: "#" },
      { key: 'compania', sortable: true, label: "Facturadado a" },
      { key: 'fecha', sortable: true, label: "Fecha de facturación" },
      { key: 'created_at', sortable: true, label: "Fecha de emisión" },
      { key: 'conduce', sortable: true, label: "Orden de entrega (conduce)" },
      { key: 'subtotal', sortable: true, label: "Sub total" },
      { key: 'iva', sortable: true, label: "IVA" },
      { key: 'total', sortable: true, label: "Total" },
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

      store.dispatch('factura/fetchData', {
         q: searchQuery.value,
         perPage: perPage.value,
         page: currentPage.value,
         sortBy: sortBy.value,
         sortDesc: isSortDirDesc.value,
      })
         .then(({ total: cantidad, facturas }) => {
            total.value = Number(cantidad)
            callback(facturas)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las facturas',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }


   const eliminar = (id) => {

      store.dispatch('factura/eliminar', id).then(({ result }) => {

         if (result) {
            toast.success("La factura ha sido eliminada con éxito")
            refetchData();

         } else {
            toast.error('No se pudo eliminar la factura, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         toast.error('No se pudo eliminar la factura, inténtelo de nuevo mas tarde')
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
