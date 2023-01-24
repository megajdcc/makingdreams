import { ref, watch, computed, onMounted } from 'vue'
import store from '@/store'
import useFilterTable from '@core/utils/useFilterTable'

export default function useEtapasList() {

  // Table Handlers
  const tableColumns = [
    { key: 'id', label: '#' },
    { key: 'nombre', sortable: true, label: "Nombre" },
    { key: 'monto', sortable: true, label: "Monto de la etapa" },
    { key: 'remuneracion', sortable: true, label: "Remuneración" },
   
    { key: 'actions', sortable: false, variant: 'primary', },
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

    store.dispatch('etapa/fetchData', {
      q: searchQuery.value,
      perPage: perPage.value,
      page: currentPage.value,
      sortBy: sortBy.value,
      isSortDirDesc: isSortDirDesc.value,
    })
      .then(({ total: all, etapas }) => {
        total.value = all
        next(etapas)

      })
      .catch((e) => {

        toast.info('Error Trayendo Data')

      })
  }


  const eliminar = (pago_id) => {



    store.dispatch('etapa/eliminar', pago_id).then(({ result }) => {

      if (result) {
        toast.success('Se ha eliminado con éxito la Etapa', { position: 'bottom-right' })

        refetchData()
      } else {
        toast.info('No se pudo eliminar la etapa , inténte de nuevo', { position: 'bottom-right' })

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
