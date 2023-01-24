<template>
  <section>
    <listado :actions="actions" isTable>

      <template #btn-action>
        <b-button variant="primary" title="Crear Etapa" v-if="$can('write','etapas')" :to="{name:'etapa.create'}" class="d-flex flex-column justify-content-center" >
          Crear Etapa
        </b-button>
      </template>
      <template #contenido>

        <b-card class="mt-1">
          <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ninguna Etapa" :sort-desc.sync="isSortDirDesc"
            sticky-header="700px" :no-border-collapse="false" small :busy="loading" show-empty>

            <template #cell(monto)="{ item }">
              <span class="text-nowrap">
                {{ item.monto | currency }}
              </span>
            </template>

            <template #cell(numeracion)="{ item }">
              <span class="text-nowrap">
                {{ iteme.remuneracion | currency }}
              </span>
            </template>




            <!-- Column: Actions -->
            <template #cell(actions)="{ item }">

              <b-button-group size="sm">

                    <b-button :to="{name:'etapa.edit',params:{id:item.id}}" variant="primary" title="Edtitar Etapa" v-if="$can('update', 'etapas')">
                      <feather-icon icon="EditIcon" />
                    </b-button>

                <b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Etapa"
                  v-if="$can('delete', 'etapas')">
                  <feather-icon icon="TrashIcon" />
                </b-button>

              </b-button-group>

            </template>

          </b-table>
        </b-card>


      </template>


    </listado>

   

  </section>
</template>


<script>

import Listado from 'components/Listado.vue'
import useEtapasList from './useEtapasList'

import {
  BTable,
  BButtonGroup,
  BButton,
  BCard
} from 'bootstrap-vue'

import store from '@/store'

import { computed, onMounted, watch, ref } from 'vue'

export default {

  components: {
    Listado,
    BTable,
    BButtonGroup,
    BButton,
    BCard,
  
  },


  setup() {


    const actions = useEtapasList();

    const {
      isSortDirDesc,
      sortBy,
      searchQuery,
      perPage,
      currentPage,
      total,
      perPageOptions,
      dataMeta,
      refetchData,
      fetchData,
      eliminar,
      tableColumns,
      refTable
    } = actions;

    onMounted(() => setTimeout(() => {
      refetchData()
    }, 2000))





    return {
      isSortDirDesc,
      sortBy,
      searchQuery,
      perPage,
      currentPage,
      total,
      perPageOptions,
      dataMeta,
      refetchData,
      fetchData,
      eliminar,
      tableColumns,
      refTable,
      actions,
      loading: computed(() => store.state.loading)

    }
  }

}
</script>