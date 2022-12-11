<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row v-if="rutaUrl || formulario.banner" class="my-1">
                  <b-col cols="12">
                     <b-img alt="formulario.nombre" rounded center fluid :height="200" :src="rutaUrl"
                        style="max-height:300px">
                     </b-img>
                  </b-col>
               </b-row>

               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group label="Banner"
                        description="Las categoría que crees puede tener una imagen de portada, opcional">

                        <validation-provider name="banner" #default="{errors}">
                           <b-form-file ref="refFile" v-model="archivo" :state="errors.length ? false : null"
                              @input="imagenCargada" accept="image/*" browse-text="Buscar imagen" />
                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>


                     </b-form-group>


                     <b-form-group>
                        <template #label>
                           Nombre: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="nombre" rules="required" #default="{errors}">
                           <b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           Permiso: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="nombre" rules="required" #default="{errors}">

                           <v-select v-model="formulario.permiso_id" :reduce="(val) => val.id " label="nombre"
                              class="flex-grow-1 email-to-selector" :options="permisos">
                           </v-select>

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                     <b-form-group label="Categoría Padre"
                        description="Si elijes una categoríá aquí, ten en cuenta que la categoría que estas creando va a ser hija de esta...">

                        <validation-provider name="categoria" #default="{errors}">
   
                           <v-select v-model="formulario.categoria_id" :reduce="(val) => val.id" label="nombre"
                              class="flex-grow-1 email-to-selector" :options="categorias">
                           </v-select>

                           <b-form-invalid-feedback :state="errors.length ? false : null ">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>
                  </b-col>
               </b-row>
               <b-row>
                  <b-col cols="12">
                     <b-button-group size="sm">
                        <b-button variant="primary" type="submit" title="Guardar categoría" v-loading="loading">
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
   BRow,BCol,
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

import { ValidationProvider,ValidationObserver } from 'vee-validate'
import {required} from '@validations'

import store from '@/store'
import { ref,toRefs,computed,onMounted,watch } from 'vue'

import { regresar } from '@core/utils/utils'

export default {
   
   components:{
      BForm,
      BContainer,
      BRow, BCol,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton  ,
      vSelect,
      ValidationProvider,
      ValidationObserver,
      BCard,
      BFormFile,
      BImg,
      BFormTags



   },

   setup(props,{emit}) {
      const formValidate = ref(null)
      const refFile = ref(null)
       const rutaUrl = ref(null)
       const archivo = ref(null)

      const permisos = computed(() => store.state.permiso.permisos)

      const {categoria:formulario,categorias} = toRefs(store.state.categoria)

      const guardar = () => {
         formulario.value.banner = archivo.value
         emit('save',formulario.value,formValidate)

      }
      
      const imagenCargada = () => {
         rutaUrl.value = URL.createObjectURL(archivo.value)
      }

      const cargarForm = () => {
         
         if (!categorias.value.length) {
            store.dispatch('categoria/getCategorias')
         }

         if (formulario.value.id) {
            rutaUrl.value = `/storage/banner/categoria/${formulario.value.banner}`

            
         }else{
            rutaUrl.value = null
         }

         if(!permisos.value.length){
            store.dispatch('permiso/cargarPermisos');
         }

      }

      onMounted(() => {

       cargarForm()


      })

      watch(formulario,() => {
         cargarForm()
      })


      return {
         required,
         formValidate,
         loading:computed(() => store.state.loading),
         regresar,
         rutaUrl,
         formulario,
         guardar,
         refFile,
         imagenCargada,
         categorias,
         archivo,
         permisos,
      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>