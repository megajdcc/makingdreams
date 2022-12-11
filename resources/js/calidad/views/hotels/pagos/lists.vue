<template>

   <div class="container-fluid">

      <!-- Filters -->
      <pago-list-filters :boda-filter.sync="bodaFilter" />

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2">

            <!-- Table Top -->
            <b-row>

               <!-- Per Page -->
               <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">

                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />

               </b-col>

               <!-- Search -->
               <b-col cols="12" md="6">

                  <b-input-group size="sm">
                     <b-form-input v-model="searchQuery" class="d-inline-block" placeholder="Buscar..." />
                     <!-- <template #append is-text>
                        <b-button-group size="sm">
                           <b-button variant="primary" @click="cargarPago" title="Cargue un pago a esta Hotel">
                              Cargar pago
                           </b-button>
                        </b-button-group>
                     </template> -->
                  </b-input-group>
                  <!-- <div class="d-flex align-items-center justify-content-end">


                  </div> -->

               </b-col>
            </b-row>

         </div>

         <b-table ref="refTable" :items="fetchPagos" responsive :fields="tableColumns" primary-key="id"
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



            <template #row-details="{item}">
               <b-card>
                  <b-row class="mb-2">

                     <b-col md="3" class="mb-1">
                        <strong>Banco : </strong>{{ item.banco }}
                     </b-col>

                     <b-col md="5" class="mb-1">
                        <strong>Pagado por : </strong>{{ item.registrante }}
                     </b-col>

                  </b-row>

               </b-card>
            </template>

            <!-- Column: Forma de pago -->
            <template #cell(novios)="{item}">
               <div class="text-nowrap">
                  {{ item.novios }}
               </div>
            </template>

            <template #cell(monto)="{item}">
               <div class="text-nowrap" style="width:100px">
                  {{ item.monto | currency }} MXN
               </div>
            </template>

            <template #cell(fecha_registro)="{item}">
               <div class="text-nowrap" style="width:100px">
                  {{ item.fecha_registro | fecha }}
               </div>
            </template>

            <!-- Column: Actions -->
            <template #cell(actions)="{item}">

               <b-button-group size="sm">

                  <b-button @click="verComprobante(item)" title="Ver Comprobante">
                     <feather-icon icon="EyeIcon" />
                  </b-button>

                  <b-button :href="`/api/descargar/comprobante/hotel/pago/${item.id}`" variant="secondary" download
                     title="Descargar el comprobante de pago">

                     <feather-icon icon="DownloadIcon" size="16" class="align-middle" />

                  </b-button>

                  <b-button variant="dark" @click="facturasOpen(item.id)" title="Facturas del pago" v-b-tooltip.hover>
                     <feather-icon icon="FileIcon" />
                     Facturas
                  </b-button>


               </b-button-group>

            </template>

         </b-table>

         <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage" :total="totalPagos" />

         <div class="mx-2 mb-2">
            <b-row>
               <div class="col-12">
                  <b-button variant="dark" @click="regresar()" size="sm">
                     Regresar
                  </b-button>
               </div>
            </b-row>
         </div>


      </b-card>

      <b-sidebar id="sidebar-right" bg-variant="white" right backdrop shadow v-model="showPago">

         <div class="container-fluid">
            <validation-observer ref="validateForm">
               <b-form @submit.prevent="enviarPago">

                  <div class="row">

                     <el-divider>Datos del pago</el-divider>

                     <div class="col-12">

                        <b-form-group label="Boda" description="Seleccione la boda de la que pertenece el pago">

                           <validation-provider #default="{errors}" name="agencia" rules="required">
                              <el-select v-model="formulario.boda_id" size="small" class="w-100" filterable>
                                 <el-option v-for="(boda,i) in bodas" :key="i" :value="boda.id"
                                    :label="`${boda.novios.novia} & ${boda.novios.novio}`"></el-option>
                              </el-select>

                              <span class="text-danger">{{ errors[0] }}</span>

                           </validation-provider>

                        </b-form-group>

                        <b-form-group label="Comprobante del pago"
                           description="Cargue una imagen, captura del pago realizado">

                           <validation-provider rules="required" name="Comprobante" #default="{errors}">

                              <b-form-file v-model="formulario.comprobante" accept=".jpg, .png, .gif, .jpeg" size="sm"
                                 :state="errors.length > 0 ? false : null" />

                              <span class="text-danger">{{ errors[0] }}</span>

                           </validation-provider>

                        </b-form-group>


                        <b-form-group label="Banco"
                           description="Escriba el nombre del banco en donde realizó el pago si aplica...">

                           <!-- <validation-provider #default="{errors}" name="banco" rules="required"> -->
                           <b-form-input v-model="formulario.banco" placeholder="Nombre del banco" />

                           <!-- <span class="text-danger">{{ errors[0] }}</span> -->

                           <!-- </validation-provider> -->

                        </b-form-group>





                        <b-form-group label="Nro de Referencia"
                           description="El Número de referencia, es el número de control que el banco asocia a la transacción, el mismo sirve para comprobar la operación">

                           <validation-provider rules="required" name="Nro de referencia" #default="{errors}">
                              <b-form-input v-model="formulario.nro_referencia"
                                 :state="errors.length > 0 ? false : null" placeholder="Nro de comprobante" size="sm" />

                              <span class="text-danger">{{ errors[0] }}</span>
                           </validation-provider>

                        </b-form-group>

                        <b-form-group label-for="monto" description="El monto que desea acreditar ">
                           <template #label>
                              Monto: {{ formulario.monto | currency }} MXN <span class="text-danger">*</span>
                           </template>
                           <!-- <validation-provider rules="required" name="Monto" #default="{errors}"> -->

                           <currency-input @change="formulario.monto= $event" :value="Number(formulario.monto)"
                              input-class="form-control form-control-sm" :options="{currency:'MXN'}" />


                           <!-- <span class="text-danger">{{ errors[0] }}</span> -->

                           <!-- </validation-provider> -->


                        </b-form-group>

                        <b-form-group label="Concepto"
                           description="Escriba una descripción del pago, para tener la referencia a futura">

                           <b-form-textarea v-model="formulario.concepto" :rows="3" :max-rows="5">

                           </b-form-textarea>

                        </b-form-group>







                     </div>
                  </div>

                  <div class="row my-1">
                     <div class="col-12">
                        <b-button variant="primary" type="submit" size="sm" v-loading="loading">
                           <feather-icon icon="SaveIcon" size="16" />
                           Cargar Comprobante
                        </b-button>
                     </div>
                  </div>





               </b-form>
            </validation-observer>
         </div>
      </b-sidebar>

      <b-sidebar id="sidebar-right" bg-variant="white" right backdrop shadow v-model="showFactura">

         <div class="container-fluid">
            <div class="row">
               <div class="col-12">
                  <h3>Facturas Cargadas</h3>
               </div>

               <div class="col-12">
                  <el-table :data="facturas" height="250" style="width: 100%">

                     <el-table-column prop="fecha" label="Fecha de carga" width="180">
                     </el-table-column>

                     <el-table-column fixed="right" label="Operaciones" width="120">
                        <template slot-scope="scope">
                           <a :href="scope.row.factura" download target="_blank" class="btn btn-secondary btn-sm"
                              title="Descargar la factura" size="sm">

                              <feather-icon icon="DownloadIcon" size="16" class="align-middle" />

                           </a>

                           <b-button variant="primary" @click="eliminarFactura(scope.row.id)" size="sm">
                              <feather-icon icon="TrashIcon" />
                           </b-button>

                        </template>
                     </el-table-column>

                  </el-table>

               </div>
               <div class="col-12 mt-2">
                  <el-upload class="upload-demo" :action="urlUploadFactura" :on-success="facturaCargada"
                     :headers="cabecera"
                     :file-list="facturas.map((val) => { return {name:val.created_at,url:val.factura} } )">
                     <el-button size="small" type="primary">Clic para subir archivo</el-button>
                     <div slot="tip" class="el-upload__tip">Solo archivos jpg/png con un tamaño menor de 500kb</div>
                  </el-upload>


               </div>
            </div>
         </div>

      </b-sidebar>

      <show-imagen :showDialog.sync="showDialog" :url="urlImagen" size="lg" />

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
   BFormFile,
   BFormTextarea,
   BInputGroup


} from 'bootstrap-vue';

import {ValidationProvider, ValidationObserver }from 'vee-validate';


import StatisticCardWithLineChart from '@core/components/statistics-cards/StatisticCardWithLineChart.vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

import {ref,onMounted,watch} from 'vue';

import store from '@/store';

import PagoListFilters from './PagoListFilters.vue';

import usePagosList from './usePagosList';

import {mapState } from 'vuex';
import vSelect from 'vue-select'
import CurrencyInput from 'components/CurrencyInput.vue';

import { Notification } from 'element-ui';
import {required} from '@validations';
import ShowImagen from 'components/ShowImagen';

import optionsComponents from 'mixins/optionsComponents';
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
      PagoListFilters,
      BFormInput,
      BPagination,
      vSelect,
      BButton,
      BButtonGroup,
      BSidebar,
      BFormRadioGroup,
      BFormRadio,
      BFormTextarea,
 
      BFormGroup,
      BForm,
      BFormFile,
      CurrencyInput,
      ValidationProvider,
      ValidationObserver,
      PaginateTable:() => import('components/PaginateTable'),
      PerPage:() => import('components/PerPage'),
      ShowImagen,
      BInputGroup

      },

   directives:{
      'b-tooltip' : VBTooltip
   },

   computed:{
      ...mapState(['loading']),
      ...mapState('boda',['bodas'])
   },
   mixins: [optionsComponents],



   setup(props) {
      

      store.dispatch('boda/cargarBodas');

      const validateForm = ref(null);
      const showPago = ref(false);
      const showFactura = ref(false);
      const facturas = ref([]);
      const urlUploadFactura = ref('pagohotel/pago/upload/factura')
      const showDialog = ref(false)
      const urlImagen = ref('')
      
      const cabecera = ref({
         'Authorization': `bearer ${localStorage.getItem('token')}`,
         'Accept':"application/json, text/plain, */*, text/html",
         'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content'),
      })

      const formulario = ref({
            id:null,
            monto:0,
            concepto:'',
            comprobante:null,
            nro_referencia:'',
            banco:'',
            hotel_id:props.id,
            usuario_id:null,
            boda_id:null,
            hotel:null,
            usuario:null,
            boda:null
      });


      const {
         fetchPagos,
         tableColumns,
         perPage,
         currentPage,
         total:totalPagos,
         dataMeta,
         perPageOptions,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refTable,
         refetchData,
         bodaFilter

      } = usePagosList(props.id)

      const getFecha = (fecha) => {
         return moment(fecha).format('LLL');
      } 

      const clearPago = () => {
         formulario.value = {
            id:null,
            monto:0,
            concepto:'',
            comprobante:null,
            nro_referencia:'',
            banco:'',
            hotel_id:props.id,
            usuario_id:null,
            boda_id:null,
            hotel:null,
            usuario:null,
            boda:null
         };

         
      }

      const enviarPago = () => {
         validateForm.value.validate().then(success => {

            if(success){


               store.dispatch('pagoHotel/cargarPago',formulario.value).then(respon => {

                  if(respon.data.result){
                     Notification.success('Se ha cargado con éxito el pago');

                     refetchData();
                     clearPago();

                     store.commit('pagoHotel/pushPago',respon.data.pago)
                     showPago.value = false



                  }else{
                     Notification.info('No se pudo cargar el pago, inténtelo de nuevo mas tarde.')
                  }
                  
               }).catch(e => {
                  console.log(e)
               }).then(() => {
               })


            }

         }).catch(e => {
            console.log(e)
         })
      }

      const cargarPago = () => {
         clearPago();

         showPago.value = true;
      } 

      const facturasOpen = (id_pago) => {
         

         store.dispatch('pagoHotel/capturarFacturas',id_pago).then(respon => {
            
            if(respon.data.result){
               
               facturas.value = respon.data.facturas;
               urlUploadFactura.value = `/api/pagohotel/${id_pago}/upload/factura`
               showFactura.value = true
            
            }else{
               Notification.info('No se puede cargar las facturas, inténtelo de nuevo ... ')
            }

         }).catch(e => {
            console.log(e);
         }).then(() => {
         })

        
      }


      const facturaCargada = (response) => {

         console.log(response);
         if(response.result){
            facturas.value.push(response.factura);
         }else{
            Notification.info('La factura no pudo ser cargada, inténtelo de nuevo mas tarde...');


         }


      } 

      const eliminarFactura = (id_factura) => {


         store.dispatch('pagoHotel/deleteFactura',id_factura).then(response => {

               if(response.data.result){
                  facturas.value.splice(facturas.value.findIndex(val => val.id == id_factura),1);
               }


         })
      }

       const verComprobante = (comprobante) => {
         
          urlImagen.value = `/api/descargar/comprobante/hotel/pago/${ comprobante.id }`; 
         showDialog.value = true;


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
         refTable,
         refetchData,
         bodaFilter,
         getFecha,
         showPago,
         required,
         validateForm,
         formulario,
         enviarPago,
         cargarPago,
         showFactura,
         facturasOpen,
         facturas,
         urlUploadFactura,
         cabecera,
         facturaCargada,
         eliminarFactura,
         verComprobante,
         showDialog,
         urlImagen
      }


   },
}
</script>