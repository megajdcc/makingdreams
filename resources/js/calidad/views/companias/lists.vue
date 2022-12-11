<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2 ">
            <!-- Table Top -->
            <b-row>
               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />
               </b-col>

               <b-col md="6">

                  <b-input-group size="sm">
                     <b-form-input v-model="searchQuery" placeholder="Buscar... " type="search" />

                     <template #append v-if="$can('write', 'compañias')">
                        <b-button variant="primary" :to="{ name: 'create.compania' }">
                           <feather-icon size="18" icon="PlusSquareIcon" />
                           Añadir
                        </b-button>
                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

         </div>

         <div class="d-flex justify-content-center">
            <!-- <b-spinner v-show="loading" variant="primary"> -->
            <b-container fluid v-loading="loading">
               <b-row>
                  <b-col cols="12" md="4" v-for="(compania,i) in data" :key="i" class="companias">
                     <b-card border-variant="primary" header-class="p-0" body-class="py-1">

                        <template #header v-if="compania.portada">
                           <b-img :src="`/storage/companias/portadas/${compania.portada}`" :alt="compania.nombre" />
                        </template>

                        <template #header v-else-if="compania.logo">
                           <b-img :src="`/storage/companias/logos/${compania.logo}`" :alt="compania.nombre" />
                        </template>

                        <b-card-title>
                           <b-link :to="{name:'show.compania',params:{id:compania.id}}" title="Ver Compañia"
                              class="font-weight-bolder">
                              {{compania.nombre}}
                           </b-link>

                           <section v-if="compania.coordinador">
                              <br>
                              <b-avatar :src="`/storage/img-perfil/${compania.coordinador.imagen}`"
                                 v-if="compania.coordinador"
                                 :title="`Coordinador: ${compania.coordinador.nombre} ${compania.coordinador.apellido}`"
                                 v-b-tooltip.hover.v-primary />
                                 <small>{{ compania.coordinador.nombre +' '+compania.coordinador.apellido }}</small>
                           </section>

                        </b-card-title>
                        <b-card-text class="scroll-area my-0">
                           {{ compania.breve }}
                        </b-card-text>
                        <template #footer>

                           <b-button-group size="sm">

                              <b-button v-b-tooltip.hover.v-primary title="Ver Empleados"
                                 v-if="$can('update','compañias')" variant="secondary"
                                 :to="{name:'compania.empleados',params:{id:compania.id}}">
                                 <feather-icon icon="UsersIcon" />
                              </b-button>

                              <b-button v-b-tooltip.hover.v-primary title="Ver Destinos" variant="info"
                                 :to="{name:'listar.destinos',params:{id:compania.id}}">
                                 <feather-icon icon="MapPinIcon" />
                              </b-button>

                              <b-button v-b-tooltip.hover.v-primary title="Editar Registro" variant="primary"
                                 v-if="$can('update','compañias')" :to="{name:'edit.compania',params:{id:compania.id}}">
                                 <feather-icon icon="EditIcon" />
                              </b-button>

                              <b-button v-b-tooltip.hover.v-primary title="Eliminar Registro"
                                 v-if="$can('delete','compañias')" variant="outline-danger"
                                 @click="eliminar(compania.id)">
                                 <feather-icon icon="Trash2Icon" />
                              </b-button>

                           </b-button-group>


                        </template>

                     </b-card>
                  </b-col>
               </b-row>
            </b-container>
            <!-- </b-spinner> -->
         </div>



         <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage" :total="total" />

      </b-card>

   </div>

</template>

<script>

import {
   BCard,
   BCardText,
   BCardTitle,
   BRow,
   BCol,
   BBadge,
   BFormInput,
   BInputGroup,
   BButton,
   BButtonGroup,
   BSpinner,
   BAvatar,
   BMedia,
   BLink,
   BImg,
   VBTooltip,
   BContainer
} from 'bootstrap-vue'

import { computed } from 'vue';
import store from '@/store';
import useCompaniasList from './useCompaniasList';

import vSelect from 'vue-select'
export default {
   props: ['id'],

   components: {
      BCard,
      BRow,
      BCol,
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
      BCardText,
      BCardTitle,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage: () => import('components/PerPage'),
      BContainer,
      BImg



   },

   directives:{
      'b-tooltip':VBTooltip
   },

   setup(props) {



      const {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData,
         data

      } = useCompaniasList()

      return {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData,
         data,
         loading: computed(() => store.state.loading),
      }


   },
}
</script>


<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.scroll-area {
  position: relative;
  margin: auto;
  width: auto;
  height: 70px;
  overflow-y: auto;
}

</style>

<style lang="scss">
 


@import '~@core/scss/vue/libs/vue-select.scss';

.dark-layout .swal2-popup{
  background: #181d2a;
}

.companias .card-header img{
   border-radius: 0.428rem 0.428rem 0px 0px;
   width:100%;
}

</style>