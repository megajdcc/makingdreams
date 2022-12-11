<template>

  <div class="container-fluid mx-0 px-0 w-100" v-loading="loading">

    <!-- Filters -->
    <reserva-list-filters :hotel-filter.sync="hotelFilter" :hoteles="getHoteles" :bodas="getBodas"
      :status-filter.sync="statusFilter" :bodas-filter.sync="bodasFilter" />

    <!-- Table Container Card -->
    <b-card no-body class="mb-0">

      <div class="m-2 row">

        <!-- Table Top -->



        <b-col cols="12" md="6">
          <b-row>
            <b-col cols="12" md="6">

              <per-page v-model="perPage" :perPageOptions="perPageOptions" size="md" />

            </b-col>

            <b-col cols="12" md="6">

              <v-select v-model="eliminadoFilter" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="[{label:'Eliminados',id:1},{label:'NO eliminados',id:2}]" :clearable="false"
                :reduce="val => val.id" class="form-control-sm"/>

            </b-col>
          </b-row>
        </b-col>

        <b-col cols="12" md="6">
          <b-row>
            <!-- Search -->
            <b-col cols="12">
              <b-input-group size="md">
                <b-form-input v-model="searchQuery" class="d-inline-block" placeholder="Buscar..." />
                <template #append>
                  <b-button variant="primary" :to="{name:'create.reservacion'}">
                    <span class="text-nowrap">Registrar Reserva</span>
                  </b-button>
                </template>

              </b-input-group>
            </b-col>


          </b-row>
        </b-col>




      </div>

      <b-table ref="refReservasListTable" :items="fetchReservas" responsive :fields="tableColumns" primary-key="id"
        :sort-by.sync="sortBy" empty-text="No se encontró ninguna reservación" :sort-desc.sync="isSortDirDesc"
        sticky-header="700px" :no-border-collapse="false">

        <template #table-colgroup="scope">
          <col v-for="field in scope.fields" :key="field.key"
            :style="{ width: field.key === 'show_details' ? '50px' : '180px' }">
        </template>

        <template #cell(show_details)="row">

          <section style="min-width:150px" class="px-0">
            <b-input-group size="sm" v-if="editing_reserva && $can('write','reservas')" class="text-nowrap ">
              <b-form-input v-model="row.item.nro_reserva" />
              <b-input-group-append>
                <b-button @click="actualizarNroReserva(row.item)" variant="primary" :loading="loading">
                  <feather-icon icon="SaveIcon" />
                </b-button>
              </b-input-group-append>

            </b-input-group>

            <b-button-group size="sm" v-else>
              <b-button @click="row.toggleDetails" size="sm" variant="primary" class="d-flex text-nowrap">
                <feather-icon :icon="(row.detailsShowing) ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                <span class="text-nowrap">{{row.item.nro_reserva}}</span>

              </b-button>

              <b-button @click.stop="editing_reserva = true" variant="primary">
                <feather-icon icon="EditIcon" />
              </b-button>
            </b-button-group>

          </section>

        </template>

        <template #row-details="row">
          <b-card>
            <b-row class="mb-2">

              <b-col md="6" class="mb-1">
                <ul>
                  <li> <strong>Hotel : </strong>{{ row.item.boda.hotel.nombre }} </li>
                  <li> <strong>Noches : </strong>{{ row.item.noches }} </li>
                  <li> <strong>Nro de ocupantes : </strong>{{ row.item.ocupantes }}</li>
                  <li> Pagada:<strong class="text-primary" v-text="(row.item.pagada) ? 'Pagada' : 'No pagada'"></strong>
                  </li>
                  <li><strong>Email : </strong><a :href="`mailto:${row.item.email}`" target="_blank"
                      class="btn btn-link">{{ row.item.email }} </a></li>
                  <li><strong>Teléfono : </strong><a :href="`tel:${row.item.telefono}`" target="_blank">{{
                      row.item.telefono }} </a></li>
                  <li> <strong>Check In : </strong>{{ row.item.check_in | fecha }} </li>
                  <li> <strong>Check Out : </strong>{{ row.item.check_out | fecha }} </li>
                  <li>
                    <strong>Cargos adicionales:</strong>{{ row.item.cargo_adicional | currency }} MXN
                  </li>
                </ul>

              </b-col>
            </b-row>

            <el-divider content-position="left">Habitaciones</el-divider>
            <b-row v-for="(habitacion,i) in row.item.habitaciones" :key="i">
              <b-col md="6" class="mb-1">
                <ul>
                  <li> <span>Categória:{{habitacion.nombre}}</span></li>
                  <li> <span>Monto:{{ habitacion.pivot.monto | currency }} MXN | {{row.item.noches}} Noches</span></li>
                  <li> <span>Observación:{{habitacion.pivot.observacion}}</span></li>
                  <li>
                    <p>Adultos:{{habitacion.pivot.habitantes.adultos}}</p>
                  </li>
                  <ol>
                    <li v-for="(habitante,u) in habitacion.pivot.habitantes.adults" :key="u">
                      <p>Nombre:{{habitante.nombre}}</p>
                    </li>
                  </ol>
                  <li>
                    <p>Adolescentes:{{habitacion.pivot.habitantes.adolescentes}}</p>
                  </li>
                  <ol>
                    <li v-for="(habitante,u) in habitacion.pivot.habitantes.jovenes" :key="u">
                      <p>Nombre:{{habitante.nombre}} <br> Edad: {{habitante.edad}}</p>
                    </li>
                  </ol>

                  <li>
                    <span>Niños:{{habitacion.pivot.habitantes.ninos}}</span>
                  </li>

                  <ol>
                    <li v-for="(habitante,u) in habitacion.pivot.habitantes.childs" :key="u">
                      <p>Nombre:{{habitante.nombre}} <br> Edad: {{habitante.edad}}</p>
                    </li>
                  </ol>


                  <li> <span>Bebés: {{habitacion.pivot.habitantes.bebes}}</span> </li>
                </ul>

              </b-col>

              <el-divider></el-divider>
            </b-row>



          </b-card>
        </template>

        <!-- Column: Fecha -->
        <template #cell(created_at)="data">
          <div class="text-nowrap">
            <strong class="text-primary"> {{ data.item.created_at | fecha }}</strong>
          </div>
        </template>

        <template #cell(boda)="data">
          <div class="text-nowrap">
            <strong class="text-primary">
              <b-link :to="{name:'rooming.list',params:{id:data.item.boda.id}}">{{
                `${data.item.boda.novios.novia} & ${data.item.boda.novios.novio}` }}
              </b-link>
            </strong>
          </div>
        </template>

        <template #cell(total_pagar)="data">
          <span class="text-nowrap">{{data.item.total_pagar | currency}} MXN</span>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">

          <b-button-group size="sm">
            <template v-if="eliminadoFilter == 2">
              <b-button variant="primary" :to="{name:'reserva.pagos',params:{id:data.item.id}}"
                title="Ver los pagos de la reservación" v-if="data.item.pagos.length > 0">
                <feather-icon icon="DollarSignIcon" size="16" class="align-middle" />
              </b-button>

              <b-button :to="{ name: 'edit.reservacion', params: { id: data.item.id } }" variant="primary" size="sm">
                <feather-icon icon="EditIcon" size="16" class="align-middle" />
              </b-button>
            </template>

            <template v-else>
              <b-button variant="info" @click="restaurarModel(data.item.id)" title="Restaurar Reservación">

                <feather-icon icon="ServerIcon" size="16" class="align-middle" />

              </b-button>

              <b-button :to="{ name: 'edit.reservacion', params: { id: data.item.id } }" variant="primary" size="sm">
                <feather-icon icon="EditIcon" size="16" class="align-middle" />
              </b-button>
            </template>

            <b-button @click="eliminar(data.item.id)" variant="danger" size="sm">
              <feather-icon icon="TrashIcon" size="16" class="align-middle " />
            </b-button>

          </b-button-group>

        </template>

      </b-table>
      <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :total="totalReservas" :perPage="perPage" />

    </b-card>

  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BPagination,
  BButtonGroup,
  VBTooltip,
  BListGroupItem,
  BCardText,
  BFormCheckbox,
  BInputGroup,
  BFormGroup,
  BInputGroupAppend
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'

import ReservaListFilters from './ReservaListFilters.vue'
import useReservasList from './useReservasList.js'

import { mapGetters,mapMutations,mapActions,mapState } from 'vuex';

import {ref,onMounted} from 'vue'


import store from '@/store';

import { Notification } from 'element-ui';

import PaginateTable from 'components/PaginateTable'


export default {
  components: {
    ReservaListFilters,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BPagination,
    BButtonGroup,
    vSelect,
    BListGroupItem,
    BCardText,
    BFormCheckbox,
    BInputGroup,
    BFormGroup,
    BInputGroupAppend,
    PaginateTable,
    PerPage:() => import('components/PerPage')
    
  },
  directives:{
    'b-tooltip':VBTooltip,
    Ripple
  },

  computed:{
   ...mapGetters('hotel',['getHoteles']),
   ...mapGetters('usuario',['getFilterUsers']),
   ...mapGetters('boda',['getBodas']),
   ...mapState('usuario',['usuarios']),
   ...mapState('boda',['boda','bodas']),
 
   ...mapState(['loading']),




  },

  mounted(){

    this.$eventHub.$on('fetch-reserva', () => {
      this.refetchData();
    })


  },


  setup() {

    const {
      fetchReservas,
      tableColumns,
      perPage,
      currentPage,
      total:totalReservas,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refTable:refReservasListTable,
      refetchData,

      // Extra Filters
      hotelFilter,
      statusFilter,
      bodasFilter,
      eliminadoFilter
    } = useReservasList()

    onMounted(() => {
      onMounted(() => {
   
      Echo.channel('reservas')
        .listen('.ReservaDeleted',() => {
            refetchData();
            // console.log(e);
        })
        .listen('.ReservaSaved',(e) => {
            refetchData();
            console.log(e);
        })

        .listen('.ReservaCreated',(e) => {
            refetchData();
            console.log(e);
        })
        .listen('.ReservaUpdated',(e) => {
            refetchData();
            console.log(e);
        })



    })
    })

    const crearUser = (reserva_id) => {

        store.dispatch('reserva/crearUser',reserva_id).then(respon => {
          if(respon.data.result) {

            Notification.info('Se ha creado con éxito al usuario, le hemos enviado un correo, para que proceda a registrar su contraseña')

            refetchData();
          }else{
            Notification.info('No se pudo registrar el usuario, inténtelo de nuevo mas tarde.')
          }
        }).catch(e => {
          console.log(e)
        })

    }

    const restaurarModel = (reserva_id) => {


      store.dispatch('reserva/restaurarReservacion',reserva_id).then(respon => {
        if(respon.data.result){
             Notification.info('Reserva Restaurada')

             store.commit('reserva/pushReserva',respon.data.reserva)
             refetchData();
        }else{
          Notification.info('No se pudo reservación,inténtelo de nuevo')
        }

      }).catch(e => {
        console.log(e)
      }).then(() => {
      })
      
    }

    const editing_reserva =ref(false)

    const actualizarNroReserva  = (reser) => {


         console.log(reser);


         store.dispatch('reserva/actualizarNroReserva',reser).then(({data}) => {

            if(data.result){

               Notification.info({
                  message:data.mensaje,
                  position:'bottom-right',
               })

               refetchData();

               editing_reserva.value = false

            }else{
               Notification.error({
                  message:data.mensaje,
                  position:'bottom-right',
               })
            }

         }).catch(e => {

            console.log(e);

         }).then(
         )



      } 



    return {


      fetchReservas,
      tableColumns,
      perPage,
      currentPage,
      totalReservas,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refReservasListTable,
      refetchData,

      // Extra Filters
      hotelFilter,
      statusFilter,
      bodasFilter,
      crearUser,
      eliminadoFilter,
      restaurarModel,
      actualizarNroReserva,
      editing_reserva
    }
  },


  methods:{
    ...mapMutations('app',['TOGGLE_OVERLAY']),
    ...mapActions('reserva',['eliminarReserva']),
    
    eliminar(id_reserva){


      this.eliminarReserva(id_reserva).then(respon => {
        
        if(respon.data.result){
          this.$notify.info('Reservación eliminada exitosamente');
          this.refetchData();
        }else{
           this.$notify.info('La Reservación no se pudo eliminar ');
        }

      }).catch(e => {
        console.log(e)
      }).then(() =>  {
      })

    },
    
  }
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">

.list-group{
  min-height: 50px;
  padding: 0.5rem;
  background: #f8f8f8;
}

@import '~@core/scss/vue/libs/vue-select.scss';
@import '~bootstrap-vue/dist/bootstrap-vue.css';
</style>
