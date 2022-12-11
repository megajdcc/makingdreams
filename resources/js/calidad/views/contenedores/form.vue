<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           # de contenedor: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="numero" rules="required" #default="{ errors }">
                           <b-form-input v-model="formulario.numero" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{  errors[0]  }}
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

import store from '@/store'
import { ref, toRefs, computed } from 'vue'

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
      vSelect,
      ValidationProvider,
      ValidationObserver,
      BCard,
      BFormFile,
      BImg,
      BFormTags



   },

   setup(props, { emit }) {
      const formValidate = ref(null)


      const { contenedor: formulario } = toRefs(store.state.contenedor)

      const guardar = () => {
         emit('save', formulario.value, formValidate)
      }

      return {
         required,
         formValidate,
         loading: computed(() => store.state.loading),
         regresar,
         formulario,
         guardar,
      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>