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
                  <el-divider></el-divider>

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

                  <el-divider content-position="left">Datos de pagos</el-divider>

                  <b-row>
                     <b-col cols="12" md="6">

                        <b-form-group label="Dirección para recibir bitcoin">

                           <validation-provider name="direccion_bitcoin" #default="{errors,valid}">
                              <b-form-input v-model="formulario.direccion_bitcoin" :state="valid"/>

                              <b-form-invalid-feedback :state="valid">
                                 {{ errors[0]  }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <el-divider>Datos Paypal</el-divider>
                        <template v-if="formulario.paypal">
                             <b-form-group label="Cliente Id">

                                 <validation-provider name="paypal.cliente_id" #default="{ errors, valid }">
                                    <b-form-input v-model="formulario.paypal.cliente_id" :state="valid"/>

                                    <b-form-invalid-feedback :state="valid">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>

                              <b-form-group label="Secreto">

                                 <validation-provider name="paypal.secret" #default="{ errors, valid }">
                                    <b-form-input v-model="formulario.paypal.secret" :state="valid"/>

                                    <b-form-invalid-feedback :state="valid">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>

                              <b-form-group label="¿ En producción ?">

                                       <validation-provider name="paypal.production" #default="{ errors, valid }">
                                          <b-form-radio-group v-model="formulario.paypal.production" 
                                          :options="[{ text: 'Sí', value: true }, { text: 'No', value: false }]"
                                          ></b-form-radio-group>

                                          <b-form-invalid-feedback :state="valid">
                                             {{ errors[0] }}
                                          </b-form-invalid-feedback>
                                       </validation-provider>
                              </b-form-group>
                        </template>

                        <el-divider>Datos Mercado Pago</el-divider>
                           <template v-if="formulario.mercado_pago">
                                <b-form-group label="Llave Publica">

                                    <validation-provider name="mercado_pago.public_key" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.mercado_pago.public_key" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group label="Token">

                                    <validation-provider name="mercado_pago.token" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.mercado_pago.token" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group label="Cliente Id">

                                    <validation-provider name="mercado_pago.cliente_id" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.mercado_pago.cliente_id" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group label="Cliente Secret">

                                    <validation-provider name="mercado_pago.cliente_secret" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.mercado_pago.cliente_secret" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group label="¿ En producción ?">

                                          <validation-provider name="mercado_pago.is_production" #default="{ errors, valid }">
                                             <b-form-radio-group v-model="formulario.mercado_pago.is_production" 
                                             :options="[{ text: 'Sí', value: true }, { text: 'No', value: false }]"
                                             ></b-form-radio-group>

                                             <b-form-invalid-feedback :state="valid">
                                                {{ errors[0] }}
                                             </b-form-invalid-feedback>
                                          </validation-provider>
                                 </b-form-group>
                           </template>
                         
                         
                     </b-col>

                      <b-col cols="12" md="6" >
                           
                        <el-divider>Datos Wompi</el-divider>

                           <template v-if="formulario.wompi">
                              <b-form-group label="Sandbox - llave publica">

                                 <validation-provider name="wompi.sandbox.llave_publica" #default="{ errors, valid }">
                                    <b-form-input v-model="formulario.wompi.sandbox.llave_publica" :state="valid"/>

                                    <b-form-invalid-feedback :state="valid">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>

                              <b-form-group label="Sandbox - llave privada">

                                 <validation-provider name="wompi.sandbox.llave_privada" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.wompi.sandbox.llave_privada" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                              </b-form-group>

                               <b-form-group label="Production - llave publica">

                                    <validation-provider name="production.llave_publica" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.wompi.production.llave_publica" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                              </b-form-group>

                              <b-form-group label="Production - llave privada">

                                 <validation-provider name="wompi.production.llave_privada" #default="{ errors, valid }">
                                       <b-form-input v-model="formulario.wompi.production.llave_privada" :state="valid"/>

                                       <b-form-invalid-feedback :state="valid">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                              </b-form-group>

                              <b-form-group label="¿ En producción ?">

                                 <validation-provider name="wompi.is_production" #default="{ errors, valid }">
                                    <b-form-radio-group v-model="formulario.wompi.is_production" 
                                    :options="[{ text: 'Sí', value: true }, { text: 'No', value: false }]"
                                    ></b-form-radio-group>

                                    <b-form-invalid-feedback :state="valid">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>
                           </template>
                           
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
   VBTooltip,
   BFormRadioGroup,

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
      BFormRadioGroup,
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

               if (formulario.value.paypal == null) {

                  formulario.value.paypal = {
                     cliente_id: null,
                     secret: null,
                     production: false,
                  }
               }


               if (formulario.value.wompi == null) {

                  formulario.value.wompi  = {
                     sandbox: {
                        llave_publica: null,
                        llave_privada: null,
                     },
                     production: {
                        llave_publica: null,
                        llave_privada: null,
                     },
                     is_production: false,
                  }
               }

                if (formulario.value.mercado_pago == null) {

                  formulario.value.mercado_pago = {
                     public_key: null,
                     token: null,
                     cliente_id: null,
                     cliente_secret: null,
                     is_production: false,
                  }
               }
            })
         }else{
            urlLogoClaro.value = `/storage/logotipos/${formulario.value.logotipo_claro}`
            urlLogoOscuro.value = `/storage/logotipos/${formulario.value.logotipo_oscuro}`

            formulario.value.logotipo_claro = null
            formulario.value.logotipo_oscuro = null

            if (formulario.value.paypal == null) {

               formulario.value.paypal = {
                  cliente_id: null,
                  secret: null,
                  production: false,
               }
            }

             if (formulario.value.wompi == null) {

               formulario.value.wompi = {
                  sandbox: {
                     llave_publica: null,
                     llave_privada: null,
                  },
                  production: {
                     llave_publica: null,
                     llave_privada: null,
                  },
                  is_production: false,
               }
            }

            if (formulario.value.mercado_pago == null) {

               formulario.value.mercado_pago = {
                  public_key: null,
                  token: null,
                  cliente_id: null,
                  cliente_secret: null,
                  is_production: false,
               }
            }

         }
      }


      cargarForm();
      // onMounted(() => cargarForm())

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

         store.dispatch('sistema/updateLogo',{modo,archivo:file}).then(({result}) => {
            if(result){
               toast.success('Se ha cargado con éxito el logo',{position:'bottom-right'})
               cargarForm()
            }else{
               toast.success('No se pudo cargar el logo', { position: 'bottom-right' })

            }
         })
      
      }

      const agregarCuenta = () => {

         store.commit('sistema/agregarCuenta')

      }
      const eliminarCuenta = (cuenta,i)=> {

         if(cuenta.id){
            store.dispatch('sistema/eliminarCuenta',cuenta.id).then(({result}) => {

               if(result){
                  toast.success('Se ha eliminado con éxito la cuenta')
                  // store.commit('sistema/eliminarCuenta',i)
               }else{
                  toast.info('No se pudo eliminar, intente de nuevo')

               }
            })
         }else{
            store.commit('sistema/eliminarCuenta', i)

         }
        
      }


      const agregarCuentaBancaria =(cuenta) => {

         store.dispatch('sistema/agregarCuenta',cuenta).then(({result}) => {
            if(result){
               toast.success('Hemos agregado con éxito la cuenta')
            }else{
               toast.info('No se pudo agregar la cuenta, inténtelo de nuevo')
            }
         })

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
         logotipo_oscuro,
         agregarCuenta,
         agregarCuentaBancaria,

         eliminarCuenta
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
