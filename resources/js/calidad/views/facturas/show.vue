<template>
   <b-container fluis>
      <div class="row">
         <div class="col-12 col-md-8">
               <b-card v-if="factura.archivo">
                  <pdf :src="`/storage/facturas/${factura.archivo}`" ref="pdfRef" style="
                                display: inline-block;
                                width: 100%;
                                max-heigth: 450px;
                                overflow-y: auto !important;
                              ">
                  </pdf>
               </b-card>
         </div>

         <div class="col-12 col-md-4">
            <b-card class="w-100">

               <b-button-group size="sm">
               
                  <b-button variant="success" title="Enviar factura por correo electrónico" @click="() => showDialog = true"
                     v-b-tooltip.hover>
                     <feather-icon icon="SendIcon" />
                     Enviar
                  </b-button>
               
                  <b-button :href="`/storage/facturas/${factura.archivo}`" variant="secondary" target="_blank" download>
                     <feather-icon icon="DownloadIcon" />
                  </b-button>
               
                  <b-button variant="info" @click="imprimir">
                     <feather-icon icon="PrinterIcon" />
                  </b-button>
               
               </b-button-group>
            
            </b-card>
          
         </div>
      </div>
      <b-sidebar v-model="showDialog" left title="Enviar por correo electrónio" backdrop>
         <validation-observer #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(enviarEmail)">
               <b-container fluid>
                  <b-row>
                     <b-col cols="12">

                        <b-form-group description="Destinatario del correo">
                           <template #label>
                              Para: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="from" rules="required|email" #default="{errors}">
                              <b-form-input v-model="formulario.from" :state="errors.length ? false : null"
                                 placeholder="Danny@gmail.com" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Quien lo está enviando">
                           <template #label>
                              De: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="to" rules="required|email" #default="{errors}">
                              <b-form-input v-model="formulario.to" :state="errors.length ? false : null"
                                 placeholder="Danny@gmail.com" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>


                        <b-form-group description="Cual es el asunto del correo">
                           <template #label>
                              Subject: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="subject" rules="required" #default="{errors}">
                              <b-form-input v-model="formulario.subject" :state="errors.length ? false : null"
                                 placeholder="Factura " />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Porque le estás enviándo esta factura ">
                           <template #label>
                              Mensaje: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="mensaje" rules="required" #default="{errors}">

                              <b-form-textarea v-model="formulario.mensaje" :rows="3"
                                 :state="errors.length ? false : null" />

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
                           <b-button type="submit" title="Enviar correo" v-b-tooltip.hover v-loading="loading">
                              <feather-icon icon="SendIcon" />
                              Enviar
                           </b-button>
                        </b-button-group>
                     </b-col>
                  </b-row>
               </b-container>
            </b-form>
         </validation-observer>

      </b-sidebar>

   </b-container>
</template>

<script>
import store from "@/store";
import { ref, toRefs, onMounted, watch,computed } from "vue";
import { BCard, BButton, VBTooltip,BLink,BButtonGroup} from "bootstrap-vue";
import pdf from "vue-pdf";

import {ValidationObserver,ValidationProvider} from 'vee-validate'
import {required,email} from '@validations'


import {
   BForm,
   BFormGroup,
   BFormInput,
   BFormTextarea,
   BFormInvalidFeedback,
   BContainer,
   BRow,
   BCol,
   BFormRadioGroup,
   BSidebar

} from 'bootstrap-vue'

export default {
  props: ["id"],

  components: {
    BCard,
    pdf,
    BButton,
    BLink,
    BButtonGroup,
      BForm,
      BFormGroup,
      BFormInput,
      BFormTextarea,
      BFormInvalidFeedback,
     ValidationObserver,
   ValidationProvider,
     BContainer,
     BRow,
     BCol,
     BFormRadioGroup,
     BSidebar


  },

  directives: {
    "b-tooltip": VBTooltip,
  },

  setup(props) {

      let { factura } = toRefs(store.state.factura);
      const {id} = toRefs(props)
     const pdfRef = ref(null)
     const showDialog = ref(false)

      const formValidate = ref(null)

      const formulario = ref({
         to     : '',
         from   : '',
         mensaje: '',
         subject: '',
      })


      const cargarForm = () => {
         
         store.dispatch('factura/fetchFactura',id.value).then((data) => {
            store.commit('factura/capturar',Number(id.value))
         }) 


      };

      onMounted(() => {
         cargarForm();
      });

      watch(id, () => {
         cargarForm();
      });

     


     const enviarEmail = () => {

      
      axios.put(`/api/facturas/${id.value}/enviar/correo`,formulario.value).then(({data}) => {
         
         if(data.result){
            toast.success('El correo se ha enviado con éxito')
            
            formulario.value = {
               to: '',
               from: '',
               mensaje: '',
               subject: '',
            }

         }else{
            toast.error('No se pudo enviar el correo, inténtelo de nuevo mas tarde')
         }

      }).catch(e => {
         
       console.log(e)

      }).then(() => {

      })


     }


      return {
         cargarForm,
         factura,
         required,
         formValidate,
         pdfRef,
         showDialog,
         imprimir:() => pdfRef.value.print(),
         loading:computed(() => store.state.loading),
         formulario,
         email,
         enviarEmail,
         firmadaOptions:[
            {
               text:'Sí',
               value:true,
            },
            {
               text: 'Nó',
               value: false,
            }
         ]
      };
  },
};
</script>