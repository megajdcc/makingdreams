<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  
                  <b-col cols="12" md="6">
                     <b-form-group description="El número de entrega debe ser un identificador único para esta entrega" >
                        <template #label>
                           Número de entrega: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="numero" rules="required" #default="{errors}">
                           <b-form-input v-model="formulario.numero" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>
                  
                  <b-col cols="12" md="6">
                     <b-form-group description="El cliente puede ser representado por un empleado de la empresa o compañia cliente">
                        <template #label>
                           Cliente: <span class="text-danger">*</span>
                        </template>
                     
                        <validation-provider name="cliente_id" rules="required" #default="{errors}">
                          
                           <v-select v-model="formulario.cliente_id" :reduce="(val) => val.id " :options="empleados">
                              
                              <template #option="{nombre,imagen,apellido,email}">
                                 <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre }`" />
                                 <strong>{{ `${nombre} ${apellido} - ${email}` }}</strong>
                              </template>
                              
                              <template #selected-option="{nombre,imagen,apellido,email}">
                                 <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre }`" />
                                 <strong>{{ `${nombre} ${apellido} - ${email}` }}</strong>
                              </template>

                           </v-select>
                           
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>
                  </b-col>

               </b-row>

               <b-row>
                  <b-col cols="12" md="6">
                        <b-form-group description="El chofer quien esté asignado para la entrega del pedido">
                           <template #label>
                              Choferes: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="chofer_id" rules="required" #default="{errors}">

                              <v-select v-model="formulario.chofer_id" :reduce="(val) => val.id " :options="choferes">

                                 <template #option="{nombre,imagen,apellido,email}">
                                    <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre }`" />
                                    <strong>{{ `${nombre} ${apellido} - ${email}` }}</strong>
                                 </template>

                                 <template #selected-option="{nombre,imagen,apellido,email}">
                                    <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre }`" />
                                    <strong>{{ `${nombre} ${apellido} - ${email}` }}</strong>
                                 </template>

                              </v-select>

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>
                  </b-col>

                  <b-col cols="12" md="6">
                  <b-form-group description="Puede establecer un comentario con relación a la orden">
                     <template #label>
                        Comentarios: 
                     </template>
                  
                     <validation-provider name="comentarios" #default="{errors}">
                  
                       <b-form-textarea v-model="formulario.comentarios" :rows="2" :state="errors.length ? false : null"></b-form-textarea>
                  
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
                        <b-button variant="primary" v-loading="loading" type="submit" title="Guardar">
                           <feather-icon icon="SaveIcon"/>
                           Guardar
                        </b-button>
                        <b-button variant="info" v-loading="loading" type="button" title="Regresar" @click="regresar">
                           <feather-icon icon="ArrowLeftIcon" />
                           Regresar
                        </b-button>

                     </b-button-group>
                  </b-col>
               </b-row>
            </b-container>
         </b-form>
      </validation-observer>
   </b-card>
</template>

<script>
   import {
      ValidationObserver,
      ValidationProvider,
   } from 'vee-validate'

   import {required} from '@validations'

   import {
      BCard,
      BContainer,
      BRow,
      BCol,
      BForm,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      BAvatar,
      BFormTextarea

   } from 'bootstrap-vue'

   import {onMounted,ref,toRefs,watch,computed} from 'vue'
   import store from '@/store'

   import { regresar } from '@core/utils/utils'

   import vSelect from 'vue-select'

export default {
   
   components:{
      BForm,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      ValidationObserver,
      ValidationProvider,
      BCard,
      BContainer,
      BRow,
      BCol,
      vSelect,
      BAvatar,
      BFormTextarea


   },

   setup(props,{emit}) {
      
      const  { orden:formulario } = toRefs(store.state.orden)

      const { usuarios:empleados } = toRefs(store.state.usuario)
      
      const formValidate = ref(null)
      const choferes = ref([])

      const cargarForm = () => {

         if (formulario.value.entrega_id) {
            store.dispatch('usuario/cargarEmpleadosCompanias', formulario.value.entrega_id)
         }

         

      }

      onMounted(() => {

         if (!choferes.value.length) {

            axios.get('/api/get/choferes').then(({ data }) => {
               choferes.value = data
            }).catch(e => {
               console.log(e)
            })
         }

         cargarForm();

      })

      watch(formulario,() => {
         cargarForm()
      })

      const guardar = () => {

         emit('save',formulario.value,formValidate.value)

      }

      return {
         required,
         loading:computed(() => store.state.loading),
         formulario,
         empleados,
         formValidate,
         guardar,
         choferes,
         regresar

      }

   },
}
</script>

<style lang="scss">
   @import '~@core/scss/vue/libs/vue-select.scss';
</style>