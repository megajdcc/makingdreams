<template>
  <b-card>

    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img
            ref="previewEl"
            rounded
            :src="usuario.avatar"
            height="80"
          />
        </b-link>
        <!--/ avatar -->
      </b-media-aside>

      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          Cargar
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept="image/*"
          :hidden="true"
          plain
          @input="cargarImagen"
        />
        <!--/ upload button -->
        <!--/ reset -->
        <b-card-text>Solo se permiten imagen del tipo JPG, GIF o PNG. Max tamaño de 800kB</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group
            label="Nombre"
            label-for="cuenta-nombre"
          >
            <b-form-input
              v-model="formulario.nombre"
              placeholder="Nombre"
              name="nombre"
              readonly
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Apellido"
            label-for="cuenta-apellido"
          >
            <b-form-input
              v-model="formulario.apellido"
              name="apellido"
              placeholder="Apellido"
              readonly
            />
          </b-form-group>
        </b-col>
        
        <b-col sm="6">
        
          <b-form-group label="Nombre de usuario" label-for="username">
            <b-form-input v-model="usuario.username" id="username" placeholder="Username" readonly />
          </b-form-group>
          
        </b-col>

        <b-col sm="6">
          <b-form-group label="E-mail" label-for="account-e-mail" >
            <b-form-input
              v-model="usuario.email"
              name="formulario.email"
              placeholder="Email"
              readonly
            />

          </b-form-group>
        </b-col>

        <b-col sm="6">
          <b-form-group label-for="example-datepicker" label="Fecha de Nacimiento">
            <flat-pickr v-model="formulario.fecha_nacimiento" class="form-control" name="date"
              placeholder="Fecha de nacimiento" />
          </b-form-group>
        </b-col>

         <b-col sm="6">
            <b-form-group label-for="Sexo" label="Sexo">
              <b-form-radio-group v-model="formulario.genero" :options="[
                {text:'Hombre',value:1},
                { text: 'Mujer', value: 2 },
                { text: 'Otro', value: 3 },
              ]"></b-form-radio-group>
            </b-form-group>
          </b-col>



          <b-col sm="6">
            <b-form-group label-for="Teléfono" label="Teléfono">
                 <b-form-input type="tel" v-model="formulario.telefono" v-mask="'+#############'"  readonly />
            </b-form-group>
          </b-col>

           <b-col sm="6">
               <b-form-group label-for="Whatsapp" label="Whatsapp">
                    <b-form-input type="tel" v-model="formulario.whatsapp"
                        v-mask="getMaskTelefono" :placeholder="getMaskTelefono" :disabled="!formulario.pais_id"/>
              </b-form-group>
            </b-col>

           <b-col sm="6" v-if="formulario.pais">
                <b-form-group label-for="Pais" label="Pais">
                    <b-form-input  v-model="formulario.pais.pais" readonly />
              </b-form-group>
            </b-col>
       

        <!-- alert -->
        <b-col
          cols="12"
          class="mt-75"
        >

        </b-col>
        <!--/ alert -->

        <b-col cols="12">

          <b-button-group>

            <b-button variant="primary" v-ripple.400="'rgba(255, 255, 255, 0.15)'" @click="guardar">
              <feather-icon icon="SaveIcon" />
              Guardar
            </b-button>
          
            <b-button variant="dark" @click.prevent="resetForm">
              Limpiar
            </b-button>

          </b-button-group>
         
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BAlert, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink, BImg,BButtonGroup,BFormRadioGroup
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref,computed,toRefs,onMounted } from 'vue'

import { Notification } from 'element-ui';
import store from '@/store'
import flatPickr from 'vue-flatpickr-component'

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormRadioGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    flatPickr,
    BButtonGroup
  },
  directives: {
    Ripple,
  },

  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const profileFile = ref(null)

    const formulario = ref({
      id: null,
      nombre: '',
      apellido: '',
      telefono: '',
      fecha_nacimiento: '',
      imagen: '',
      direccion: '',
      email: '',
      password: '',
      rol: null,
      avatar: '',
      is_dueno: false

    })


    const {usuario} = toRefs(store.state.usuario)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    onMounted(() => {
      formulario.value = clone(usuario.value)

    })

    const cargarImagen  = (file) => {
      
      let form = new FormData();

      form.append('filepond', profileFile.value);

      axios.post('api/upload/avatar', form, {
        headers: {
          'Content-Type': 'multipart/form-data; boundary=something'
        }
      }).then(respon => {
        store.commit('usuario/updateAvatar',respon.data)

      }).catch(e => {
        console.log(e)
      }).then(() => {
      })


    }

    const guardar = () => {


      store.dispatch('usuario/guardarUsuario', formulario.value).then(({data}) => {

        if (data.result) {
          store.commit('usuario/updatePerfil',data.usuario)
          
          Notification.success({
            message: 'Se ha guardado con éxito los cambios',
            position:'bottom-right'
          })

        } else {
          Notification.info({
            text: 'Nó se guardarón los cambios,inténtelo de nuevo...',
            position:'bottom-right'
          })

        }

      }).catch(e => {
        console.log(e)
      }).then(() => {

      })
    }

    const resetForm = () => {
      formulario.value = clone(usuario.value)
    }

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
      loading:computed(() => store.state.loading),
      usuario,
      formulario,
      profileFile,
      cargarImagen,
      guardar,
      resetForm,
      getMaskTelefono: computed(() => {
        if (formulario.value.pais_id) {
          return `+${formulario.value.pais.lada}##########`
        }
        return '+#############'
      })
      
    }
  }
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
