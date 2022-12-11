<template>
  <b-card>
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="row" v-if="orden.archivo">


          <pdf :src="`/storage/ordenes/${orden.archivo}`" ref="pdfRef"
            style="
              display: inline-block;
              width: 100%;
              max-heigth: 450px;
              overflow-y: auto !important;
            ">
            </pdf>
        </div>
      </div>

      <div class="col-12 col-md-4">

         <validation-observer ref="formValidate" #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(guardar)">
               <b-container fluid>
                  <b-row>
                     <b-col cols="12">
                        <b-form-group description="Si tanto el chofer y el cliente han firmado, puedes marcar esto...">
                           <template #label>
                              Fírmada:
                           </template>
                           <validation-provider name="firmada" #default="{errors}">
                        
                              <b-form-radio-group v-model="orden.firmada" :options="firmadaOptions" :state="errors.length ? false : null" />
                        
                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        
                        </b-form-group>

                        <b-form-group description="Puedes ajustar el comentario" >
                           <template #label>
                              Comentarios
                           </template>
                           <validation-provider name="comentarios" #default="{errors}">
                              
                              <b-form-textarea v-model="orden.comentarios" :state="errors.length ? false : null" :rows="4" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>

                        </b-form-group>

                      

                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col cols="12">
                        <b-button-group size="sm" class="w-100">


                           <b-button type="submit" variant="primary" v-loading="loading" v-b-tooltip.hover title="Guardar" v-if="$can('update','ordenes')">
                              <feather-icon icon="SaveIcon" />
                              <!-- Guardar -->
                           </b-button>

                           <b-button :to="{name:'update.orden',params:{orden_id:orden.id}}" variant="warning" v-loading="loading" v-b-tooltip.hover title="Actualizar Orden"
                              v-if="$can('update','ordenes')">
                              <feather-icon icon="EditIcon" />
                           </b-button>

                           <b-button variant="success" title="Enviar Orden por correo electrónico" @click="() => showDialog = true" v-b-tooltip.hover>
                              <feather-icon icon="SendIcon" />
                              <!-- Enviar -->
                           </b-button>
                        
                           <b-button :href="`/storage/ordenes/${orden.archivo}`" variant="secondary" target="_blank" download>
                              <feather-icon icon="DownloadIcon" />
                           </b-button>
                           <b-button variant="info" @click="imprimir">
                              <feather-icon icon="PrinterIcon" />
                           </b-button>

                           <b-button variant="dark" @click="showFirmas">
                              <span class="fas fa-signature"></span>
                              Firmas
                           </b-button>

                        </b-button-group>
                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col>
                        <strong class="text-danger">Nota:</strong>
                        <p class="text-justify">Es importante que sepa que el documento una vez firmado en físico y marcado aquí como firmado, el documento se auto firma de mánera Automática solo si el cliente y el chofer tienen sus Firmas digitales registradas...</p>
                     </b-col>
                  </b-row>
               </b-container>
            </b-form>
         </validation-observer>

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
                           <b-form-input v-model="formulario.from" :state="errors.length ? false : null" placeholder="Danny@gmail.com" />
                     
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
                           <b-form-input v-model="formulario.to" :state="errors.length ? false : null"  placeholder="Danny@gmail.com" />
                     
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
                           <b-form-input v-model="formulario.subject" :state="errors.length ? false : null" placeholder="Orden de entrega " />
                     
                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>

                     <b-form-group description="Porque le estás enviando esta orden ">
                        <template #label>
                           Mensaje: <span class="text-danger">*</span>
                        </template>
                     
                        <validation-provider name="mensaje" rules="required" #default="{errors}">

                          <b-form-textarea v-model="formulario.mensaje" :rows="3" :state="errors.length ? false : null" />
                     
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

   <b-sidebar v-model="isShowFirmas" left title="Firmar Orden" backdrop lazy>
      <validation-observer ref="formValidateFirmas" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardarFirmas)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12">
                     <b-form-group >
                        <template #label>
                           Quien Firma ?:<span class="text-danger">*</span>
                        </template>
                        
                        <validation-provider name="quien_firma" rules="required" #default="{errors,valid}">
                           <v-select v-model="formFirmante.firmante" :options="firmanteOptions" :reduce="(option) => option.value" />
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        </validation-provider>

                     </b-form-group>


                     <b-form-group v-if="formFirmante.firmante === 3" description="Nombre del firmante"> 
                        <template #label>
                           Nombre :<span class="text-danger">*</span>
                        </template>
                     
                        <validation-provider name="nombre" rules="required" #default="{errors,valid}">
                           <b-form-input v-model="formFirmante.nombre" :state="valid" />
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     
                     </b-form-group>

                    

                     <b-form-group description="Establezca la firma digital">
                        
                        <template #label>
                           Firma ?:<span class="text-danger">*</span>
                        </template>
                     
                        <validation-provider name="firma" #default="{errors,valid}">
                     
                        <VueSignaturePad id="signature" width="100%" height="150px" ref="signaturePad" :options="{ penColor:'#000' }" />
                     
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
                        <b-button type="submit" title="Guardar Firma" v-b-tooltip.hover v-loading="loading" variant="primary">
                           <feather-icon icon="SendIcon" />
                           Establecer
                        </b-button>

                        <b-button @click="limpiarUltimaLinea" title="Eliminar ultimo trazo" variant="info">
                           <feather-icon icon="ArrowLeftIcon" />
                           Deshacer
                        </b-button>
                        
                        <b-button @click="limpiar" title="limpiar" variant="danger">
                           <feather-icon icon="TrashIcon" />
                           Limpiar
                        </b-button>

                     </b-button-group>
                  </b-col>
               </b-row>
            </b-container>
         </b-form>
      </validation-observer>
   
   </b-sidebar>

  </b-card>
</template>

<script>
import store from "@/store";
import { ref, toRefs, onMounted, watch,computed } from "vue";
import { BCard, BButton, VBTooltip,BLink,BButtonGroup} from "bootstrap-vue";
import pdf from "vue-pdf";

import {ValidationObserver,ValidationProvider} from 'vee-validate'
import {required,email} from '@validations'
import vSelect from 'vue-select'

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
     BSidebar,
     vSelect


  },

  directives: {
    "b-tooltip": VBTooltip,
  },

  setup(props) {

      let { orden } = toRefs(store.state.orden);
      const {id} = toRefs(props)
      const pdfRef = ref(null)
      const showDialog = ref(false)
      const isShowFirmas = ref(false)
      const formValidate = ref(null)
      const formValidateFirmas = ref(null)
      const signaturePad = ref(null)
 
   
     const formulario = ref({
         to     : '',
         from   : '',
         mensaje: '',
         subject: '',
      })

      const formFirmante = ref({
            firmante: 1, // 1 => Chofer, 2 => Cliente, 3 => quien recibe,
            nombre: '',
            firma:null
      })


      const cargarForm = () => {
         
         store.dispatch('orden/fetchOrden',id.value).then((data) => {
            store.commit('orden/capturar',Number(id.value))
         }) 


      };

      onMounted(() => {
         cargarForm();
      });

      watch(id, () => {
         cargarForm();
      });

      const enviarOrden = () => {

      };

      const guardar = () => {
         
         store.dispatch('orden/guardar',orden.value).then(({result,orden:ord}) => {
            
            if(result){
               toast.success('Se ha actualizado la orden con éxito')
                store.commit('orden/setOrden',ord)
               pdfRef.value.pdf.loadDocument(`/storage/ordenes/${ord.archivo}`);
            }else{
               toast.info('La orden no se pudo guardar,inténtelo de nuevo mas tarde')
            }

         }).catch(e => {
            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }
         })


      }

     const enviarEmail = () => {

      
      axios.put(`/api/ordens/${id.value}/enviar/correo`,formulario.value).then(({data}) => {
         
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

     const showFirmas = () => {
      isShowFirmas.value = true
     }

     const guardarFirmas = () => {
        const { isEmpty, data } = signaturePad.value.saveSignature()

        if (!isEmpty) { 

         formFirmante.value.firma = data;

           store.dispatch('orden/establecerFirmas', { data: formFirmante.value ,orden_id:orden.value.id}).then(({ result,orden:ord }) => {

              if (result) {
                 toast.success('Se ha establecido con éxito la firma')
                 pdfRef.value.pdf.loadDocument(`/storage/ordenes/${ord.archivo}`);

                 formFirmante.value = {
                        firmante: 1, 
                        nombre: '',
                        firma:null
                 }

                 isShowFirmas.value = false;



              } else {
                 toast.info('No se pudo establecer la firma, inténtelo de nuevo')
              }

           }).catch(e => {

            console.log(e)
            
            if(e.response.status === 422){
               formValidateFirmas.value.setErrors(e.response.data.errors)
            }

            console.log(e)

           });

        }
     }

     const limpiarUltimaLinea = () => {
        signaturePad.value.undoSignature();
     }

     const limpiar = () => {
        signaturePad.value.clearSignature();
        console.log(signaturePad.value)
     }

      return {
         cargarForm,
         enviarOrden,
         orden,
         required,
         formValidate,
         formValidateFirmas,
         guardar,
         pdfRef,
         showDialog,
         imprimir:() => pdfRef.value.print(),
         loading:computed(() => store.state.loading),
         formulario,
         email,
         enviarEmail,
         showFirmas,
         isShowFirmas,
         guardarFirmas,
         formFirmante,
         signaturePad,
         limpiarUltimaLinea,
         limpiar,
         firmadaOptions:[
            {
               text:'Sí',
               value:true,
            },
            {
               text: 'Nó',
               value: false,
            }
         ],

         firmanteOptions:[
            {
               label:'Chofer (Driver)',
               value:1
            },
            {
               label: 'Cliente',
               value: 2
            },
            {
               label: 'Quien Recibe',
               value: 3
            }
         ]
      };
  },
};
</script>

<style lang="scss">
#signature {
   border: double 3px transparent;
   border-radius: 5px;
   background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #1e292c, #9c49a3);
   background-origin: border-box;
   background-clip: content-box, border-box;
}

.container {
   width: "100%";
   padding: 8px 16px;
}

.buttons {
   display: flex;
   gap: 8px;
   justify-content: center;
   margin-top: 8px;
}
</style>