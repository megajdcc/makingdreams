<template>

   <b-container fluid>

      <!-- Banner Principal -->

      <banner-boda :boda="boda" />

      <!-- Formulario de Reservacion -->
      <b-row class="mt-2">

         <b-col cols="12" md="8">
            <div class="text-center">
               <h2>Realiza tu solicitud de Reserva</h2>
               <!-- <small>El proceso es facil</small> -->
            </div>

            <p class="text-center">Favor de enviar su solicitud de reservación para nuestra boda por medio de
               esta pagina. <br> Se les recuerda que es importante solicitar la reserva por este medio o via
               teléfonica para que puedan ser ingrasados al grupo de la Boda.</p>

            <b-container fluid>
               <validation-observer ref="formValidate" #default="{handleSubmit}">
                  <b-form @submit.prevent="handleSubmit(enviar)">
                     <b-row>

                        <b-col cols="12">

                           <b-form-group description="Nombre completo con nombres y apellidos">
                              <template #label>
                                 Su Nombre: <span class="text-danger">*</span>
                              </template>

                              <validation-provider #default="{errors}" rules="required" name="invitado">
                                 <b-form-input v-model="formulario.invitado" placeholder="Joe Doe" size="sm"
                                    :state="errors.length > 0 ? false : null" />
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

                                 <b-form-input v-model="formulario.email" type="email" placeholder="joe@example.com"
                                    size="sm" :state="errors.length > 0 ? false:null" />

                                 <b-form-invalid-feedback>
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                              </validation-provider>

                           </b-form-group>

                        </b-col>

                        <b-col class="col-12 col-md-6">
                           <b-form-group>
                              <template #label>
                                 Teléfono: <span class="text-danger">*</span>
                              </template>
                              <validation-provider #default="{errors}" rules="required" name="Teléfono">
                                 <the-mask type="tel" placeholder="Número de teléfono"
                                    class="form-control form-control-sm" v-model="formulario.telefono" :mask="masks"
                                    :masked="masked" :class="{'is-invalid' : errors[0]}" />
                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                              </validation-provider>
                           </b-form-group>
                        </b-col>

                     </b-row>

                     <div class="row">
                        <b-col cols="12" md="6">
                           <b-form-group description="Fecha de entrada y de salida de la habitación">

                              <template #label>
                                 Check in y Check out <span class="text-danger">*</span> | {{ formulario.noches | noches
                                 }}
                              </template>

                              <validation-provider #default="{errors}" rules="required">

                                 <flat-pickr v-model="fechas" :config="configDate" class="form-control" required
                                    placeholder="Select date" name="date" @on-change="fechaCambiada"
                                    :defaultDate="[boda.fecha,getFechaMasXDias(boda.fecha)]" />
                                 <br>
                                 <b-form-invalid-feedback :state="errors.length ? false : null">
                                    {{ errors[0] }}
                                 </b-form-invalid-feedback>
                              </validation-provider>

                           </b-form-group>
                        </b-col>
                     </div>

                     <el-divider></el-divider>

                     <div v-for="(habitacion, i ) in formulario.habitaciones" :key="i">
                        <b-row>
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
                                       :aria-describedby="ariaDescribedby" :state="errors.length ? false:null">
                                       <b-form-radio v-for="(tipo,i) in boda.habitaciones " :key="i" :value="tipo.id"
                                          :checked="i == 0 ? true : false">{{ tipo.nombre}}</b-form-radio>
                                    </b-form-radio-group>

                                    <b-form-invalid-feedback>
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>
                              </b-form-group>
                           </b-col>


                           <div class="col-12 d-flex justify-content-center flex-column align-items-start"
                              v-if="habitacion.habitacion_id">

                              <!-- <b-button v-b-toggle="`collapse-${i}`" variant="outline-primary">Descripción</b-button>
                                 <b-collapse :id="`collapse-${i}`" class="mt-2"> -->
                              <b-card :title="getTipoHabitacion(habitacion.habitacion_id).nombre"
                                 :img-src="((getTipoHabitacion(habitacion.habitacion_id)).imagenes.length) ? `/storage/hotel/habitaciones/${(getTipoHabitacion(habitacion.habitacion_id).imagenes[0]) ?  getTipoHabitacion(habitacion.habitacion_id).imagenes[0].imagen : 'hab_default.jpg'} ` : ''"
                                 img-alt="Image" :img-top="windowWidth < 1054 ? true : false"
                                 :img-left="windowWidth >= 1054 ? true : false" tag="article"
                                 class="mb-2 mx-2 card-habitacion">

                                 <b-card-text>
                                    {{(getTipoHabitacion(habitacion.habitacion_id)).descripcion}}
                                 </b-card-text>

                              </b-card>
                              <!-- </b-collapse> -->


                           </div>

                        </b-row>

                        <b-row class="mt-2" v-show="habitacion.habitacion_id">

                           <b-col cols="12" md="3">
                              <b-form-group>
                                 <template #label>
                                    N° de Adultos <span class="text-danger">*</span>
                                 </template>

                                 <el-select v-model="habitacion.habitantes.adultos"
                                    @change="aumentarAdulto(habitacion,$event)" placeholder="Seleccione" filterable
                                    class="w-100" size="small">
                                    <el-option
                                       v-for="(v,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? (getTipoHabitacion(habitacion.habitacion_id).pivot.max_adultos)  : 0"
                                       :key="i" :value="v" :label="(v > 1) ? `${v} Adultos` : `${v} Adulto`">
                                    </el-option>
                                 </el-select>




                                 <!-- <b-button variant="primary" @click="aumentarAdulto(habitacion)"
                                    :disabled="habitacion.habitantes.adultos == getTipoHabitacion(habitacion.habitacion_id).pivot.max_adultos"
                                    size="sm">
                                    {{ habitacion.habitantes.adultos }}
                                    <feather-icon icon="PlusIcon" class="ml-1" />
                                 </b-button> -->

                              </b-form-group>
                           </b-col>

                           <b-col cols="12" md="3">

                              <b-form-group label="N° de Bebés"
                                 v-if="getTipoHabitacion(habitacion.habitacion_id).pivot.max_bebes > 0 ">


                                 <el-select v-model="habitacion.habitantes.bebes" placeholder="Seleccione" clearable
                                    filterable class="w-100" size="small">
                                    <el-option
                                       v-for="(v,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? getTipoHabitacion(habitacion.habitacion_id).pivot.max_bebes : 0"
                                       :key="i" :value="v" :label="(v > 1) ? `${v} Bebés` : `${v} Bebé`">
                                    </el-option>
                                 </el-select>




                                 <!-- <b-input-group>
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

                                 </b-input-group> -->
                              </b-form-group>


                           </b-col>

                           <b-col cols="12" md="3"
                              v-if="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.active">
                              <b-form-group>

                                 <template #label>
                                    N° de Niños ( {{
                                    `${getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0]} -
                                    ${getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[1]}`
                                    }} )
                                 </template>


                                 <el-select v-model="habitacion.habitantes.ninos" placeholder="Seleccione" size="small"
                                    class="w-100" filterable
                                    @change="ajustarChild(habitacion.habitantes.ninos,i,getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0])">
                                    <el-option
                                       v-for="(val,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.max : 0"
                                       :key="i" :label="val" :value="val"></el-option>
                                 </el-select>

                              </b-form-group>
                           </b-col>

                           <b-col cols="12" md="3"
                              v-if="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.active">
                              <b-form-group>
                                 <template #label>
                                    N° de Jóvenes ( {{
                                    `${getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0]} -
                                    ${getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[1]}`
                                    }} )
                                 </template>

                                 <el-select v-model="habitacion.habitantes.adolescentes" placeholder="Seleccione"
                                    size="small" class="w-100"
                                    @change="ajustarJovenes(habitacion.habitantes.adolescentes, i, getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0])"
                                    filterable clearable>

                                    <el-option
                                       v-for="(val,i) in (getTipoHabitacion(habitacion.habitacion_id)) ? (getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.max)  : 0"
                                       :key="i" :label="val" :value="val"></el-option>

                                 </el-select>

                              </b-form-group>
                           </b-col>

                        </b-row>

                        <b-row>

                           <b-col cols="12" md="4" v-show="habitacion.habitantes.adultos > 0 ">

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

                              <div v-for="(nino, e) in habitacion.habitantes.childs" :key="e">

                                 <b-form-group :label="`Nombre del niño # ${ e + 1}`">

                                    <validation-provider name="nombre" rules="required" #default="{errors}">
                                       <b-form-input v-model="nino.nombre" size="sm" placeholder="Nombre completo"
                                          :state="errors.length > 0 ? false : null" />
                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>

                                 </b-form-group>

                                 <b-form-group :label="`Edad del niño # ${ e + 1}`">
                                    <validation-provider name="edad" rules="required" #default="{errors}">
                                       <b-form-spinbutton v-model="nino.edad"
                                          :min="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[0]"
                                          :max="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_menores.edades[1]"
                                          size="sm" :state="errors.length > 0 ? false : null" />
                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-button variant="danger" title="Quitar" size="sm"
                                    @click="() => { habitacion.habitantes.childs.splice(e,1); habitacion.habitantes.ninos-- }">
                                    <feather-icon icon="TrashIcon" />
                                    Quitar
                                 </b-button>

                              </div>


                           </b-col>

                           <b-col cols="12" md="4" v-show="habitacion.habitantes.adolescentes > 0 ">

                              <div v-for="(joven, e) in habitacion.habitantes.jovenes" :key="e">
                                 <b-form-group :label="` Nombre del joven # ${e + 1}`">
                                    <validation-provider name="nombre" rules="required" #default="{errors}">
                                       <b-form-input v-model="joven.nombre" size="sm" placeholder="Nombre completo"
                                          :state="errors.length > 0 ? false : null" />

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>

                                 </b-form-group>

                                 <b-form-group :label="`Edad del joven # ${ e + 1}`">
                                    <validation-provider name="edad" rules="required" #default="{errors}">
                                       <b-form-spinbutton v-model="joven.edad"
                                          :min="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[0]"
                                          :max="getTipoHabitacion(habitacion.habitacion_id).pivot.ocupacion_juniors.edades[1]"
                                          size="sm" :state="errors.length > 0 ? false : null" />

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-button variant="danger" title="Quitar" size="sm"
                                    @click="() => { habitacion.habitantes.jovenes.splice(e,1); habitacion.habitantes.adolescentes-- }">
                                    <feather-icon icon="TrashIcon" />
                                    Quitar
                                 </b-button>
                              </div>

                           </b-col>
                        </b-row>


                        <b-row>
                           <b-col>
                              <b-form-group label="Petición acerca de la habitación">

                                 <b-form-textarea v-model="habitacion.observacion" :rows="3" :max-rows="6"
                                    placeholder="Petición acerca de la Habitación"></b-form-textarea>

                              </b-form-group>
                           </b-col>
                        </b-row>

                        <el-divider></el-divider>

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
                                       <el-select v-model="formulario.datos_facturacion.cfdi" clearable filterable
                                          class="w-100" placeholder="Seleccione una opción" size="small">
                                          <el-option v-for="(val, i) in options_cfdi" :key="i" :value="val.id"
                                             :label="val.text"></el-option>

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
                                       <b-form-input v-model="formulario.datos_facturacion.nombre" placeholder="Nombre"
                                          size="sm" :state="(errors.length > 0) ? false :null">
                                       </b-form-input>

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group description="">

                                    <template #label>
                                       RFC: <span class="text-danger">*</span>
                                    </template>

                                    <validation-provider name="RFC" rules="required" #default="{errors}">

                                       <b-form-input v-model="formulario.datos_facturacion.rfc"
                                          :state="errors.length > 0 ? false :null"></b-form-input>

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>


                                    </validation-provider>

                                 </b-form-group>


                                 <b-form-group>

                                    <template #label>
                                       Email: <span class="text-danger">*</span>
                                    </template>
                                    <validation-provider name="email" rules="required|email" #default="{errors}">
                                       <b-form-input type="email" v-model="formulario.datos_facturacion.email" size="sm"
                                          :state="(errors.length > 0) ? false :null"></b-form-input>

                                       <b-form-invalid-feedback>
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
                                          class="form-control form-control-sm"
                                          v-model="formulario.datos_facturacion.telefono" :mask="masks" :masked="masked"
                                          :class="{'is-invalid' : errors[0]}" />
                                       <b-form-invalid-feedback :state="errors.length ? false : null">
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>

                                    </validation-provider>
                                 </b-form-group>


                              </b-col>

                              <div class="col-12 col-md-6">
                                 <b-form-group>

                                    <template #label>
                                       Dirección 1: <span class="text-danger">*</span>
                                    </template>

                                    <validation-provider name="direccion1" rules="required" #default="{errors}">

                                       <b-form-textarea v-model="formulario.datos_facturacion.direccion1" :rows="3"
                                          :max-rows="3" placeholder="Primera dirección"
                                          :state="errors.length > 0 ? false :null"></b-form-textarea>

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>
                                    </validation-provider>
                                 </b-form-group>

                                 <b-form-group label="Direccion 2:">

                                    <b-form-textarea v-model="formulario.datos_facturacion.direccion2" :rows="3"
                                       :max-rows="3" placeholder="Segunda dirección"></b-form-textarea>

                                 </b-form-group>




                                 <b-form-group description="Código postal">

                                    <template #label>
                                       CP: <span class="text-danger">*</span>
                                    </template>

                                    <validation-provider name="CP" rules="required" #default="{errors}">

                                       <b-form-input v-model="formulario.datos_facturacion.cp"
                                          :state="errors.length > 0 ? false :null" />

                                       <b-form-invalid-feedback>
                                          {{ errors[0] }}
                                       </b-form-invalid-feedback>


                                    </validation-provider>

                                 </b-form-group>

                              </div>
                           </b-row>

                           <b-col cols="12" v-if="formulario.facturacion">
                              <span>Los campos marcados con <span class="text-danger">*</span>, son importante no
                                 deben
                                 Faltar.</span>
                           </b-col>

                        </b-col>
                     </b-row>

                     <b-row class="my-2">
                        <b-col cols="12">
                           <b-button variant="primary" size="md" block type="submit" v-loading="loading">
                              <feather-icon icon="SendIcon" />
                              Enviar Solicitud
                           </b-button>
                        </b-col>
                     </b-row>
                  </b-form>
               </validation-observer>
            </b-container>

         </b-col>

         <b-col cols="12" md="4">
            <aside-boda :boda="boda" />
         </b-col>

      </b-row>


   </b-container>
</template>

<script>
import { ref,toRefs,onMounted, watch,computed} from 'vue'
import store from '@/store';
import router from '@/router';

import {primerNombre} from '@core/utils/filter.js';
import 'swiper/css/swiper.css'



import FormUser  from './FormUser.vue'

import FormHabitaciones  from './FormHabitaciones.vue'
import confirmacion from './confirmacion.vue';
import Ripple from 'vue-ripple-directive'
import 'animate.css';

import {ValidationObserver,ValidationProvider} from 'vee-validate';
import { TheMask }from 'vue-the-mask';
import { required, email, min} from '@validations'

import optionsComponents from 'mixins/optionsComponents';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from "flatpickr/dist/l10n/es.js"
import useBoda from '@core/utils/useBoda';

import {
   BCard,
   BCardText,
   BCardImg,
   BLink,
   VBTooltip,
   BImg,
   BFormGroup,
   BFormInput,
   BForm,
   BFormRadioGroup,
   BFormRadio,
   VBToggle,
   BButton,
   BCollapse,
   BFormSpinbutton,
   BFormTextarea,
   BAvatarGroup,
   BAvatar,
   VBPopover,
   BInputGroup,
   BInputGroupAppend,
   BFormInvalidFeedback,
   BRow,
   BCol,
   BJumbotron,
   BFormCheckboxGroup,
   BContainer
} from 'bootstrap-vue';


import {Notification} from 'element-ui';
import FeatherIcon from '../../../src/@core/components/feather-icon/FeatherIcon.vue';
import Swal from 'sweetalert2'

export default{
   props:['url'],

   directives:{
      'b-tooltip':VBTooltip,
      Ripple,
      'b-toggle':VBToggle,
      'b-popover' : VBPopover
   },

   mixins:[optionsComponents],
   
   components:{
      BCard,
      BCardText,
      BCardImg,
      BLink,
      BImg,
      BFormGroup,
      FormUser,
      FormHabitaciones,
      confirmacion,
      ValidationObserver,
      ValidationProvider,
      TheMask,
      BFormInput,
      BForm,
      BFormRadioGroup,
      BFormRadio,
      BButton,
      BCollapse,
      BFormSpinbutton,
      BFormTextarea,
      BAvatarGroup,
      BAvatar,
      flatPickr,
      FeatherIcon,
      BInputGroup,
      BInputGroupAppend,
      BFormInvalidFeedback,
      BRow,
      BCol,
      BJumbotron,
      BFormCheckboxGroup,
      BContainer,
      BannerBoda:() => import('components/BannerBoda'),
      AsideBoda: () => import('components/AsideBoda')
   },
 
   setup(props) {

      const {reserva:formulario} = toRefs(store.state.reserva)

      const formValidate = ref(null)
      const step = ref(0);

      const options_cfdi = [
         {
            id: 1,
            text:'(G03) Gastos en General',
         },
         {
            id: 2,
            text: '(P01) Por Definir',
         }

      ];

      const habitaciones = ref(1);
      const noches_minimas = ref(1)

      const boda =  computed(() => store.getters['boda/draft'])

      const fechas = ref([]);

      const {
         verificarFecha,
         irUrl,
         imagenes,
         getTipoHabitacion
      } = useBoda(boda)
      
      const cargarForm = () => {

            formulario.value.boda_id = boda.value.id;
            formulario.value.boda = boda.value
            
            if(boda.value.id){
               verificarFecha();
            }
           
            formulario.value.habitaciones = [];
            formulario.value.habitaciones.push({
               habitacion_id:(boda.value.habitaciones.length > 0) ? boda.value.habitaciones[0].id : null,
               reserva_id:null,
               habitantes:{bebes:0,adultos:1,adolescentes:0,ninos:0,adults:[{nombre:''}],childs:[],jovenes:[]},
               monto:0,
               observacion:''
            });

            noches_minimas.value = boda.value.habitaciones[0].pivot.noches_minimas

            boda.value.hotel.redes = (boda.value.hotel.redes) ? boda.value.hotel.redes : {};

            fechas.value  = [boda.value.check_in,moment(boda.value.check_in).add(noches_minimas.value,'days').format('YYYY-MM-DD')]

      }

      onMounted(() => {
         store.dispatch('boda/cargarBodaPorUrl',props.url);
      });

      watch(boda,() => {
        cargarForm()
      })

     

      const asignarHabitaciones = (habitaciones) => {
         formulario.value.habitaciones = habitaciones
         step++;
      }

      const configDate = ref({
         allowInput:false,
        
         locale:Spanish,
         conjunction:',',

         enable:[(date) => {
            let boda_check_out = null;
            let reserva_check_out = null;
            if(boda.value.id){

               boda_check_out = moment(boda.value.fecha).add(15,'days');
               let fecha = boda_check_out.toDate()

               // console.log(fecha2);

                return (date.getTime() >= new Date().getTime() && date.getTime() <= fecha.getTime())
            }

            return (date.getTime() > new Date().getTime())


            
            
         }],
         mode:'range',
         onDayCreate: function(dObj, dStr, fp, dayElem){
            // Utilize dayElem.dateObj, which is the corresponding Date

            if(boda.value.id){

               let fecha_calendar = moment(dayElem.dateObj).format('YYYY-MM-DD');
                let fecha_boda = moment(boda.value.fecha).format('YYYY-MM-DD');

               // console.log(new Date(formulario.value.reservacion_habitacion.reserva.boda.fecha))

               if(fecha_calendar == fecha_boda){
                  // console.log(dayElem.dateObj);
                  dayElem.innerHTML += "<span class='event fa fa-heart'></span>";
               }

            }
         }


      })

      const fechaCambiada = (dates) => {

         if(dates && dates.length > 1){
             
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

               formulario.value.check_in = fecha1.format('YYYY-MM-DD');
               formulario.value.check_out = fecha2.format('YYYY-MM-DD');
               formulario.value.noches = fecha2.diff(fecha1,'days');
               // formulario.noches = fecha2.diff(fecha1,'days');
            }
           

            

            // if(formulario.value.noches < this.boda.noches_minimas){
            //       this.$notify.info('Las noches mínimas permitidas son:'+this.boda.noches_minimas+' Noches.')
            //       this.fechas = [];
            //       this.formulario.check_in = null;
            //       this.formulario.check_out = null;
            // }

         }

         
      }

      const habCambiada = (val) => {

         if(boda.value.id){

            boda.value.habitaciones.forEach(va => {

               if(va.id === val){

                  // noches_minimas.value = va.pivot.noches_minimas

                  // fechas.value = [boda.value.check_in,getFechaMasXDias(boda.value.fecha)];

                  let nm =  va.pivot.noches_minimas;

                  if(formulario.value.noches && formulario.value.noches >= nm){
                     // noches_minimas.value = formulario.value.noches;
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
 
      const getFechaMasXDias = (fech) => {

         let fecha = moment(fech).add(noches_minimas.value,'days').format('YYYY-MM-DD');
         return fecha;

      }
      
      const enviar = () => {

         if(validarFecha()){

               store.dispatch('reserva/enviarSolicitud',formulario.value).then(respon => {
                  
                  if(respon.data.result){

                     const rootEle = document.documentElement
                     rootEle.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                     })


                     store.commit('reserva/clearReserva');
                     formValidate.value.reset();
                     cargarForm();
                     fechas.value = [];
                     habitaciones.value = 1;
          

                     Swal.fire({
                        title: 'Solicitud Registrada!',
                        text: 'Gracias!. Hemos recibido tu solicitud, te estaremos informando por correo electrónico acerca de los procedimientos para que empieces a pagar las cuota correspondientes',
                        icon: 'success',
                        customClass: {
                           confirmButton: 'btn btn-primary',
                        },

                        showClass: {
                           popup: 'animate__animated animate__tada',
                        },

                        buttonsStyling: false,
                        })
                  
                  }else{
                     Notification.info('No se pudo registrar tú solicitud, inténtalo de nuevo mas tarde');

                  }

               }).catch(e => {

                  if(e.response.status === 422){
                     formValidate.value.setErrors(e.response.data.errors)
                  }
                
               }).then(() => {
               })

         }
         
      }

      const ajustarChild = (ninos,index,edad_minima = 3) => {

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

      const aumentarAdulto = (habitacion,cantidad = 0) => {

         habitacion.habitantes.adults = [];

         for (let index = 0; index < cantidad; index++) {
            habitacion.habitantes.adults.push({
               nombre: ''
            })
         }

         // if(cantidad >= habitacion.habitantes.adults.length){
            
         //    for (let index = 0; index < (cantidad - habitacion.habitantes.adults.length ); index++) {
         //       habitacion.habitantes.adults.push({
         //          nombre: ''
         //       })
         //    }

         // }else{
         //    habitacion.habitantes.adults = [];

         //    for (let index = 0; index < cantidad; index++) {
         //       habitacion.habitantes.adults.push({
         //          nombre: ''
         //       })
         //    }


         // }
      }



      return {
         boda,
         formValidate,
         cargarForm,
         primerNombre,
         irUrl,
         imagenes,
         formulario,
         step,
         asignarHabitaciones,
         required,
         email,
         min,
         habitaciones,
         configDate,
         fechaCambiada,
         fechas,
         getFechaMasXDias,
         noches_minimas,
         habCambiada,
         options_cfdi,
         loading:computed(() => store.state.loading),
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
         getTipoHabitacion,
         enviar,
         ajustarChild,
         ajustarJovenes,
         
         quitarAdulto: (adults,i,habitacion) => {
            adults.splice(i,1)
            habitacion.habitantes.adultos--;
         },
         aumentarAdulto

      };
   }
}
</script>