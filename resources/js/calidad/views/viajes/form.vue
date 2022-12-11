<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="4">
                     <b-form-group description="El tipo de viaje ha realizar para determinar si es de entrega o de retorno">
                        <template #label>
                           Tipo de Viaje: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="tipo_viaje" rules="required" #default="{ errors }">
                          <b-form-radio-group v-model="formulario.tipo_viaje" :options="tipos_viajes" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                     <b-form-group>
                        <template #label>
                           Chofer: <span class="text-danger">*</span>
                        </template>
                     
                        <validation-provider name="chofer_id" rules="required" #default="{errors}">
                           <v-select v-model="formulario.chofer_id" placeholder="Seleccione" :reduce="option => option.id"
                              :options="choferes.filter(val => val.rol.nombre == 'Chofer')" :filterBy="choferesFilterBy">
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

                  <b-col cols="12" md="4">
                     <b-form-group>
                        <template #label>
                           Fecha del viaje: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="fecha"  rules="required" #default="{ errors }">

                           <flat-pickr v-model="formulario.fecha" class="form-control" :config="{ dateFormat: 'Y-m-d'}"
                              placeholder="YYYY-MM-DD" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>


                  </b-col>

                  <b-col cols="12" md="4">
                     <b-form-group description="La hora puede referirse a la hora de partida">
                        <template #label>
                           Hora salida:
                        </template>
                  
                        <validation-provider name="hora_salida" #default="{ errors }">
                  
                           <flat-pickr v-model="formulario.hora_salida" class="form-control" placeholder="HH:ii Example 15:30"  :config="{enableTime:true,noCalendar:true, dateFormat:'H:i',valueFormat:'H:i'}" />
                  
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                  
                        </validation-provider>
                     </b-form-group>

                     <b-form-group description="La hora en la que llega al origen o destino" v-if="formulario.tipo_viaje == 1">
                        <template #label>
                           Hora de llegada:
                        </template>
                     
                        <validation-provider name="hora_llegada" #default="{ errors }">
                     
                           <flat-pickr v-model="formulario.hora_llegada" class="form-control" placeholder="HH:ii Example 15:30"
                              :config="{enableTime:true,noCalendar:true, dateFormat:'H:i'}" />
                     
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>
                  
                  
                  </b-col>
               </b-row>

               <b-row v-if="formulario.tipo_viaje == 1">
                  <el-divider content-position="left">Hora de descargas</el-divider>
                  <b-col cols="12" md="6">
                    

                     <b-form-group description="La hora en que el vagon (container) es montado en el camión (remolque)">
                        <template #label>
                           Hora de pegado:
                        </template>
                     
                        <validation-provider name="hora_descarga.pegado" #default="{ errors }">
                     
                           <flat-pickr v-model="formulario.hora_descarga.pegado" class="form-control" placeholder="HH:ii Example 15:30"
                              :config="{enableTime:true,noCalendar:true, dateFormat:'H:i'}" />
                     
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>

                  </b-col>

                    <b-col cols="12" md="6">
                    

                     <b-form-group description="La hora en que el vagon (container) es desmontado del camión (remolque)">
                        <template #label>
                           Hora de Despegue:
                        </template>
                     
                        <validation-provider name="hora_descarga.despegado" #default="{ errors }">
                     
                           <flat-pickr v-model="formulario.hora_descarga.despegado" class="form-control" placeholder="HH:ii Example 3:30"
                              :config="{enableTime:true,noCalendar:true, dateFormat:'H:i'}" />
                     
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>

                  </b-col>

               </b-row>

               <b-row v-else>
                  <el-divider content-position="left">Recogido en el Cliente</el-divider>
                     <b-col cols="12" md="6">
                        <b-form-group>
                           <template #label>
                              Fecha:
                           </template>
                        
                           <validation-provider name="recogido.fecha" #default="{ errors }">
                        
                              <flat-pickr v-model="formulario.recogido.fecha" class="form-control" :config="{ dateFormat: 'Y-m-d'}"
                                 placeholder="YYYY-MM-DD" />
                        
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>
                     </b-col>

                     <b-col cols="12" md="6">
                        <b-form-group>
                           <template #label>
                              Destino: 
                           </template>
                        
                           <validation-provider name="fecha" #default="{ errors,valid }">
                        
                              <b-form-input v-model="formulario.recogido.destino" :state="valid"/> 
                        
                              <b-form-invalid-feedback :state="errors.length ? false :  null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>
                     </b-col>

               </b-row>

               <b-row>
                  <b-col cols="12">
                     <b-button-group size="sm">
                        <b-button variant="primary" type="submit" title="Guardar registro" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>
                        <b-button variant="dark" @click="regresar" title="Regresar" v-loading="loading">
                           <feather-icon icon="ArrowLeft" />
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
   BForm,
   BContainer,
   BRow, BCol,
   BFormGroup,
   BFormInput,
   BFormInvalidFeedback,
   BFormRadioGroup,
   BButtonGroup,
   BButton,
   BCard,
   BFormFile,
   BImg,
   BFormTags,
   BAvatar
} from 'bootstrap-vue'


import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'

import store from '@/store'
import { ref, toRefs, computed,onMounted } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import vSelect from 'vue-select'

import { regresar } from '@core/utils/utils'

export default {

   components: {
      BForm,
      BContainer,
      BRow,
      BCol,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      ValidationProvider,
      ValidationObserver,
      BCard,
      BFormFile,
      BImg,
      BFormTags,
      flatPickr,
      vSelect,
      BFormRadioGroup,
      BAvatar


   },

   props:['id'],

   setup(props, { emit }) {

      const formValidate = ref(null)

      const {id} = toRefs(props)

      const tipos_viajes = ref([
         {
            value:1,
            text:'Entrega'
         },
         {
            value: 2,
            text: 'Retorno'
         }
      ])

      const { viaje: formulario } = toRefs(store.state.viaje)

      const {usuarios:choferes} = toRefs(store.state.usuario)


      const guardar = () => {
         
         if (id.value) {
            formulario.value.entrega_id = id.value
         }

         emit('save', formulario.value, formValidate.value)
      }


      onMounted(() => {

         if(!choferes.value.length){
            store.dispatch('usuario/cargarUsuarios')
         }

        

      })


      return {
         required,
         formValidate,
         loading: computed(() => store.state.loading),
         regresar,
         formulario,
         guardar,
         tipos_viajes,
         choferes,
         choferesFilterBy: (option, label, search) => (option.nombre || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > - 1,
      }
   },
}
</script>
<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>