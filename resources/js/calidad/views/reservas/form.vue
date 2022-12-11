<template>
   <validation-observer ref="formValidate" #default="{handleSubmit}">
      <b-form @submit.prevent="handleSubmit(guardar)">
         <b-card>
            <b-container fluid>

               <b-row>

                  <b-col cols="12" md="6">

                     <b-form-group description="Nombre completo con nombres y apellidos">

                        <template #label>
                           Nombre del solicitante: <span class="text-danger">*</span>
                        </template>

                        <validation-provider #default="{errors}" rules="required" name="invitado">
                           <b-form-input v-model="formulario.invitado" placeholder="Joe Doe" size="sm"
                              :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>

                     </b-form-group>

                  </b-col>

                  <b-col cols="12" md="6">

                     <b-form-group>
                        <template #label>
                           Email: <span class="text-danger">*</span>
                        </template>
                        <validation-provider #default="{errors}" rules="required|email" name="email">
                           <b-form-input v-model="formulario.email" type="email" placeholder="joe@example.com" size="sm"
                              :state="errors.length ? false : null" />
                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>

                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           Teléfono: <span class="text-danger">*</span>
                        </template>
                        <validation-provider #default="{errors}" rules="required" name="telefono">

                           <the-mask type="tel" placeholder="Número de teléfono" class="form-control form-control-sm"
                              v-model="formulario.telefono" :mask="masks" :masked="masked"
                              :class="{'is-invalid' : errors[0]}" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                        </validation-provider>
                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group description="La boda a la cual se desea asistir con la reservación">
                        <template #label>
                           Boda: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="boda_id" rules="required" #default="{errors}">

                           <el-select v-model="formulario.boda_id" placeholder="Seleccione" filterable size="small"
                              class="w-100" @change="capturarBoda" :class="{'is-invalid' : errors.length > 0 }">
                              <el-option v-for="(boda,i) in bodasPermitidas()" :key="i" :value="boda.id"
                                 :label="`${boda.novios.novia} & ${boda.novios.novio}`"></el-option>
                           </el-select>

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>

                     </b-form-group>
                  </b-col>

               </b-row>

               <div class="row" v-if="formulario.boda_id">
                  <div class="col-12 col-md-6">
                     <b-form-group description="Fecha de entrada y de salida de la habitación">

                        <template #label>
                           Chech in y Check out <span class="text-danger">*</span> | {{formulario.noches}} noches
                        </template>

                        <validation-provider #default="{errors}" rules="required">

                           <flat-pickr v-model="fechas" :config="configDate" class="form-control" required
                              placeholder="Select date" name="date" @on-change="fechaCambiada" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>


                        </validation-provider>


                     </b-form-group>
                  </div>
               </div>

               <el-divider></el-divider>

               <div class="" v-if="formulario.boda_id && formulario.habitaciones.length">

                  <div v-for="(habitacion, i ) in formulario.habitaciones" :key="i">

                     <template v-if="habitacion.habitantes">

                        <b-row v-if="formulario.boda_id">
                           <b-col cols="12">
                              <h4 class="font-weight-bold">Habitación #{{`${ i + 1 }`}}</h4>
                           </b-col>
                           <el-divider></el-divider>

                           <b-col cols="12">
                              <b-form-group label="Tipo de habitación" description="Seleccione el tipo de habitación"
                                 #default="{ ariaDescribedby }">
                                 <validation-provider #default="{errors}" name="habitaciones.habitacion_id"
                                    rules="required">

                                    <b-form-radio-group @change="habCambiada" v-model="habitacion.habitacion_id"
                                       :aria-describedby="ariaDescribedby" :state="(errors.length > 0) ? false:null">
                                       <b-form-radio v-for="(tipo,i) in boda.habitaciones " :key="i" :value="tipo.id"
                                          :checked="i == 0 ? true : false">{{ tipo.nombre}}</b-form-radio>
                                    </b-form-radio-group>

                                    <b-form-invalid-feedback :state="errors.length ? false : null">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>
                           </b-col>


                           <b-col cols="12" class="d-flex justify-content-center flex-column align-items-start"
                              v-if="habitacion.habitacion_id">

                              <b-card :title="getTipoHabitacion(habitacion.habitacion_id).nombre"
                                 :img-src="`/storage/hotel/habitaciones/${(getTipoHabitacion(habitacion.habitacion_id).imagenes[0]) ?  getTipoHabitacion(habitacion.habitacion_id).imagenes[0].imagen : 'hab_default.jpg'} `"
                                 img-alt="Image" :img-top="windowWidth < 1054 ? true : false"
                                 :img-left="windowWidth >= 1054 ? true : false" tag="article"
                                 class="mb-2 mx-md-2 card-habitacion">

                                 <b-card-text class="text-justify">
                                    {{(getTipoHabitacion(habitacion.habitacion_id)).descripcion}}
                                 </b-card-text>

                              </b-card>


                           </b-col>

                        </b-row>

                        <b-row class="mt-2" v-show="habitacion.habitacion_id">

                           <!-- <b-col cols="12"  md="3">
                              <b-form-group>
                                 <template #label>
                                    N° de Adultos* (+18)
                                 </template>

                                 <el-select v-model="habitacion.habitantes.adultos" placeholder="Seleccione"
                                    size="small" class="w-100" filterable
                                    @change="ajustarAdultos(habitacion.habitantes.adultos,i)">

                                    <el-option
                                       v-for="(val,u) in (getTipoHabitacion(habitacion.habitacion_id)) ? getTipoHabitacion(habitacion.habitacion_id).pivot.max_adultos  : 1"
                                       :key="u" :label="val" :value="val" :selected="(val == 1) ? true : false">
                                    </el-option>

                                 </el-select>

                              </b-form-group>
                           </b-col> -->

                           <b-col cols="12" md="3" v-if="habitacion.habitacion_id">
                              <b-form-group>
                                 <template #label>
                                    N° de Adultos <span class="text-danger">*</span>
                                 </template>

                                 <b-button variant="primary" @click="aumentarAdulto(habitacion)"
                                    :disabled="habitacion.habitantes.adultos == getTipoHabitacion(habitacion.habitacion_id).pivot.max_adultos"
                                    size="sm">
                                    {{ habitacion.habitantes.adultos }}
                                    <feather-icon icon="PlusIcon" class="ml-1" />
                                 </b-button>

                              </b-form-group>
                           </b-col>


                           <b-col cols="12" md="3">

                              <b-form-group>
                                 <template #label>
                                    N° de Bebés
                                 </template>

                                 <b-input-group>

                                    <el-rate v-model="habitacion.habitantes.bebes"
                                       :icon-classes="['fas fa-child','fas fa-child','fas fa-child']"
                                       void-icon-class="fas fa-child" text-color="#ff9900" show-score
                                       :max="(getTipoHabitacion(habitacion.habitacion_id)) ? getTipoHabitacion(habitacion.habitacion_id).pivot.max_bebes : 0"
                                       score-template="{ value } bebé">
                                    </el-rate>

                                    <b-input-group-append>
                                       <b-button @click="() =>habitacion.habitantes.bebes = 0 " size="sm" variant="link"
                                          title="Limpiar selección">
                                          <feather-icon icon="TrashIcon" />
                                       </b-button>
                                    </b-input-group-append>
                                 </b-input-group>

                              </b-form-group>

                           </b-col>

                           <b-col cols="12" md="3"
                              v-if="getTipoHabitacion(habitacion.habitacion_id) && getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.active">
                              <b-form-group>
                                 <template #label>
                                    N° de Niños
                                    ({{getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0]}}-{{getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[1]}})
                                 </template>

                                 <el-select v-model="habitacion.habitantes.ninos" placeholder="Seleccione" size="small"
                                    class="w-100" filterable
                                    @change="ajustarChild(habitacion.habitantes.ninos,i,getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0])"
                                    clearable>
                                    <el-option
                                       v-for="(val,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.max : 0"
                                       :key="i" :label="val" :value="val"></el-option>
                                 </el-select>

                              </b-form-group>
                           </b-col>

                           <b-col cols="12" md="3"
                              v-if="getTipoHabitacion(habitacion.habitacion_id) && getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.active">
                              <b-form-group>
                                 <template #label>
                                    N° de Jóvenes
                                    ({{getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0]}}-{{getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[1]}})
                                 </template>

                                 <el-select v-model="habitacion.habitantes.adolescentes" placeholder="Seleccione"
                                    size="small" class="w-100" filterable
                                    @change="ajustarJovenes(habitacion.habitantes.adolescentes, i, getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0])"
                                    clearable>

                                    <el-option
                                       v-for="(val,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? (getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.max)  : 0"
                                       :key="i" :label="val" :value="val"></el-option>
                                 </el-select>

                              </b-form-group>
                           </b-col>

                        </b-row>

                        <b-row>

                           <b-col cols="12" md="4"
                              v-show="habitacion.habitantes.adultos > 0 && habitacion.habitacion_id ">
                              <!-- <b-form-group v-for="(adult, e) in habitacion.habitantes.adults" :key="e">
                                 <template #label>
                                    Nombre del adulto #{{ e + 1}}
                                 </template>

                                 <validation-provider name="nombre" rules="required" #default="{errors}">
                                    <b-form-input v-model="adult.nombre" size="sm" placeholder="Nombre completo"
                                       :state="errors.length > 0 ? false : null"></b-form-input>

                                    <b-form-invalid-feedback :state="errors.length ? false : null">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>


                                 </validation-provider>

                              </b-form-group> -->

                              <b-form-group v-for="(adult, e) in habitacion.habitantes.adults" :key="e"
                                 :label="`Nombre del adulto # ${e + 1}`">

                                 <validation-provider name="nombre" rules="required" #default="{errors}">
                                    <b-input-group>
                                       <b-form-input v-model="adult.nombre" size="sm" placeholder="Nombre completo"
                                          :state="errors.length ? false : null" />

                                       <template #append is-text v-if="e != 0 ">
                                          <b-button variant="danger"
                                             @click="quitarAdulto(habitacion.habitantes.adults,e,habitacion)" size="sm">
                                             <feather-icon icon="TrashIcon" />
                                          </b-button>
                                       </template>
                                    </b-input-group>

                                    <b-form-invalid-feedback>
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>

                                 </validation-provider>

                              </b-form-group>
                           </b-col>

                           <b-col cols="12" md="4" v-show="habitacion.habitantes.ninos > 0 ">

                              <section v-for="(nino, e) in habitacion.habitantes.childs" :key="e">
                                 <b-form-group>
                                    <template #label>
                                       Nombre del niño #{{ e + 1}}
                                    </template>
                                    <validation-provider name="nombre" rules="required" #default="{errors}">
                                       <b-form-input v-model="nino.nombre" size="sm" placeholder="Nombre completo"
                                          :state="errors.length > 0 ? false : null"></b-form-input>
                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>

                                 </b-form-group>

                                 <b-form-group>
                                    <template #label>
                                       Edad del niño #{{ e + 1}}
                                    </template>
                                    <validation-provider name="edad" rules="required" #default="{errors}">
                                       <b-form-spinbutton v-model="nino.edad"
                                          :min="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0]"
                                          :max="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[1]"
                                          size="sm" :state="errors.length > 0 ? false : null" />
                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-button variant="danger" title="Quitar" size="sm"
                                    @click="() => { habitacion.habitantes.childs.splice(e,1); habitacion.habitantes.ninos-- }">
                                    <feather-icon icon="TrashIcon" />
                                    Quitar
                                 </b-button>

                              </section>


                           </b-col>

                           <b-col cols="12" md="4" v-show="habitacion.habitantes.adolescentes > 0 ">

                              <section v-for="(joven, e) in habitacion.habitantes.jovenes" :key="e">
                                 <b-form-group>
                                    <template #label>
                                       Nombre del joven #{{ e + 1}}
                                    </template>
                                    <validation-provider name="nombre" rules="required" #default="{errors}">
                                       <b-form-input v-model="joven.nombre" size="sm" placeholder="Nombre completo"
                                          :state="errors.length > 0 ? false : null"></b-form-input>

                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>

                                 </b-form-group>

                                 <b-form-group>
                                    <template #label>
                                       Edad del joven #{{ e + 1}}
                                    </template>
                                    <validation-provider name="edad" rules="required" #default="{errors}">
                                       <b-form-spinbutton v-model="joven.edad"
                                          :min="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0]"
                                          :max="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[1]"
                                          size="sm" :state="errors.length > 0 ? false : null" />
                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>
                                 </b-form-group>

                                 <b-button variant="danger" title="Quitar" size="sm"
                                    @click="() => { habitacion.habitantes.jovenes.splice(e,1); habitacion.habitantes.adolescentes-- }">
                                    <feather-icon icon="TrashIcon" />
                                    Quitar
                                 </b-button>

                              </section>

                           </b-col>

                        </b-row>

                     </template>


                     <b-row>
                        <b-col cols="12">
                           <b-form-group label="Petición acerca de la habitación">
                              <b-form-textarea v-model="habitacion.observacion" :rows="3" :max-rows="6"
                                 placeholder="Petición acerca de la Habitación" />
                           </b-form-group>
                        </b-col>
                     </b-row>

                     <el-divider></el-divider>
                  </div>

               </div>

               <b-row>
                  <b-col cols="12">
                     <b-form-group label="Requiere Factura Fiscal ? " #default="{ariaDescribedby}">
                        <b-form-radio-group v-model="formulario.facturacion" :aria-describedby="ariaDescribedby">
                           <b-form-radio :value="true">Sí</b-form-radio>
                           <b-form-radio :value="false">Nó</b-form-radio>
                        </b-form-radio-group>
                     </b-form-group>
                  </b-col>
                  <b-col cols="12">


                     <b-row v-if="formulario.facturacion">
                        <b-col cols="12" md="6">

                           <b-form-group
                              description="Las opciones disponibles aplican tanto para personas fisica y moral">
                              <template #label>
                                 Uso de CFDI: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="cfdi" rules="required" #default="{errors}">
                                 <el-select v-model="facturacion.cfdi" clearable filterable class="w-100"
                                    placeholder="Seleccione una opción" size="small">
                                    <el-option v-for="(val, i) in options_cfdi" :key="i" :value="val.id"
                                       :label="val.text">
                                    </el-option>

                                 </el-select>

                                 <b-form-invalid-feedback :state="errors.length ? false : null ">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                              </validation-provider>
                           </b-form-group>


                           <b-form-group description="El nombre completo">

                              <template #label>
                                 Nombre o razón social: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="nombre" rules="required" #default="{errors}">
                                 <b-form-input v-model="facturacion.nombre" placeholder="Nombre" size="sm"
                                    :state="(errors.length > 0) ? false :null"></b-form-input>

                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>



                           <b-form-group description="">

                              <template #label>
                                 RFC: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="RFC" rules="required" #default="{errors}">

                                 <b-form-input v-model="facturacion.rfc" :state="errors.length > 0 ? false :null">
                                 </b-form-input>

                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>

                           </b-form-group>

                           <b-form-group>

                              <template #label>
                                 Email: <span class="text-danger">*</span>
                              </template>
                              <validation-provider name="email" rules="required|email" #default="{errors}">
                                 <b-form-input type="email" v-model="facturacion.email" size="sm"
                                    :state="(errors.length > 0) ? false :null"></b-form-input>

                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>

                           <b-form-group>
                              <template #label>
                                 Teléfono: <span class="text-danger">*</span>
                              </template>
                              <validation-provider #default="{errors}" rules="required" name="Teléfono">
                                 <the-mask type="tel" placeholder="Número de teléfono"
                                    class="form-control form-control-sm" v-model="facturacion.telefono" :mask="masks"
                                    :masked="masked" :class="{'is-invalid' : errors[0]}" />
                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>
                           </b-form-group>


                        </b-col>

                        <b-col cols="12" md="6">
                           <b-form-group>
                              <template #label>
                                 Dirección 1: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="direccion1" rules="required" #default="{errors}">

                                 <b-form-textarea v-model="facturacion.direccion1"
                                    :state="errors.length > 0 ? false :null"></b-form-textarea>

                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>

                           </b-form-group>

                           <b-form-group label="Direccion 2:">

                              <b-form-textarea v-model="facturacion.direccion2" :rows="3" :max-rows="3"
                                 placeholder="Segunda dirección" />

                           </b-form-group>
                           <b-form-group description="Código postal">

                              <template #label>
                                 CP: <span class="text-danger">*</span>
                              </template>

                              <validation-provider name="CP" rules="required" #default="{errors}">

                                 <b-form-input v-model="facturacion.cp" :state="errors.length > 0 ? false :null">
                                 </b-form-input>

                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>

                              </validation-provider>

                           </b-form-group>

                        </b-col>
                     </b-row>

                     <b-col cols="12" v-if="formulario.facturacion">
                        <span>Los campos marcados con <span class="text-danger">*</span>, son importante no deben
                           Faltar.</span>
                     </b-col>

                  </b-col>
               </b-row>

               <b-row class="my-2">
                  <b-col cols="12">
                     <b-button-group size="sm">
                        <b-button variant="dark" @click.stop="regresar">
                           <feather-icon icon="ArrowLeftIcon" />
                           Regresar
                        </b-button>

                        <b-button variant="primary" type="submit" :v-loading="loading">Enviar Solicitud</b-button>

                     </b-button-group>
                  </b-col>
               </b-row>

            </b-container>
         </b-card>
      </b-form>
   </validation-observer>
</template>
<script>
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import {required,email} from '@validations';
import {ref,toRefs,onMounted, watch,computed} from 'vue';
import store  from '@/store';
import { TheMask }from 'vue-the-mask';
import optionsComponents from 'mixins/optionsComponents';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from "flatpickr/dist/l10n/es.js"
import {Notification} from 'element-ui';

import {
   BForm,
   BFormGroup,
   BFormInput,
   BButton,
   BFormRadioGroup,
   BFormRadio,
   BCard,
   BCardText,
   BFormTextarea,
   BFormSpinbutton,
   BFormSelect,
   BInputGroup,
   BInputGroupAppend,
   BButtonGroup,
   BFormInvalidFeedback,
   BContainer,
   BRow,
   BCol

} from 'bootstrap-vue';

export default {

   props:{
      boda_id:{
         type:Number|String,
         default:null,
         required:false
      }
   },

   components:{
      ValidationObserver,
      ValidationProvider,
      BForm,
      BFormGroup,
      BFormInput,
      BButton,
      TheMask,
      BFormRadioGroup,
      BFormRadio,
      BCard,
      BCardText,
      BFormTextarea,
      BFormSpinbutton,
      BFormSelect,
      flatPickr,
      BInputGroup,
      BInputGroupAppend,
      BButtonGroup,
      BFormInvalidFeedback,
      BContainer,
      BRow,
      BCol

   },

   mixins:[optionsComponents],

   setup(props,{emit}){

      const { boda_id } = toRefs(props)

      const { reserva:formulario } = toRefs( store.state.reserva )

      const options_cfdi = [
         {
            id: 1,
            text: '(G03) Gastos en General',
         },
         {
            id: 2,
            text: '(P01) Por Definir',
         }

      ];
      
      const facturacion = ref({

         nombre: '',
         email: '',
         telefono: null,
         direccion1: '',
         direccion2: '',
         rfc: null,
         cp: null,
         cfdi:null


      })

      const  boda  = computed(() => store.getters['boda/draft'])
      
      const fechas = ref([])
      const habitaciones = ref(1);
      const  {bodas}  = toRefs(store.state.boda)
      const noches_minimas = ref(1)
      const formValidate = ref(null)

      const cargarForm = () => {

         if(boda_id.value){

            formulario.value.boda_id = Number(boda_id.value)
            
            if(bodas.value.length){
                capturarBoda(Number(boda_id.value))
            }

         }
      
         if(formulario.value.id){  

            fechas.value = [formulario.value.check_in,formulario.value.check_out];
            formulario.value.habitaciones = formulario.value.habitaciones.map(val => {
               return  {
                  habitacion_id: val.pivot.habitacion_id,
                  reserva_id:val.pivot.reserva_id,
                  habitantes:val.pivot.habitantes,
                  monto:Number(val.pivot.monto),
                  observacion:val.pivot.observacion,
                  pivot:val.pivot
               };
            })

            habitaciones.value = formulario.value.habitaciones.length;

            noches_minimas.value = formulario.value.habitaciones[0].pivot.noches_minimas;
            
            boda.value = formulario.value.boda;


            if(formulario.value.datos_facturacion){
               facturacion.value = formulario.value.datos_facturacion
            }



         }else{

            formulario.value.habitaciones = [];
            formulario.value.habitaciones.push({
               habitacion_id:(boda.value.habitaciones.length) ? boda.value.habitaciones[0].id : null,
               reserva_id:null,
               habitantes:{bebes:0,adultos:1,adolescentes:0,ninos:0,adults:[{nombre:''}],childs:[],jovenes:[]},
               monto:0,
               observacion:''
            });
         }

      }

      watch([bodas,formulario],(val) => {
         cargarForm();
      })
   
      onMounted(() => {

         if(bodas.value.length){

            bodas.value = bodas.value.filter(val => {
               return (new Date(val.fecha).getTime() > new Date().getTime());
            })

         }else{
            store.dispatch('boda/cargarBodas');
         }

         cargarForm();

      })

      const capturarBoda = (val) => {

         store.commit('boda/capturarBoda',val);

         // boda.value = store.state.boda.boda;
         noches_minimas.value = boda.value.habitaciones[0].pivot.noches_minimas;
         fechas.value = [boda.value.check_in, getFechaMasXDias(boda.value.check_in)];
         formulario.value.noches = noches_minimas.value;
         formulario.value.boda = boda.value


      }

      const guardar = () => {

         if(validarFecha()) {

            if(formulario.value.facturacion){
               formulario.value.datos_facturacion = facturacion.value
            }
            emit('save', formulario.value, formValidate.value);
         }

      }
 
      const  getTipoHabitacion = (val) => {
         return boda.value.habitaciones.find(value => value.id == val);
      }

      const configDate = ref({
         allowInput:false,
        
         locale:Spanish,
         conjunction:',',

         enable:[(date) => {

            let boda_check_out = null;
            let reserva_check_out = null;
            
         if( formulario.value.boda_id ){
               boda_check_out = moment(boda.value.fecha).add(5,'days');
               let fecha = boda_check_out.toDate()

               // console.log(fecha2);

                return (date.getTime() >= new Date().getTime() && date.getTime() <= fecha.getTime())
            }

            return (date.getTime() > new Date().getTime())


            
            
         }],
         mode:'range',
         onDayCreate: function(dObj, dStr, fp, dayElem){
            // Utilize dayElem.dateObj, which is the corresponding Date

            if(formulario.value.boda_id){

               let fecha_calendar = moment(dayElem.dateObj).format('YYYY-MM-DD');
               let fecha_boda = moment(boda.value.fecha).format('YYYY-MM-DD');


               if(fecha_calendar == fecha_boda){
                  dayElem.innerHTML += "<span class='event fa fa-heart'></span>";
               }

            }
         }


      })

      const validarFecha = () => {
       
            
         let fecha1 = moment(formulario.value.check_in);
         let fecha2 = moment(formulario.value.check_out);

         noches_minimas.value = (formulario.value.boda.habitaciones.find(val => val.id === formulario.value.habitaciones[0].habitacion_id)).pivot.noches_minimas

         if(fecha1.format('YYYY-MM-DD') == fecha2.format('YYYY-MM-DD')){
              
            Notification.warning({
               title:'El check out no puede ser el mismo día que la del check in',
               position:'bottom-right' 
            }) 

            return false

         }else if(fecha2.diff(fecha1,'days') < noches_minimas.value){

            Notification.info('Las noches mínimas permitidas son:'+noches_minimas.value+' Noches.')
            fechas.value = [];

            formulario.value.check_in = null;
            formulario.value.check_out = null;

            return false

               
         }else{
            formulario.value.noches = fecha2.diff(fecha1,'days');
            formulario.value.check_in = fecha1.format('YYYY-MM-DD');
            formulario.value.check_out = fecha2.format('YYYY-MM-DD');
            formulario.value.noches = fecha2.diff(fecha1,'days');

            return true;
         }

      }

      const fechaCambiada = (dates) => {

         if(dates.length > 1){
             
             let fecha1 = moment(dates[0]);
             let fecha2 = moment(dates[1]);

          

            if(fecha1.format('YYYY-MM-DD') == fecha2.format('YYYY-MM-DD')){
              
               Notification.warning({
                  title:'El check out no puede ser el mismo día que la del check in',
                 position:'top-left' 
               }) 

            }else if(fecha2.diff(fecha1,'days') < noches_minimas.value){

                  Notification.info('Las noches mínimas permitidas son:'+noches_minimas.value+' Noches.')
                  fechas.value = [];

                  formulario.value.check_in = null;
                  formulario.value.check_out = null;

               
            }else{
               formulario.value.noches = fecha2.diff(fecha1,'days');
               formulario.value.check_in = fecha1.format('YYYY-MM-DD');
               formulario.value.check_out = fecha2.format('YYYY-MM-DD');
               formulario.value.noches = fecha2.diff(fecha1,'days');
            }

            // if(formulario.value.noches < this.boda.noches_minimas){
            //       this.$notify.info('Las noches mínimas permitidas son:'+this.boda.noches_minimas+' Noches.')
            //       this.fechas = [];
            //       this.formulario.check_in = null;
            //       this.formulario.check_out = null;
            // }

         }

         
      }

      const getFechaMasXDias = (fech) => {

         let fecha = moment(fech).add(noches_minimas.value,'days').format('YYYY-MM-DD');
         return fecha;

      }

      const habCambiada = (val) => {

         if(boda.value.id){

            boda.value.habitaciones.forEach(va => {

               if(va.id === val){

                  
                  
                  let nm =  va.pivot.noches_minimas;

                  if(formulario.value.noches && formulario.value.noches >= nm){
                     noches_minimas.value = nm
                  }else{
                      noches_minimas.value = nm
                      fechas.value = [boda.value.check_in,getFechaMasXDias(boda.value.fecha)];
                      Notification.info({
                         message:'Hemos cambiado tu fecha de entrada y de salida (check_in y check_out), porque las noches mínimas no coinciden con las  permitidas por el tipo de habitación, si no estás de acuerdo con las fechas establecidas, puedes cambiarla ahora mismo...',
                         position:'bottom-right'
                      })


                  }

                 

                  

               }

            })
         }

      } 

      const bodasPermitidas = () => {
         
         return bodas.value.filter(val => {
            return (Date.now() < new Date(val.fecha).getTime() );
         })
      }

      const ajustarAdultos = (adultos,index) => {

         formulario.value.habitaciones[index].habitantes.adults = [];
         
         for (let i = 1; i <= adultos; i++) {

              formulario.value.habitaciones[index].habitantes.adults.push({
                 nombre:''
              })
            
         }

      }

      const ajustarChild  = (ninos,index,edad_minima = 3) => { 
         formulario.value.habitaciones[index].habitantes.childs = [];
         for (let i = 1; i <= ninos; i++) {

               formulario.value.habitaciones[index].habitantes.childs.push({
                 nombre:'',
                 edad:edad_minima,
              })
            
         }
      }

      const ajustarJovenes = (adolescentes,index,edad_minima = 13) => {
         formulario.value.habitaciones[index].habitantes.jovenes = [];
         
         for (let i = 1; i <= adolescentes; i++) {

              formulario.value.habitaciones[index].habitantes.jovenes.push({
                 nombre:'',
                 edad:edad_minima
              })
            
         }

      }

      const aumentarAdulto = (habitacion) => {
         habitacion.habitantes.adults.push({
            nombre: ''
         })
         habitacion.habitantes.adultos++;
      } 

      return {
         required,
         formValidate,
         email,
         guardar,
         fechas,
         habitaciones,
         bodas,
         capturarBoda,
         getTipoHabitacion,
         formulario,
         boda,
         cargarForm,
         configDate,
         fechaCambiada,
         noches_minimas,
         habCambiada,
         getFechaMasXDias,
         bodasPermitidas,
         options_cfdi,
         windowWidth:computed(() => store.state.app.windowWidth),
         optionsPicker:computed(() => {
            return {
               disabledDate:(fecha) => {
                  return fecha.getTime() < new Date().getTime()
               },

               cellClassName:(fecha) => {
                  return (fecha.getUTCDate() == new Date(boda.value.fecha).getUTCDate() && fecha.getMonth() == new Date(boda.value.fecha).getMonth() && fecha.getFullYear() == new Date(boda.value.fecha).getFullYear()) ? 'bg-success text-white matrimonio fas fa-heart' : ''
               },
          
            }
         }),
         ajustarAdultos,
         ajustarChild,
         ajustarJovenes,
         loading:computed(() => store.state.loading),
         facturacion,
         aumentarAdulto,
         quitarAdulto: (adults, i, habitacion) => {
            adults.splice(i, 1)
            habitacion.habitantes.adultos--;
         },
      }

   }

}

</script>
<style>
   .endRange,.startRange{
      background: #b4975a !important;
      box-shadow: none !important;
      border-color: #c0a774 !important;
   }
   .event {
      position: absolute;
      color: #db2609;
      font-size: 10pt;
      left: 0px;
      right: 0px;

   }

   .event.busy {
      background: #f64747;
   }
</style>

<style scoped>
.card-habitacion img{
   width: 300px;
   max-width:334px;
   height: 250px;
   object-fit: cover;
   object-position: center;
}

.el-rate__icon {
    margin-right: 6px;
    font-size: 20pt !important;
}

</style>