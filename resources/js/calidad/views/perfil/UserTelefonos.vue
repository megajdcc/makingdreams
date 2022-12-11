<template>
      <b-card>
         <validation-observer ref="formValidate" #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(guardar)">
               <b-container fluid>

                  <template v-if="usuario.telefonos.length < 5 ">
                     <b-row>
                        <b-col cols="12" md="4">
                           <b-form-group>
                              <template >
                                 Número de teléfono: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="numero" rules="required" #default="{errors,valid}">
                                 
                                 <b-form-input v-model="formulario.numero" :state="valid" v-mask="'+#############'" placeholder="Ejemplo: +574121234578" />

                                 <b-form-invalid-feedback >
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>

                        
                                 
                        </b-col>

                        <b-col cols="12" md="4">

                           <b-form-group>
                              <template>
                                 ¿Está asociado a whatsapp ?: <span class="text-danger">*</span>
                              </template>
                           
                              <validation-provider name="whatsapp" rules="required" #default="{errors,valid}">
                           
                                 <b-form-checkbox switch :value="true" :unchecked-value="false" v-model="formulario.whatsapp" :state="valid" />
                           
                                 <b-form-invalid-feedback>
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                           
                              </validation-provider>
                           </b-form-group>

                        
                        </b-col>

                        <b-col cols="12" md="4">
                        
                           <b-form-group>
                              <template>
                                 ¿Este número es el principal ?: <span class="text-danger">*</span>
                              </template>
                        
                              <validation-provider name="principal" rules="required" #default="{errors,valid}">
                        
                                 <b-form-checkbox switch :value="true" :unchecked-value="false" v-model="formulario.principal" :state="valid" />
                        
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
                              <b-button variant="primary" type="submit" v-loading="loading" >
                                 <feather-icon icon="SaveIcon" />
                                 Guardar
                              </b-button>
                           </b-button-group>
                        </b-col>
                     </b-row>

                  </template>


                  <b-row class="mt-1">

                     <b-col cols="12">
                        <table class="table table-sm table-hover table-bordeless w-100">
                           <thead>
                              <th>
                                 Número de teléfono
                              </th>
                              <th>
                                 Es el número principal ? 
                              </th>
                              <th>
                                 Está asociado a whatsapp ? 
                              </th>
                              <th></th>
                           </thead>

                           <tbody>
                              <tr v-for="(telefono,i) in usuario.telefonos" :key="i" >
                                 <td>
                                    <span>
                                       {{ telefono.numero }}
                                    </span>
                                 </td>
                                 <td>
                                    <span>
                                       {{ telefono.principal ? 'Sí' : 'No' }}
                                    </span>
                                 </td>

                                 <td>
                                    <span>
                                       {{ telefono.whatsapp ? 'Sí' : 'No' }}
                                    </span>
                                 </td>
                                 <td>
                                    <b-button size="sm" variant="danger" @click="quitarTelefono(telefono)">
                                       <feather-icon icon="TrashIcon"/>
                                       Quitar
                                    </b-button>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </b-col>
                  </b-row>
               </b-container>
            </b-form>
         </validation-observer>
      </b-card>
</template>

<script>

import {
   
   BCard,
   BContainer,
   BRow,
   BCol,
   BForm,
   BFormGroup,
   BFormInput,
   BFormInvalidFeedback,
   BFormCheckbox,
   BButtonGroup,
   BButton

} from 'bootstrap-vue'

import {ValidationObserver,ValidationProvider} from 'vee-validate'
import {required} from '@validations'
import store from '@/store'

import {toRefs,ref,computed} from 'vue'

export default {
   
   components:{
      BCard,
      BContainer,
      BRow,
      BCol,
      BForm,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      ValidationObserver,
      ValidationProvider,
      BFormCheckbox,
      BButtonGroup,
      BButton

   },


 
   setup(props){

      const formValidate = ref(null)
      const {usuario} = toRefs(store.state.usuario)

      const formulario = ref({
         numero:'',
         principal:false,
         whatsapp:false
      }) 

      const guardar = () => {

         store.dispatch('usuario/agregarTelefono',formulario.value).then(({result}) => {
            if(result){
               toast.success('Se ha agregado con éxito el número de teléfono',{position:'bottom-right'})
               
               formulario.value = {
                  numero: '',
                  principal: false,
                  whatsapp: false
               }

            }else{
               toast.info('No se pudo agregar el número de teléfono, intételo de nuevo', { position: 'bottom-right' })
            }

         }).catch(e => {
            console.log(e)
            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }

         })

      }


      const quitarTelefono = (telefono) => {
         store.dispatch('usuario/quitarTelefono',telefono).then(({result}) => {
            
            if(result){
               toast.info('Se ha eliminado con éxito el número de teléfono',{position:'bottom-right'})
            }else{
               toast.info('No se pudo eliminar, inténtelo de nuevo', { position: 'bottom-right' })

            }

         })

      }

      return {
         formValidate,
         guardar,
         required,
         formulario,
         usuario,
         quitarTelefono,
         loading:computed(() => store.state.loading)
      }
   }


}
</script>