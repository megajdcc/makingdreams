<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{handleSubmit}">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <el-steps :active="turno" finish-status="success">
               <el-step title="Cliente" description="Quien solicita">
                  <template #icon>
                     <feather-icon icon="UserIcon" />
                  </template>

               </el-step>

               <el-step title="Contenedor" description="Información del contenedor y Barco">
                  <template #icon>
                     <span class="fas fa-truck-loading"></span>
                  </template>

               </el-step>

               <el-step title="Destino" description="Información del destino">
                  <template #icon>
                     <span class="fas fa-map-marked"></span>
                  </template>

               </el-step>

               <!-- <el-step title="Cita" description="Fecha de entrega acordada">
                  <template #icon>
                     <span class="fas fa-calendar-check"></span>
                  </template>

               </el-step>

               <el-step title="Estatus" description="Estatus de entrega">
                  <template #icon>
                     <span class="fas fa-clipboard-check"></span>
                  </template>

               </el-step> -->


            </el-steps>
            <hr>

            <!-- Cliente -->
            <section v-if="turno == 0">
               <b-container fluid>
                  <b-row>
                     <b-col cols="12">

                        <b-form-group>
                           
                           <template #label>
                              Compañia: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="compania_id" rules="required" #default="{errors}">
                           
                              <v-select v-model="formulario.compania_id" placeholder="Seleccione" :reduce="option => option.id"
                                 :options="companias" :filterBy="clienteFilterBy">
                                 <template #option="{nombre,imagen}">
                                    <b-avatar :src="`/storage/companias/logos/${imagen}`" :alt="`${ nombre }`" />
                                    <strong>{{ nombre }}</strong>
                                 </template>
                           
                                 <template #selected-option="{nombre,imagen}">
                                    <b-avatar :src="`/storage/companias/logos/${imagen}`" :alt="`${ nombre }`" size="sm" class="mr-1" />
                                    <strong>{{ nombre }}</strong>
                                 </template>
                              </v-select>
                           
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           
                           </validation-provider>
                           
                        </b-form-group>

                       

                     </b-col>

                  </b-row>
               </b-container>
            </section>

            <!-- Contenedor -->
            <section v-if="turno  == 1">
               <b-container fluid>

                  <!-- Barco -->
                  <el-divider content-position="left">Barco y Atraque</el-divider>
                  <b-row >
                     <b-col cols="12" md="6">
                        <b-form-group description="Fecha del Atraque">
                           <template #label>
                              Llegada: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="contenedor.atraque_id" rules="required" #default="{errors}">
                              <v-select v-model="formulario.contenedor.atraque_id" :reduce="(val) => val.id" :options="atraques"
                                 :filterBy="atraqueFilterBy" @input="capturarAtraque">
                              
                                 <template #option="{barco,llegada,viaje}">
                                    <strong>{{ llegada | fecha }} - {{ barco ? barco.nombre : 'Sin definir'}}[ Viaje:{{ viaje ? viaje : 'Sin definir'}}]</strong>
                                 </template>
                              
                                 <template #selected-option="{ llegada }">
                                    <strong>{{ llegada | fecha }}</strong>
                                 </template>
                              
                              </v-select>
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           
                           </validation-provider>
                              
                           <b-button :to="{name:'create.atraque'}" variant="primary" title="Registrar Atraque" v-b-tooltip.hover class="w-100 mt-1">
                              Nuevo Atraque
                           </b-button>

                            
                        </b-form-group>
                     </b-col>
                     <b-col cols="12" md="6" v-if="atraque.id">
                        <b-form-group label="Viaje" description="Nro de Viaje">
                           <!-- <flat-pickr  disabled v-model="atraque.llegada" class="form-control" :config="{ dateFormat: 'Y-m-d'}"
                              placeholder="YYYY-MM-DD" /> -->
                              <b-form-input v-model="atraque.viaje" readonly />
                        </b-form-group>
                     </b-col>
                  </b-row>

                  <b-row v-if="atraque.id">
                     <b-col cols="12" md="6">
                        <b-form-group label="Puerto" description="Puerto de atraque">
                           <b-form-input v-model="atraque.puerto.nombre" readonly />
                        </b-form-group>
                     </b-col>

                     <b-col cols="12" md="6">
                        <b-form-group label="Barco" description="Nombre del barco">
                           <b-form-input v-model="atraque.barco.nombre" readonly />
                        </b-form-group>
                     </b-col>
                  </b-row>

                  <el-divider content-position="left">Datos del Contenedor</el-divider>
               
                  <b-row>

                     <b-col cols="12" md="6">
                        <b-form-group description="Seleccione el número del contenedor">
                           <template #label>
                              Contenedor: <span class="text-danger">*</span>
                           </template>
                           <validation-provider name="contenedor.contenedor_id" rules="required" #default="{errors}">
                              <v-select v-model="formulario.contenedor.contenedor_id" :options="contenedores"
                                 :reduce="(option) => option.id" label="numero"></v-select>

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group label="Seal">
                           <validation-provider name="seal" #default="{errors}">
                              <b-form-input v-model="formulario.contenedor.seal"
                                 :state="errors.length ? false : null" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group label="Hazmat o no ?">
                           <validation-provider name="hazmat" #default="{errors}">
                              <b-form-radio-group v-model="formulario.contenedor.hazmat" :options="optionsHazmat" :state="errors.length ? false : null" />
                          

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>


                        <b-form-group label="Fecha de demora" description="Esta fecha es calculada con respecto a la fecha de llegada o atraque del barco">
                              <b-form-input :value="formulario.contenedor.fecha_demora" readonly />
                        </b-form-group>

                      


                     </b-col>

                     <b-col cols="12" md="6">

                        <b-form-group label="Booking">
                           <validation-provider name="booking" #default="{errors}">
                              <b-form-input v-model="formulario.contenedor.booking"
                                 :state="errors.length ? false : null" placeholder="Booking/BL de entrada" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>


                        <b-form-group label="Origen">
                           <validation-provider name="origen" rules="required" #default="{errors}">
                              <b-form-input v-model="formulario.contenedor.origen" :state="errors.length ? false : null"
                                 placeholder="Origen" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group label="Tipo de carga">
                           <validation-provider name="tipo_carga" #default="{errors}">
                              <b-form-input v-model="formulario.contenedor.tipo_carga" :state="errors.length ? false : null" placeholder="Tipo de carga" />
                        
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                     </b-col>
                  </b-row>
               </b-container>
            </section>

            <!-- Destino -->
            <section v-if="turno  == 2">
               <b-container fluid>
                  <b-row>

                     <b-col cols="12" md="6">
                        <b-form-group description="Seleccione un Destino, los destinos son traidos de los registrados por la compañia">
                           <template #label>
                              Destino: <span class="text-danger">*</span>
                           </template>
                           <validation-provider name="destino_id" rules="required" #default="{errors}">
                           
                              <v-select v-model="formulario.destino_id" :reduce="(val) => val.id" :options="optionsDestinos"  @input="capturarDestino" label="destino">
                              </v-select>
                           
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}                      
                              </b-form-invalid-feedback>
                           
                           </validation-provider>
                        </b-form-group>

                        <table class="table table-hover table-sm w-100">
                           
                           <tr>
                              <td>Destino:</td><td>{{ destino.destino }}</td>
                           </tr>

                           <tr>
                              <td>Pais:</td>
                              <td>{{ destino.estado ? destino.estado.pais.pais : 'Sin definir' }}</td>
                           </tr>

                           <tr>
                              <td>Estado:</td>
                              <td>{{ destino.estado ? destino.estado.estado : 'Sin definir' }}</td>
                           </tr>

                           <tr>
                              <td>Ciudad:</td>
                              <td>{{ destino.ciudad ? destino.ciudad.ciudad : 'Sin definir' }}</td>
                           </tr>

                        </table>
                     </b-col>

                     <b-col cols="12" md="6">
                        <GmapMap ref="input" :center="{ lat:latitud, lng:longitud }" :zoom="zoom_map" :options="options_map"
                           style="width:100%; height:250px; display: flex; justify-content:center;">
                           <GmapMarker :key="0" :position="{ lat:latitud, lng:longitud }" :visible="visibleMarker" :draggable="false"
                              :clickable="false" :icon="iconMarker">
                              <GmapInfoWindow :options="optionsPlace">
                              </GmapInfoWindow>
                           </GmapMarker>
                        
                        </GmapMap>
                     </b-col>


                  </b-row>

               </b-container>
            </section>

            <b-button-group size="sm" class="mt-1">

               <b-button type="button" v-if="turno > 0" title="Regresar" @click="() => turno--">
                  <feather-icon icon="ArrowLeftIcon" />
                  Regresar
               </b-button>

               <b-button variant="primary" type="button" v-if="turno < 2" title="Siguiente" @click="siguiente">
                  <feather-icon icon="ArrowRightIcon" />
                  Siguiente
               </b-button>

               <b-button variant="primary" v-show="turno == 2" type="submit" title="Guardar" v-loading="loading">
                  <feather-icon icon="SaveIcon" />
                  Guardar
               </b-button>

            </b-button-group>

         </b-form>
      </validation-observer>
   </b-card>
</template>

<script>
import {ValidationObserver,ValidationProvider} from 'vee-validate'
import {required} from '@validations';
import {ref,onMounted,toRefs,computed,watch} from 'vue'
import store from '@/store'
import flatPickr from 'vue-flatpickr-component'
import useDireccion from '@core/utils/useDireccion';
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import Ripple from 'vue-ripple-directive'

import {
   BForm,
   BCard,
   BContainer,
   BRow,
   BCol,
   BFormGroup,
   BFormInvalidFeedback,
   BFormInput,
   BButtonGroup,
   BButton,
   BFormRadioGroup,
   BFormRadio,
   BAvatar,
   BInputGroup,
   BInputGroupPrepend,
   BImg, 
   BMedia, 
   BCollapse, 
   VBToggle, 
   BListGroup, 
   BListGroupItem, 
   BAvatarGroup, 
   BBadge, 
   VBTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {

   components:{
      BForm,
      BCard,
      BContainer,
      BRow,
      BCol,
      BFormGroup,
      BFormInvalidFeedback,
      BFormInput,
      BButtonGroup,
      BButton,
      ValidationObserver,
      ValidationProvider,
      BFormRadioGroup,
      BFormRadio,
      BAvatar,
      vSelect,
      flatPickr,
      BInputGroup,
      BInputGroupPrepend,
      AppTimeline,
      AppTimelineItem,
       BImg, 
      BMedia, 
      BCollapse,  
      BListGroup, 
      BListGroupItem, 
      BAvatarGroup, 
      BBadge, 

      

   },

   directives:{
      Ripple,
      'b-tooltip':VBTooltip,
      'b-toggle':VBToggle
   },
 

   setup(_,{emit}) {
      
      const formValidate = ref(null)
      const turno = ref(0)
      const tipo_cliente = ref(1); // 1 => Persona Independiente, 2 => Compañia
      const buscadormap = ref('');
      const visibleMarker = ref(true);
      const zoom_map = ref(14);
      const markers = ref([]);
      const iconMarker = ref('');
      const input = ref(null)
      const fecha_demora = ref('')

      const {entrega:formulario} =  toRefs(store.state.entrega)
      const { usuarios } = toRefs(store.state.usuario)
      const {  companias } = toRefs(store.state.compania)
      const {contenedores} = toRefs(store.state.contenedor)

      const { atraques, atraque} = toRefs(store.state.atraque)
      const { destinos,destino } = toRefs(store.state.destino)

      const {
         paises,
         ciudades,
         estados,
         cargarPaises,
         cargarEstados,
         cargarCiudades,
         pais_id,
         estado_id
      } = useDireccion();

      const cargarForm = () => {

         if(!atraques.value.length){
            store.dispatch('atraque/getAtraques')
         }

         if (!destinos.value.length) {
            store.dispatch('destino/getDestinos')
         }
         
         if (formulario.value.id) {

            setTimeout(() => {
               store.commit('destino/capturar', formulario.value.destino_id)
            }, 3000);

         }

      }

      watch(destino,() => {
         if(destino.value.id){
            optionsPlace.value.content = '<div><strong>' + destino.value.destino + '</strong><br>'
         }
      })

      watch(atraque,({llegada}) => {
           formulario.value.contenedor.fecha_demora = llegada ? moment(llegada).add(10,'days').format('YYYY-MM-DD') : '';
      })

      onMounted(() => {
         
         if(!usuarios.value.length){
            store.dispatch('usuario/cargarUsuarios');
         }

          if(!companias.value.length){
            store.dispatch('compania/cargarCompanias');
         }
         
       

         if(!contenedores.value.length ){
            store.dispatch('contenedor/getContenedores')
         }
         cargarForm();
      })

      watch(formulario,() => {
         cargarForm()
      })


      const guardar = () => {
         emit('save',formulario.value,formValidate.value)
      }

      const siguiente = () => {
         formValidate.value.validate().then((result) => {
            if(result){
               turno.value++;
            }
         })
      }

      const optionsPlace = ref({
         content: '<strong>Puerto Ríco</strong>',
      })

      const options_map = ref({
         mapTypeControl: false,
         zoomControl: true,
      })

      const setPlace = (place) => {
         visibleMarker.value = false;
         var address = '';
         if (place.address_components) {
            address = [
               (place.address_components[0] && place.address_components[0].short_name || ''),
               (place.address_components[1] && place.address_components[1].short_name || ''),
               (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
         }

         zoom_map.value = 23

         destino.value.lat = Number(place.geometry.location.lat());
         destino.value.lng = Number(place.geometry.location.lng());

         iconMarker.value = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
         };

         visibleMarker.value = true;

         optionsPlace.value.content = '<div><strong>' + place.name + '</strong><br>' + address
      }


      const moviendomapa = (dato) => {
         destino.value.lat = Number(dato.latLng.lat())
         destino.value.lng = Number(dato.latLng.lng())
      }
      
      const posicionCambiada = () => {

      }

      watch(atraque,({llegada}) => {
         
         if(llegada){
            fecha_demora.value = moment(llegada).add(10, 'days').format('LL')
         }

      }) 

      return {
         loading:computed(() => store.state.loading),
         required,
         formValidate,
         guardar,
         formulario,
         turno,
         tipo_cliente,
         companias,
         siguiente,
         contenedores,
         choferes:computed(() => usuarios.value.filter(val => val.rol.nombre == 'Chofer')),
         clienteFilterBy:(option,label,search) => (option.nombre || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > - 1,
         atraqueFilterBy: (option, label, search) => (option.llegada || option.barco.nombre || option.puerto.nombre || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > - 1,

         clientes:computed(() => usuarios.value.filter(val => val.rol.nombre == 'Cliente')),
         tipoClienteOptions:[
            {
               value:1,
               text:'Independiente / Personal'
            },
            {
               value:2,
               text:'Compañía'
            }
         ],
         paises,
         ciudades,
         estados,
         cargarPaises,
         cargarEstados,
         cargarCiudades,
         pais_id,
         estado_id,
         buscadormap,
         visibleMarker,
         zoom_map,
         markers,
         iconMarker,
         input,
         optionsPlace,
         options_map,
         setPlace,
         moviendomapa,
         posicionCambiada,
         atraques,
         atraque,
         destinos,
         destino,

         optionsDestinos:computed(() => {
            return destinos.value.filter(val => val.compania_id == formulario.value.compania_id)
         }),

         optionsHazmat:[
            {text:'Sí',value:true},
            { text: 'Nó', value: false },

         ],

         latitud: computed(() => destino.value.lat ? Number(destino.value.lat) : 18.4563269),
         longitud: computed(() => destino.value.lng ? Number(destino.value.lng) : -66.097255 ),
         capturarAtraque:(val) => val ? store.commit('atraque/capturar',val) : store.commit('atraque/clear'),
         capturarDestino: (val) => val ? store.commit('destino/capturar', val) : store.commit('destino/clear'),
         fecha_demora
      }
   },
}
</script>


<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
