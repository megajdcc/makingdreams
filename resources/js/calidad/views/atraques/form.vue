<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group description="Fecha en que el barco hizo el atraque">
                        <template #label>
                           Fecha: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="llegada" rules="required" #default="{ errors }">
                        
                           <flat-pickr v-model="formulario.llegada" class="form-control" :config="{ dateFormat: 'Y-m-d'}"
                           placeholder="YYYY-MM-DD" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group description="Nro del Viaje">
                        <template #label>
                            Viaje:
                        </template>

                        <validation-provider name="viaje"  rules="required" #default="{ errors }">

                           <b-form-input v-model="formulario.viaje" type="number" :min="0" step="1"
                              :state="errors.length ? false : null" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>


                  </b-col>
               </b-row>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group description="Cual Barco hizo el atraque?">
                        <template #label>
                           Barco:
                        </template>
                     
                        <validation-provider name="barco_id"  rules="required" #default="{ errors }">
                     
                           <v-select v-model="formulario.barco_id" :reduce="(val) => val.id" :options="barcos" label="nombre"></v-select>
                     
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group description="En cual Puerto hizo el atraque?">
                        <template #label>
                           Puerto:
                        </template>
                     
                        <validation-provider name="puerto_id"  rules="required"  #default="{ errors }">
                     
                           <v-select v-model="formulario.puerto_id" :reduce="(val) => val.id" :options="puertos" label="nombre"></v-select>
                     
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
   BButtonGroup,
   BButton,
   BCard,
   BFormFile,
   BImg,
   BFormTags
} from 'bootstrap-vue'

import vSelect from 'vue-select'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import flatPickr from 'vue-flatpickr-component'

import store from '@/store'
import { ref, toRefs, computed,onMounted } from 'vue'

import { regresar } from '@core/utils/utils'

export default {

   components: {
      BForm,
      BContainer,
      BRow, BCol,
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
      vSelect,
      flatPickr



   },

   setup(props, { emit }) {
      const formValidate = ref(null)

      const { atraque: formulario } = toRefs(store.state.atraque)
      const { barcos } = toRefs(store.state.barco)
      const { puertos } = toRefs(store.state.puerto)


      const cargarForm = () => {

         if(!barcos.value.length){
            store.dispatch('barco/getBarcos')
         }

         if (!puertos.value.length) {
            store.dispatch('puerto/getPuertos')
         }

      }

      onMounted(() => {
         cargarForm()
      })


      const guardar = () => {
         emit('save', formulario.value, formValidate.value)
      }


      return {
         required,
         formValidate,
         loading: computed(() => store.state.loading),
         regresar,
         formulario,
         guardar,
         barcos,
         puertos
      }
   },
}
</script>


<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>