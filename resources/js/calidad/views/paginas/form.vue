<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           Título: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="titulo" rules="required" #default="{errors}">

                           <b-form-input v-model="formulario.titulo" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>

                     <b-form-group description="La ruta es la dirección URL...">
                        <template #label>
                           Ruta: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="ruta" rules="required" #default="{errors}">

                           <b-input-group :state="errors.length ? false : null">

                              <b-input-group-prepend is-text>
                                 {{ `${ url }/manual/` }}
                              </b-input-group-prepend>
                              <b-form-input v-model="formulario.ruta" :state="errors.length ? false : null" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </b-input-group>
                        </validation-provider>

                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group>

                        <template #label>
                           Categoría: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="categorias" rules="required" #default="{errors}">

                           <v-select v-model="formulario.categorias" multiple :reduce="(val) => val.id" label="nombre"
                              class="flex-grow-1 email-to-selector" :options="categorias">
                           </v-select>

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
                        <b-button @click="start" v-if="!isListening" variant="success">
                           <feather-icon icon="MicIcon" />
                        </b-button>

                        <b-button v-else @click="stop" variant="danger">
                           <feather-icon icon="MicOffIcon" />
                        </b-button>
                     </b-button-group>
                  </b-col>
                  <b-col cols="12">
                     <b-form-group>

                        <template #label>
                           Contenido:
                        </template>

                        <validation-provider name="permiso_id" rules="required" #default="{errors}">

                           <!-- <quill-editor id="blog-content" v-model="formulario.contenido" :options="{ theme: 'snow'}" /> -->

                           <editor output-format="html" :value="formulario.contenido"
                            @input="formulario.contenido = $event"
                              api-key="t1i940nuarrf1zefgxbf6ow5cxmgjmcad7q7l3fm5prgebyc" :init="optionsEditor" />



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
                        <b-button type="submit" variant="primary" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>

                        <b-button variant="secondary" v-loading="loading" @click="regresar">
                           <feather-icon icon="ArrowLeftIcon" />
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
   BCard,
   BContainer,
   BRow,
   BCol,
   BButtonGroup,
   BButton,
   BFormGroup,
   BFormInput,
   BFormInvalidFeedback,
   BInputGroup,
   BInputGroupPrepend

} from 'bootstrap-vue'

import { ValidationProvider,ValidationObserver } from 'vee-validate'
import {required}  from '@validations'
import vSelect from 'vue-select'

import {ref,computed,toRefs,onMounted, watch} from 'vue'
import store from '@/store'
import { regresar } from '@core/utils/utils'

import { quillEditor } from 'vue-quill-editor'

import Editor from '@tinymce/tinymce-vue'


import { useSpeechRecognition } from '@vueuse/core'

export default {
   components:{
      BForm,
      BCard,
      BContainer,
      BRow,
      BCol,
      ValidationObserver,
      ValidationProvider,
      BButtonGroup,
      BButton,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      vSelect,
      BInputGroup,
      BInputGroupPrepend,
      quillEditor,
      'editor':Editor

   },

   setup(props,{emit}) {
      
      const formValidate = ref(null)

      const categorias = computed(() => store.state.categoria.categorias)
      const permisos = computed(() => store.state.permiso.permisos)
      const escuchado = ref('')
      // const optionsEditor = {
      //    height: 500,
      //    menubar: true,
      //    plugins: [
      //       'advlist autolink lists link image charmap print preview anchor',
      //       'searchreplace visualblocks code fullscreen',
      //       'insertdatetime media table paste code help wordcount '
      //    ],
      //    toolbar:
      //       'undo redo | formatselect | bold italic backcolor | \
      //                                              alignleft aligncenter alignright alignjustify | \
      //                                              bullist numlist outdent indent | removeformat | table | help'
      // }

       const { isSupported,
              isListening,
              isFinal,
              result,
              start,
      stop } = useSpeechRecognition({
        lang: 'es-MX',
        interimResults: true,
        continuous: true,
      });
      

      const optionsEditor = {
            selector: 'textarea#premiumskinsandicons-snow',
            skin: 'snow',
            icons: 'thin',

         plugins: 'quickbars image lists code table codesample advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code wordcount ',
            
            toolbar: 'formatselect | forecolor backcolor | bold italic underline strikethrough | link image blockquote codesample | align bullist numlist | code | table',
            height: 400,
            content_style: 'body { margin: 2rem 10%; }',
            branding:false,
            language:'es'
            }
      const { pagina: formulario } = toRefs(store.state.pagina)

      const cargarForm  = () => {
         if(!categorias.value.length){
            store.dispatch('categoria/getCategorias')
         }

         if (!permisos.value.length) {
            store.dispatch('permiso/cargarPermisos')
         }

      }

     
      const guardar = ()  => {
         
        

         emit('save',formulario.value,formValidate.value)

      }

      onMounted(() => {
         cargarForm()
      })

      if(isSupported){

         watch(result, (val) => {
            escuchado.value = val 
         })

         watch(isListening,val => {
            if(!val) {
               formulario.value.contenido += ` ${escuchado.value}`
               escuchado.value = '';
            }

         })

      }


      return {
         formValidate,
         required,
         loading:computed(() => store.state.loading),
         formulario,
         guardar,
         regresar,
         categorias,
         url:window.location.origin,
         permisos,
         optionsEditor,
         start,
         stop,
         isListening
      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/quill.scss';

</style>