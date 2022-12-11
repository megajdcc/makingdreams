<template>

   <div class="container-fluid">


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

                  <div class="d-flex align-items-center justify-content-end">
                     <b-form-input v-model="searchQuery" class="d-inline-block mr-1" placeholder="Buscar..." />
                     <b-button @click="exportarData" variant="primary" class="d-flex">
                        <feather-icon icon="DownloadIcon" />
                        Descargar
                     </b-button>

                  </div>

               </b-col>
            </b-row>

         </div>

         <b-table ref="refBodasListTable" :items="fetchBodas" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ningúna boda" :sort-desc.sync="isSortDirDesc"
            sticky-header="750px" :no-border-collapse="false" borderless outlined small>

            <template #thead-top="data">
               <b-tr>

                  <b-th variant="primary" colspan="2" class="text-center bg-primary text-white">BODA</b-th>
                  <b-th variant="dark" colspan="5" class="text-center bg-dark text-white">HABITACIONES</b-th>

               </b-tr>
            </template>

            <template #table-colgroup="scope">
               <col v-for="field in scope.fields" :key="field.key"
                  :style="{ width: field.key === 'fecha' || field.key === 'disponibles' ? '150px' : '60px' }">
            </template>


            <!-- Column: Novios -->
            <template #cell(novios)="data">
               <div class="text-nowrap">
                  <b-link :to="{name:'rooming.list',params:{id:data.item.id}}">{{ data.item.dnovios }}</b-link>

               </div>
            </template>

            <template #cell(fecha)="data">
               <div class="text-nowrap" style="width:150px">
                  {{ getFecha(data.item.fecha) }}
               </div>
            </template>

            <template #cell(hab_habilitadas)="data">
               <div class="text-nowrap" style="width:100px">
                  {{ getHabitacionesContratadas(data.item.habitaciones) }}
               </div>
            </template>

            <template #cell(solicitadas)="data">
               <div class="text-nowrap" style="width:100px">
                  {{ data.item.reservaciones.length }}
               </div>
            </template>

            <template #cell(confirmadas)="data">
               <div class="text-nowrap" style="width:100px">
                  {{ data.item.reservaciones.filter(val => val.confirmada).length }}
               </div>
            </template>

            <template #cell(por_confirmar)="data">
               <div class="text-nowrap" style="width:100px">
                  {{ data.item.reservaciones.filter(val => !val.confirmada).length }}
               </div>
            </template>



            <template #cell(disponibles)="data">

               <div v-for="(habitacion, i) in data.item.habitaciones" :key="i" style="width:250px">
                  <label>{{habitacion.nombre}}:</label>
                  <!-- <b-progress
                        :max="habitacion.pivot.cantidad"
                        >
                        <b-progress-bar :value="getCantidadHabitacionesReserva(habitacion.id,data.item) > habitacion.pivot.cantidad  ? habitacion.pivot.cantidad :  getCantidadHabitacionesReserva(habitacion.id,data.item)">
                           <strong>{{ getCantidadHabitacionesReserva(habitacion.id,data.item) }} / {{ habitacion.pivot.cantidad }}</strong>
                        </b-progress-bar>
                        </b-progress> -->
                  <strong>{{ habitacion.pivot.cantidad - getCantidadHabitacionesReserva(habitacion.id,data.item) }}
                  </strong>
               </div>

            </template>

         </b-table>

         <div class="mx-2 mb-2">
            <b-row>

               <b-col cols="12" sm="6"
                  class="d-flex align-items-center justify-content-center justify-content-sm-start">
                  <span class="text-muted">Mostrando {{ dataMeta.from }} de {{ dataMeta.to }} de {{ dataMeta.of }}
                     entradas</span>
               </b-col>

               <!-- Pagination -->
               <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-end">

                  <b-pagination v-model="currentPage" :total-rows="totalBodas" :per-page="perPage" first-number
                     last-number class="mb-0 mt-1 mt-sm-0" prev-class="prev-item" next-class="next-item">

                     <template #prev-text>
                        <feather-icon icon="ChevronLeftIcon" size="18" />
                     </template>
                     <template #next-text>
                        <feather-icon icon="ChevronRightIcon" size="18" />
                     </template>
                  </b-pagination>

               </b-col>

            </b-row>
         </div>
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
   BProgress,
   BProgressBar,
   BTr,
   BTh,
   BLink


} from 'bootstrap-vue';

import StatisticCardWithLineChart from '@core/components/statistics-cards/StatisticCardWithLineChart.vue'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

import {ref,onMounted,watch} from 'vue';

import store from '@/store';
import xlsx from 'xlsx';
import FileSaver from 'file-saver';

import useBodasList from './useBodasList';

import {mapState } from 'vuex';
import vSelect from 'vue-select'
import CurrencyInput from 'components/CurrencyInput';

import { Notification } from 'element-ui';

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
      BProgress,
      BLink,
   BProgressBar,
    BTr,
   BTh
      },

   directives:{
      'b-tooltip' : VBTooltip
   },

   computed:{
      ...mapState(['loading']),
   },

   setup(props) {
      
      const {
         fetchBodas,
         tableColumns,
         perPage,
         currentPage,
         totalBodas,
         dataMeta,
         perPageOptions,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refBodasListTable,
         refetchData,
         bods



      } = useBodasList(props.id)

      const getFecha = (fecha) => {
         return moment(fecha).format('ll');
      } 

      const getCantidadHabitacionesReserva = (habitacion_id,boda) => {
         let suma = 0;

         boda.reservaciones.forEach(val => {
            if(val.confirmada){
               suma += val.habitaciones.filter(value => value.id == habitacion_id).length
            }
            
         })
         return suma;

      }

      onMounted(() => {
         // fetchBodas();
      })

      const exportarData = () => {
          let dataExport = bods.value.map((val) => {

             let hab_habilitadas = 0;

             val.habitaciones.forEach(value => {
                hab_habilitadas += value.pivot.cantidad
             })
            return {
               Novios:val.dnovios,
               Fecha:getFecha(val.fecha),
               Contratadas:hab_habilitadas,
               Solicitadas:val.reservaciones.length,
               Confirmadas:val.reservaciones.filter(val => val.confirmada).length,
               'Por confirmar':val.reservaciones.filter(val => !val.confirmada).length,
      
            };
         }) 

         let data = xlsx.utils.json_to_sheet(dataExport)
         // console.log(data);
         // data.Cells["Adultos"].AutoFitColumns();
         // var ws = xlsx.utils.aoa_to_sheet(data);
         // console.log(ws);
         // data.Cells['a1:l50'].AutoFitColumns();

         var wscols = [
               {wch:30},
               {wch:30},
               {wch:15},
               {wch:15},
               {wch:15},
               {wch:15},
               
            ];

            data['!cols'] = wscols;

         const workbook = xlsx.utils.book_new()

         const filename = 'Bodas'
         xlsx.utils.book_append_sheet(workbook, data, filename)
         xlsx.writeFile(workbook, `${filename}.xlsx`)
      }  


      const getHabitacionesContratadas = (habitaciones) => {
         let cantidad  = 0 ;

         habitaciones.forEach(val => {
            cantidad += val.pivot.cantidad;
         })
         return cantidad;

      }


      return {
         fetchBodas,
         tableColumns,
         perPage,
         currentPage,
         totalBodas,
         dataMeta,
         perPageOptions,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refBodasListTable,
         refetchData,
         getFecha,
         getCantidadHabitacionesReserva,
         exportarData,
         getHabitacionesContratadas
      }


   },
}
</script>