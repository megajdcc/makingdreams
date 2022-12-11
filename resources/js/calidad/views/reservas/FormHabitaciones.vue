<template>

<div class="container-fluid">

   <b-form @submit.prevent="siguiente">
      <validation-observer ref="formValidate">

         <div class="row mb-2">
            <div class="col-12">
                  <span for="">Seleccione el tipo de Habitación</span>
            </div>
         </div>

         <div class="row">
            <div class="col-12 d-flex tipohabitacion">

               <b-card
                  v-for="(habitacion,index) in habs"
                  :key="index"
                  :title="habitacion.nombre"
                  :img-src="`/storage/hotel/habitaciones/${(habitacion.imagenes[0]) ? habitacion.imagenes[0].imagen : 'hab_default.jpg'}`"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="max-width: 20rem;"
                  class="mb-2 mx-2 card-habitacion"
                  :class="{'card-selected' :tipo_habitacion == habitacion.id}"
                  @click="seleccionarTipoHabitacion(habitacion.id)">
                  <b-card-text>
                     {{habitacion.descripcion}}
                  </b-card-text>
               </b-card>

            </div>
         </div>

         <div class="row mt-2">
         

            <div class="col-12 my-2">
               

                  <div class="row mt-2">
                     <div class="col-12">
                        <span for="">Tarifas</span>
                        <p>Seleccione la tarifa que le convenga, de acuerdo a la edad del habitante. Al menos un adulto por habitación.</p>

                        <el-table
                           :data="tarifas"
                           style="width: 100%"
                           ref="tableTarifa"
                           highlight-current-row
                           @current-change="TarifaSeleccionada"
                           size="mini"
                           :row-class-name="() => 'cpointer'"
                           >
                           
                           <el-table-column
                           prop="nombre"
                           label="Nombre"
                           width="auto">
                           </el-table-column>
                           
                           <el-table-column
                           label="Precio"
                           width="auto">
                           <template #default="{row}">
                              <i class="el-icon-money"></i>
                              <span style="margin-left: 10px">{{ row.precio | currency }} MXN</span>
                           </template>
                           </el-table-column>
            

                           <el-table-column
                              label="Rango de edad"
                              width="auto">
                              <template #default="{row}">
                                 <span style="margin-left: 10px">{{ (row.rango_edad) ? 'Si' : null }}</span>
                              </template>
                           </el-table-column>

                           <el-table-column
                              label="Edades"
                              width="auto">
                              <template #default="{row}">
                                 <span style="margin-left: 10px">{{ (row.rango_edad) ? `${row.edades[0]} a  ${row.edades[1] }` : 'No aplica' }}</span>
                              </template>
                           </el-table-column>


            

                        </el-table>

                     </div>
                  </div>

                  <validation-observer ref="habitanteValidateForm">
                     <b-form @submit.prevent="asignarHabitante">

                        <span>Huésped</span>
                        
                        <div class="row mt-2">

                           <div class="col-12 col-md-6  ">
                                 <b-form-group label="Nombre completo" description="Establezca el nombre y el apellido del Habitante">
                                    <validation-provider name="Nombre" #default="{errors}" rules="required">
                                       <b-form-input v-model="nombre" :state="errors.length > 0 ? false:null" size="sm" />
                                       <small class="text-danger">{{ errors[0] }}</small>

                                    </validation-provider>
                                    
                                 </b-form-group>
                           </div>

                           <div class="col-12 col-md-6">
                              <b-form-group label="Edad" description="Si el huesped es un bebe menor de 1 año, dejelo en 0, de lo contrario establezca la edad correspondiente">

                                 <validation-provider name="Edad" #default="{errors}" rules="required">
                                       <b-form-spinbutton  v-model="edad" :min="(currentRow) ? currentRow.edades[0] : 0" :max="(currentRow) ? currentRow.edades[1] : 0" :state="errors.length > 0 ? false:null" size="sm" />
                                       <small class="text-danger">{{ errors[0] }}</small>

                                 </validation-provider>
                                    
                              </b-form-group>
                           </div>

                           <div class="col-12">
                                 <b-button variant="primary" v-b-tooltip.hover title="Asignar Huesped " size="sm" type="submit" :disabled="limiteAlcanzado || !currentRow"><span class="fas fa-user-plus"></span></b-button>
                           </div>
                        </div>

                     </b-form>
                  </validation-observer>
            

            </div>

            <div class="col-12">
               <span>Huéspedes</span>

               <el-table :data="habitantes" size="mini" style="width: 100%">
                  
                   

                  <el-table-column
                  prop="nombre"
                  label="Nombre"
                  width="auto">
                  </el-table-column>

                     <el-table-column
                  prop="edad"
                  label="Edad"
                  width="auto">
                  </el-table-column>

                  <el-table-column
                     fixed="right"
                     label="Acciones"
                     width="100">
                     <template #default="{row}">
                        <el-button 
                           @click="habitantes.splice(habitantes.findIndex(val => val.nombre == row.nombre),1)" 
                           icon="el-icon-delete-solid" 
                           type="danger"
                           size="mini" 
                           circle>
                           </el-button>

                     </template>
                  </el-table-column>

                  
               </el-table>

            </div>

            <div class="col-12 mt-2 mb-2">

               <b-form-group description="Fecha de entrada y de salida de la habitación">
                  
                  <template #label>
                     Chech in y Check out <span class="text-danger">*</span> | {{noches}} noches
                  </template>

                  <validation-provider #default="{errors}" rules="required">

                 
                     <el-date-picker
                        v-model="fechas"
                        size="small"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="al"
                        start-placeholder="Check in"
                        :picker-options="optionsPicker"

                        :class="{'is-invalid' : errors[0]}"
                        end-placeholder="Check out"
                        >
                     </el-date-picker>
                     <br>
                     <small class="text-danger">{{ errors[0] }}</small>


                   </validation-provider>


               </b-form-group>

               <b-button variant="primary" size="sm" :disabled="!validarAsignacion" @click="asignarHabitacion" class="my-2"><span class="fas fa-save mr-1"></span> Asignar Habitación</b-button>
            </div>

         </div>

         <el-divider content-position="left">Habitaciones</el-divider>

         <div class="row">
            <div class="col-12">
            <el-table :data="habitaciones" size="mini" style="width: 100%">
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







                  <el-table-column
                     fixed="right"
                     label="Acciones"
                     width="100">
                     <template #default="{$index}">
                        <el-button 
                           @click="habitaciones.splice($index,1)" 
                           icon="el-icon-delete-solid" 
                           type="danger"
                           size="mini" 
                           circle>
                           </el-button>

                     </template>
                  </el-table-column>

                  
               </el-table>
            </div>
         </div>
      
      </validation-observer>


       <div class="row my-2">
          <b-button-group size="sm">
            <b-button @click="$emit('regresar')" size="small"><span class="fas fa-arrow-left mr-1" ></span>Regresar</b-button>
            <b-button type="button" variant="primary" @click="siguiente" size="sm" :disabled="habitaciones.length < 1"><span class="fas fa-arrow-right" ></span>Siguiente</b-button>
          </b-button-group>
        
       </div>
   </b-form>
  
</div>
   
</template>

<script>



import {ValidationProvider,ValidationObserver} from 'vee-validate';
import {mapGetters,mapState,mapActions} from 'vuex';
import { required } from '@validations'
import {ref,toRefs} from 'vue';

import {getEtapaEdad} from '@core/utils/filter';

import {
   BFormGroup,
   BFormInput,
   BButton,
   BForm,
   BCardImg, 
   BCardGroup,
   BCard,
   BCardText,
   BFormSpinbutton,
   BFormRadio,
   BButtonGroup,
   BCollapse,
   VBToggle,
   VBTooltip
   } 
from 'bootstrap-vue';
export default {
   
   props:['formulario','boda'],

   components:{
      ValidationProvider,
      ValidationObserver,
      BFormInput,
      BFormGroup,
      BButton,
      BForm,
      BCardImg,
      BCardGroup,
      BCard,
      BCardText,
      BFormSpinbutton,
      BFormRadio,
      BButtonGroup,
      BCollapse
   },

   directives:{
      'b-toggle':VBToggle,
      'b-tooltip':VBTooltip
   },

   data(){
      return{
         fechas:[],
      
         asignandoHabitante:false,
         currentRow: null,
         habitantes:[],
         tarifa_id:null,
         tipo_habitacion:null,

         nombre:'',
         edad:0,
         required,
         habitaciones:[],
         adulto:false,
         noches:0,
         error:''
         


      }
   },

   setup(props){
      
      return {
         getEtapaEdad
      }
   },

   computed:{

      ...mapState('habitacion',{habs:'habitaciones'}),
      ...mapState('tarifa',['tarifas']),
      ...mapState('app',['windowWidth']),
      ...mapGetters('habitacion',['getHabitacion']),


      optionsPicker(){
         return {
            disabledDate:(fecha) => {
               return fecha.getTime() < new Date().getTime()
            },

            cellClassName:(fecha) => {
               return (fecha.getUTCDate() == new Date(this.boda.fecha).getUTCDate() && fecha.getMonth() == new Date(this.boda.fecha).getMonth() && fecha.getFullYear() == new Date(this.boda.fecha).getFullYear()) ? 'bg-success text-white matrimonio fas fa-heart' : ''
            },
          
         }
      },


      validarAsignacion(){
         let result = true;

         if(!this.tipo_habitacion){
            result = false;
         }else if(this.habitantes.length < 1 ){
            result = false;
         }else if((this.habitantes.filter(val => val.edad > 18)).length < 1 ){
            result = false;
         }else if(this.fechas.length < 1){
            result = false
         }
         return result;

      },

      limiteAlcanzado(){

         let limite_adulto = (this.getHabitacion(this.tipo_habitacion)!= undefined) ? this.getHabitacion(this.tipo_habitacion).adultos : 0;
         let limite_bebe = (this.getHabitacion(this.tipo_habitacion) != undefined) ? this.getHabitacion(this.tipo_habitacion).bebes : 0;
      
         let pax_registrados = (this.habitantes.length > 0 )  ? this.habitantes.filter(val => val.edad > 5).length : 0;
         let bebe_registrados = (this.habitantes.length > 0) ? this.habitantes.filter(val => val.edad <= 5).length : 0;

         if(pax_registrados >= limite_adulto && this.edad > 5){

            return true;
         }

         if(bebe_registrados >= limite_bebe && this.edad <= 5){
            return true;
         }

         this.error = '';

         return false;


      },



   },

   methods:{

      ...mapActions('tarifa',['cargarTarifas']),


      siguiente(){

         this.formulario.habitaciones = this.habitaciones;
            const rootEle = document.documentElement
            rootEle.scrollTo({
            top: 400,
            behavior: 'smooth',
            })
          this.$emit('next');
      },
      seleccionarTipoHabitacion(hab){
         this.tipo_habitacion = hab
         this.cargarTarifas(hab)

      },
      
   

 

      TarifaSeleccionada(val){
         this.currentRow = val;
      },

      asignarHabitante(){
         
         this.$refs.habitanteValidateForm.validate().then(success => {
            
            if(success){

               this.habitantes.push({nombre:this.nombre,
                                       edad:this.edad,
                                       precio:this.currentRow.precio,
                                       tarifa:this.currentRow
                                       });

               // this.currentRow = null
               this.nombre = '';
               this.edad = 0;
               this.adulto = false;
               this.error = '';

            }

         })

      },

      asignarHabitacion(){
         
      

         this.habitaciones.push({
            habitacion_id:this.tipo_habitacion,
            habitantes:this.habitantes,
            monto:this.getMonto({habitantes:this.habitantes}) * this.noches,
            check_in:this.fechas[0],
            check_out:this.fechas[1],
            noches:this.noches
         })

         this.habitantes = [];
         this.tipo_habitacion = null;
         this.currentRow = null;
         this.fechas = [];
         this.noches = 0;

      },


      getMonto({habitantes}){

         let monto = 0 

         habitantes.forEach(val => {
            monto += Number(val.precio);
         })

         return monto;
      },


   




   },


   watch:{
      
      fechas(val){

         if(val.length > 1 ){
             
             let fecha1 = moment(val[0]);
             let fecha2 = moment(val[1]);
            
            this.noches = fecha2.diff(fecha1,'days');

         }
        
      },


      currentRow(val){
         
         if(val){
            this.edad = this.currentRow.edades[0]
         }

      }


   }

}
</script>

<style lang="scss">
.matrimonio{
   color:white;
   span{
      line-height:10px !important;
   }


}

.cpointer{
   cursor:pointer;
}
.el-table__body tr.current-row>td.el-table__cell {
    background-color: #5a4c2d !important;
    color: white !important;
}

.tipohabitacion{
   overflow-x: auto;
   
   .card-habitacion{
      min-width:20rem;
      cursor:pointer;

   }

   // &::-webkit-scrollbar {
   //  display: none;
   // }

   .card-selected{
      border: 2px solid;
   }

}  


</style>