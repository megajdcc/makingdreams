<template>
   <section class="invoice-add-wrapper">
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-row class="invoice-add">
            
               <b-col cols="12" xl="9" md="8">
                  <b-card no-body class="invoice-preview-card">
                     <!-- Header -->
                     <b-card-body class="invoice-padding pb-0">

                        <b-container fluid>
                           <b-row>
                              <b-col cols="12" md="6">
                                 <!-- Header: Left Content -->
                                    <div class="logo-wrapper justify-content-start align-items-center">
                                       <b-link class="brand-logo ">
                                          <img src="/storage/logo.png" alt="RDSC" style="height:100px !important; width:auto !important">
                                       </b-link>
                                    </div>
                                    <b-card-text class="mb-25">
                                       PMB # 529 HC-01 Box 29030 <br>
                                       Caguas PR, 00725-8900 <br>
                                       Tel. 787-789-9264 / 787-720-0407 <br>
                                       Fax. 787-790-7742
                                    </b-card-text>
                                    
                                  

                                    <el-divider></el-divider>

                                    <h4>Facturado a:</h4>
                                    
                                    <b-card-text class="mb-25 font-weight-bolder">
                                       {{ compania.id ? compania.nombre : 'Sin definir' }}
                                    </b-card-text>

                                    <b-form-group>
                                       <template #label>
                                          <!-- Dirección Facturación: <span class="text-danger">*</span> -->
                                       </template>

                                       <validation-provider name="direccion_facturacion" rules="required" #default="{errors,valid}">
                                          <b-form-textarea v-model="formulario.direccion_facturacion" :state="valid" :rows="2" />
                                          
                                             <b-form-invalid-feedback :state="valid">
                                                {{ errors[0] }}
                                             </b-form-invalid-feedback>
                                       </validation-provider>
                                    </b-form-group>
                              </b-col>   

                              <b-col cols="12" md="6">
                                 <!-- Header: Right Content -->
                                 <div class="invoice-number-date mt-md-0 mt-2">
                                    <div class="d-flex align-items-center justify-content-md-end mb-1">
                                 
                                       <h4 class="invoice-title">
                                          Factura #
                                       </h4>
                                 
                                       <b-input-group class="input-group-merge invoice-edit-input-group disabled">
                                          <b-input-group-prepend is-text>
                                             <feather-icon icon="HashIcon" />
                                          </b-input-group-prepend>
                                          <b-form-input id="invoice-data-id" v-model="factura_id" disabled />
                                       </b-input-group>
                                 
                                    </div>
                                 
                                 
                                       <b-form-group>
                                          <template #label>
                                             Fecha de facturación:: <span class="text-danger">*</span>
                                          </template>
                                 
                                          <validation-provider name="fecha" rules="required" #default="{errors}">
                                             <flat-pickr v-model="formulario.fecha" class="form-control" placeholder="2022-09-10" />
                                 
                                             <b-form-invalid-feedback :state="errors.length ? false : null">
                                                {{ errors[0] }}
                                             </b-form-invalid-feedback>
                                          </validation-provider>
                                       </b-form-group>
                                 
                                 
                                 
                                       <b-form-group>
                                          <template #label>
                                             Orden de entrega (Conduce): <span class="text-danger">*</span>
                                          </template>
                                          <validation-provider name="orden_id" rules="required" #default="{errors}">
                                 
                                             <v-select v-model="formulario.orden_id" :reduce="val => val.id" :options="ordenes" label="numero"
                                                class="w-100" @input="capturarCompania" />
                                 
                                             <b-form-invalid-feedback :state="errors.length ? false : null">
                                                {{ errors[0] }}
                                             </b-form-invalid-feedback>
                                          </validation-provider>
                                       </b-form-group>

                                       <b-form-group>
                                          <template #label>
                                             Clasificación: <span class="text-danger">*</span>
                                          </template>
                                          <validation-provider name="clasificacion" rules="required" #default="{errors,valid}">
                                       
                                             <v-select v-model="formulario.clasificacion" :reduce="val => val.value" :options="clasificaciones" class="w-100" />
                                       
                                             <b-form-invalid-feedback :state="valid">
                                                {{ errors[0] }}
                                             </b-form-invalid-feedback>
                                          </validation-provider>
                                       </b-form-group>

                                 
                                 
                                 </div>
                              </b-col>

                           </b-row>
                        </b-container>
         
                     </b-card-body>
         
                     <!-- Spacer -->
                     <hr class="invoice-spacing">
         
                     <!-- Items Section -->
                     <b-card-body class="invoice-padding form-item-section">
                      
                           <b-row>
                              <b-col cols="12">
                                 <table class="table table-hover table-sm table-striped">
                                    <thead>
                                       <th>Cant</th>
                                       <th>Descripción</th>
                                       <th>Precio Unitario</th>
                                       <th>Total</th>
                                       <th></th>
                                    </thead>
                                    <tbody>
                                       <tr v-for="(item, index) in formulario.vendido" :key="index" ref="row" class="pb-2">
                                          <td>
                                             <b-form-group>
                                                <validation-provider name="vendido.cantidad" rules="required" #default="{errors,valid}">
                                               

                                                   <el-input-number v-model="item.cantidad" size="small" @change="calcularTotal(index)" controls-position="right" :min="0" :max="1000" />

                                                   <b-form-invalid-feedback :state="valid">
                                                      {{ errors[0] }}
                                                   </b-form-invalid-feedback>
                                                </validation-provider>
                                             </b-form-group>
                                          </td>

                                          <td>
                                             <b-form-group>
                                                <validation-provider name="vendido.descripcion" rules="required" #default="{errors,valid}">
                                                   
                                                   <b-form-input :state="valid" v-model="item.descripcion" size="sm"   />
                                          
                                                   <b-form-invalid-feedback>
                                                      {{ errors[0] }}
                                                   </b-form-invalid-feedback>

                                                </validation-provider>
                                             </b-form-group>
                                          </td>

                                          <td>
                                             <b-form-group>
                                                <validation-provider name="vendido.precio_unitario" rules="required" #default="{errors}">
                                          
                                                   <currency-input :value="item.precio_unitario" input-class="form-control form-control-sm" :options="optionsCurrency" @change="(val) => { item.precio_unitario = val; calcularTotal(index) }" />
                                          
                                                <b-form-invalid-feedback :state="errors.length ? false : null">
                                                   {{ errors[0] }}
                                                </b-form-invalid-feedback>
                                          
                                                </validation-provider>
                                             </b-form-group>
                                          </td>

                                          <td>
                                             <b-form-group>
                                                <validation-provider name="vendido.total" rules="required" #default="{errors,valid}">
                                          
                                                   <currency-input :value="item.total" input-class="form-control form-control-sm" :options="optionsCurrency" @change="item.total = $event" disabled />
                                          
                                                   <b-form-invalid-feedback :state="valid">
                                                      {{ errors[0] }}
                                                   </b-form-invalid-feedback>
                                          
                                                </validation-provider>
                                             </b-form-group>
                                          </td>

                                          <td style="vertical-align: baseline;">
                                             <b-button-group size="sm">
                                                
                                                <b-button variant="outline-primary" title="Mas opciones" @click="mostrarDialog(index)">
                                                   <feather-icon icon="SettingsIcon" />
                                                </b-button>

                                                <b-button variant="outline-danger" title="Quitar" v-if="index != 0" @click="quitarItem(index)">
                                                   <feather-icon icon="XIcon" />
                                                </b-button>

                                             </b-button-group>
                                             
                                          </td>
                                          
                                       </tr>
                                    </tbody>
                                 </table>
                              </b-col>
                           </b-row>
                           <b-row>
                              <b-col cols="12" md="6">
                                 <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" size="sm" variant="primary"
                                    @click="$store.commit('factura/addVendido')">
                                    Agregar Item
                                 </b-button>
                                 <br>
                                 <b-form-group label="Iva" description="Ajusta el % del iva, si no concuerda">
                                    <el-input-number v-model="iva" size="small" @change="calcular"  controls-position="right" :min="0" :max="100" />
                                 </b-form-group>
                                 
                              </b-col>
                                 <!-- Col: Total -->
                                 <b-col cols="12" md="6"  class="d-flex justify-content-end" order="1" order-md="2">
                                    <div class="invoice-total-wrapper">
                                       <div class="invoice-total-item">
                                 
                                          <p class="invoice-total-title">
                                             Subtotal:
                                          </p>
                                 
                                          <p class="invoice-total-amount">
                                             {{ formulario.subtotal | currency }}
                                          </p>
                                 
                                       </div>
                                 
                                       <div class="invoice-total-item">
                                          <p class="invoice-total-title">
                                             Iva:{{ iva }}%
                                          </p>
                                          <p class="invoice-total-amount">
                                             {{ formulario.iva | currency }} 
                                          </p>
                                       </div>
                                       <hr class="my-50">
                                       <div class="invoice-total-item">
                                          <p class="invoice-total-title">
                                             Total:
                                          </p>
                                          <p class="invoice-total-amount">
                                             {{ formulario.total | currency }}
                                          </p>
                                       </div>
                                    </div>
                                 </b-col>
                           </b-row>
                        
                     </b-card-body>
         
                     <!-- Invoice Description: Total -->
                     <b-card-body class="invoice-padding pb-0">
                        <b-row>
         
                        
                       

                        </b-row>
                     </b-card-body>
                    
                  </b-card>
               </b-col>
            
               <b-col cols="12" md="4" xl="3" class="invoice-actions mt-md-0 mt-2">
            
                  <b-card>
            
                     <!-- <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mb-75" block disabled>
                        Enviar Factura
                     </b-button> -->
            
                     <!-- Button: DOwnload -->
                     <!-- <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="mb-75" block>
                        Vista Previa
                     </b-button> -->
            
                     <!-- Button: Print -->
                     <b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" block type="submit" title="Guardar">
                        <feather-icon icon="SaveIcon" />
                        Guardar
                     </b-button>
                  </b-card>
         
               </b-col>
            
            </b-row>
         </b-form>
      </validation-observer>
      
       <b-sidebar v-model="showDialog" left title="Información adicional" backdrop>
         <b-container fluid>
            <b-row>
               <b-col cols="12">
      
                  <b-form-group>
                     <template #label>
                        Vagón:
                     </template>
                        <b-form-input v-model="formulario.vendido[vendido].vagon"/>
                  </b-form-group>


                  <b-form-group>
                     <template #label>
                        Millas:
                     </template>
                     <b-form-input v-model="formulario.vendido[vendido].millas" />
                  </b-form-group>


                  <b-form-group>
                     <template #label>
                        Referencia:
                     </template>
                     <b-form-input v-model="formulario.vendido[vendido].referencia" />
                  </b-form-group>


               </b-col>
            </b-row>
      
         </b-container>
      </b-sidebar>

   </section>
</template>

<script>
import { ref,toRefs,computed,onMounted } from 'vue'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

import {
   BRow,
   BCol,
   BCard,
   BCardBody,
   BButton,
   BCardText,
   BForm,
   BFormGroup,
   BFormInput,
   BInputGroup,
   BInputGroupPrepend,
   BFormTextarea,
   BFormCheckbox,
   BPopover,
   VBToggle,
   BLink,
   BFormInvalidFeedback,
   BContainer,
   BButtonGroup,
   BSidebar
   
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'


import { ValidationObserver, ValidationProvider} from 'vee-validate'
import {required} from '@validations'

import { optionsCurrency } from '@core/utils/utils'

export default {
   components: {
      BRow,
      BCol,
      BCard,
      BCardBody,
      BButton,
      BCardText,
      BForm,
      BFormGroup,
      BFormInput,
      BInputGroup,
      BInputGroupPrepend,
      BFormTextarea,
      BFormCheckbox,
      BPopover,
      flatPickr,
      vSelect,
      BLink,
      ValidationObserver,
      ValidationProvider,
      BFormInvalidFeedback,
      BContainer,
      BButtonGroup,
      BSidebar,
      CurrencyInput:() => import('components/CurrencyInput.vue')
   },

   directives: {
      Ripple,
      'b-toggle': VBToggle,
   },

   setup(props,{emit}) {

      const ordenes = ref([])
      const clasificaciones = ref([
         {
            label:'Muelle',
            value:1
         },
         {
            label: 'Local',
            value: 2
         }, 
         {
            label:'Us',
            value:3
         },
         {
            label: 'Otros',
            value: 4
         }
      ])
      const { factura: formulario, factura_id } = toRefs(store.state.factura)
      const { compania } = toRefs(store.state.compania)
      const iva = ref(11);
      const showDialog = ref(false)
      const vendido = ref(0)
      const formValidate = ref(null)
     
      const cargarForm = () => {

         store.dispatch('factura/getUltimaFactura');

         if(!ordenes.value.length){
            

            axios.get('api/ordens/get/sin-facturar').then(({data}) => {
               ordenes.value  = data
            }).catch(e => console.log(e))
            .then(() => {
            })

         }
      }

      onMounted(() => cargarForm())


      const capturarCompania = (orden_id) => {
         
         if(orden_id){
            axios.get(`api/ordens/${orden_id}/get`).then(({ data }) => {
               store.commit('compania/setCompania', data.entrega.compania)
               formulario.value.direccion_facturacion = compania.value.direccion
               formulario.value.compania_id = compania.value.id
            })
         }else{
            store.commit('compania/clear')
         }
       

      } 

      const quitarItem = (i) => {

         store.commit('factura/quitarVendido',i)

         setTimeout(() => {
            calcular()
         },1500)

      }

      const calcularTotal = (i = 0) => {

         formulario.value.vendido[i].total = formulario.value.vendido[i].cantidad * formulario.value.vendido[i].precio_unitario

         calcular();
      
      }


      const calcular = () => {
         
         formulario.value.subtotal = 0;

         formulario.value.vendido.forEach((val) => {
            formulario.value.subtotal += val.total

         })

         formulario.value.iva = formulario.value.subtotal * iva.value / 100
         formulario.value.total = formulario.value.subtotal + formulario.value.iva

      }

      const guardar = () => {
         emit('save',formulario.value,formValidate.value)
      }

      const mostrarDialog = (i) => {
         vendido.value = i;
         showDialog.value = true
      } 

      return {
         factura_id,
         required,
         formulario,
         ordenes,
         clasificaciones,
         capturarCompania,
         compania,
         optionsCurrency,
         calcularTotal,
         guardar,
         quitarItem,
         loading:computed(() => store.state.loading),
         iva,
         calcular,
         showDialog,
         vendido,
         mostrarDialog,
         formValidate
      }
   }

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';

.invoice-add-wrapper {
   .add-new-client-header {
      padding: $options-padding-y $options-padding-x;
      color: $success;

      &:hover {
         background-color: rgba($success, 0.12);
      }
   }
}
</style>

<style lang="scss" scoped>
@import '~@core/scss/base/pages/app-invoice.scss';
@import '~@core/scss/base/components/variables-dark';

.form-item-section {
   background-color: $product-details-bg;
}

.form-item-action-col {
   width: 27px;
}

.repeater-form {
   // overflow: hidden;
   transition: 0.35s height;
}

.v-select {

   &.item-selector-title,
   &.payment-selector {
      background-color: #fff;

      .dark-layout & {
         background-color: unset;
      }
   }
}

.dark-layout {
   .form-item-section {
      background-color: $theme-dark-body-bg;

      .row .border {
         background-color: $theme-dark-card-bg;
      }
   }
}
</style>
