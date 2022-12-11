<template>
   <b-card>

      <b-row>
         <!-- Per Page -->
         <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
            <label>Mostrar</label>
            <v-select v-model="perPage" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="perPageOptions"
               :clearable="false" class="per-page-selector d-inline-block mx-50" />
            <label>entradas</label>

         </b-col>

         <!-- Search -->
         <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
               <b-form-input v-model="searchQuery" class="d-inline-block mr-1" placeholder="Buscar..." />


               <b-button-group>
                  <b-button variant="primary" @click="agregarArchivo()" v-if="$can('write','archivos')">
                     <span class="text-nowrap">Agregar Archivo</span>
                  </b-button>
               </b-button-group>

            </div>
         </b-col>
      </b-row>


      <b-overlay :show="loading">
         <b-row class="my-1">
            <b-col sm="2" v-for="(archivo,i) in archivos" :key="i">

               <b-card body-class="p-0" footer-class="p-0">

                  <template #header>
                     <b-img :alt="archivo.nombre" fluid :src="getImage(archivo)" class="img-file" @click="verArchivo(archivo)" />
                  </template>

                  <small class="text-justify">{{ archivo.nombre }}</small>

                  <template #footer>
                     <b-button-group size="sm">
                        <b-button variant="danger" size="sm" @click="eliminar(archivo.id)" title="Eliminar"  v-if="$can('delete','archivos')">
                           <feather-icon icon="TrashIcon" />
                        </b-button>

                        <b-button variant="dark" size="sm" :href="archivo.url" download title="Descargar">
                           <feather-icon icon="DownloadIcon" />
                        </b-button>
                        
                     </b-button-group>
                  </template>

               </b-card>
            </b-col>
         </b-row>
      </b-overlay>

      <b-row>
         <b-col>
            <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage"
               :total="totalArchivos" />
         </b-col>
      </b-row>

      <b-sidebar v-model="showSidebar" left backdrop @hidden="() => $store.commit('archivo/clear')">
         
         <template #title>
            Cargar Archivo
         </template>

         <b-container fluid>
            <b-row>
               <b-col>
                  <b-overlay :show="loading">
                     <validation-observer ref="formValidate" #default="{handleSubmit}">
                        <b-form @submit.prevent="handleSubmit(guardar)">

                           <b-form-group label="Nombre del archivo">

                              <validation-provider name="nombre" rules="required" #default="{errors}">
                                 <b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" />

                                 <b-form-invalid-feedback>
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>

                           <b-form-group label="Archivo" description="Cargue el archivo">

                              <validation-provider name="url" rules="required" #default="{errors}">
                                 <b-form-file v-model="formulario.url" :state="errors.length ? false : null"
                                    browse-text="Buscar" capture drop-placeholder />

                                 <b-form-invalid-feedback>
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>

                           </b-form-group>


                           <b-button-group size="sm">

                              <b-button type="submit" variant="primary" title="Guardar">
                                 <feather-icon icon="SaveIcon" />
                                 Guardar
                              </b-button>

                              <b-button @click="() => showSidebar = false" variant="danger">
                                 Cerrar
                              </b-button>

                           </b-button-group>

                        </b-form>
                     </validation-observer>
                  </b-overlay>
               </b-col>
            </b-row>
         </b-container>


      </b-sidebar>

      <show-imagen :url="url" :showDialog.sync="showImagen" :tipo="tipo" />
   </b-card>
</template>

<script>

import useListArchivos from './useListArchivos'

import {ref,toRefs,computed,watch,onMounted} from 'vue'

import { ValidationObserver,ValidationProvider } from 'vee-validate'

import {required} from '@validations';
import store from '@/store'

import { getImage } from '@core/utils/utils.js'

import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BSidebar,
   BFormGroup,
   BFormInput,
   BForm,
   BFormInvalidFeedback,
   BButtonGroup,
   BButton,
   BOverlay,
   BFormFile,
   BImg

} from 'bootstrap-vue'

import vSelect from 'vue-select'

import { Notification } from 'element-ui';
export default {
   
   props:['id'],


   components:{
      BCard,
      BContainer,
      BRow,
      BCol,
      BSidebar,
      BFormGroup,
      BFormInput,
      BForm,
      BFormInvalidFeedback,
      ValidationObserver,
      ValidationProvider,
      BButtonGroup,
      BButton,
      vSelect,
      PaginateTable: () => import('components/PaginateTable'),
      BOverlay,
      BFormFile,
      BImg,
      ShowImagen:() => import('components/ShowImagen')



   },

   setup(props) {


      const showSidebar = ref(false)
      const formValidate = ref(null)
      const showImagen = ref(false)
      const tipo = ref(null)

      const url = ref('')

      const formulario = computed(() => store.getters['archivo/draft'])

      const {
         archivos,
         refetchData,
         fetchArchivos,
         dataMeta,
         totalArchivos,
         perPageOptions,
         searchQuery,
         perPage,
         currentPage,
         sortBy,
         isSortDesc,
      } = useListArchivos(props.id)

      const agregarArchivo = () => {
         formulario.value.entrega_id = props.id
         showSidebar.value = true
      }

      onMounted(() => {
         refetchData();
      })

      const guardar = () => {

         store.dispatch('archivo/guardar',formulario.value).then(({data}) => {

            if(data.result){
               
               Notification.success({
                  message:'Archivo Guardado con éxito...',
                  position:'bottom-right'
               })

               refetchData();

               showSidebar.value = false

            }else{

               Notification.error({
                  message: 'El Archivo no se pudo guardar, inténtelo de nuevo',
                  position: 'bottom-right'
               })

            }

         })

      }

      const verArchivo = (archivo) => {
         url.value = archivo.url;
         tipo.value = archivo.tipo
         showImagen.value = true;
      }

      const eliminar = (archivo_id)=> {

         store.dispatch('archivo/eliminar',archivo_id).then(response => {

            if(response.data.result){
               refetchData();
               Notification.info('Archivo eliminado con éxito')
            }else{
               Notification.info('Archivo no eliminado, inténtelo de nuevo')

            }
         }).catch(e => {
            console.log(e)
         })

      } 


      return {
         archivos,
         refetchData,
         fetchArchivos,
         dataMeta,
         totalArchivos,
         perPageOptions,
         searchQuery,
         perPage, 
         currentPage,
         sortBy,
         isSortDesc,
         loading:computed(() => store.state.loading),
         required,
         agregarArchivo,
         showSidebar,
         formValidate,
         guardar,
         formulario,
         getImage,
         showImagen,
         url,
         verArchivo,
         tipo,
         eliminar
      }

   },

}
</script>

<style lang="scss" scope>

.img-file{
   width: 100%;
   height: 100%;
   object-fit: contain;
   cursor: pointer;
}

.card .card-header{
   padding: 0px;
}


</style>