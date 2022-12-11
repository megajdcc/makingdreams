<template>
   <b-overlay :show="loading">
      <b-sidebar :visible="showForm" title="Aplicar Egreso" @hidden="cerrar" backdrop
         sidebar-class="form-egreso-sidebar">

         <validation-observer ref="formValidate" #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(guardar)">

               <b-container fluid>

                  <b-row>
                     <b-col cols="12">
                        <b-form-group description="Seleccione una boda">
                           <template #label>
                              Boda: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="boda_id" rules="required" #default="{errors}">

                              <v-select v-model="formulario.boda_id" :options="optionsBoda" :reduce="val => val.value"
                                 label="name" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Cual es el monto que deseas egresar?">
                           <template #label>
                              Monto: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="monto" rules="required" #default="{errors}">

                              <currency-input :value="formulario.monto" @change="formulario.monto = $event"
                                 :options="optionsCurrency" validar name="monto" input-class="form-control" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>


                        </b-form-group>

                        <b-form-group description="Establece el número de referencia para el egreso">
                           <template #label>
                              Referencia: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="referencia" rules="required" #default="{errors}">

                              <b-form-input v-model="formulario.referencia" :state="errors.length ? false : null" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Establece el concepto del egreso">
                           <template #label>
                              Concepto: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="concepto" rules="required" #default="{errors}">

                              <b-form-input v-model="formulario.concepto" :state="errors.length ? false : null" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Carga un comprobante">
                           <template #label>
                              Comprobante de egreso: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="comprobante" rules="required" #default="{errors}">

                              <b-form-file v-model="formulario.comprobante" :state="errors.length ? false : null" browse-text="Buscar archivo" accept=".jpg,.png,.pdf,.jpeg" capture />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>


                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col cols="12">
                        <b-button-group size="sm">
                           <b-button variant="primary" type="submit">
                              <feather-icon icon="SaveIcon" />
                              Guardar
                           </b-button>
                           <b-button variant="dark" @click="cerrar">
                              <feather-icon icon="XIcon" />
                           </b-button>
                        </b-button-group>
                     </b-col>
                  </b-row>
               </b-container>



            </b-form>
         </validation-observer>
      </b-sidebar>
   </b-overlay>
</template>
<script>
import{
   BContainer,
   BRow,
   BCol,
   BForm,
   BFormGroup,
   BFormInput,
   BFormInvalidFeedback,
   BSidebar,
   BOverlay,
   BButtonGroup,
   BButton,
   BFormFile
} from 'bootstrap-vue'

import { ValidationObserver, ValidationProvider } from 'vee-validate'
import {required} from '@validations'

import store from '@/store'

import {ref,toRefs,computed,onMounted} from 'vue'

import vSelect from 'vue-select'
import { optionsCurrency } from "@core/utils/utils"

import ToastificationContentVue from '@core/components/toastification/ToastificationContent.vue'

export default {
   
   
   props:{
      showForm:{
         type:Boolean,
         default:false,
         required:true
      }
   },


   model:{
      prop:'show-form',
      event:'update:show-form'
   },

   components:{
      BContainer,
      BRow,
      BCol,
      BForm,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      ValidationObserver,
      ValidationProvider,
      BSidebar,
      BOverlay,
      BButtonGroup,
      BButton,
      CurrencyInput:() => import('components/CurrencyInput'),
      vSelect,
      BFormFile

   },

   setup(props,{emit}) {
      
      const bodas = computed(() => store.state.boda.bodas)

      const formValidate = ref(null)

      const formulario = ref({
         monto        : 0,
         comprobante  : null,
         concepto     : '',
         referencia:'',
         boda_id      : null,
         movimiento_id: null,
      })

      const cerrar = () => {

         formulario.value = {
            monto: 0,
            comprobante: null,
            concepto: '',
            referencia: '',
            boda_id: null,
            movimiento_id: null,
         }

         emit('update:show-form',false)
         
      }

      const guardar = () => {


         const datos = new FormData();
         datos.append('boda_id',formulario.value.boda_id);
         datos.append('monto',formulario.value.monto)
         datos.append('referencia',formulario.value.referencia)
         datos.append('comprobante',formulario.value.comprobante)
         datos.append('concepto',formulario.value.concepto);

         axios.post(`/api/egresos`,datos,{
            headers:{
               'content-type':"multipart/form-data; boundary=something"
            }
         }).then(({data}) => {

            if(data.result){
               
               toast({
                  component:ToastificationContentVue,
                  props:{
                     icon:'InfoIcon',
                     title:'Egreso Registrado con éxito',
                     hideClose:true,
                  }
               },{
                  timeout:4000,
                  position:'bottom-right'
               });

               emit('newRegistro');

               cerrar();

            }else{
               toast({
                  component: ToastificationContentVue,
                  props: {
                     variant:'danger',
                     icon: 'HelpCircleIcon',
                     title: 'Registro no exitoso, inténtelo de nuevo',
                     hideClose: true,
                  }
               }, {
                  timeout: 4000,
                  position: 'bottom-right'
               });
            }

         }).catch(e => {
            
            console.log(e)
            if(e && e.response.status === 422){

               formValidate.value.setErrors(e.response.data.errors)
            }

         })

         

      }
      
      const cargarForm = () => {

         if(!bodas.value.length){
            store.dispatch('boda/cargarBodas')
         }


      }


      onMounted(() => {
         cargarForm();
      })


      return {
         optionsCurrency,
         guardar,
         formulario,
         formValidate,
         bodas,
         cerrar,
         loading:computed(() => store.state.loading),
         required,
         optionsBoda:computed(() => {
            return bodas.value.map(val => {
               return {
                  name: `${val.novios.novia} & ${val.novios.novio}`,
                  value: val.id
               }
            })
         })
      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';


 .form-egreso-sidebar {

    width: 320px;

 }

@media (min-width:792px){
   
   .form-egreso-sidebar {

      width: 450px !important;

   }

} 


</style>