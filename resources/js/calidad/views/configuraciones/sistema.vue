<template>
      <b-card>
         <validation-observer #default="{handleSubmit}" ref="formValidate">
            <b-form @submit.prevent="handleSubmit(guardar)">
               <b-container fluid>
                  <b-row>
                     <b-col md="6">

                        <b-form-group>

                           <template #label>
                              Nombre de la Aplicación: <span class="text-danger">*</span> 
                           </template>

                           <validation-provider name="nombre" rules="required" #default="{valid,errors}">

                              <b-form-input v-model="formulario.nombre" :state="valid"/>
                              
                              <b-form-invalid-feedback :state="valid">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>

                     </b-col>

                     <b-col md="6">
                        <b-form-group >
                        
                           <template #label>
                              Monto inicial: <span class="text-danger">*</span>
                           </template>
                        
                           <validation-provider name="monto_inicial" rules="required" #default="{valid,errors}">
                        
                              <currency-input v-model="formulario.monto_inicial" :options="optionsCurrency" class="form-control" :state="!errors.length" />
                        
                              <b-form-invalid-feedback :state="valid">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>
                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col cols="12" md="6">
                        <b-form-group
                           title="Este logo aparecerá mientras el tema esté en modo claro"
                           v-b-tooltip.hover.v-warning description="Presiona encima del recuadro para buscar una imagen.">
                           <template #label>
                              Logo para fondos claro: <span class="text-danger">*</span>
                              <feather-icon icon="HelpCircleIcon" class="text-warning" />
                           </template>
                  
                           <section class="content-logo" @click="() => refLogoClaro.$refs.input.click()" :style="`background:url(${urlLogoClaro})`">
                  
                           </section>
                  
                           <validation-provider name="logotipo_claro" #default="{errors}">
                              <b-form-file v-model="logotipo_claro" ref="refLogoClaro" plain accept=".jpb, .png" class="d-none" @input="logoSeleccionado($event,'claro')"
                                 :state="errors.length ? false : null" />
                  
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                  
                           </validation-provider>
                  
                  
                  
                        </b-form-group>
                     </b-col>
                     <b-col cols="12" md="6">
                  
                        <b-form-group
                           title="Este logo aparecerá mientras el tema esté en modo oscuro"
                           v-b-tooltip.hover.v-warning description="Presiona encima del recuadro para buscar una imagen.">
                           <template #label>
                              Logo para fondos oscuros: <span class="text-danger">*</span>
                              <feather-icon icon="HelpCircleIcon" class="text-warning" />
                           </template>
                  
                  
                           <section class="content-logo" @click="refLogoOscuro.$refs.input.click()" :style="`background:url(${urlLogoOscuro})`">
                           </section>
                  
                           <validation-provider name="logotipo_oscuro" #default="{errors}">
                  
                              <b-form-file v-model="logotipo_oscuro" ref="refLogoOscuro" plain accept=".jpb, .png" class="d-none" @input="logoSeleccionado($event,'oscuro')"
                                 :state="errors.length ? false : null" />
                  
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                  
                           </validation-provider>
                  
                        </b-form-group>
                  
                     </b-col>
                  
                  </b-row>

                  <b-row>
                     <b-col>
                     <b-form-group>
                     
                        <template #label>
                           Términos y Condiciones:
                        </template>
                     
                        <validation-provider name="terminos" rules="required" #default="{ errors }">
                           <editor output-format="html" :value="formulario.terminos" @input="formulario.terminos = $event"
                              api-key="t1i940nuarrf1zefgxbf6ow5cxmgjmcad7q7l3fm5prgebyc" :init="optionsEditor" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     
                     </b-form-group>
                     </b-col>
                  </b-row>

                  <b-row>
                     <b-button-group>

                        <b-button type="submit" variant="primary" v-loading="loading">
                           Guardar
                        </b-button>
                     </b-button-group>
                  </b-row>
               </b-container>
            </b-form>   
         </validation-observer>
      </b-card>
</template>

<script>

import {computed,onMounted, toRefs,ref} from 'vue';

import store from '@/store'
import { optionsCurrency } from '@core/utils/utils';
import Editor from '@tinymce/tinymce-vue'

import {optionsEditor} from '@core/utils/utils'

import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BButtonGroup,
   BButton,
   BFormGroup,
   BFormInput,
   BForm,
   BFormInvalidFeedback,
   BFormFile,
   VBTooltip

} from 'bootstrap-vue'

import {ValidationObserver,ValidationProvider} from 'vee-validate'
import {required} from '@validations'

export default {
   
   components:{
      BCard,
      BContainer,
      BRow,
      BCol,
      BButtonGroup,
      BButton,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      ValidationObserver,
      ValidationProvider,
      BForm,
      Editor,
      BFormFile,
      currencyInput:() => import('components/CurrencyInput.vue')
   },

   directives:{
      'b-tooltip':VBTooltip
   },

   setup(){
      
      const formValidate = ref(null)
      const refLogoClaro = ref(null)
      const refLogoOscuro = ref(null)
      const logotipo_claro = ref(null)
      const logotipo_oscuro = ref(null)
      const urlLogoClaro = ref('')
      const urlLogoOscuro = ref('')
      const {sistema:formulario}  = toRefs(store.state.sistema)

      const cargarForm = () => {
         
         if (!formulario.value.id) {
            store.dispatch('sistema/fetch').then(() => {
               
               urlLogoClaro.value = `/storage/logotipos/${formulario.value.logotipo_claro}`
               urlLogoOscuro.value = `/storage/logotipos/${formulario.value.logotipo_oscuro}`

               formulario.value.logotipo_claro = null
               formulario.value.logotipo_oscuro = null
            })
         }else{
            urlLogoClaro.value = `/storage/logotipos/${formulario.value.logotipo_claro}`
            urlLogoOscuro.value = `/storage/logotipos/${formulario.value.logotipo_oscuro}`

            formulario.value.logotipo_claro = null
            formulario.value.logotipo_oscuro = null

         }
      }

      onMounted(() => cargarForm())

      const guardar = () => {
         
         formulario.value.logotipo_claro = logotipo_claro.value
         formulario.value.logotipo_oscuro = logotipo_oscuro.value

         store.dispatch('sistema/guardar',formulario.value).then(({result}) => {

            if(result){
               toast.success('Se ha guardado con éxito los cambios',{
                  position:'bottom-right'
               })
            }else{
               toast.info('No se pudierón guardar los cambios, inténtelo de nuevo mas tarde',{
                  position:'bottom-right'
               })
            }

         }).catch(e => {

            console.log(e)
            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }

         })


      }
      
      const logoSeleccionado = (file,modo) => {

         switch (modo) {
            case 'claro':
               urlLogoClaro.value = URL.createObjectURL(file)
               break;

            case 'oscuro':
               urlLogoOscuro.value = URL.createObjectURL(file)
               break;

         }
      
      }

     

      return {
         guardar,
         formValidate,
         formulario,
         required,
         optionsCurrency,
         loading:computed(() => store.state.loading),
         urlLogoClaro,
         urlLogoOscuro,
         logoSeleccionado,
         refLogoClaro,  
         refLogoOscuro,
         optionsEditor,
         logotipo_claro,
         logotipo_oscuro
      }

   }
}
</script>

<style lang="scss" scoped>

.content-logo{
   border: 3px dotted rgba(44, 23, 23, 0.568);
   height: 150px;
   border-radius: 10px;
   box-shadow: -5px 10px 25px rgb(0 0 0 / 50%);
   cursor: pointer;
   background-repeat: no-repeat !important;
   background-size: contain !important;
   background-position: center center !important;

   &::after {
         content: "";
         display: flex;
         justify-content: center;
         align-items: center;
         height: 100%;
         font-weight: bolder;
   }
   
   &:hover{
          transform: scale3d(1.2, 1.2, 3.5);
         
         &::after {
               content: "" !important;
               display: flex;
               justify-content: center;
               align-items: center;
               height: 100%;
               font-weight:bolder;
         }
         
     
   }
}

</style>
