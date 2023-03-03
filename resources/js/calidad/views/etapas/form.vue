<template>
   <validation-observer ref="formValidate" #default="{handleSubmit}">
      <b-form @submit.prevent="handleSubmit(guardar)">
        <b-card>

          <b-container fluid class="px-0 mx-0">
            <b-row>
              <b-col cols="12" md="6">
                <b-form-group >
                  <template #label>
                    Nombre : <span class="text-danger">*</span>
                  </template>

                  <validation-provider name="nombre" rules="required" #default="{valid,errors}">
                    <b-form-input v-model="formulario.nombre" :state="valid" placeholder="Nombre de la etapa" />
                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0]  }}
                    </b-form-invalid-feedback>
                  </validation-provider>

                </b-form-group>

                <b-form-group>
                  <template #label>
                    Descripción
                  </template>
                
                  <validation-provider name="descripcion" #default="{valid,errors}">
                    <b-form-textarea v-model="formulario.descripcion" :rows="3" :state="valid"></b-form-textarea>
                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                
                </b-form-group>

              </b-col>

              <b-col cols="12" md="6">
                <b-form-group>
                  <template #label>
                    Monto : <span class="text-danger">*</span>
                  </template>
              
                  <validation-provider name="monto" rules="required" #default="{valid,errors}">
                    <currency-input v-model="formulario.monto" :options="optionsCurrency" InputClass="form-control"/>
                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </validation-provider>
              
                </b-form-group>

                <b-form-group>
                  <template #label>
                    Remuneración
                  </template>
                
                  <validation-provider name="remuneracion"  #default="{valid,errors}">
                    <currency-input v-model="formulario.remuneracion" :options="optionsCurrency" InputClass="form-control" />
                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                
                </b-form-group>

                  <b-form-group>
                    <template #label>
                      Etapa Siguiente
                    </template>
                  
                    <validation-provider name="etapa_id" #default="{valid,errors}">
                      <v-select v-model="formulario.etapa_id" :options="etapas" label="nombre" :reduce="(option) => option.id"></v-select>
                      <b-form-invalid-feedback :state="valid">
                        {{ errors[0] }}
                      </b-form-invalid-feedback>
                    </validation-provider>
                  
                  </b-form-group>



              </b-col>

            </b-row>
          </b-container>
          <template #footer>

            <b-button-group size="sm">
              <b-button type="submit" variant="primary" title="Guardar" v-loading="loading" :disabled="loading">
                <feather-icon icon="SaveIcon" />
                Guardar
              </b-button>

               <b-button type="button" variant="warning" title="Nueva Etapa" v-loading="loading" :disabled="loading" 
               :to="{name:'etapa.create'}" v-if="formulario.id">
                <feather-icon icon="PlusIcon" />
                Nueva Etapa
              </b-button>

              <b-button variant="dark" title="regresar" @click="regresar">
                <feather-icon icon="ArrowLeftIcon"/>
                Regresar
              </b-button>
            </b-button-group>
          </template>
        </b-card>
      </b-form>
   </validation-observer>
</template>

<script>

import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate';

import {
  BForm,
  BFormGroup,
  BFormInput,
  BContainer,
  BRow,
  BCol,
  BFormInvalidFeedback,
  BButtonGroup,
  BButton,
  BCard,
  BFormTextarea
} from 'bootstrap-vue'

import CurrencyInput from 'components/CurrencyInput.vue'

import { regresar } from '@core/utils/utils';

import {required} from '@validations'


import {computed,toRefs,ref,onMounted} from 'vue'

import store from '@/store'

import { optionsCurrency } from '@core/utils/utils';

import vSelect  from 'vue-select'

export default {


  components:{
    BForm,
    BFormGroup,
    BContainer,
    BRow,
    BCol,
    BFormInvalidFeedback,
    BButtonGroup,
    BButton,
    BCard,
    BFormInput,
    ValidationObserver,
    ValidationProvider,
    CurrencyInput,
    BFormTextarea,
    vSelect


  },


  setup(_,{emit}){

    const {etapa:formulario,etapas} = toRefs(store.state.etapa)
    const formValidate = ref(null)


    const cargarForm = () => {

      if(!etapas.value.length){
        store.dispatch('etapa/getAll')
      }

    }

    onMounted(() => cargarForm())
    const guardar= () => {

      emit('save',formulario.value,formValidate.value)

    }

    return {
      loading:computed(() => store.state.loading),
      formulario,
      formValidate,
      guardar,
      regresar,
      required,
      optionsCurrency,
      etapas
    }
  }
  
}
</script>