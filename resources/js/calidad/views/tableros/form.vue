<template>
    <validation-observer ref="formValidate" #default="{handleSubmit}">
      <b-form @submit.prevent="handleSubmit(guardar)">
        <b-card >

          <b-container fluid class="px-0 mx-0">
            <b-row>
              <b-col cols="12" md="6">
                <b-form-group >
                  <template #label>
                    Beneficiario : <span class="text-danger">*</span>
                  </template>

                  <validation-provider name="beneficiario_id" rules="required" #default="{valid,errors}">
                    <v-select v-model="formulario.beneficiario_id" :options="usuarios" :reduce="option => option.id" label="nombre"></v-select>

                    <b-form-invalid-feedback :state="valid">
                      {{  errors[0]  }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col cols="12" md="6">
                  <b-form-group >
                    <template #label>
                      Etapa : <span class="text-danger">*</span>
                    </template>

                    <validation-provider name="etapa_id" rules="required" #default="{valid,errors}">
                      <v-select v-model="formulario.etapa_id" :options="etapas" :reduce="option => option.id" label="nombre"></v-select>

                      <b-form-invalid-feedback :state="valid">
                        {{  errors[0]  }}
                      </b-form-invalid-feedback>
                    </validation-provider>
                  </b-form-group>
              </b-col>

              <b-col cols="12" md="6">
                <b-form-group >
                  <template #label>
                    Tablero : 
                  </template>

                  <validation-provider name="tablero_id" #default="{ valid, errors }">

                    <v-select v-model="formulario.tablero_id" :options="tablerosDisponibles" :reduce="option => option.id" label="beneficiario">
                    </v-select>

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

              <b-button variant="primary" title="Guardar" type="submit" v-loading="loading" :disabled="loading">
                <font-awesome-icon icon="fa fa-save"/>
                Guardar
              </b-button>


                <b-button variant="dark" title="Nuevo Tablero" v-loading="loading" :to="{name:'tablero.create'}" 
                :disabled="loading" v-if="formulario.id">
                  <font-awesome-icon icon="fa fa-plus"/>
                  Nuevo Tablero
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
} from 'vee-validate'

import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButtonGroup,
  BButton,
  BCard,
  BContainer,
  BRow,
  BCol,

} from 'bootstrap-vue'
import vSelect from 'vue-select'

import {required} from '@validations'

import store from '@/store'
import {computed,ref,toRefs} from 'vue';


export default {
  
  components:{
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButtonGroup,
    BButton,
    BCard,
    BContainer,
    BRow,
    BCol,

    ValidationObserver,
    ValidationProvider,

    vSelect
  },

  setup(props,{emit}){
    const {tablero:formulario,tableros} = toRefs(store.state.tablero)
    const {usuarios} = toRefs(store.state.usuario)
    const {etapas} = toRefs(store.state.etapa)



    const formValidate = ref(null)

    const guardar = () => {
        emit('save',formulario.value,formValidate.value)
    }

    const cargarForm = () => {

      if(!usuarios.value.length) {
        store.dispatch('usuario/cargarUsuarios')
      }

      if(!etapas.value.length){
        store.dispatch('etapa/getAll')
      }
       if (!tableros.value.length) {
        store.dispatch('tablero/getAll')
      }
    }

    cargarForm();

    return {
      formulario,
      guardar,
      formValidate,
      loading:computed(() => store.state.loading),
      required,
      usuarios,
      etapas,
      tablerosDisponibles:computed(() => {
        return tableros.value.map(val => ({
            id:val.id,
            beneficiario:`${val.beneficiario.nombre} ${val.beneficiario.apellido}`
        }))
      })
    }
  }

}
</script>