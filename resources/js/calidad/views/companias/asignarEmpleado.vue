<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           Usuario: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="usuario_id" rules="required" #default="{ errors }">

                           <v-select v-model="formulario.usuario_id" :reduce="(val) => val.id"  :options="empleados" :filterBy="empleadosFilterBy">
                              <template #option="{nombre,imagen,apellido}">
                                 <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre }`" />
                                 <strong>{{ nombre }} {{ apellido }}</strong>
                              </template>
                              
                              <template #selected-option="{nombre,imagen,apellido}">
                                 <b-avatar :src="`/storage/img-perfil/${imagen}`" :alt="`${ nombre } ${apellido}`" size="sm" class="mr-1" />
                                 <strong>{{ nombre }} {{ apellido }}</strong>
                              </template>
                           </v-select>
                           
                           <!-- <el-select v-model="formulario.usuario_id" placeholder="seleccione" class="w-100"
                              size="small" clearable filterable>
                              <el-option v-for="(empleado, i) in empleados" :key="i"
                                 :label="`${empleado.nombre} ${empleado.apellido} - ${empleado.email}`"
                                 :value="empleado.id"></el-option>
                           </el-select> -->
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group description="Puesto que ocupa en la empresa">
                        <template #label>
                           Puesto: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="puesto" rules="required" #default="{ errors }">

                           <b-form-input v-model="formulario.puesto" :state="errors.length ? false : null" />
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
                        <b-button variant="primary" type="submit" title="Guardar" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>

                        <b-button variant="secondary" title="Regresar" @click="regresar">
                           <feather-icon icon="ArrowLeftIcon" />
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

import { ValidationObserver,ValidationProvider} from 'vee-validate'

import {required} from '@validations'


import {computed,ref,toRefs,onMounted} from 'vue'
import store from '@/store'
import { regresar } from '@core/utils/utils'
import {
   BForm,
   BFormInput,
   BFormGroup,
   BFormInvalidFeedback,
   BButtonGroup,
   BButton,
   BContainer,
   BRow,
   BCol,
   BCard,
   BAvatar


} from 'bootstrap-vue'

import vSelect from 'vue-select';
import { options } from 'preact'

export default{

   props:['id'],

   components:{
      ValidationObserver,
      ValidationProvider,
      BForm,
      BFormInput,
      BFormGroup,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      BContainer,
      BRow,
      BCol,
      BCard,
      vSelect,
      BAvatar

   },

   setup(props){

      const {usuarios} = toRefs(store.state.usuario)
      const formValidate = ref(null)
      const formulario = ref({
         compania_id:props.id,
         usuario_id:null,
         puesto:''
      })

      const cargarForm = () => {

         if(!usuarios.value.length){
            store.dispatch('usuario/cargarUsuarios')
         }
      }


      onMounted(() => cargarForm())

      const guardar = () => {

         store.dispatch('compania/asignarEmpleado',formulario.value).then(({data}) => {

            if(data.result){
               
               toast.success('Se ha asociado con éxito al usuario como su empleado')

               formulario.value = {
                  compania_id: props.id,
                  usuario_id: null,
                  puesto: ''
               }

               store.dispatch('usuario/cargarUsuarios')

            }else{
               toast.info('No se pudo asociar al usuario,inténtelo de nuevo mas tarde')
            }

         }).catch(e => {
            console.log(e)
            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }

         })
         

      }

      
      return{
         required,
         loading:computed(() => store.state.loading),
         regresar,
         formulario,
         guardar,
         formValidate,
         empleadosFilterBy: (option, label, search) => (option.nombre || option.apellido || options.email || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > - 1,
         empleados:computed(() => {
            return usuarios.value.filter(val => val.rol.nombre == 'Cliente')
         })
      }

   }
}


</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>

