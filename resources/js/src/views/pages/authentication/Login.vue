<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <b-link class="brand-logo ">
        <img :src="logotipo" alt="Making Dreams">
      </b-link>


      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-card-title class="mb-1 text-center font-weight-bolder">
          Making Dreams! 👋
        </b-card-title>
        <b-card-text class="mb-2 text-center font-weight-bold">
          Inicia sesión en tu cuenta y comienza la aventura
        </b-card-text>

        <!-- form -->
        <validation-observer ref="formValidate" #default="{ invalid,handleSubmit }">
          <b-form class="auth-login-form mt-2" @submit.prevent="handleSubmit(iniciar)">

            <!-- email -->
            <b-form-group label-for="email" label="Email">
              <validation-provider #default="{ errors }" name="email" rules="required|email">
                <b-form-input id="email" v-model="formulario.email" name="login-email"
                  :state="errors.length > 0 ? false : null" placeholder="john@example.com" autofocus />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Password</label>
                <b-link :to="{ name: 'auth-forgot-password' }">
                  <small>Olvidaste la contraseña?</small>
                </b-link>
              </div>
              <validation-provider #default="{ errors }" name="password" rules="required">
                <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid' : null">
                  <b-form-input id="password" v-model="formulario.password" :type="passwordFieldType"
                    class="form-control-merge" :state="errors.length > 0 ? false : null" name="login-password"
                    placeholder="Password" />

                  <b-input-group-append is-text>
                    <feather-icon class="cursor-pointer" :icon="passwordToggleIcon" @click="togglePasswordVisibility" />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group>
              <b-form-checkbox id="remember-me" v-model="formulario.remember" name="checkbox-1">
                Recordarme
              </b-form-checkbox>
            </b-form-group>

            <!-- submit button -->
            <b-button variant="primary" type="submit" block :disabled="invalid" v-loading="loading">
              Iniciar
            </b-button>
          </b-form>
        </validation-observer>

        <!-- <b-card-text class="text-center mt-2">
          <span>Nuevo en la plataforma? </span>
          <b-link :to="{ name: 'new.registro' }">
            <span>Registro de Cliente</span>
          </b-link>
        </b-card-text> -->

      


      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>


<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'

import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
  BFormInvalidFeedback,
  BCard
} from 'bootstrap-vue'

import useLogotipo from '@core/utils/useLogotipo'

import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import {computed} from 'vue';
import useAuth from '@core/utils/useAuth'

import '@core/scss/vue/libs/toastification.scss'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import router from '@/router'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BCard,
    BImg,
    BForm,
    BButton,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    BFormInvalidFeedback
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      sideImg: require('@/assets/images/pages/login-v2.svg'),
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },

    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },


  setup(props){
    
    const usuario = computed(() => store.state.usuario.usuario)
    const {
      login,
      formValidate,
      formulario
    } = useAuth();


    const {
      logotipo
    } = useLogotipo();


    const iniciar  = ()  => {


      login().then((result) => {
        
       

        if(result){
          
          router.replace(getHomeRouteForLoggedInUser(usuario.value.rol.nombre)).then(
            () => {
            toast({
                 component: ToastificationContent,
                 props: {
                    title: `Bienvenido ${usuario.value.nombre || usuario.value.apellido}`,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                    text: `Ha iniciado sesión correctamente como ${usuario.value.rol.nombre}. ¡Ahora puedes empezar a explorar!`,
                 },
              }, {
                 position: 'bottom-right',
                 timeout: 4000
              })
            })

        }else{

            toast({
                component: ToastificationContent,
                props: {
                  title: `No pudimos autenticarte, inténtelo de nuevo`,
                  icon: 'HelpCircleIcon',
                  variant: 'danger',
                },
            }, {
                position: 'bottom-right',
                timeout: 4000
            })
        
        }


      }).catch(e => console.log(e))


    }

    return{
      login,
      required,
      loading:computed(() => store.state.loading),
      auth:computed(() => store.state.auth),
      formValidate,
      formulario,
      iniciar,
      logotipo
    }
  }

  
}
</script>

<style lang="scss" scope>
@import '~@core/scss/vue/pages/page-auth.scss';

.brand-logo img{
  width: auto;
  height: 130px !important;
}
</style>
