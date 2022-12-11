<template>
   <b-sidebar id="sidebar-right" bg-variant="white" left backdrop shadow :visible="showForm"
      @hidden="() => $emit('update:show-form',false)">

      <template #title>
         Edite su pago
      </template>
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid class="mb-1">
               <b-row>
                  <b-col cols="12" v-if="habitacion">
                     <p class="my-0">Noches: {{ habitacion.reserva.noches }}</p>
                     <p class="my-0">Personas: {{ habitacion.habitantes.adultos + habitacion.habitantes.ninos +
                        habitacion.habitantes.adolescentes
                        }}</p>
                     <p class="my-0">Monto por persona: {{ habitacion.monto / (habitacion.habitantes.adultos +
                        habitacion.habitantes.ninos + habitacion.habitantes.adolescentes) | currency
                        }} MXN</p>
                     <p class="my-0">Monto pendiente: {{ habitacion.pendiente | currency }} MXN</p>
                  </b-col>

                  <b-col cols="12">

                     <b-form-group>

                        <template #label>
                           Forma de pago: <span class="text-danger">*</span>
                        </template>

                        <validation-provider rules="required" name="forma_pago" #default="{ errors }">

                           <b-form-radio-group v-model="formulario.forma_pago" size="sm"
                              :state="errors.length > 0 ? false : null" class="d-flex justify-content-center flex-wrap"
                              :options="optionsFormaPago" buttons button-variant="primary" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>

                     <b-form-group v-if="formulario.forma_pago == 5"
                        description="Escriba la forma en la que se realizó el pago...">
                        <template #label>
                           Metodo de pago: <span class="text-danger">*</span>
                        </template>
                        <validation-provider rules="required" name="metodo_pago" #default="{ errors }">
                           <b-form-input v-model="formulario.metodo_pago" :state="errors.length > 0 ? false : null" />
                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>

                     <b-form-group description="Cargue el archivo que respalde el comprobante (opcional) ">

                        <template #label>
                           Comprobante del pago:
                        </template>

                        <validation-provider name="comprobante" #default="{ errors }">

                           <b-form-file v-model="comprobante" accept="*" size="sm"
                              :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>

                     <b-form-group description="Seleccione el banco en donde realizó la transferencia"
                        v-if="formulario.forma_pago == 1">

                        <template #label>
                           Banco: <span class="text-danger">*</span>
                        </template>

                        <validation-provider #default="{ errors }" name="banco_id" rules="required">

                           <el-select v-model="formulario.banco_id" size="small" class="w-100" filterable>
                              <el-option v-for="(banco, i) in bancos" :key="i" :value="banco.id"
                                 :label="`${banco.nombre} - ${banco.cuenta}`"></el-option>
                           </el-select>

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>


                     <b-form-group description="Seleccione la agencia donde realizó el pago"
                        v-if="formulario.forma_pago == 2">

                        <template #label>
                           Agencia: <span class="text-danger">*</span>
                        </template>


                        <validation-provider #default="{ errors }" name="agencia_id" rules="required">
                           <el-select v-model="formulario.agencia_id" size="small" class="w-100" filterable>
                              <el-option v-for="(agencia, i) in agencias" :key="i" :value="agencia.id"
                                 :label="`${agencia.nombre}`"></el-option>
                           </el-select>

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>

                     <b-form-group
                        description="El Número de referencia, es el número de control que el banco asocia a la transacción, el mismo sirve para comprobar la operación">

                        <template #label>
                           Nro de Pago: <span class="text-danger">*</span>
                        </template>

                        <validation-provider rules="required" name="nro_referencia" #default="{ errors }">
                           <b-form-input v-model="formulario.nro_referencia" :state="errors.length ? false : null"
                              placeholder="Nro de comprobante" size="sm" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>

                     </b-form-group>

                     <b-form-group label-for="monto" description="El monto que desea acreditar ">
                        <template #label>
                           Monto: {{ formulario.monto | currency }} MXN <span class="text-danger">*</span>
                        </template>
                        <currency-input @change="formulario.monto = $event" :value="Number(formulario.monto)"
                           input-class="form-control form-control-sm" :options="optionsCurrency"
                           :disabled="formulario.id ? true : false" />
                     </b-form-group>


                     <b-form-group description="Describa el concepto del pago...">

                        <template #label>
                           Concepto del pago: <span class="text-danger">*</span>
                        </template>

                        <validation-provider rules="required" name="concepto" #default="{ errors }">

                           <b-form-textarea v-model="formulario.concepto" :rows="3"
                              :state="errors.length > 0 ? false : null">
                           </b-form-textarea>

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
                        <b-button variant="primary" type="submit" size="sm" v-loading="loading">
                           <feather-icon icon="SaveIcon" size="16" />
                           Guardar
                        </b-button>

                        <b-button @click="() => $emit('update:show-form',false)" variant="danger">
                           <feather-icon icon="XIcon" size="16" />
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

import { BSidebar,BRow,BContainer,BCol,
   BFormGroup,
   BFormInput,
   BFormFile,
   BFormRadioGroup,
   BForm,
   BFormTextarea,
   BFormInvalidFeedback,
   BButton,
   BButtonGroup

} from 'bootstrap-vue'

import { ValidationObserver,ValidationProvider } from 'vee-validate'

import {required} from '@validations'

import { ref,toRefs,computed,watch,onMounted } from 'vue'

import store from '@/store'

import CurrencyInput from 'components/CurrencyInput'

import { optionsCurrency } from '@core/utils/utils'
export default {

   components:{
      BSidebar, 
      BRow, 
      BContainer, 
      BCol,
      BFormGroup,
      BFormInput,
      BFormFile,
      BFormRadioGroup,
      BForm,
      ValidationObserver,
      ValidationProvider,
      CurrencyInput,
      BFormTextarea,
      BFormInvalidFeedback,
      BButton,
      BButtonGroup


   },

   props:{
      habitacion:{
         type:Object,
         required:false
      },

      showForm:{
         type:Boolean,
         default:false,
         required:true,
      }
   },

   model:{
      prop:'show-form',
      event:'update:show-form'
   },


   setup(props,{emit}) {
      
      const { pago:formulario } = toRefs(store.state.pago)

      const bancos = computed(() => store.state.banco.bancos)

      const agencias = computed(() => store.state.agencia.agencias)
      const comprobante = ref(null)
      const formValidate = ref(null)


      const optionsFormaPago = ref([
         {
            text:'Bancaria',
            value:1,
         },
         {
            text: 'Agencia',
            value: 2,
         },
         {
            text: 'Otros',
            value: 5,
         }
      ])

      const cargarForm = () => {

         if(!bancos.value.length){
            store.dispatch('banco/cargarBancos')
         }

         if (!agencias.value.length) {
            store.dispatch('agencia/cargarAgencias')
         }

      }

      onMounted(() => cargarForm())

      const guardar = () => {
         
         formulario.value.comprobante = comprobante.value;
         store.dispatch('pago/guardarPago',formulario.value).then(({result,pago}) => {

            if(result){
               toast.success('Pago actualizado con éxito')

               emit('pagoUpdate')

            }else{
               toast.info('El pago no pudo ser actualizado, inténtelo de nuevo.')
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
         optionsFormaPago,
         bancos,
         agencias,
         guardar,
         comprobante,
         optionsCurrency,
         loading:computed(() => store.state.loading),
         formValidate
      }
   },
}
</script>