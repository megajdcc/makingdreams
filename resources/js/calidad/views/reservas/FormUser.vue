<template>
   <div class="container-fluid">
       <b-form @submit.prevent="siguiente">
      <validation-observer ref="formValidate">

      <div class="row">
            
            
            <div class="col-12 col-md-6">
               <b-form-group description="Nombre completo con nombres y apellidos">
                  <template #label>
                     Su Nombre: <span class="text-danger">*</span>
                  </template>
                  
                  <validation-provider #default="{errors}" rules="required" name="Nombre">
                     <b-form-input v-model="formulario.reservante" placeholder="Joe Doe" size="sm" :state="errors.length > 0 ? false:null"></b-form-input>
                     <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
               
               </b-form-group>

               <b-form-group>
                  <template #label>
                     Email: <span class="text-danger">*</span>
                  </template>
                   <validation-provider #default="{errors}" rules="required|email" name="Email">

                     <b-form-input v-model="formulario.email" type="email" placeholder="joe@example.com" size="sm" :state="errors.length > 0 ? false:null"></b-form-input>

                      <small class="text-danger">{{ errors[0] }}</small>


                   </validation-provider>
               </b-form-group>

            </div>

            <div class="col-12 col-md-6">
               <b-form-group>
                  <template #label>
                     Teléfono: <span class="text-danger">*</span>
                  </template>
                  <validation-provider #default="{errors}" rules="required" name="Teléfono">
                   <the-mask type="tel" placeholder="Número de teléfono" class="form-control form-control-sm" v-model="formulario.telefono" :mask="masks" :masked="masked" :class="{'is-invalid' : errors[0]}"/>
                   <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
               </b-form-group>
            </div>

           

       
         


      </div>

       </validation-observer>

      <div class="row">
         <div class="col-12">
            <b-button type="submit" size="sm"><span class="fas fa-arrow-right"></span>Siguiente</b-button>
         </div>
      </div>

      </b-form>

   
   </div>
</template>
<script>

import { ref,toRefs } from 'vue'
import { TheMask }from 'vue-the-mask';

import optionsComponents from 'mixins/optionsComponents';

import {
   BFormGroup,
   BFormInput,
   BButton,
   BForm

} from 'bootstrap-vue'; 

import {ValidationProvider,ValidationObserver} from 'vee-validate';
import { required, email } from '@validations'


export default {

   props:['formulario'],
   mixins:[optionsComponents],

   components:{
      BFormGroup,
      BFormInput,
      BButton,
      TheMask,
      ValidationProvider,
      ValidationObserver,
      BForm
   },


   methods:{
      siguiente(){
         this.$refs.formValidate.validate().then(success => {
            if(success){
               this.$emit('next');
            }

         })
      }

   },

   setup(props,{emit}) {
      // const {formulario} = toRefs(props);

      return {
         // formulario,
         required,
         email
      }
   },

}
</script>
