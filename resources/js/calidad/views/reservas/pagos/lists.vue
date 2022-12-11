<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Filters -->
      <pagos-list-filters :forma-pago-filter.sync="formaPagoFilter" />

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2">

            <!-- Table Top -->
            <b-row>

               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <label>Mostrar</label>
                  <v-select v-model="perPage" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                     :options="perPageOptions" :clearable="false" class="per-page-selector d-inline-block mx-50" />
                  <label>entradas</label>
               </b-col>

               <!-- Search -->
               <b-col cols="12" md="6">

                  <!-- <div class="d-flex align-items-center justify-content-end">
                   <b-form-input v-model="searchQuery" class="d-inline-block mr-1" placeholder="Buscar..." />
                  </div> -->
                  <div class="d-flex align-items-center justify-content-end">

                     <!-- <b-button-group size="sm">
                        <a :href="`/api/boda/${boda.id}/descargar/habitaciones/status/${(statusFilter) ? statusFilter : ''}`" class="btn btn-primary" download title="Descargue una lista de todas las habitaciones de la boda " v-b-tooltip.hover>
                        
                        <feather-icon icon="DownloadIcon" size="18" />
                        Descargar 
                        </a>
                     </b-button-group> -->

                  </div>
               </b-col>
            </b-row>

         </div>

         <b-table ref="refPagosListTable" :items="fetchPagos" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ningún pago" :sort-desc.sync="isSortDirDesc"
            :sticky-header="true" :no-border-collapse="false">

            <template #table-colgroup="scope">
               <col v-for="field in scope.fields" :key="field.key"
                  :style="{ width: field.key === 'show_details' ? '30px' : '60px' }">
            </template>

            <template #cell(show_details)="row">

               <b-button @click="row.toggleDetails" size="sm" variant="text" class="d-flex text-nowrap">
                  <feather-icon :icon="(row.detailsShowing) ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                  <span class="text-nowrap">{{row.item.id}}</span>
               </b-button>

            </template>



            <template #row-details="row">
               <b-card>
                  <b-row class="mb-2">

                     <div class="col-12 col-md-6">
                        <table class="table table-hover table-sm">
                           <tr>
                              <td>Noches:</td>
                              <td>{{ row.item.reserva.noches }} </td>
                           </tr>
                           <tr>
                              <td>Pagado por :</td>
                              <td>{{ row.item.usuario.nombre ? row.item.usuario.nombre : row.item.reserva.invitado }}
                              </td>
                           </tr>
                           <tr>
                              <td>Boda de :</td>
                              <td>{{ row.item.reserva.boda.novios.novia +' & '+ row.item.reserva.boda.novios.novio }}
                              </td>
                           </tr>

                           <tr>
                              <td>Invitado :</td>
                              <td> <strong>{{row.item.reserva.invitado}}</strong></td>
                           </tr>

                           <tr>
                              <td>Email invitado: </td>
                              <td><strong>{{row.item.reserva.email}}</strong></td>
                           </tr>
                           <tr>
                              <td>Teléfono del invitado: </td>
                              <td><strong>{{row.item.reserva.telefono}}</strong></td>
                           </tr>
                           <tr v-if="row.item.concepto">
                              <td> Concepto: </td>
                              <td><strong>{{row.item.concepto}}</strong></td>
                           </tr>

                        </table>
                     </div>

                     <!-- <b-col md="3" class="mb-1">
                              <strong>Noches : </strong>{{ row.item.reserva.noches }} 
                           </b-col>

                           <b-col md="5" class="mb-1">
                              <strong>Pagado por : </strong>{{ row.item.usuario.nombre ? row.item.usuario.nombre : row.item.reserva.invitado }}
                           </b-col>

                             <b-col md="4" class="mb-1">
                              <strong>Boda de : </strong>{{ row.item.reserva.boda.novios.novia +' & '+ row.item.reserva.boda.novios.novio }}
                           </b-col> -->
                  </b-row>
                  <!-- <b-row>
                              <div class="col-12 col-md-4">
                                 Invitado: <strong>{{row.item.reserva.invitado}}</strong>
                              </div>

                              <div class="col-12 col-md-4">
                                 Email invitado: <strong>{{row.item.reserva.email}}</strong>
                              </div>
                              
                              <div class="col-12 col-md-4">
                                 Teléfono del invitado: <strong>{{row.item.reserva.telefono}}</strong>
                              </div>
                           </b-row>

                            <b-row>
                              <div class="col-12 col-md-4" v-if="row.item.concepto">
                                 Concepto: <strong>{{row.item.concepto}}</strong>
                              </div>
                            </b-row> -->





               </b-card>
            </template>

            <!-- Column: Forma de pago -->
            <template #cell(forma)="data">
               <div class="text-nowrap">
                  {{getFormaPago(data.item.forma_pago,data.item.metodo_pago)}}
               </div>
            </template>

            <template #cell(status)="data">

               <el-select size="small" style="width:150px !important" filterable class="w-100"
                  v-model="data.item.status" @change="updateStatusPago({status:$event,pago:data.item.id})"
                  v-if="data.item.status != 3">
                  <el-option v-for="(statu,i) in status" :key="i" :value="statu.id" :label="statu.label"></el-option>
               </el-select>

               <strong v-else class="text-danger">Pago Rechazado</strong>

            </template>

            <template #cell(monto)="data">
               <div class="text-nowrap" style="width:100px">
                  {{data.item.monto | currency }} MXN
               </div>
            </template>

            <template #cell(status_pago)="data">
               <div class="text-nowrap" style="width:100px" v-text="getStatus(data.item.status_pago)">

               </div>
            </template>



            <!-- Column: Actions -->
            <template #cell(actions)="data">

               <b-button-group size="sm">

                  <b-button variant="primary" v-if="$can('update','pagos')" @click="editarPago(data.item.id)"
                     title="Editar Pago">
                     <feather-icon icon="EditIcon" />
                  </b-button>


                  <b-button @click="verComprobante(data.item)" title="Ver Comprobante"
                     v-if="data.item.comprobante && getExt(data.item.comprobante)">
                     <feather-icon icon="EyeIcon" />
                  </b-button>

                  <b-button :href="`/api/descargar/comprobante/pago/${data.item.id}`" variant="secondary" download
                     title="Descargar el comprobante de pago"
                     v-if="data.item.comprobante && (data.item.forma_pago == 1 || data.item.forma_pago == 5 || data.item.forma_pago == 2)">
                     <feather-icon icon="DownloadIcon" size="16" class="align-middle" />
                  </b-button>

                  <!-- <a href="" download target="_blank" class="btn btn-secondary" title="Descargar el comprobante de pago" v-if="data.item.comprobante && (data.item.forma_pago == 1 || data.item.forma_pago == 5) ">
                         
                       

                        </a> -->

               </b-button-group>

            </template>

         </b-table>




         <paginate-table :dataMeta="dataMeta" :currentPage="currentPage" :perPage="perPage" :total="totalPagos" />


      </b-card>

      <show-imagen :showDialog.sync="showDialog" :url="urlImagen" size="lg" :tipo="tipoArchivo" />
      <form-pago v-model="showFormPago" @pagoUpdate="refetchData" />

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
   BPagination,
   BButton,
   BButtonGroup,
   VBTooltip,
   BSidebar,
   BFormRadioGroup,
   BFormRadio,
   BFormGroup,
   BForm,
   BFormFile


} from 'bootstrap-vue';



import StatisticCardWithLineChart from '@core/components/statistics-cards/StatisticCardWithLineChart.vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

import {ref,onMounted,watch} from 'vue';

import store from '@/store';

import PagosListFilters from './PagosListFilters.vue';

import usePagosList from './usePagosList';

import {mapState } from 'vuex';
import vSelect from 'vue-select'
import CurrencyInput from 'components/CurrencyInput';

import { Notification } from 'element-ui';
import optionsComponents from 'mixins/optionsComponents'
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import ShowImagen from 'components/ShowImagen';

import PaginateTable from 'components/PaginateTable'

import { getExt  } from '@core/utils/utils'

export default {
   props:['id'],

   components:{
      BCard,
      BRow,
      BCol,
      BTable,
      BBadge,
      StatisticCardWithLineChart,
      StatisticCardHorizontal,
      PagosListFilters,
      BFormInput,
      BPagination,
      vSelect,
      BButton,
      BButtonGroup,
      BSidebar,
      BFormRadioGroup,
      BFormRadio,
 
      BFormGroup,
      BForm,
      BFormFile,
      ShowImagen,
      CurrencyInput,
      PaginateTable,
      FormPago: () => import('components/FormPago')

      },

   directives:{
      'b-tooltip' : VBTooltip
   },

   computed:{
      ...mapState(['loading']),
   },


   mixins:[optionsComponents],

   setup(props) {
      
      const {
         fetchPagos,
         tableColumns,
         perPage,
         currentPage,
         totalPagos,
         dataMeta,
         perPageOptions,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refPagosListTable,
         refetchData,
         formaPagoFilter


      } = usePagosList(props.id)

      const showFormPago = ref(false)
         

      const showDialog = ref(false)
      const urlImagen = ref('')
      const tipoArchivo = ref('');


      const status = ref([
         {
            id:0,
            label:'Por confirmar',
            variant:"warning"
         },
         
         // {
         //    id:1,
         //    label:'Comprobada',
         // },
         
         {
            id:2,
            label:'Aprobada',
            variant:'success'
         },

         {
            id:3,
            label:'Rechazada',
            variant:'danger'
         }

      ]);
      
      const getFormaPago = (forma,metodo_pago = null) => {

         switch (forma) {
            
            case 1:
               return 'Transferencia';
               break;
            
            case 2:
               return 'Efectivo';
               break;

            case 3:
               return 'Paypal';
               break;

            case 4:
               return 'Conekta';
               break;

            case 5:
               return metodo_pago;
               break;
         }

      } 
      
      const getStatusPago = (status) => {

         let getStatus = {
            text:'',
            variant:'danger'
         }



           switch (status) {
            
            case 0:
               getStatus.text = 'Por comprobar'
               getStatus.variant = 'info'
               break;
            
            case 1:
               getStatus.text = 'Comprobada'
               getStatus.variant = 'warning'
               break;

            case 2:
               getStatus.text = 'Aprobada'
               getStatus.variant = 'success'
               break;

            case 3:
               getStatus.text = 'Rechazada'
               getStatus.variant = 'danger'
               break;
         }

         return getStatus

      }

      const updateStatusPago = (data) => {
         // console.log(data);
            Swal.fire({
            title: 'Deseas continuar con esta acción?',
                  text: "Siempre podrás cambiar el status de un pago!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Sí!',
                  cancelButtonText:'Nó',
                  customClass: {
                     confirmButton: 'btn btn-primary',
                     cancelButton: 'btn btn-outline-danger ml-1',
                  },
                  buttonsStyling: false,
                  }).then(result => {
                  
                  if (result.value) {
                      store.dispatch('pago/cambiarStatus',data).then( respon => {

                        if(respon.data.result){
                           Notification.info("El estatus del pago se ha cambiado");
                           refetchData()
                        }else{
                           Notification.info("El estatus del pago no se pudo cambiar");
                        }
                     }).catch((e) => {
                        console.log(e)
                     })
                  }else{
                     refetchData();
                  }
            })

        


      }

      const verComprobante = (comprobante) => {
         tipoArchivo.value = getExt(comprobante.comprobante)
         urlImagen.value = `/api/descargar/comprobante/pago/${ comprobante.id }`; 
         showDialog.value = true;
      }

      const descargarComprobante = (pago) => {

         
         store.dispatch('pago/descargarComprobante',pago).then(respon => {

            console.log(respon);

         }).catch(e => console.log(e));

      }


      const editarPago = (pago) => {
         store.commit('pago/capturarPago', pago)
         showFormPago.value = true

      }



      return {
         fetchPagos,
         tableColumns,
         perPage,
         currentPage,
         totalPagos,
         dataMeta,
         perPageOptions,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refPagosListTable,
         refetchData,
         formaPagoFilter,
         getFormaPago,
         getStatusPago,
         status,
         updateStatusPago,
         verComprobante,
         showDialog,
         urlImagen,
         descargarComprobante,
         tipoArchivo,
         showFormPago,
         editarPago,
         getExt,
         getStatus:(status) => {
            const valores = ['No Aplica','Transferido','Por Transferir']
            return valores[status]
         }

      }


   },
}
</script>