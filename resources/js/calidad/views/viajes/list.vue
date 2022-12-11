<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2">
            <!-- Table Top -->
            <b-row>
               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />
               </b-col>

               <b-col md="6">

                  <b-input-group size="sm">
                     <b-form-input v-model="searchQuery" placeholder="Buscar... " type="search" />

                     <template #append v-if="$can('write', 'viajes') && id && total < 2">

                        <b-button variant="primary" :to="{ name: 'create.viaje',params:{id:id} }">
                           <feather-icon size="18" icon="PlusSquareIcon" />
                           Añadir
                        </b-button>

                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

         </div>

         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ningun viaje" :sort-desc.sync="isSortDirDesc"
            sticky-header="700px" :no-border-collapse="false" small :busy="loading" show-empty>

            <template #empty>
               <span class="text-nowrap text-center d-block">
                  No se encontró níngún viaje...
               </span>
            </template>

            <template #table-busy>
               <div class="text-center my-2">
                  <b-spinner class="align-middle" variant="primary"></b-spinner>
                  <strong>Cargando...</strong>
               </div>
            </template>

            <template #cell(id)="{item,toggleDetails,detailsShowing}">
               <b-button size="sm" @click="toggleDetails">
                  <feather-icon :icon="detailsShowing ? 'ArrowUpIcon' : 'ArrowDownIcon'" />
                  {{ item.id }}
               </b-button>
            </template>

            <template #row-details="{item,toggleDetails}">
                  <table class="table table-sm table-hover">

                     <template v-if="item.tipo_viaje == 1">
                        <tr>
                           <td>Hora de llegada:</td>
                           <td>{{ getHora(item.hora_llegada) }}</td>
                        </tr>
                        <tr>
                           <td colspan="2">Hora de descarga</td>
                        </tr>
                        
                        <tr>
                           <td>Pegado:</td>
                           <td> {{ getHora(item.hora_descarga.pegado) }} </td>
                        </tr>
                        <tr>
                           <td>Despegado:</td>
                           <td> {{ getHora(item.hora_descarga.despegado) }}</td>
                        </tr>

                     </template>

                     <template v-if="item.tipo_viaje == 2">
                      
                        <tr>
                           <td colspan="2">Recogido</td>
                        </tr>
                     
                        <tr>
                           <td>fecha:</td>
                           <td> {{ item.recogido.fecha | fecha }} </td>
                        </tr>
                        <tr>
                           <td>Destino:</td>
                           <td> {{ item.recogido.destino }}</td>
                        </tr>
                     
                     </template>
                    

                  </table>
            </template>


            <template #cell(tipo_viaje)="{item}">
               <strong class="text-nowrap" >{{ item.tipo_viaje == 1  ? 'Para entregar' : 'Para retornar' }}</strong>
            </template>


            <template #cell(chofer_id)="{item}">
               <strong class="text-nowrap" v-if="item.chofer">{{ `${item.chofer.nombre} ${item.chofer.apellido}` }}</strong>
            </template>

            <template #cell(fecha)="{item}">
               <strong class="text-nowrap">{{ `${item.fecha} ${item.hora_salida}` | fecha('D/MM/YYYY h:mm a') }} </strong>
            </template>

        


            <!-- Column: Actions -->
            <template #cell(actions)="{ item }">

               <b-button-group size="sm">

                  <b-button variant="primary" title="Editar" :to="{ name: 'edit.viaje', params: { id: item.id } }"
                     v-if="$can('update', 'viajes')">
                     <feather-icon icon="EditIcon" />
                  </b-button>

                  <b-button variant="danger" @click="eliminar(item.id)" title="Eliminar viaje"
                     v-if="$can('delete', 'viajes')">
                     <feather-icon icon="Trash2Icon" />
                  </b-button>
               </b-button-group>

            </template>

         </b-table>

         <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage" :total="total" />

      </b-card>

   </div>

</template>

<script>

import {
   BCard,
   BRow,
   BCol,
   BTable,
   BBadge,
   BFormInput,
   BInputGroup,
   BButton,
   BButtonGroup,
   BSpinner,
   BAvatar,
   BMedia,
   BLink
} from 'bootstrap-vue';

import { computed,toRefs,watch,onMounted } from 'vue';
import store from '@/store';
import useListViaje from './useListViaje';

import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter';
export default {
   props: ['id'],

   components: {
      BCard,
      BRow,
      BCol,
      BTable,
      BInputGroup,
      BBadge,
      BFormInput,
      vSelect,
      BButton,
      BButtonGroup,
      BSpinner,
      BAvatar,
      BMedia,
      BLink,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage: () => import('components/PerPage'),

   },


   setup(props) {

      const {id} = toRefs(props)

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
         eliminar,
         tableColumns,
         fetchData,

      } = useListViaje(id.value)

      watch(id,() => setTimeout(() => {
         refetchData()
      },2000))

      onMounted(() => {

         setTimeout(() => {
            refetchData()
         }, 2000)

      })


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
         eliminar,
         tableColumns,
         fetchData,
         camiones: computed(() => store.state.camion.camiones),
         loading: computed(() => store.state.loading),
         avatarText,

         getHora:(hora) => moment(`1991-12-30 ${hora}`).format('LT')
      }


   },
}
</script>