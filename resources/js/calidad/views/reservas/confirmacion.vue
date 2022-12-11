<template>
   <div class="container-fluid">
      <div class="row">
         <div class="col-12">
            <h3>Confirme la definición de las habitaciones</h3>
            <small>Recuerde que si desea modificar las habitaciones,puede regresar al paso anterior.</small>
            <el-table :data="formulario.habitaciones" size="mini" style="width: 100%">
                  <el-table-column type="expand">
                     <template #default="{row}">

                        <p class="my-0">Check In:{{row.check_in}}</p>
                        <p class="my-0">Check out:{{row.check_out}}</p>
                        
                        <p class="my-0">Noches en la habitación:{{row.noches}} noches</p>
                        <p class="my-0">Adultos: {{ row.habitantes.filter(val => val.edad >= 18 ).length }}</p>
                        <p class="my-0">Menores: {{ row.habitantes.filter(val => val.edad < 18 ).length }}</p>
                        <el-divider content-position="left">Huéspedes de la habitación</el-divider>
                        <template v-for="(hues,i) in row.habitantes" >
                           <p class="my-0">Nombre: {{ hues.nombre }}</p>
                           <p class="my-0">Edad: {{ hues.edad }} años ({{ getEtapaEdad(hues.edad) }}) </p>
                           <el-divider class="my-0"></el-divider>
                        </template>
                     
                     </template>
                  </el-table-column>
                  <el-table-column
                  label="Habitación"
                  width="auto">
                     <template #default="{row}">
                        <span>{{ getHabitacion(row.habitacion_id).nombre}}</span>
                     </template>
                  </el-table-column>

                  <el-table-column
                  label="Pax"
                  width="auto">
                     <template #default="{row}">
                        <span>{{ row.habitantes.length }}</span>
                     </template>
                  </el-table-column>

                  <el-table-column
                     label="Monto por noche"
                     width="auto">
                        <template #default="{row}">
                           <span>{{ getMonto(row) * row.habitantes.length  | currency }} MXN</span>
                        </template>
                  </el-table-column>

                  <el-table-column
                     label="Total"
                     width="auto">
                        <template #default="{row}">
                           <span>{{ row.monto  | currency }} MXN <br> {{row.noches}} Noches</span>
                        </template>
                  </el-table-column>

               </el-table>

         </div>
      </div>

      <div class="row">
         <div class="col-12 d-flex justify-content-end">
            <span class="mr-3 mt-1">Total a pagar: <strong>{{ getTotalPagar() | currency }} MXN </strong></span>
         </div>
      </div>

      <div class="row">
         <div class="col-12">
            <b-form-group label="Requiere Factura Fiscal ? " #default="{ariaDescribedby}">
               <b-form-radio-group v-model="formulario.facturacion" :aria-describedby="ariaDescribedby">
                  <b-form-radio :value="true">Sí</b-form-radio>
                  <b-form-radio :value="false">Nó</b-form-radio>
               </b-form-radio-group>
            </b-form-group>
         </div>
         
         
         <div class="col-12">
            <validation-observer ref="validateFactura">
               <b-form @submit.prevent="enviar">

                  <div class="row" v-if="formulario.facturacion">
                     <div class="col-12 col-md-6">
                        <b-form-group  description="El nombre completo">

                             <template #label>
                               Nombre: <span class="text-danger">*</span>
                            </template>

                           <validation-provider name="nombre" rules="required" #default="{errors}">
                              <b-form-input v-model="formulario.datos_facturacion.nombre" placeholder="Nombre" size="sm" :state="(errors.length > 0) ? false :null"></b-form-input>

                              <small class="text-danger">{{ errors[0] }}</small>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group>

                             <template #label>
                               Email: <span class="text-danger">*</span>
                            </template>
                           <validation-provider name="email" rules="required|email" #default="{errors}">
                              <b-form-input type="email" v-model="formulario.datos_facturacion.email"  size="sm" :state="(errors.length > 0) ? false :null"></b-form-input>

                              <small class="text-danger">{{ errors[0] }}</small>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group>
                           <template #label>
                              Teléfono: <span class="text-danger">*</span>
                           </template>
                           <validation-provider #default="{errors}" rules="required" name="Teléfono">
                           <the-mask type="tel" placeholder="Número de teléfono" class="form-control form-control-sm" v-model="formulario.datos_facturacion.telefono" :mask="masks" :masked="masked" :class="{'is-invalid' : errors[0]}"/>
                           <small class="text-danger">{{ errors[0] }}</small>
                           </validation-provider>
                        </b-form-group>


                     </div>

                     <div class="col-12 col-md-6">
                         <b-form-group>

                            <template #label>
                               Dirección 1: <span class="text-danger">*</span>
                            </template>

                           <validation-provider name="direccion1" rules="required" #default="{errors}">

                              <b-form-textarea v-model="formulario.datos_facturacion.direccion1" :rows="3" :max-rows="3" placeholder="Primera dirección"  :state="errors.length > 0 ? false :null"></b-form-textarea>

                              <small class="text-danger">{{ errors[0] }}</small>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group label="Direccion 2:">

                           <b-form-textarea v-model="formulario.datos_facturacion.direccion2" :rows="3" :max-rows="3" placeholder="Segunda dirección" ></b-form-textarea>
                 
                        </b-form-group>


                        <b-form-group description="">

                            <template #label>
                               RFC: <span class="text-danger">*</span>
                            </template>

                           <validation-provider name="RFC" rules="required" #default="{errors}">

                              <b-form-input v-model="formulario.datos_facturacion.rfc"  :state="errors.length > 0 ? false :null"></b-form-input>

                              <small class="text-danger">{{ errors[0] }}</small>

                           </validation-provider>

                        </b-form-group>

                        <b-form-group description="Código postal">

                           <template #label>
                              CP: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="CP" rules="required" #default="{errors}">

                              <b-form-input v-model="formulario.datos_facturacion.cp"  :state="errors.length > 0 ? false :null"></b-form-input>

                              <small class="text-danger">{{ errors[0] }}</small>

                           </validation-provider>

                        </b-form-group>




                     </div>


                  </div>

                  <div class="row">
                     <div class="col-12">
                        <b-form-group label="Observación" description="Si tiene alguna petición, este campo está para ese fin.">
                           <b-form-textarea v-model="formulario.observacion" :rows="3" :max-rows="6" placeholder="Su observación o petición..."></b-form-textarea>
                        </b-form-group>
                     </div>

                     <div class="col-12" v-if="formulario.facturacion">
                        <span>Los campos marcados con <span class="text-danger">*</span>, son importante no deben Faltar.</span>
                     </div>
                  </div>

                  <div class="row my-2">
                     <b-button-group size="sm">
                        <b-button @click="$emit('regresar')" size="sm"><span class="fas fa-arrow-left mr-1" ></span>Regresar</b-button>
                        <b-button type="submit" variant="primary" size="sm"><span class="fas fa-save" ></span>Enviar Solicitud</b-button>
                     </b-button-group>
                  </div>

                
               </b-form>
            </validation-observer>
           
         </div>
      </div>

     
   </div>
</template>

<script>

import {ref, toRefs} from 'vue'

import { getEtapaEdad } from '@core/utils/filter';

import {mapGetters} from 'vuex';
import {ValidationObserver,ValidationProvider} from 'vee-validate';

import {required,email} from '@core/utils/validations/validations';
import optionsComponents from 'mixins/optionsComponents';

import {
   BButtonGroup,
   BButton,
   BFormRadioGroup,
   BForm,
   BFormTextarea,
   BFormInput,
   BFormGroup,
   BFormRadio
} from 'bootstrap-vue';

export default {

   props:['formulario'],

   components:{
      BButtonGroup,
      BButton,
      BFormRadioGroup,
      ValidationObserver,
      ValidationProvider,
      BForm,
      BFormInput,
      BFormTextarea,
      BFormGroup,
      BFormRadio
   },


   mixins:[optionsComponents],

   computed:{
      ...mapGetters('habitacion',['getHabitacion']),

   },


   methods:{

      enviar(){
         this.$refs.validateFactura.validate().then(success => {
            
            this.formulario.total_pagar = this.getTotalPagar();

            if(success){
               
               this.$emit('save')
            }

         })
      }

   },

   setup(props){
      
      const getMonto = ({habitantes}) => {

         let monto = 0 

         habitantes.forEach(val => {
            monto += Number(val.precio);
         })

         return monto;
      }

      const getTotalPagar = () => {

         let monto = 0 ;

         props.formulario.habitaciones.forEach(val => {
            monto += val.monto;
         })

         return monto;
           

      }  


      return {
         getEtapaEdad,
         getMonto,
         getTotalPagar,
         required,
         email,
        
      }

   },

}
</script>