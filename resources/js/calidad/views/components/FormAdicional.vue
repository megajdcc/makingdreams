<template>
   <b-sidebar :visible="showFormCargo" bg-variant="white" left backdrop shadow
      @hidden="$emit('update:show-form-cargo',false)">

      <template #title>
         <h3>Aplicar cargo adicional</h3>
      </template>

      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>

               <b-row>
                  <b-col cols="12">

                     <b-form-group description="Describa porque está aplicando este cargo adicional">
                        <template #label>
                           Concepto: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="concepto" rules="required" #default="{errors}">

                           <b-form-textarea v-model="formulario.concepto" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>


                     <b-form-group>
                        <template #label>
                           Monto:{{ formulario.monto | currency }} <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="monto" rules="required" #default="{errors}">
                           <currency-input :value="formulario.monto" @input="formulario.monto = $event"
                              :options="optionsCurrency" validar InputClass="form-control" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>


                  </b-col>
               </b-row>

               <b-row>
                  <b-col cols="12">
                     <b-button-group size="sm">
                        <b-button variant="primary" type="submit" title="Guardar" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>

                        <b-button variant="danger" @click="() => $emit('update:show-form-cargo',false)" title="Cerrar">
                           <feather-icon icon="XIcon" />
                        </b-button>
                     </b-button-group>
                  </b-col>

               </b-row>
            </b-container>
         </b-form>

      </validation-observer>



   </b-sidebar>
</template>

<script>


import {
   BSidebar,
   BForm,
   BFormGroup,
   BFormInput,
   BFormInvalidFeedback,
   BContainer,
   BRow,
   BCol,
   BButton,BButtonGroup,
   BFormTextarea
} from 'bootstrap-vue'

import { ValidationProvider,ValidationObserver } from 'vee-validate'

import {required} from '@validations'

import {ref,onMounted,watch,toRefs,computed} from 'vue'

import store from '@/store'

import {optionsCurrency}  from '@core/utils/utils'
import { Notification } from 'element-ui'
export default {

   components:{
      BSidebar,
      BForm,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BContainer,
      BRow,
      BCol,
      BButton,
      BButtonGroup,
      ValidationProvider,
      ValidationObserver,
      CurrencyInput:() => import('components/CurrencyInput'),
      BFormTextarea

   },
   props:{
      showFormCargo:{
         type:Boolean,
         required:true,
         default:false
      },

      formularioCargo:{
         type:Object,
         required:true
      }
   },

   model:{
      prop:'showFormCargo',
      event:'update:show-form-cargo'
   },


   setup(props,{emit}) {

      const formValidate = ref(null)

      const {formularioCargo:formulario} = toRefs(props)


      const guardar = () => {


         store.dispatch('cargo/guardar',formulario.value).then(({result}) => {

            if(result){
               
               Notification.success({
                  message:'Se ha guardado con éxito el cargo',
                  position:'bottom-right'
               })

               emit('submitSuccess')


            }else{

               Notification.info({
                  message: 'No se pudo guardar el cargo, inténtelo de nuevo',
                  position: 'bottom-right'
               })
               
            }
         }).catch(e => {
            console.log(e)

            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }
         })

      }



      return {
         required,
         formulario,
         loading:computed(() => store.state.loading),
         optionsCurrency,
         guardar,
         formValidate
      }

   },
}
</script>