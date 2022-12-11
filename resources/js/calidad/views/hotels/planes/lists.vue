<template>
   <b-card>
      <b-container fluid>
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

                     <b-button variant="primary" @click="agregarPlan()">
                        <span class="text-nowrap">Agregar Plan</span>
                     </b-button>
                  </b-button-group>

               </div>
            </b-col>
         </b-row>

         <b-overlay :show="loading">
            <b-row class="my-3">

               <b-col md="6" lg="6" xl="4" v-for="(plan, i ) in planes" :key="i">
                  <b-jumbotron bg-variant="dark" header-tag="h3" lead-tag="h3" text-variant="primary"> 

                  <template #header>
                     <h3 class="text-white">{{ plan.plan }}</h3>
                  </template>

                  <template #lead>
                     <p class="text-white text-justify">{{ plan.descripcion }}</p>
                  </template>
                     <!-- <p>For more information visit website</p> -->
                     
                     <b-button-group size="sm">
                        <b-button @click="editar(plan)" title="Editar plan del hotel" variant="primary">
                           <feather-icon icon="EditIcon"/>
                           Editar
                        </b-button>

                        <b-button @click="eliminar(plan.id)" title="Eliminar Plan" variant="danger">
                           <feather-icon icon="TrashIcon"/>
                           Eliminar
                        </b-button>

                     </b-button-group>
                  </b-jumbotron>
               </b-col>
            </b-row>
         </b-overlay>

         <b-row>
            <b-col>
               <paginate-table :dataMeta="dataMeta" :perPage="perPage" :currentPage.sync="currentPage"
                  :total="totalPlanes" />
            </b-col>
         </b-row>
      </b-container>

      <b-sidebar lazy v-model="showForm" left>
         <template #title>
            Plan de Hotel
         </template>

         <validation-observer ref="formValidate" #default="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(guardar)">
               <b-container fluid>
                  <b-row>
                     <b-col>
                        <b-form-group description="Nombre del plan de hotel">
                           <template #label>
                              Plan: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="plan" rules="required" #default="{errors}">
                              <b-form-input v-model="formulario.plan" :state="errors.length ? false : null " />

                              <b-form-invalid-feedback>
                                 {{errors[0]}}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Descripción del plan de hotel">
                           <template #label>
                              Descripción: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="descripcion" rules="required" #default="{errors}">
                              <b-form-textarea v-model="formulario.descripcion" :state="errors.length ? false : null"
                                 :rows="8" />

                              <b-form-invalid-feedback>
                                 {{errors[0]}}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                     </b-col>
                  </b-row>

                  <b-row>
                     <b-col>
                        <b-button type="submit" variant="primary" size="sm" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>
                     </b-col>
                  </b-row>
               </b-container>
            </b-form>

         </validation-observer>

      </b-sidebar>
   </b-card>
</template>

<script>

import { ref,onMounted,watch,computed } from 'vue'

import {
   BContainer,
   BRow,
   BCol,
   BSidebar,
   BCard,
   BButton,
   BButtonGroup,
   BFormInput,
   BOverlay,
   BFormGroup,
   BFormInvalidFeedback,
   BFormTextarea,
   BForm,
   BJumbotron
} from 'bootstrap-vue';

import useListPlanes from './useListPlanes';

import vSelect from 'vue-select'

import store from '@/store'

import { ValidationObserver,ValidationProvider } from 'vee-validate';

import {required} from '@validations'


import { Notification } from 'element-ui';

export default {

   props:['idhotel'],

   components:{
      BContainer,
      BRow,
      BCol,
      BSidebar,
      BCard,
      BButton,
      BButtonGroup,
      vSelect,
      BFormInput,
      BOverlay,
      BFormGroup,
      BFormInvalidFeedback,
      BFormTextarea,
      PaginateTable:() => import('components/PaginateTable'),
      ValidationObserver,
      ValidationProvider,
      BForm,
      BJumbotron

   },

   setup(props) {

      const showForm = ref(false)

      const formValidate = ref(null)

      const formulario = ref({
         id:null,
         plan:null,
         descripcion:null,
         hotel_id:props.idhotel,
      })

      const {
         planes,
         refetchData,
         fetchPlanes,
         dataMeta,
         totalPlanes,
         perPageOptions,
         searchQuery,
         perPage,
         currentPage,
      } = useListPlanes(props.idhotel);
      
      onMounted(() => refetchData())

      const agregarPlan = () => {

         showForm.value = true

      }

      watch(perPage,(val) => {
         console.log(val)
      })

      const clearFormulario = () => {

         formulario.value = {
            id:null,
            plan:'',
            descripcion:'',
            hotel_id:props.idhotel
         }
      }


      const guardar = () => {


         store.dispatch('hotel/guardarPlan',formulario.value).then(({data}) => {

            if(data.result){
               if(formulario.value.id){
                  Notification.info({
                     message: 'Plan Actualizado con éxito',
                     position: 'bottom-right'
                  })
               }else{
                  Notification.info({
                     message: 'Plan Registrado con éxito',
                     position: 'bottom-right'
                  })
               }
             

               refetchData();

               clearFormulario()

               showForm.value = false
            }else{

               if(formulario.value.id){
                  Notification.info({
                     message: 'Plan no se pudo actualizar, inténtelo de nuevo mas tarde.',
                     position: 'bottom-right'
                  })
               }else{
                  Notification.info({
                     message: 'Plan no se pudo registrar, inténtelo de nuevo mas tarde.',
                     position: 'bottom-right'
                  })
               }
              
            }

         }).catch(e => {
            if(e.response.status === 422) {

               formValidate.value.setErrors(e.response.data.errors)
            }
            console.log(e)

         })
      }

      const editar = (plan) => {

         formulario.value = plan
         showForm.value  =true;

      }

      const eliminar = (plan) => {

         store.dispatch('hotel/eliminarPlan',plan).then(({data}) => {

            if(data.result){
               Notification.info({
                  message:'Plan eliminado con éxito',
                  position:'bottom-right'
               })
               refetchData();
            }else{
               Notification.error({
                  message: 'Plan no eliminado, inténtelo de nuevo',
                  position: 'bottom-right'
               })

            }
         })

      }

      

      return {
         planes,
         refetchData,
         fetchPlanes,
         dataMeta,
         totalPlanes,
         perPageOptions,
         searchQuery,
         perPage,
         currentPage,
         agregarPlan,
         loading:computed(() => store.state.loading),
         showForm,
         formulario,
         formValidate,
         required,
         guardar,
         editar,
         eliminar

      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
