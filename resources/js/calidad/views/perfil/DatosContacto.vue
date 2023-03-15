<template>
    <validation-observer ref="formValidate" #default="{handleSubmit}">

      <b-form @submit.prevent="handleSubmit(guardar)">

        <b-card title="Información de Contacto">

          <b-container fluid>
            <b-row>
              <b-col cols="12" md="6">
                <b-form-group label="Whatsapp" description="¿ Cual es el número asociado al whatsapp?">
                  <validation-provider name="whatsapp" #default="{valid,errors}">
                    <b-form-input v-model="formulario.whatsapp" v-mask="'+#############'"  :state="valid"/>

                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0]  }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                </b-form-group>

                 <b-form-group label="Teléfono 1">
                  <validation-provider name="telefono_1" #default="{valid,errors}">
                    <b-form-input v-model="formulario.telefono_1" v-mask="'+#############'"  :state="valid"/>

                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0]  }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                </b-form-group>

                <b-form-group label="Teléfono 2">
                  <validation-provider name="telefono_2" #default="{valid,errors}">
                    <b-form-input v-model="formulario.telefono_2" v-mask="'+#############'"  :state="valid"/>

                    <b-form-invalid-feedback :state="valid">
                      {{ errors[0]  }}
                    </b-form-invalid-feedback>
                  </validation-provider>
                </b-form-group>

              </b-col>

              <b-col cols="12" md="6">
                 <b-form-group label="Correo">
                    <validation-provider name="correo" rules="email" #default="{ valid, errors }">
                      <b-form-input v-model="formulario.correo"  :state="valid"/>

                      <b-form-invalid-feedback :state="valid">
                        {{ errors[0] }}
                      </b-form-invalid-feedback>
                    </validation-provider>
                  </b-form-group>
                  <b-form-group label="Otro">
                      <validation-provider name="otro"  #default="{ valid, errors }">

                        <b-form-input v-model="formulario.otro"  :state="valid"/>

                        <b-form-invalid-feedback :state="valid">
                          {{ errors[0] }}
                        </b-form-invalid-feedback>

                      </validation-provider>
                    </b-form-group>

                     <b-form-group description="Este mensaje es importante, lo mostraremos a los usuarios que necesiten confirmar con usted , depositos o transferencias interbancarias.">
                      <template #label>
                        Mensaje: <span class="text-danger">*</span>
                      </template>
                      <validation-provider name="mensaje" rules="required" #default="{ valid, errors }">

                          <b-form-textarea v-model="formulario.mensaje" :rows="3">
                          </b-form-textarea>

                        <b-form-invalid-feedback :state="valid">
                          {{ errors[0] }}
                        </b-form-invalid-feedback>

                      </validation-provider>
                    </b-form-group>

                </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                  <b-alert :show="true" variant="danger" class="p-1">
                    <font-awesome-icon icon="fas fa-triangle-exclamation"/>
                   <strong>
                    Debes poner correctamente tus datos, verifica bien antes de guardar.
                   </strong>
                  </b-alert>
              </b-col>
            </b-row>
          </b-container>

          <template #footer>

            <b-button-group size="sm">
              <b-button variant="primary" type="submit" title="Guardar" v-loading="loading" :disabled="loading" >
                <feather-icon icon="saveIcon"/>
                Guardar
              </b-button>
            </b-button-group>
          </template>
        </b-card>

      </b-form>

    </validation-observer>
</template>
<script>

import {
  BCard,
  BForm,
  BButtonGroup,
  BButton,
  BContainer,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormTextarea,
  BAlert
} from 'bootstrap-vue'

import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'

import {required , email} from '@validations'
import {computed,toRefs,ref,onMounted,watch} from 'vue'
import store from '@/store'



export default {
  
  props:{
    usuario:Object
  },

  components:{
    BCard,
    BForm,
    BButtonGroup,
    BButton,
    BContainer,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormTextarea,
    BAlert,
    ValidationObserver,
    ValidationProvider,

  },



  setup(props){
    const {usuario} = toRefs(props)
    const {contacto:formulario} = toRefs(store.state.contacto)
    const formValidate  = ref(null)

    const cargar = () => {
      store.dispatch('contacto/fetchForUser', usuario.value.id)

    } 
    onMounted(() => cargar())

    watch(usuario,() => cargar())
    
    const guardar = () => {
      store.dispatch('contacto/guardar',formulario.value).then(({result}) => {
        
        if(result){
          toast.success('Se ha guardado con éxito el cambio')
        }else{
          toast.info('No se pudo guardar, inténtelo de nuevo')
        }
      }).catch( e => {
        
        if(e.response.status === 422){
          formValidate.value.setErrors(e.response.data.errors)
        }

      })
    }

    return {
      usuario,
      loading:computed(() => store.state.loading),
      guardar,
      formulario,
      required,
      email,
      formValidate
    }
  }
}
</script>