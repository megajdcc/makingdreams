<template>
   <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <!-- Form -->
      <b-form class="p-2 w-100" @submit.prevent="handleSubmit(guardar)" @reset.prevent="resetForm">

         <b-row class="w-100">
            <b-col>
               <b-tabs v-if="form" pills vertical>

                  <!-- Tab: Cuenta -->
                  <b-tab active>

                     <template #title>
                        <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
                        <span class="d-none d-sm-inline">Cuenta</span>
                     </template>

                     <b-card>
                        
                        <b-media no-body v-if="form.id">
                           <b-media-aside>
                              <b-link>
                                 <b-img ref="previewEl" rounded :src="form.avatar" height="80" />
                              </b-link>
                              <!--/ avatar -->
                           </b-media-aside>
                        
                           <b-media-body class="mt-75 ml-75">
                        
                              <b-row>
                                 <b-col>
                                    <h4 class="mb-1" v-text="title(`${form.nombre} ${form.apellido}`)"></h4>
                                 </b-col>
                              </b-row>
                              <b-row>
                                 <!-- upload button -->
                                 <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" size="sm" class="mb-75 mr-75"
                                    @click="$refs.refInputEl.$el.click()">
                                    Actualizar
                                 </b-button>
                        
                                 <b-form-file ref="refInputEl" v-model="profileFile" accept=".jpg, .png, .gif, .jpeg" :hidden="true" plain
                                    @input="cargarImagen" />
                                 <!--/ upload button -->
                                 <!--/ reset -->
                                 <b-card-text>Solo se permiten imagen del tipo JPG, GIF o PNG. Max tamaño de 800kB
                                 </b-card-text>
                              </b-row>
                           </b-media-body>
                        </b-media>

                        <b-form>
                           <b-row class="mt-1">
                        
                              <!-- Field: nombre -->
                              <b-col cols="12" md="4">
                                 <validation-provider #default="{errors}" name="Nombre" rules="required">
                                    <b-form-group label="Nombre" label-for="nombre">
                                       <b-form-input id="nombre" v-model="form.nombre" autofocus :state="errors.length ? false : null" trim
                                          placeholder="" />
                        
                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                        
                                    </b-form-group>
                                 </validation-provider>
                        
                              </b-col>
                        
                              <!-- Field: Apellido -->
                              <b-col cols="12" md="4">
                                 <!-- Apellido -->
                                 <validation-provider #default="{errors}" name="apellido" rules="required">
                                    <b-form-group label="Apellido" label-for="apellido">
                                       <b-form-input id="apellido" v-model="form.apellido" autofocus :state="errors.length ? false : null" trim
                                          placeholder="Crespo" />
                        
                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </b-form-group>
                                 </validation-provider>
                              </b-col>
                        
                        
                              <!-- Field: Email -->
                              <b-col cols="12" md="4">
                                 <!-- Email -->
                                 <validation-provider #default="{errors}" name="Email" rules="required|email">
                                    <b-form-group label="Email" label-for="email">
                                       <b-form-input id="email" v-model="form.email" :state="errors.length ? false : null" trim />
                        
                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </b-form-group>
                                 </validation-provider>
                        
                              </b-col>
                        
                        
                              <!-- Field: Rol de usuario -->
                              <b-col cols="12" md="4">
                                 <!-- User Role -->
                                 <validation-provider #default="{errors}" name="rol_id" rules="required">
                        
                                    <b-form-group label="Rol de usuario" label-for="user-role" :state="errors.length ? false : null">
                        
                                       <v-select v-model="form.rol_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="getRols"
                                          :reduce="val => val.value" :clearable="false" input-id="user-role" />
                        
                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                        
                                    </b-form-group>
                                 </validation-provider>
                              </b-col>

                              <b-col cols="12" md="4">
                                
                                 <b-form-group label="Fecha Nacimiento" label-for="birth-date">
                                    <validation-provider name="fecha_nacimiento" #default="{errors,valid}">
                                          
                                       <flat-pickr v-model="form.fecha_nacimiento" 
                                          class="form-control" 
                                          :config="{ dateFormat: 'Y-m-d'}" 
                                          placeholder="YYYY-MM-DD" />

                                          <b-form-invalid-feedback :state="valid">
                                             {{ errors[0] }}
                                          </b-form-invalid-feedback>

                                    </validation-provider>

                                 
                                 </b-form-group>
                              </b-col>
                        
                           </b-row>
                        </b-form>
                     
                     </b-card>

                  </b-tab>

                  <!-- Cuentas Bancarias -->
                  <b-tab lazy>
                     <template #title>
                        <feather-icon icon="ListIcon" />
                        Datos Bancarios
                     </template>

                     <datos-bancario :usuario="usuario" isUser />

                  </b-tab>

                  <!-- Telefonos -->
                  <b-tab lazy>
                  
                     <template #title>
                        <feather-icon icon="PhoneIcon" />
                        <span class="font-weight-bold">Teléfonos</span>
                     </template>
                  
                     <user-telefonos :usuario="usuario" isUser />
                  
                  </b-tab>
                
               </b-tabs>
            </b-col>
         </b-row>

         <b-row>
            <b-col>
               <!-- Form Actions -->
               <div class="d-flex mt-2">


                  <b-button-group size="sm">


                     <b-button @click="regresar" title="regresar">
                        <feather-icon icon="ArrowLeftIcon" />
                        Regresar
                     </b-button>

                     <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" type="submit" v-loading="loading">
                        Guardar
                     </b-button>
                     <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" v-if="!form.id" type="reset" variant="outline-secondary">
                        Limpiar
                     </b-button>

                  </b-button-group>

               </div>
            </b-col>
         </b-row>



      </b-form>
   </validation-observer>
</template>


<script>
import {
   BCol,
   BRow,
   BForm,
   BFormGroup, 
   BFormInput, 
   BFormInvalidFeedback, 
   BButton, 
   BFormTextarea,
   BTab, 
   BTabs, 
   BCard, 
   BAlert, 
   BLink,
   BInputGroup, 
   BInputGroupPrepend,
   BAvatar,
   BCardHeader,
   BCardTitle,
   BFormCheckbox,
   BFormRadioGroup, 
   BFormCheckboxGroup,
   BMedia,
   BMediaAside, 
   BMediaBody,
   BImg,
   BFormFile,
   BCardText,
   BButtonGroup

} from 'bootstrap-vue'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import formValidation from '@core/comp-functions/forms/form-validation'

import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import store from '@/store'
import {onMounted, ref, watch,toRefs,computed} from 'vue'
import { required, alphaNum, email } from '@validations'
import { avatarText,title } from '@core/utils/filter'
import flatPickr from 'vue-flatpickr-component'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import useUsersList from './useUsersList'

import {regresar} from '@core/utils/utils'

export default {
   
   components:{
      BMediaAside,
      BMediaBody,
      BImg,
      BFormRadioGroup,
      BFormCheckboxGroup,
      BAvatar,
      BCardHeader,
      BCardTitle,
      BFormCheckbox,
      BTab,
      BTabs,
      BCard,
      BAlert,
      BLink,
      BForm,
      BCol,
      BRow,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButton,

      ValidationProvider,
      ValidationObserver,
      vSelect,
      BFormTextarea,
      BInputGroup,
      BInputGroupPrepend,
      flatPickr,
      BMedia,
      BFormFile,
      BCardText,
      BButtonGroup,

      DatosBancario:() => import('views/perfil/DatosBancario.vue'),
      UserTelefonos: () => import('views/perfil/UserTelefonos.vue'),


   },

   directives:{
      Ripple
   },

   setup(props, { emit }) {
      
      const { resolveUserRoleVariant } = useUsersList()
      const getRols = computed(() => store.getters['rol/getRols'])
      const { refFormObserver, getValidationState, resetForm } = formValidation(resetuserData)
      const profileFile = ref(null)
      // const {usuario:form} = toRefs(store.state.usuario)
      const form = computed(() => store.getters['usuario/draft'])

      const cargarform = () => {

         if(!getRols.value.length){
            store.dispatch('rol/cargarRoles')
         }

      }

      onMounted(() => {
         cargarform()
      })


      watch([form], () => {
         cargarform();
      })

      const resetuserData = () => store.commit('usuario/clearUsuario')

      const guardar =  () => {
         emit('save',form.value,refFormObserver.value)
      }

      const whatsappOptions = [
         { text: 'Si', value: true },
         { text: 'No', value: false }
      ]

       // ? Demo Purpose => Update image on click of update
      const refInputEl = ref(null)
      const previewEl = ref(null)

      const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

      const cargarImagen = (file) => {

         let dat = new FormData();
         dat.append('filepond', profileFile.value);
         
         store.dispatch('usuario/updateAvatarUser',dat).then(({data:datos}) => {
            store.commit('usuario/actualizarAvatarDeUsuario',datos)
         }).catch(e => console.log(e))

      }

      return {
         refFormObserver,
         getValidationState,
         resetForm,
         guardar,
         form,
         cargarform,
         whatsappOptions,
         avatarText,
         title,
         inputImageRenderer,
         refInputEl,
         previewEl,
         resolveUserRoleVariant,
         regresar,
         required,
         alphaNum,
         email,
         profileFile,
         loading:computed(() => store.state.loading),
         getRols,
         cargarImagen,
         usuario:computed(() => store.state.usuario.user)
         
      }
  }
}

</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
