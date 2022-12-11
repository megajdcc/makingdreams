import store from '@/store'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useFilterTable from '@core/utils/useFilterTable'
import {watch,ref} from 'vue'

export default function useSearchContainerList() {

   const estatus = ref(null)
   const entregas = ref([])
   const search = ref('')
   const total = ref(0)
   

   const estatusOptions = ref([
      { value: 1, label: 'Importado' },
      { value: 2, label: 'Por asignar' },
      { value: 3, label: 'Asignado' },
      { value: 4, label: 'En ruta' },
      { value: 5, label: 'Entregado' },
      { value: 6, label: 'En espera' },
   ])

   const cliente_id = ref(null)


   const refetchData = () => {

      fetchData((items) => entregas.value = items )
      
     
   }


   watch([cliente_id, estatus], () => refetchData())

   const fetchData = (callback) => {

      store.dispatch('entrega/searchContainer', {
         cliente_id: cliente_id.value,
         perPage:1,
         currentPage:1,
         contenedor:search.value

      })
         .then(({ total: cantidad, entregas: despachos }) => {
            total.value = Number(cantidad)
            callback(despachos)
         })
         .catch((e) => {

            toast({
               component: ToastificationContent,
               props: {
                  title: 'Error trayendo las entregas del container',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
               },
            }, {
               position: 'bottom-right'
            })

         })
   }

   return {
      total,
      refetchData,
      fetchData,
      estatus,
      cliente_id,
      entregas,
      search,
      estatusOptions
   }
}
