<template>
   <b-container fluid>
      <b-row>
         <!-- Brand logo-->
         <b-link class="brand-logo" style="position: absolute;
            left: 10px;
            top: 10px;
            z-index: 3000;" :to="{name:'login'}">
            <img src="/storage/logotipo.png" alt="Logo"  />
         </b-link>
      
         <b-col cols="12" class="header px-0 d-flex  justify-content-center">
            <section class="w-50" style="z-index:1000 !important">
      
               <b-input-group>
                  <b-form-input v-model="search" type="search" placeholder="Buscar por número de container..." class="w-50" />
                  <template #append>
                     <b-button variant="primary" title="buscar" v-b-tooltip.hover @click="buscar">
                        <feather-icon icon="SearchIcon" />
                        Buscar
                     </b-button>
                  </template>
      
               </b-input-group>
      
            </section>
      
         </b-col>
      
      </b-row>

      <b-row class="mt-1">
         <b-col cols="12">
            <b-card no-body class="mb-0" v-show="false">
            
               <div class="m-2">
                  <!-- Table Top -->
                  <b-row>
                     <!-- Per Page -->
            
                     <b-col cols="12" class="d-flex justify-content-end">
            
                        <b-button-group size="sm">
                        
                           <b-button variant="dark" title="Descargar Registros" v-b-tooltip @click="descargarExcel">
                              <feather-icon icon="DownloadIcon" />
                              Descargar
                           </b-button>
                        
                        </b-button-group>
            
                     </b-col>
            
                  </b-row>
            
               </div>
              
            
            </b-card>

            <div class="mt-1">
               <b-card v-for="(entrega,i) in entregas" :key="i" class="p-0" body-class="p-0">
                  <b-card-header header-bg-variant="primary">
                     <h2 class="font-weight-bolder text-white">{{ entrega.contenedor.contenedor.numero }} - {{ getStatus(entrega.status) }}</h2>
                  </b-card-header>

                  <b-card-body class="mt-1">
                     <b-container fluid>
                        <b-row v-if="entrega.viajes.length">
                           <b-col cols="12" md="6" v-for="(viaje,i) in entrega.viajes" :key="i">
                              <h4 > Fecha de {{ viaje.tipo_viaje == 1 ? 'Sacado' : 'Devolución' }}: <strong>{{ viaje.hora ? `${viaje.fecha} ${viaje.hora}` : viaje.fecha | fecha(viaje.hora ? 'LLL' : 'LL') }}</strong></h4>
                           </b-col>
                        </b-row>
                        <hr>
                        <b-row>

                           <b-col cols="12" class="d-flex flex-column">
                              <h3>Estatus creados</h3>
                              <vue-perfect-scrollbar class="scroll-area w-100" :settings="{maxScrollbarLength:700}">
                              <app-timeline>
                              
                                 <app-timeline-item icon="MapPinIcon" v-for="(estatus, r ) in entrega.statuses" :key="r">
                              
                                    <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                                       <h6>
                                          <b-badge variant="primary">{{ estatus.situacion | situacion }}</b-badge>
                                       </h6>
                                       <small class="text-muted">{{ estatus.created_at | fecha('LLL') }}</small>
                                    </div>
                              
                                    <p>{{ estatus.comentario }}</p>
                              
                                    <b-media v-if="estatus.usuario">
                                       <template #aside>
                                          <b-avatar :src="`/storage/img-perfil/${ estatus.usuario.avatar }`" />
                                       </template>
                                       <h6>{{ estatus.usuario.nombre }} {{ estatus.usuario.apellido }}</h6>
                                       <p>{{ estatus.usuario.rol.nombre }}</p>
                                    </b-media>
                              
                                 </app-timeline-item>
                              </app-timeline>
                              </vue-perfect-scrollbar>
                           </b-col>

                        </b-row>
                     </b-container>

                  </b-card-body>
               </b-card>
            </div>

         </b-col>
      </b-row>
   </b-container>
  
</template>

<script>

import xlsx from 'xlsx';

import {
   BCard,
   BCardTitle,
   BCardHeader,
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
   BLink,
   VBTooltip,
   BContainer,
   BSidebar,
   BForm,
   BFormGroup,
   BFormInvalidFeedback,
   BCardBody,

} from 'bootstrap-vue'
import {ref,computed} from 'vue'
import useSearchContainerList from './useSearchContainerList.js'
import store from '@/store'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { getStatus } from '@core/utils/utils'



export default {

   components:{
      BCard,
      BCardHeader,
      BCardBody,
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
      BLink,
      VBTooltip,
      BContainer,
      BSidebar,
      BForm,
      BFormGroup,
      BFormInvalidFeedback,
      AppTimeline,
      AppTimelineItem,
      VuePerfectScrollbar,
      BCardTitle,


   },

   directives:{
      'b-tooltip':VBTooltip
   }, 
   
   setup() {

         const {
            total,
            refetchData,
            fetchData,
            estatus,
            cliente_id,
            entregas,
            search,
            estatusOptions
         } = useSearchContainerList();

         const buscar = () => {
            refetchData()
         }

         const descargarExcel = () => {

         let dataExport = entregas.value.map((val) => {

            let fecha_sacado = 'Sin definir'
            let chofer = 'Sin definir'
            let chofer_trae = 'Sin definir'
            let fecha_devuelto = 'Sin definir'


            if(val.viajes.length){

               let viaje = val.viajes.find(v => v.tipo_viaje == 1)

               if(viaje != undefined){
                
                  fecha_sacado = viaje.fecha
                  chofer = viaje.chofer ? viaje.nombre +' '+viaje.chofer.apellido : 'Sin definir'
               
               }


               const traida = val.viajes.find(v => v.tipo_viaje == 2)

               if (traida != undefined) {

                  fecha_devuelto = traida.fecha
                  chofer_trae = traida.chofer ? traida.nombre + ' ' + traida.chofer.apellido : 'Sin definir'

               }


            }

            return {
               'Entrega Nro': val.id,
               'LLegada':val.contenedor.atraque.llegada,
               'Status':getStatus(val.status),
               'Barco':val.contenedor.atraque.barco.nombre,
               'Viaje':val.contenedor.atraque.viaje,
               'Seal':val.contenedor.seal,
               'Demora':val.contenedor.fecha_demora,
               'Contenedor': val.contenedor.contenedor.numero,
               'Fecha Sacado': fecha_sacado,
               'Tipo carga' :val.contenedor.tipo_carga,
               'Fecha entrega':val.cita ? val.cita.fecha : 'Sin definir',
               'Cliente':val.compania.nombre,
               'Pueblo':val.destino.destino,
               'Chofer': chofer,
               'Fecha de Dev': fecha_devuelto,
               'Chofer devuelve': chofer_trae,
               'PO':val.informacion_adicional ? val.informacion_adicional.po : 'Sin definir',
               'Sales Order': val.informacion_adicional ? val.informacion_adicional.sales_order : 'Sin definir',
               'Invoice Nro': val.informacion_adicional ? val.informacion_adicional.invoice : 'Sin definir',
               'Shipment': val.informacion_adicional ? val.informacion_adicional.shipment : 'Sin definir',
               'Delivery':val.orden ? val.orden.numero : 'Sin definir'
            }

         })



         let data = xlsx.utils.json_to_sheet(dataExport)
         // console.log(data);
         // data.Cells["Adultos"].AutoFitColumns();
         // var ws = xlsx.utils.aoa_to_sheet(data);
         // console.log(ws);
         // data.Cells['a1:l50'].AutoFitColumns();

         var wscols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
         ];

         data['!cols'] = wscols;

         const workbook = xlsx.utils.book_new()

         const filename = 'Entregas'
         xlsx.utils.book_append_sheet(workbook, data, filename)
         xlsx.writeFile(workbook, `${filename}.xlsx`)

         }


         return {
            total,
            refetchData,
            fetchData,
            estatus,
            cliente_id,
            entregas,
            search,
            buscar,
            descargarExcel,
            getStatus,
            loading:computed(() => store.state.loading)
         }
   },
}
</script>
<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';

.scroll-area {
   position: relative;
   margin: auto;
   width: 400px;
   height: 300px;
}

.content-toggle-table {

   color: black !important;

   td,
   h3,
   h6,
   small {
      color: black !important;
   }



}
</style>

<style lang="scss">
.header {
   background-image: url('/storage/container.jpg');
   background-position: center 300% !important;
   background-size: cover;
   background-repeat: no-repeat;
   background-attachment: fixed;
   height: 400px;
   display: flex;
   justify-content: center;
   align-items: center;
   border-bottom: 10px solid #a03bb3;


   &::after {
      content: '';
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      width: 100% !important;
      height: 400px !important;
      padding: 0px;
      margin: 0px;
   }

   .table-header {
      width: 320px;
      height: 200px;
      border: 2px solid white;
      z-index: 900 !important;
   }

}

.el-rate__icon {
   margin-right: 6px;
   font-size: 20pt !important;
}

.header-table {
   width: 100%;
   flex: 0 1 21px;
   border-bottom: 1px solid white;

   .li-1 {
      border-right: 1px solid white;
      flex: 0 1 30px;
   }

   .lc-1 {
      flex: 1 1 auto;
   }

   .lr-1 {
      border-left: 1px solid white;
      flex: 0 1 30px;
   }

}

.footer-table {
   width: 100%;
   flex: 0 1 21px;
   border-top: 1px solid white;

   .li-1 {

      flex: 0 1 30px;
   }

   .lc-1 {
      flex: 1 1 auto;
   }

   .lr-1 {
      // border-left: 1px solid white;
      flex: 0 1 30px;
   }

}


.center-t {
   flex: 1 1 auto;
   display: flex;
   justify-content: center;
   align-items: center;
}

.ft1 {
   // background-image:url('/storage/f1.svg');
   background-color: #a03bb3;
   position: absolute;
   top: 0px;
   right: 10px;
   height: 100px;
   width: 80px;
   z-index: 301;
}

.el-step__icon {
   background-color: #f8f8f8 !important;
}

.card-habitacion img {
   width: auto;
   max-width: 334px;
   height: 250px;
   object-fit: cover;
   object-position: center;
}

@media (min-width:540px) {
   .table-header {
      width: 400px !important;
   }
}

@media (min-width:720px) {
   .table-header {
      width: 500px !important;
   }

   .header {

      height: 320px;


      &::after {
         height: 320px !important;

      }
   }


}


.endRange,
.startRange {
   background: #a03bb3 !important;
   box-shadow: none !important;
   border-color: #a03bb3 !important;
}

.event {
   position: absolute;
   color: #db2609;
   font-size: 10pt;
   left: 0px;
   right: 0px;
   //  &::before{
   //  content:"\f004",
   //  background: #bb1717;

   //  }
}

.event.busy {
   background: #f64747;
}
</style>

