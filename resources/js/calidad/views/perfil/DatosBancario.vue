<template>
      <b-card>
         <validation-observer ref="formValidate" #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(guardar)">
               <b-container fluid>

                  <template v-if="usuario.datos_bancarios.length < 5 ">
                     <b-row>
                        <b-col cols="12" md="4">
                           <b-form-group description="Nombre del Banco">
                              <template >
                                 Entidad Financiera: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="entidad" rules="required" #default="{errors,valid}">
                                 
                                 <b-form-input v-model="formulario.entidad" :state="valid"  placeholder="Nombre del banco" />
                                 
                                 <b-form-invalid-feedback >
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>

                        
                                 
                        </b-col>

                        <b-col cols="12" md="4">

                           <b-form-group >
                              <template>
                                 Número de cuenta: <span class="text-danger">*</span>
                              </template>
                           
                              <validation-provider name="numero" rules="required" #default="{errors,valid}">
                           
                                 <b-form-input v-model="formulario.numero" :state="valid" />
                           
                                 <b-form-invalid-feedback>
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                           
                              </validation-provider>
                           </b-form-group>

                        
                        </b-col>

                        <b-col cols="12" md="4">
                        
                           <b-form-group>
                              <template>
                                 ¿Esta cuenta es la principal ?: <span class="text-danger">*</span>
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
                                 Banco
                              </th>
                              <th>
                                 Número de cuenta
                              </th>
                              <th>
                                 Está cuenta es la principal ? 
                              </th>
                              <th></th>
                           </thead>

                           <tbody>
                              <tr v-for="(cuenta,i) in usuario.datos_bancarios" :key="i" >
                                 <td>
                                    <span>
                                       {{ cuenta.entidad }}
                                    </span>
                                 </td>
                                 <td>
                                    <span>
                                       {{ cuenta.numero }}
                                    </span>
                                 </td>

                                 <td>
                                    <span>
                                       {{ cuenta.principal ? 'Sí' : 'No' }}
                                    </span>
                                 </td>
                                 <td>
                                    <b-button size="sm" variant="danger" @click="quitarCuenta(cuenta)">
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

   props:{
      usuario:{
         type:Object,
         required:false
      },
      isUser:{
         type:Boolean,
         default:false,
      }
   },

 
   setup(props){

      const formValidate = ref(null)
      const {usuario:user,isUser} = toRefs(props)

      const usuario = computed(() => user.value ? user.value : store.state.usuario.usuario)

      const formulario = ref({
         entidad:'',
         principal:false,
         numero:null
      }) 

      const guardar = () => {

         store.dispatch('usuario/agregarDatoBancario', { datos: formulario.value ,usuario:usuario.value,isUser:isUser.value}).then(({result}) => {
            if(result){
               toast.success('Se ha agregado con éxito el dato bancario',{position:'bottom-right'})
               
               formulario.value = {
                  entidad: '',
                  principal: false,
                  numero: null
               }

            }else{
               toast.info('No se pudo agregar el dato Bancario, intételo de nuevo', { position: 'bottom-right' })
            }

         }).catch(e => {
            console.log(e)
            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }

         })

      }


      const quitarCuenta = (cuenta) => {
         store.dispatch('usuario/quitarDatoBancario',{cuenta:cuenta,isUser:isUser.value}).then(({result}) => {
            
            if(result){
               toast.info('Se ha eliminado con éxito el dato Bancario',{position:'bottom-right'})
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

         quitarCuenta,
         loading:computed(() => store.state.loading)
      }
   }


}
</script>