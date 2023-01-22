<template>
   <b-tabs  fill pill small>

      <b-tab active>
         <template #title>
            <!-- <section class="content-btn p-1">
               <b-img :src="LogoPaypal" class="procesadores"></b-img>
      
            </section> -->
            <strong>Paypal</strong>

           
         </template>
      
      
         <b-card>
            <b-form-group>

               <template #label>
                  Monto a pagar: <span class="text-danger">*</span>
               </template>

               <validation-provider name="monto" rules="required" #default="{valid,errors}">

                  <currency-input v-model="monto" :options="optionsCurrency" :disabled="true" input-class="form-control"></currency-input>

                  <PayPal :amount="monto" currency="USD" :client="credentialsPaypal" env="sandbox" class="mt-1" @payment-completed="pagoCompletadoPaypal">

                  </PayPal>

                  <b-form-invalid-feedback :state="valid">
                     {{  errors[0] }}
                  </b-form-invalid-feedback>

               </validation-provider>

            </b-form-group>

            <b-button @click="pagar" variant="pagar">
            </b-button>
         </b-card>
      </b-tab>

      <b-tab >
         <template #title>
            <!-- <section class="content-btn p-1">
               <b-img :src="LogoWompi" class="procesadores" ></b-img>

            </section> -->

            <strong>Wompi</strong>
         </template>


         <b-card>

         </b-card>
      </b-tab>

      <b-tab>
         <template #title>
            <!-- <section class="content-btn p-1"> -->
              <strong>Consignación Bancaria</strong> 
            <!-- </section> -->
         </template>
      
      
         <b-card>
      
         </b-card>
      </b-tab>

    

     
   </b-tabs>
</template>

<script>

import {
   ValidationObserver,
   ValidationProvider
} from 'vee-validate'

import {
   BForm,
   BFormInput,
   BCard,
   BButton,
   BButtonGroup,
   BTabs,
   BTab,
   BImg,
   BFormGroup,
   BFormInvalidFeedback

} from 'bootstrap-vue'
import { optionsCurrency } from '@core/utils/utils'
import store from '@/store'
import PayPal from 'vue-paypal-checkout'

import {
   computed,
   onMounted,
   toRef,
   toRefs,
   ref,
   watch
 } from 'vue'

import {required} from '@validations';

import router from '@/router'

export default {
   
   components:{
      BForm,
      BFormInput,
      BCard,
      BButton,
      BButtonGroup,
      ValidationObserver,
      ValidationProvider,
      BTabs,
      BTab,
      BImg,
      BFormGroup,
      BFormInvalidFeedback,
      PayPal,
      CurrencyInput:() => import('components/CurrencyInput.vue')

   },


   setup(){
      
      const {sistema} = toRefs(store.state.sistema)
      const usuario = computed(() => store.state.usuario.usuario)
      const LogoWompi = require('@/assets/images/logos/wompi-logo-black.png');
      const LogoPaypal = require('@/assets/images/logos/logo-Paypal.png');
      const monto = ref(0)
      
      const cargarForm = () => {
         monto.value = sistema.value.monto_inicial
      }

      watch(sistema,() => cargarForm())
      onMounted(() => cargarForm())

      const credentialsPaypal = {
         sandbox: 'AV3n2lzr67F2JiJJGkxxBM7jCW52qzi5nmayPG0T7eLP-SrPXHzEGI_t13fxspHJOcbXXT-0puRRDRIb',
         production: '<production client id>'
      }

      const pagar = () => {

      }


      const pagoCompletadoPaypal = ({payer,state}) => {
        
         if(state === 'approved'){
            
            store.dispatch('pago/guardar',{
               monto:monto.value,
               aprobado:true,
               status:2,
               usuario_id:usuario.value.id,
               concepto:`Donación por derecho a Backoffice, pago realizado por Paypal con el ID ${payer.payer_info.payer_id}`,
               detalles:payer,
               metodo:1
            }).then(({result,usuario:user}) => {
               
               if(result){
                  toast.success('Su pago se ha aprobado con éxito', { position: 'bottom-right' })
                  store.commit('usuario/updatePerfil',user)
                  router.push({name:'home'})
               }else{
                  toast.info('No pudimos aprobar tu pago, danos 24 horas para verificar tu pago, te estaremos informando',{position:'bottom-right'})
               }
             
            })
               
         }else{
               toast.info('Su pago no fue aprobado con éxito ...',{position:'bottom-right'})
         }

      }


      return {
         loading:computed(() => store.state.loading),
         sistema,
         LogoWompi,
         LogoPaypal,
         usuario,
         optionsCurrency,
         required,
         monto,
         credentialsPaypal,
         pagar,
         pagoCompletadoPaypal

      }
   }

}
</script>

<style lang="scss">


.content-btn{
      background-color: aliceblue;
      .procesadores{
         width: auto !important;
         height: 40px !important;
         object-fit: contain;
      }
   }

</style>