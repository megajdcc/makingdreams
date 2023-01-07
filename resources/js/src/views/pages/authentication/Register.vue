<template>

<div class="auth-wrapper auth-v1 px-2">

    <b-link class="brand-logo">
      <b-img :src="logotipo" />
    </b-link>

    <div class="auth-inner py-2">
      <b-card class="mb-0" style="z-index:1">

        <b-card-title class="mb-1">
          La aventura comienza aquí 🚀
        </b-card-title>
        <b-card-text class="mb-2">
          Empieza por registrarte.
        </b-card-text>
            <validation-observer ref="formValidate" #default="{handleSubmit}">
              <b-form class="auth-register-form mt-2" @submit.prevent="handleSubmit(registrar)"
                style="max-height:310px;overflow-y:auto">
            
                <!-- Datos de usuario -->

                <!-- Nombre  de usuario-->
                <b-form-group>
                  <template #label>
                    Nombre de usuario: <span class="text-danger">*</span>
                  </template>
                
                  <validation-provider name="username" rules="required" #default="{valid,errors}">
                    <b-form-input v-model="formulario.username" :state="valid" placeholder="@megajdcc" />
                
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                
                  </validation-provider>
                </b-form-group>
                
                <!-- Nombre -->
                <b-form-group>
                  <template #label>
                    Nombre: <span class="text-danger">*</span>
                  </template>
            
                  <validation-provider name="nombre" rules="required" #default="{errors}">
                    <b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" placeholder="John" />
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group>
            
                <!-- apellido -->
                <b-form-group>
                  <template #label>
                    Apellido: <span class="text-danger">*</span>
                  </template>
            
                  <validation-provider name="apellido" rules="required" #default="{errors}">
                    <b-form-input v-model="formulario.apellido" :state="errors.length ? false : null" placeholder="Dhere" />
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group>
            
                <!-- Telefono -->
                <b-form-group>
                  <template #label>
                    Teléfono: <span class="text-danger">*</span>
                  </template>
            
                  <validation-provider name="telefono" rules="required" #default="{errors}">
                    <b-form-input type="tel" v-model="formulario.telefono" :state="errors.length ? false : null" v-mask="'+#############'" />
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group>

                <!-- Pais -->

                <b-form-group>

                  <template #label>
                    Pais: <span class="text-danger">*</span>
                  </template>

                  <validation-provider name="pais_id" rules="required" #default="{errors,valid}">
                    <v-select v-model="formulario.pais_id" :options="paises" :reduce="(option) => option.id" label="pais" />
                  
                    <b-form-invalid-feedback :state=valid>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  
                  </validation-provider>

                </b-form-group>
            
                <!-- email -->
                <b-form-group label-for="email">
                  <template #label>
                    Email: <span class="text-danger">*</span>
                  </template>
                  <validation-provider #default="{ errors }" name="email" rules="required">
            
                    <b-form-input id="email" v-model="formulario.email" :state="errors.length ? false:null" name="register-email"
                      placeholder="john@example.com" />
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group>
            
                <!-- password -->
                <!-- <b-form-group label-for="password">
                  <template #label>
                    Contraseña: <span class="text-danger">*</span>
                  </template>
                  <validation-provider #default="{ errors }" name="password" rules="required">
                    <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                      <b-form-input id="password" v-model="formulario.password" :type="passwordFieldType"
                        :state="errors.length ? false:null" class="form-control-merge" name="register-password"
                        placeholder="············" />
                      <b-input-group-append is-text>
                        <feather-icon :icon="passwordToggleIcon" class="cursor-pointer" @click="togglePasswordVisibility" />
                      </b-input-group-append>
                    </b-input-group>
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group> -->
            
                <!-- Retype Password -->
                <!-- <b-form-group label-for="retype_password">
                  <template #label>
                    Vuelva a escribir la contraseña: <span class="text-danger">*</span>
                  </template>
                  <validation-provider #default="{ errors }" name="retype_password" rules="required">
                    <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid':null">
                      <b-form-input id="password" v-model="formulario.retype_password" :type="passwordFieldType"
                        :state="errors.length ? false:null" class="form-control-merge" name="register-password"
                        placeholder="············" />
                      <b-input-group-append is-text>
                        <feather-icon :icon="passwordToggleIcon" class="cursor-pointer" @click="togglePasswordVisibility" />
                      </b-input-group-append>
                    </b-input-group>
            
                    <b-form-invalid-feedback>
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
            
                  </validation-provider>
                </b-form-group> -->
            
                <!-- checkbox -->
                <b-form-group>
                  <b-form-checkbox id="register-privacy-policy" v-model="formulario.status" name="checkbox-1">
                    Estoy de acuerdo con las
                    <b-link :to="{name:'public.terminos'}" target="_blank">políticas y términos de privacidad</b-link>
                  </b-form-checkbox>
                </b-form-group>
            
                <!-- submit button -->
                <input type="hidden" name="formulario.tipo_cliente" value="2" />
                <b-button variant="primary" block type="submit" :disabled="!formulario.status">
                  Inscribirse
                </b-button>
              </b-form>
            
            </validation-observer>
        <b-card-text class="text-center mt-2">
          <span>Ya tienes una cuenta? </span>
          <b-link :to="{name:'login'}">
            <span>Iniciar sesión en su lugar</span>
          </b-link>
        </b-card-text>
      </b-card>
    </div>
  </div>

</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import useLogotipo from '@core/utils/useLogotipo'

import useDireccion from '@core/utils/useDireccion'

import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
  BCardTitle,
  BCardText,
  BCard,
  BTabs,
  BTab,
  BFormInvalidFeedback,
  BFormTextarea,

} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {computed, ref, toRefs, onMounted} from 'vue'
import store from '@/store'
import vSelect from 'vue-select'

import router from '@/router'

export default {

  components: {
    VuexyLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
    BCard,
    BTabs,
    BTab,
    BFormInvalidFeedback,
    BFormTextarea,
    vSelect

  },
  
  mixins: [togglePasswordVisibility],

  props:['link'],

  setup(props){

    const {link} = toRefs(props)

    const passwordFieldType = ref('password')
    const sideImg = ref(require('@/assets/images/pages/register-v2.svg'));
    const formValidate = ref(null)

    const formulario = ref({
      nombre: '',
      username: '',
      apellido: '',
      email: '',
      telefono: null,
      pais_id:null,
      password: '',
      retype_password: '',
      link:null
    })


    const {
      logotipo
    } = useLogotipo();

    const {
      paises,

    } = useDireccion()

    const verificarLink = () => {

      axios.get(`/api/fetch/link/${link.value}`).then(({data}) => {

        if(!data.result){
          toast.info('El link de referencia no existe, si ya tiene un usuario, por favor ingrese ...',{position:'top-left'})
          router.push({name:'login'})
        }

      }).catch(e => console.log(e))


    }

    onMounted(() => {
      formulario.value.link  = link.value

      verificarLink()
    })

    const registrar = ()  => {

      axios.post('/api/auth/register',formulario.value).then(({data}) => {
        if(data.result){

          toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: `Gracias por registrarte!. Te hemos enviado un correo para que confirmes tu cuenta y establezcas tú contraseña`,
              icon: 'CoffeeIcon',
              variant: 'success',
              text: ``,
              duration:10000,
            },

          })

          router.push({ name: 'login' })


        }
      

      }).catch(e => {
        console.log(e)
        if(e.response.status === 422){
           formValidate.value.setErrors(e.response.data.errors)
        }
      })

    }

    const clearFormulario = () => {
    
      formulario.value = {
        nombre: '',
        username: '',
        apellido: '',
        email: '',
        telefono: null,
        pais_id: null,
        password: '',
        retype_password: '',
        link: link.value
      }
    
    }

    return {
      
      formValidate,
      passwordFieldType,
      passwordToggleIcon: computed(() => passwordFieldType.value === 'password' ? 'EyeIcon' : 'EyeOffIcon'),

      imgUrl:computed(() => {
        if (store.state.appConfig.layout.skin === 'dark') {
            sideImg.value = require('@/assets/images/pages/register-v2-dark.svg')
            return sideImg
        }
        return sideImg
      } ),

      required,
      email,

      formulario,
      registrar,
      clearFormulario,
      logotipo,
      paises
   
    }

  }
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
<style lang="scss" scoped>

@import '~@core/scss/vue/pages/page-auth.scss';
.brand-logo {
  position: absolute;
  left:1rem;
  top:1rem;

  &img{
    width: auto;
      height: auto;
  }
 
}
</style>
