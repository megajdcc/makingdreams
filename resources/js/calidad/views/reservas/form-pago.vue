<template>
   <b-container fluid class="w-100">

      <banner-boda :boda="boda" />

      <b-row class="mt-2">
         <b-col cols="12" md="8">

            <b-card>
               <b-container fluid>
                  <b-row>
                     <b-col cols="12">
                        <h3 class="font-weight-bolder">Estado de cuenta de la Reserva</h3>
                     </b-col>
                  </b-row>
                  <b-row>
                     <b-col cols="12" md="8" class="my-1 justify-content-center d-flex justify-content-md-start">
                        <b-link class="brand-logo">
                           <img src="/storage/logotipo.png" alt="Logo" />
                        </b-link>
                     </b-col>

                     <b-col cols="12" md="4" class="d-flex align-items-center">
                        <h4 class="invoice-title my-0" style="font-weight:600">
                           Reserva
                           <span class="invoice-number">#{{ reserva.nro_reserva }}</span>
                        </h4>
                     </b-col>
                  </b-row>

                  <el-divider></el-divider>

                  <b-row class="row">
                     <div class="col-12 col-md-8">

                        <p class="mb-1">Invitado:</p>
                        <p>
                           {{ reserva.invitado }}
                        </p>
                        <b-link :href="`mailto:${reserva.email}`" target="_blank" class="d-block">{{ reserva.email }}
                        </b-link>
                        <b-link :href="`tel:${reserva.telefono}`" class="d-block">{{ reserva.telefono }}</b-link>
                        <p> ( {{ reserva.check_in | fecha }} al {{ reserva.check_out | fecha }} ) / {{ reserva.noches }}
                           - noches </p>
                        <p> Reserva realizada el día: {{ reserva.created_at | fecha }}</p>

                     </div>
                     <div class="col-12 col-md-4">
                        <p class="mb-1">Detalles de los pagos:</p>
                        <table border="0">
                           <tr>
                              <td>Total reserva:</td>
                              <td>{{ reserva.total_pagar | currency }} MXN</td>
                           </tr>
                           <tr>
                              <td>Total adeudo:</td>
                              <td>{{ reserva.total_pagar - saldoPagado() | currency }} MXN</td>
                           </tr>

                           <tr>
                              <td>Pagos realizados:</td>
                              <td>{{ reserva.pagos.length }}</td>
                           </tr>

                        </table>
                     </div>
                  </b-row>
                  <el-divider content-position="left">Habitaciones</el-divider>
                  <b-row>
                     <b-col cols="12">
                        <b-table ref="thabitaciones" :items="habitaciones" responsive :fields="tchabitaciones"
                           primary-key="id" :sort-by.sync="sortByhabitaciones"
                           empty-text="No se encontró ninguna reservación" :sort-desc.sync="isSortDirDescHabitaciones"
                           sticky-header="700px" :no-border-collapse="false">

                           <template #table-colgroup="scope">
                              <col v-for="field in scope.fields" :key="field.key" class="p-0"
                                 :style="{ width: field.key === 'show_details' ? '30px' : '180px' }">
                           </template>


                           <template #cell(show_details)="{item,detailsShowing,toggleDetails}">

                              <b-button @click="toggleDetails" size="sm" variant="text" class="d-flex text-nowrap">
                                 <feather-icon :icon="(detailsShowing) ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                                 <strong class="text-nowrap">{{item.habitacion}}</strong>
                              </b-button>

                           </template>

                           <template #row-details="{item}">
                              <b-card>
                                 <b-row class="mb-2">

                                    <b-col md="6" class="mb-1">
                                       <ul>
                                          <li> <span>Observación:{{item.observacion}}</span></li>
                                          <li>
                                             <p>Adultos:{{item.habitantes.adultos}}</p>
                                          </li>
                                          <ol>
                                             <li v-for="(habitante,u) in item.habitantes.adults" :key="u">
                                                <p>{{habitante.nombre}}</p>
                                             </li>
                                          </ol>
                                          <li>
                                             <p>Adolescentes:{{item.habitantes.adolescentes}}</p>
                                          </li>
                                          <ol>
                                             <li v-for="(habitante,u) in item.habitantes.jovenes" :key="u">
                                                <p>Nombre:{{habitante.nombre}} <br> Edad: {{habitante.edad}}</p>
                                             </li>
                                          </ol>

                                          <li>
                                             <span>Niños:{{item.habitantes.ninos}}</span>
                                          </li>

                                          <ol>
                                             <li v-for="(habitante,u) in item.habitantes.childs" :key="u">
                                                <p>Nombre:{{habitante.nombre}} <br> Edad: {{habitante.edad}}</p>
                                             </li>
                                          </ol>


                                          <li> <span>Bebés: {{item.habitantes.bebes}}</span> </li>
                                       </ul>

                                    </b-col>
                                 </b-row>




                              </b-card>
                           </template>



                           <template #cell(pnoche)="{item}">
                              <span class="text-nowrap">{{ item.pnoche | currency}} MXN</span>
                           </template>


                           <template #cell(monto)="{item}">
                              <span class="text-nowrap">{{ item.monto | currency}} MXN</span>
                           </template>


                           <template #cell(total_habitacion)="{item}">
                              <span class="text-nowrap">{{ item.total_habitacion | currency}} MXN</span>
                           </template>



                        </b-table>
                     </b-col>
                  </b-row>

                  <template v-if="reserva.cargos.length">
                     <el-divider content-position="left">Cargos adicionales por la boda</el-divider>
                     <b-row>
                        <b-col>
                           <table class="table table-sm table-hover thead-light">
                              <thead>
                                 <tr>
                                    <th>Tipo de cargo</th>
                                    <th>Monto por persona</th>
                                    <th>Monto pagar</th>
                                    <th>Nota</th>
                                 </tr>

                              </thead>
                              <tbody>
                                 <tr v-for="(cargo, i ) in reserva.cargos" :key="i">
                                    <td>{{ cargo.tipo.nombre }}</td>
                                    <td>{{ cargo.monto | currency }}</td>
                                    <td>{{ cargo.monto * reserva.habitaciones[0].pivot.habitantes.adultos | currency }}
                                    </td>
                                    <td> {{ cargo.nota }}</td>
                                 </tr>
                              </tbody>
                           </table>
                        </b-col>

                     </b-row>
                  </template>

                  <template v-if="reserva.cargos_adicionales.length">
                     <el-divider content-position="left">Cargos adicionales de la reserva</el-divider>
                     <b-row>
                        <b-col>
                           <table class="table table-sm table-hover thead-light">
                              <thead>
                                 <tr>
                                    <th>Concepto</th>
                                    <th>Monto</th>
                                 </tr>

                              </thead>
                              <tbody>
                                 <tr v-for="(cargo, i ) in reserva.cargos_adicionales" :key="i">
                                    <td>{{ cargo.concepto }}</td>
                                    <td>{{ cargo.monto | currency }}</td>
                                 </tr>
                              </tbody>
                           </table>
                        </b-col>

                     </b-row>
                  </template>


                  <b-row>
                     <b-col cols="12" class="d-flex justify-content-end">
                        <table border="0" style="width:250px; margin-right:1.5rem">
                           <tr>
                              <td>Total a pagar:</td>
                              <td class="text-right">{{ reserva.total_pagar | currency }} MXN</td>
                           </tr>
                           <tr>
                              <td>Total pagado:</td>
                              <td class="text-right">{{ saldoPagado() | currency }} MXN</td>
                           </tr>
                           <tr>
                              <td>Pendiente: </td>
                              <td class="text-right"><strong class="text-primary">{{ reserva.total_pagar - saldoPagado()
                              | currency }} MXN</strong></td>
                           </tr>
                        </table>
                     </b-col>
                  </b-row>

                  <b-row>
                     <el-divider content-position="left">Pagos realizados</el-divider>
                     <b-col cols="12">

                        <b-table ref="tpagos" :items="pagos" responsive :fields="tcpagos" primary-key="id"
                           :sort-by.sync="sortBypagos" empty-text="No se encontró ningún pago"
                           :sort-desc.sync="isSortDirDescPago" sticky-header="700px" :no-border-collapse="false">

                           <template #table-colgroup="scope">
                              <col v-for="field in scope.fields" :key="field.key" class="p-0" :title="field.key"
                                 :style="{ width: field.key === 'id' ? '30px !important' : '180px' }">
                           </template>


                           <template #cell(show_details)="{item,detailsShowing,toggleDetails}">

                              <b-button @click="toggleDetails" size="sm" variant="text" class="d-flex text-nowrap">
                                 <feather-icon :icon="(detailsShowing) ? 'ChevronUpIcon' : 'ChevronDownIcon'" />
                                 <strong class="text-nowrap">{{item.habitacion}}</strong>
                              </b-button>

                           </template>



                           <template #cell(forma_pago)="{item}">
                              <span class="text-nowrap">{{ item.forma_pago | forma_pago(item.metodo_pago) }}</span>
                           </template>


                           <template #cell(status)="{item}">
                              <span class="text-nowrap">{{ item.status | status_pago }}</span>
                           </template>

                           <template #cell(monto)="{item}">
                              <span class="text-nowrap">{{ item.monto | currency }} MXN</span>
                           </template>



                           <template #cell(comprobante)="{item}">
                              <b-link :href="`/storage/comprobantes/${item.comprobante}`" download
                                 v-if="item.forma_pago != 3 && item.forma_pago != 4">
                                 <feather-icon icon="DownloadIcon" size="18" />
                              </b-link>
                           </template>



                        </b-table>


                     </b-col>
                  </b-row>

                  <el-divider></el-divider>

                  <b-row>
                     <b-col cols="12" md="6" v-if="!reserva.pagada">

                        <b-form-group label="Elije el método de pago que te convenga ? ">
                           <el-select @change="verificarMetodo" v-model="metodo_de_pago" placeholder="Seleccione"
                              class="w-100" filterable>
                              <el-option v-for="(metodo, i ) in metodosPago" :key="i" :value="metodo.id"
                                 :label="metodo.label"></el-option>
                           </el-select>
                        </b-form-group>

                     </b-col>

                     <b-col cols="12" class="col-12" v-else>
                        <b-alert variant="success" show>
                           <h4 class="alert-heading">
                              No hay pagos pendientes
                           </h4>

                        </b-alert>
                     </b-col>
                  </b-row>
               </b-container>
            </b-card>

            <b-card v-if="metodo_de_pago == 2">
               <b-container fluid>
                  <b-row>
                     <b-col cols="12" md="6">
                        <b-row>
                           <b-col>
                              <h2>Transferencia Bancaria</h2>
                           </b-col>
                        </b-row>
                        <b-row>
                           <b-col cols="12">
                              <strong>Pasos</strong>
                              <ol>
                                 <li>Elija una cuenta bancaria y vaya al sistema del banco para que haga la
                                    transferencia</li>
                                 <li>Proceda a cargar los datos de transferencia que se le solicitan y que son
                                    necesarios</li>
                                 <li>Envíe la notificación de consignación bancaria</li>
                              </ol>

                              <p class="text-justify">Una vez recibamos, los datos y el comprobante que le acrediten el
                                 pago, procederemos a validar y cotejar dicha información. Finalizada la verificación se
                                 procederá a aprobar el pago. Normalmente no mas de media hora, nos tardamos en
                                 verificar la transacción. Se le notificará por correo electrónico el estatus de la
                                 consignación.</p>
                           </b-col>

                           <b-col cols="12">
                              <el-divider content-position="left">Datos bancarios disponibles</el-divider>
                              <el-collapse accordion>
                                 <el-collapse-item v-for="(cuenta,i) in cuentas" :name="i" :key="i">

                                    <template slot="title">
                                       <span class="fas fa-money-check mr-2"></span><strong
                                          v-text="cuenta.nombre"></strong>
                                    </template>

                                    <div class="w-100">
                                       <table class="table table-hover table-sm table-responsive w-100">
                                          <tbody>
                                             <tr>
                                                <td>Banco:</td>
                                                <td>{{ cuenta.nombre }}</td>
                                             </tr>
                                             <tr>
                                                <td>Beneficiario:</td>
                                                <td>{{ cuenta.beneficiario }}</td>
                                             </tr>

                                             <tr>
                                                <td>Número de cuenta:</td>
                                                <td>{{ cuenta.cuenta }}</td>
                                             </tr>

                                             <tr>
                                                <td>Clabe:</td>
                                                <td>{{ cuenta.clabe }}</td>
                                             </tr>

                                          </tbody>


                                       </table>
                                    </div>

                                 </el-collapse-item>
                              </el-collapse>
                           </b-col>
                        </b-row>
                     </b-col>

                     <b-col cols="12" md="6">
                        <validation-observer ref="validateFormTransferencia" #default="{handleSubmit}">
                           <b-form @submit.prevent="handleSubmit(enviarFormulario)">

                              <b-form-group label="Comprobante del pago"
                                 description="Cargue un archivo que respalde el comprobante">

                                 <validation-provider rules="required" name="Comprobante" #default="{errors}">

                                    <b-form-file v-model="formulario.comprobante" accept="*" size="sm"
                                       :state="errors.length > 0 ? false : null" />

                                    <span class="text-danger">{{ errors[0] }}</span>

                                 </validation-provider>

                              </b-form-group>


                              <b-form-group label="Banco"
                                 description="Seleccione el banco en donde realizó la transferencia">

                                 <validation-provider #default="{errors}" name="banco" rules="required">
                                    <el-select v-model="formulario.banco_id" size="small" class="w-100" filterable>
                                       <el-option v-for="(banco,i) in cuentas" :key="i" :value="banco.id"
                                          :label="`${banco.nombre} - ${banco.cuenta}`"></el-option>
                                    </el-select>
                                    <span class="text-danger">{{ errors[0] }}</span>

                                 </validation-provider>

                              </b-form-group>

                              <b-form-group label="Nro de Referencia"
                                 description="El Número de referencia, es el número de control que el banco asocia a la transacción, el mismo sirve para comprobar la operación">

                                 <validation-provider rules="required" name="Nro de referencia" #default="{errors}">
                                    <b-form-input v-model="formulario.nro_referencia"
                                       :state="errors.length > 0 ? false : null" placeholder="Nro de comprobante"
                                       size="sm" />

                                    <span class="text-danger">{{ errors[0] }}</span>
                                 </validation-provider>

                              </b-form-group>

                              <b-form-group label-for="monto" description="El monto que desea acreditar ">
                                 <template #label>
                                    Monto: {{ formulario.monto | currency }} MXN <span class="text-danger">*</span>
                                 </template>

                                 <currency-input @change="formulario.monto= $event" :value="Number(formulario.monto)"
                                    input-class="form-control form-control-sm" :options="{currency:'MXN'}" />


                              </b-form-group>

                              <b-button variant="primary" type="submit" v-loading="loading">
                                 <feather-icon icon="SendIcon" /> Enviar
                              </b-button>
                           </b-form>

                        </validation-observer>
                     </b-col>
                  </b-row>
               </b-container>
            </b-card>

            <b-card v-if="metodo_de_pago == 1">
               <b-container fluid>
                  <b-row>
                     <b-col cols="12">
                        <h2>Pagos en Agencias</h2>
                     </b-col>
                  </b-row>
                  <b-row>
                     <b-col cols="12">
                        <strong>Pasos</strong>
                        <ol>
                           <li>Acercate a una de nuestras oficinas disponibles en horarios de atención </li>
                           <li>Anuncia que quieres pagar una reservación</li>
                           <li>Buscarán tu reserva en el sistema y cargaran tu pago</li>
                        </ol>

                        <p class="text-justify">Los pagos acreditados en agencias son aprobados de inmediatos</p>
                     </b-col>

                     <b-col cols="12">
                        <el-divider content-position="left">Agencias disponibles</el-divider>
                        <el-collapse accordion>
                           <el-collapse-item v-for="(agencia,i) in agencias" :name="i" :key="i">

                              <template slot="title">
                                 <span class="fas fa-map mr-2"></span><strong v-text="agencia.nombre"></strong>
                              </template>

                              <div class="w-100">
                                 <table class="table table-hover table-sm table-responsive w-100">
                                    <tbody>
                                       <tr>
                                          <td>Responsable:</td>
                                          <td>{{ agencia.responsable.nombre+ ' '+agencia.responsable.apellido }}</td>
                                       </tr>
                                       <tr>
                                          <td>Teléfono:</td>
                                          <td>{{ agencia.telefono }}</td>
                                       </tr>

                                       <tr v-if="agencia.ciudad">
                                          <td>dirección:</td>
                                          <td>{{ agencia.direccion +' - ' +agencia.ciudad.ciudad +' ' +
                                          agencia.estado.estado }}</td>
                                       </tr>



                                    </tbody>


                                 </table>
                              </div>

                           </el-collapse-item>
                        </el-collapse>
                     </b-col>
                  </b-row>
               </b-container>
            </b-card>


            <b-card v-if="metodo_de_pago == 4" v-loading="loading">
               <b-container fluid>

                  <b-row>
                     <b-col cols="12">
                        <h2>Pagos con tarjetas de crédito o débito.</h2>
                        <p>Puede pagar el monto que desee, antes de colocar los datos de su tarjeta, verifique el monto
                           a pagar. </p>

                        <p><Strong>Importante:</Strong>Conekta cobra una comisión por transacción del 3.4%(sobre el
                           monto que establezca) + 3MXN + IVA.</p>

                        <p>Es por ello que al monto que establezca, nosotros le sumamos la comisión que corresponda.</p>
                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col cols="12" md="6">
                        <b-form-group label-for="monto" description="El monto que desea acreditar ">

                           <template #label>
                              Monto: {{ formulario.monto | currency }} MXN <br> Comisión {{ ((formulario.monto * 0.034)
                              + 3) * 1.16 | currency }} MXN <br> Total a debitar {{ (((formulario.monto * 0.034) +
                              3) * 1.16) + formulario.monto | currency }} MXN<span class="text-danger">*</span>
                           </template>

                           <currency-input @change="formulario.monto= $event" :value="Number(formulario.monto)"
                              input-class="form-control form-control-sm" :options="{currency:'MXN'}" />


                        </b-form-group>
                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col id="formConekta" style="height: 470px;">

                     </b-col>
                  </b-row>
               </b-container>
            </b-card>

            <b-card v-if="metodo_de_pago == 3" v-loading="loading">
               <b-container fluid>

                  <b-row>
                     <b-col cols="12" md="6">
                        <b-form-group label-for="monto" description="El monto que desea acreditar ">

                           <template #label>
                              Monto: {{ formulario.monto | currency }} MXN <span class="text-danger">*</span>
                           </template>

                           <currency-input @change="formulario.monto= $event" :value="Number(formulario.monto)"
                              input-class="form-control form-control-sm mb-2" :options="{currency:'MXN'}" />


                           <PayPal :amount="String(formulario.monto)" currency="MXN" :client="credentials"
                              :env="credentials.env" @payment-completed="pagoEnviado" />

                        </b-form-group>
                     </b-col>
                  </b-row>

                  <b-row>
                     <div class="col-12" id="formConekta" style="height: 470px;">

                     </div>
                  </b-row>
               </b-container>
            </b-card>

         </b-col>
         <b-col cols="12" md="4">
            <aside-boda :boda="boda" />
         </b-col>

      </b-row>

   </b-container>

</template>

<script>
import {ref,onMounted,watch,computed } from 'vue';

import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
import store  from '@/store'
import {Notification } from 'element-ui';
import {primerNombre} from '@core/utils/filter.js';
import Ripple from 'vue-ripple-directive'
import 'animate.css';
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import CurrencyInput from 'components/CurrencyInput';
import {required} from '@validations';
import 'swiper/css/swiper.css'

import PayPal from 'vue-paypal-checkout'

import useBoda from '@core/utils/useBoda'


import {
   BLink,
   BAvatar,
   BAvatarGroup,
   VBPopover,
   VBTooltip,
   BImg,
   BCard,
   BCardBody,
   BButton,
   BCol,
   BRow,
   BContainer,
   BFormGroup,
   BFormInput,
   BFormFile,
   BForm,
   BAlert,
   BTable,

} from 'bootstrap-vue';

export default {

   props:['id'],

   components:{
      BLink,
      BAvatar,
      BAvatarGroup,
      BImg,
      BCard,
      BCardBody,
      BButton,
      BCol,BRow,
      BFormGroup,
      ValidationObserver,
      ValidationProvider,
      CurrencyInput,
      BFormInput,
      BFormFile,
      BForm,
      BAlert,
      BTable,
      BContainer,
      PayPal,
      BannerBoda:() => import('components/BannerBoda'),
      AsideBoda:() => import('components/AsideBoda')
   },

   directives:{
      'b-popover' : VBPopover,
      'b-tooltip' : VBTooltip,
      Ripple
   },

   setup(props){
      const metodo_de_pago = ref(null);
      const cuentas = ref([]);
      const validateFormTransferencia = ref(null);
      const thabitaciones = ref(null)
      const tchabitaciones = ref([
           { key: 'show_details', sortable: false, label: '#', width: '50px', stickyColumn: true, isRowHeader: true, },
            { key: 'pax', sortable: false, label: "Pax" },
            { key: 'noches', sortable: false, label: "noches" },
            { key: 'pnoche', sortable: false, label: "Precio por noche " },
            { key: 'monto', sortable: false, label: "Monto" },
            { key: 'total_habitacion', label:"Total habitación", sortable:false,stickyColumn: false },
      ])

      const tcpagos = ref([
          { key: 'id', sortable: false, label: '#', width: '50px'},
            { key: 'forma_pago', sortable: false, label: "Forma de pago" },
            { key: 'nro_referencia', sortable: false, label: "Nro de referencia" },
             { key: 'status', sortable: false, label: "Estatus" },
            { key: 'monto', sortable: false, label: "Monto" },
            { key: 'comprobante', label:"Comprobante", sortable:false,stickyColumn: false },
      ])

      const sortByhabitaciones = ref('') 
      const sortBypagos = ref('')
      const isSortDirDescHabitaciones = ref(false)
      const isSortDirDescPago = ref(false)
      const fetchHabitaciones = ref([]);

      const boda = computed(() => store.getters['boda/draft'])

      const agencias = ref([]);

      const reserva = ref({
         id:null,
         invitado:'',
         nro_reserva:null,
         email:'',
         telefono:null,
         pagada:false,
         total_pagar:0,
         boda_id:null,
         facturacion:false,
         datos_facturacion:{},
         aprobada:null,
         check_in:null,
         check_out:null,
         noches:0,
         boda:null,
         habitaciones:[],
         pagos:[],
         cargos:[]
      })

      const formulario = ref({
           id:null,
            forma_pago:1, // 1 => Transferencia, 2 => 'Agencia' , 3 => 'Paypal', 4  => 'Conekta',
            status:0, // 0 => por comprobar , 1 => comprobada, 2 => aprobada, 3 => rechazada
            comprobante:null,
            nro_referencia:'',
            monto:0,
            reserva_id:props.id,
            banco_id:null,
            agencia_id:null,
            agencia:null,
            banco:null,
            reserva:null,
            
      })

      const checkout_id = ref('');
      const token_id = ref('');
      const pagos = ref([]);

      const conekta = ref(false)

      const paypal = ref({
         paypal_id:null,
         active:false,
         production:false
      })

      const credentials = ref({
         sandbox:null,
         production:null,
         env:'sandbox'
      })

      const cargarForm = () => {

         store.dispatch('boda/cargarBodaPorReserva',props.id).then((data) => {

            reserva.value                   = data.reserva;
            formulario.value.nro_referencia = reserva.value.nro_reserva;
            agencias.value                  = data.agencias;
            cuentas.value                   = data.cuentas
            conekta.value = data.conekta
            paypal.value = data.paypal

            if(paypal.value.active){
               credentials.value.sandbox = paypal.value.paypal_id
               credentials.value.production = paypal.value.paypal_id
               credentials.value.env = paypal.value.production ? 'production' : 'sandbox'

               metodosPago.push({
                     id:3,
                     label:'Paypal'
               })
            }

            if(conekta.value){
               metodosPago.push({
                  id:4,
                  label:'Tarjetas Crédito o Débido'
                  })
            }

            if(data.boda.cobranza_agencia){
               metodosPago.push({
                  id:1,
                  label:'Nuestras agencias'
               })
            }
            if(reserva.value.habitaciones.length > 0 ){
            
               habitaciones.value = reserva.value.habitaciones.map(val => {
                  let monto = val.pivot.monto;
                 
                  let pax = val.pivot.habitantes.adultos + val.pivot.habitantes.ninos + val.pivot.habitantes.adolescentes;
                  return {
                     habitacion:val.nombre,
                     pax:pax,
                     monto:monto,
                     total_habitacion:val.pivot.monto,
                     noches:reserva.value.noches,
                     pnoche:monto / reserva.value.noches,
                     habitantes:val.pivot.habitantes,
                     observacion:val.pivot.observacion
                  }


               })

               pagos.value = reserva.value.pagos.map((val,i)=> {
                  return {
                     id:i+1,
                     forma_pago:val.forma_pago,
                     status:val.status,
                     nro_referencia:val.nro_referencia,
                     monto:val.monto,
                     comprobante:val.comprobante,
                     fecha_pago:val.created_at,
                     metodo_pago:val.metodo_pago
                  };

               })


            }


         }).catch(e => {
            console.log(e);
         })


         fetch('/api/auth/conekta')
         .then(response => response.json())
         .then((data) => {

          
            const { checkout, id } = data
            if(id){
               checkout_id.value = checkout.id
               token_id.value = id
            }
           
         });

      }

      const habitaciones = ref([]);

      const metodosPago = ([ 
               {
                  id:2,
                  label:'Transferencia Bancaria',
               },
               ])
      onMounted(() => {
         
         cargarForm();


      })
      watch(metodo_de_pago,(val) => {
         if(val == 4){
           
         }
      })


      const printInvoice = () => {
         window.print()
      }

      const saldoPagado = () => {
         let monto = 0 
         
         if(reserva.value.pagos.length > 0){
            
            reserva.value.pagos.forEach(val => {
               if(val.status == 2){
                   monto+=Number(val.monto);
               }
              
            })            
         }

         return monto;

      }  

      const clearFormulario = () => {
         formulario.value = { 
            id:null,
            forma_pago:1, // 1 => Transferencia, 2 => 'Agencia' , 3 => 'Paypal', 4  => 'Conekta'
            status:0, // 0 => por comprobar , 1 => comprobada, 2 => aprobada, 3 => rechazada
            comprobante:null,
            nro_referencia:'',
            monto:0,
            reserva_id:props.id,
            banco_id:null,
            agencia_id:null,
            agencia:null,
            banco:null,
            reserva:null
            };
      }

      
      const enviarFormulario = () => {

         validateFormTransferencia.value.validate().then(success => {

            if(success){
               

               store.dispatch('pago/cargarPago',formulario.value).then(respon => {

                  if(respon.data.result){
                     // swal({
                     // title: 'Gracias por tu pago!',
                     // text: 'Te estaremos informando cuando sea aprobado!',
                     // icon: 'success',
                     // customClass: {
                     //    confirmButton: 'btn btn-primary',
                     // },

                     // showClass: {
                     //    popup: 'animate__animated animate__tada',
                     // },

                     // buttonsStyling: false,
                     // })

                     Notification.success('Gracias por tu pago, te estaremos informando cuando sea aprobado');

                    
                     clearFormulario();
                     metodo_de_pago.value = null;



                  }else{
                     Notification.info('No se pudo cargar el pago, inténtelo de nuevo mas tarde.')
                  }
                  
               }).catch(e => {
                  console.log(e)
               }).then(() => {
               })
            }
         })

      }

      const verificarMetodo = (val) => {
         if(val == 4){
         
            formulario.value.monto = reserva.value.total_pagar - saldoPagado();

            setTimeout(() => {
               window.ConektaCheckoutComponents.Card({
                  targetIFrame: "#formConekta",
                  allowTokenization: true, 
                  checkoutRequestId: checkout_id.value,
                  publicKey: "key_OsW8LuyVL6ESxfQWduVKzEw", 
                  options: {
                  styles: {
            
                     inputType: 'rounded',
            // buttonType modifica el diseño de los campos de llenado de información del  Web Checkout Tokenizer
            //        buttonType: 'basic' // 'basic' | 'rounded' | 'sharp'
                     buttonType: 'rounded',
            //Elemento que personaliza el borde de color de los elementos            
                     states: {
                        empty: {
                        borderColor: '#FFAA00' // Código de color hexadecimal para campos vacíos
                        },
                        invalid: {
                        borderColor: '#FF00E0' // Código de color hexadecimal para campos inválidos
                        },
                        valid: {
                        borderColor: '#0079c1' // Código de color hexadecimal para campos llenos y válidos
                        }
                     }
                  },
                  languaje: 'es', // 'es' Español | 'en' Ingles
            //Elemento que personaliza el botón que finzaliza el guardado y tokenización de la tarjeta
                  button: {
                     colorText: '#ffffff', // Código de color hexadecimal para el color de las palabrás en el botón de: Alta de Tarjeta | Add Card
                     text:'Agregar tarjeta y Pagar',
                     //text: 'Agregar Tarjeta***', //Nombre de la acción en el botón ***Se puede personalizar
                     backgroundColor: '#606266' // Código de color hexadecimal para el color del botón de: Alta de Tarjeta | Add Card
                  },
            //Elemento que personaliza el diseño del iframe
                  iframe: {
                     colorText: '#65A39B',  // Código de color hexadecimal para el color de la letra de todos los campos a llenar
                     backgroundColor: '#FFFFFF' // Código de color hexadecimal para el fondo del iframe, generalmente es blanco.
                  }
                  },
                  onCreateTokenSucceeded: function(token) {
                   
                     store.dispatch('pago/ProcesarPagoTarjeta',{
                        reserva:reserva.value.id,
                        monto:formulario.value.monto,
                        token_id:token.id
                     }).then(respon => {
                        //  console.log(respon.data);
                        if(respon.data.result){
                          
                           Notification.success(respon.data.mensaje);
                           clearFormulario();
                           metodo_de_pago.value = null;
                           $('#formConekta').empty();

                           cargarForm();

                        }else{
                           Notification.info(respon.data.mensaje);
                           Notification.info('Puede Inténtarlo de nuevo con otra tarjeta, o elejir otro método de pago...');
                           cargarForm();
                        }

                     }).catch(e => {
                        console.log(e)
                     }).then(() => {
                     })
                   
                  },
                  onCreateTokenError: function(error) {
                   cargarForm();
                  }
               })
            }, 300);
            
         }else{
            $('#formConekta').empty()
         }

      }

      const pagoEnviado = (val) => {
         
         // console.log(val)
         if(val.state == "approved"){
            formulario.value.forma_pago = 3
            formulario.value.status = 2
            formulario.value.nro_referencia = val.payer.payer_info.payer_id

               store.dispatch('pago/cargarPago',formulario.value).then(respon => {

                  if(respon.data.result){

                     Notification.success('Gracias por tu pago, los pagos con PayPal quedan aprobado automáticamente.');
                     clearFormulario();
                     metodo_de_pago.value = null;
                     cargarForm()

                  }else{
                     Notification.info('No se pudo cargar el pago, inténtelo de nuevo mas tarde.')
                  }
                  
               }).catch(e => {
                  console.log(e)
               }).then(() => {
               })
         }else{
            Notification.info({
               message:'El Pago no pudo ser procesado inténtelo de nuevo mas tarde',
               position:'bottom-right'
            })
         }

      }


      return {

         pagoEnviado,
        
         boda,
         formulario,
         primerNombre,
         printInvoice,
         reserva,
         saldoPagado,
         habitaciones,
         agencias,
         metodosPago,
         metodo_de_pago,
         cuentas,
         required,
         loading:computed(() => store.state.loading),
         enviarFormulario,
         validateFormTransferencia,
         checkout_id,
         token_id,
         verificarMetodo,
         // table de habitaciones
         thabitaciones,
         tchabitaciones,
         sortByhabitaciones,
         isSortDirDescHabitaciones,
         fetchHabitaciones,
         //Table de pagos
         pagos,
         tcpagos,
         sortBypagos,
         isSortDirDescPago,
         conekta,
         paypal,
         credentials
      };
   }


}

</script>



<style lang="scss">

p{
   // font-size:14pt;
   // line-height: 12px;
   margin:0px;

}

.header{
   background-image: url('/storage/lazo_matrimonial.jpg');
   background-position: center center;
   background-size: cover;
   background-repeat: no-repeat;
   background-attachment: fixed;
   height: 400px;
   display: flex;
   justify-content: center;
   align-items: center;
   border-bottom: 10px solid #b4975a;


   &::after{
      content: '';
      background-color: rgba(0,0,0,0.4);
      position: absolute;
      width: 100% !important;
      height: 400px !important;
      padding: 0px;
      margin: 0px;
   }

   .table-header{
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

.header-table{
   width:100%;
   flex: 0 1 21px;
   border-bottom: 1px solid white;
   .li-1{
      border-right: 1px solid white;
      flex:0 1 30px;
   }
   .lc-1{
      flex:1 1 auto;
   }
   .lr-1{
      border-left: 1px solid white;
      flex:0 1 30px;
   }

}

.footer-table{
   width:100%;
   flex: 0 1 21px;
   border-top: 1px solid white;
   .li-1{
     
      flex:0 1 30px;
   }
   .lc-1{
      flex:1 1 auto;
   }
   .lr-1{
      // border-left: 1px solid white;
      flex:0 1 30px;
   }

}


.center-t{
   flex: 1 1 auto;
   display: flex;
   justify-content: center;
   align-items: center;
}

.ft1{
   // background-image:url('/storage/f1.svg');
    background-color: #b4975a;
   position: absolute;
   top: 0px;
   right:10px;
   height: 100px;
   width:80px;
   z-index: 301;
}

.el-step__icon {
   background-color:#f8f8f8 !important;
}
.card-habitacion img{
   width: auto;
   max-width:334px;
   height: 250px;
   object-fit: cover;
   object-position: center;
}
@media (min-width:540px){
    .table-header{
      width: 400px !important;
   }
}

@media (min-width:720px){
    .table-header{
      width: 500px !important;
   }

   .header{

      height: 320px;


      &::after{
         height: 320px !important;
    
      }
   }


}


</style>
