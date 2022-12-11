<template>
   <form autocomplete="off" @submit.prevent="save"  v-loading="loading">
	<div class="card">
		<div class="card-body">
			
			<div class="container-fluid">
				
				<div class="row">
					<div class="col-12 col-lg-6">
											
						<div class="form-group" data-toggle="tooltip" title="Nombre de la tarifa" :class="{'has-danger': errors.nombre}">
							<label for="nombre">Nombre de la tarifa <span class="text-danger">*</span> <i class="fas fa-question-circle text-secondary"></i></label>
							<input  v-model="formulario.nombre" class="form-control form-control-sm" type="text" id="nombre" :class="{'is-invalid' : errors.nombre }" placeholder="nombre de la tarifa"/>
							<div class="invalid-feedback d-flex" role="alert" v-if="errors.nombre">
                           <strong v-text="errors.nombre[0]"></strong>
							</div>
						</div>
                  
                   

                  <b-form-group label="Rango de edad?" description="Si decide que la tarifa tiene un rango de edad, se habilitará la opción para asignar el rango" v-slot="{ ariaDescribedby }">
                     <b-form-radio v-model="formulario.rango_edad" :aria-describedby="ariaDescribedby" name="some-radios" :value="true">Sí, con rango </b-form-radio>
                     <b-form-radio v-model="formulario.rango_edad" :aria-describedby="ariaDescribedby" name="some-radios" :value="false">Nó, sin rango</b-form-radio>
                  </b-form-group>


                  <b-form-group description="El rango de edad comprendido">
                     <template #label>
                        Rango de edad <span class="text-danger">*</span>
                     </template>

                      <el-slider
                        v-model="formulario.edades"
                        range
                        show-stops
                        :max="getMaxPersonas"
                        :format-tooltip="(val) => (val > 1) ? `${val} años` : `${val} año`" :disabled="!formulario.rango_edad">
                     </el-slider>

                     <!-- <vue-slider
                           v-model="formulario.edades"
                           
                           class="mb-2"
                           data-label='Años'
                           :disabled="!formulario.rango_edad"
                     /> -->

                     <strong  v-if="errors.edades" v-text="errors.edades[0]" class="text-danger"></strong>
                  </b-form-group>

                

													
					</div>

               <div class="col-12 col-lg-6">
                    
                   <div class="form-group">
                     <label for="max_permitidas">Max permitidas</label>

                     <div class="input-group">
                        <el-slider v-model="formulario.max_personas" id="max_permitidas" show-input :min="1" :max="100" class="w-100"></el-slider>

                       
                        <strong  v-if="errors.max_personas" v-text="errors.max_personas[0]" class="text-danger"></strong>

                     </div>
                  </div>

                  
                  <b-form-group label-for="precio">
                     <template #label>
                          Precio: {{ formulario.precio | currency }} MXN <span class="text-danger">*</span>
                     </template>
                     <currency-input @change="formulario.precio = $event" :value="formulario.precio" input-class="form-control form-control-sm" :options="{currency:'MXN'}"></currency-input>
                     <strong  v-if="errors.precio" v-text="errors.precio[0]" class="text-danger"></strong>
                  </b-form-group>
               
               </div>



            </div>

         </div>
      </div>

      <div class="card-footer">
         <b-button  @click="$router.go(-1)" size="sm"><span class="fas fa-arrow-left mr-1"></span> Regresar </b-button>
         <b-button variant="primary" @click="guardar" size="sm" v-loading="loading"><span class="fas fa-save mr-1"></span> Guardar</b-button>
      </div>
   </div>
</form>
</template>

<script>

import {ref,toRefs, onMounted} from 'vue'

import {mapState} from 'vuex';
import store from '@/store';
import {BFormGroup, BFormRadio,BButton} from 'bootstrap-vue'
import CurrencyInput from 'components/CurrencyInput';
import VueSlider from 'vue-slider-component'
import { $themeConfig } from '@themeConfig'

export default {
   

   props:['id'],

   components:{
      BFormRadio,
      BFormGroup,
      BButton,
      CurrencyInput,
      VueSlider

   },
   computed:{
      ...mapState(['errors','loading']),

   },
   setup(props,{emit}){

      const {id} = toRefs(props);
      
     
      const formulario = ref({
         id:null,
         nombre:'',
         precio:0,
         rango_edad:false,
         edades:[12,18],
         max_personas:0,
         habitacion_id:null,
      });

      const cargarForm  = () => {
         formulario.value = store.getters['tarifa/draft'];
         formulario.value.precio = Number(formulario.value.precio)

      }

      onMounted(() => {
         cargarForm();
      })

      const guardar = () => {
         emit('save',formulario.value)
      }

      const regresar =  ref({
            name:'habitacion.tarifas',
            params:{idhabitacion:(formulario.value.habitacion_id) ? formulario.value.habitacion_id : id.value}
      })


      return {
         formulario,
         guardar,
         $themeConfig,
         regresar

         
      }
   }
}

</script>