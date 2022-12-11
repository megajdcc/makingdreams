<template>
   <b-card>
      <b-container fluid>
         <b-row>
            <b-col cols="12" md="6">
               <h3>Asignar Estatus</h3>
               <validation-observer ref="formValidate" #default="{handleSubmit}">
                  <b-form @submit.prevent="handleSubmit(guardar)">

                     <b-container fluid>
                        <b-row>
                           <b-col cols="12">
                              <b-form-group>
                                 <template #label>
                                    Estatus: <span class="text-danger">*</span>
                                 </template>

                                 <validation-provider name="situacion" rules="required" #default="{errors}">

                                    <b-form-radio-group id="btn-radios-1" v-model="formulario.situacion"
                                       :options="optionsSituaciones" name="radios-btn-default" buttons
                                       :state="errors.length ? false : null" button-variant="primary" size="sm" />

                                    <b-form-invalid-feedback :state="errors.length ? false : null">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>

                                 </validation-provider>
                              </b-form-group>

                              <b-form-group>
                                 <template #label>
                                    Comentario:
                                 </template>

                                 <validation-provider name="comentario" #default="{errors}">

                                    <b-form-textarea v-model="formulario.comentario"
                                       :state="errors.length ? false : null" :rows="2"></b-form-textarea>

                                    <b-form-invalid-feedback :state="errors.length ? false : null">
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>

                                 </validation-provider>
                              </b-form-group>
                           </b-col>
                        </b-row>

                        <b-row>
                           <b-col>
                              <div class="form-group">
                                 <label for="map-canvas">Posici&oacute;n en el mapa <span
                                       class="required">*</span></label>
                                 <p class="text-grey">
                                 <ul>
                                    <li class="text-grey">Arrastra el marcador hacia la ubicaci&oacute;n real del
                                       contenedor.</li>
                                    <li class="text-grey">Puedes apoyarte escribiendo una ubicaci&oacute;n como una
                                       ciudad,
                                       municipio, colonia, etc. y seleccionar una de las opciones sugeridas.</li>
                                 </ul>
                                 Las coordenadas de la ubicaci&oacute;n se crean automaticamente.
                                 </p>
                              </div>


                           </b-col>
                        </b-row>
                        <!-- google map -->
                        <b-row>
                           <b-col>

                              <div class="d-none">
                                 <div class="input-group col-md-6 mt-2" id="myAutocomplete">
                                    <div class="input-group-prepend">
                                       <div class="input-group-text bg-secondary">
                                          <span class="fas fa-search text-white" aria-hidden="true"></span>
                                       </div>
                                    </div>

                                    <gmap-autocomplete class="form-control py-1 " style="z-index:8000 !important"
                                       @place_changed="setPlace">

                                    </gmap-autocomplete>

                                 </div>
                              </div>

                              <GmapMap ref="input" :center="{
                        	lat:getLatitud(),
                        	lng:getLongitud()
                        }" :zoom="zoom_map" :options="options_map"
                                 style="width:100%; height:250px; display: flex; justify-content:center;">
                                 <GmapMarker :key="0" :position="{
                           	lat:getLatitud(),
                           	lng:getLongitud()
                           }" :visible="visibleMarker" :draggable="true" :clickable="true" :icon="iconMarker"
                                    @mouseup="moviendomapa" @position_changed="posicionCambiada()">
                                    <GmapInfoWindow :options="optionsPlace">
                                    </GmapInfoWindow>
                                 </GmapMarker>

                              </GmapMap>

                           </b-col>
                        </b-row>

                        <!-- Lat y lng  -->
                        <b-row>
                           <b-col md="6">

                              <b-form-group label="Latitud">
                                 <validation-provider name="lat" #default="{errors}">
                                    <b-input-group>
                                       <b-input-group-prepend is-text>
                                          <span class="fas fa-map-marked-alt"></span>
                                       </b-input-group-prepend>

                                       <b-form-input v-model="formulario.lat" :state="errors.length ? false : null" />

                                    </b-input-group>
                                    <b-form-invalid-feedback>
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>

                                 </validation-provider>

                              </b-form-group>

                           </b-col>

                           <b-col md="6">

                              <b-form-group label="Longitud">
                                 <validation-provider name="lng" #default="{errors}">
                                    <b-input-group>
                                       <b-input-group-prepend is-text>
                                          <span class="fas fa-map-marked-alt"></span>
                                       </b-input-group-prepend>
                                       <b-form-input v-model="formulario.lng" :state="errors.length ? false : null" />
                                    </b-input-group>
                                    <b-form-invalid-feedback>
                                       {{ errors[0] }}
                                    </b-form-invalid-feedback>
                                 </validation-provider>

                              </b-form-group>

                           </b-col>
                        </b-row>


                        <b-row>
                           <b-col cols="12">
                              <b-button-group size="sm">
                                 <b-button variant="primary" type="submit" title="Guardar" v-loading="loading"
                                    :disabled="loading">
                                    <feather-icon icon="SaveIcon" />
                                    Guardar
                                 </b-button>
                              </b-button-group>
                           </b-col>
                        </b-row>
                     </b-container>
                  </b-form>
               </validation-observer>
            </b-col>

            <b-col cols="12" md="6">
               <h3>Estatus creados</h3>
               <app-timeline>

                  <app-timeline-item icon="MapPinIcon" v-for="(estatus, i ) in estatuses" :key="i">

                     <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                        <h6>
                           <b-badge variant="primary">{{ estatus.situacion | situacion }}</b-badge>
                        </h6>
                        <small class="text-muted">{{ estatus.created_at | fecha('LLL') }}</small>
                     </div>

                     <p>{{ estatus.comentario }}</p>

                     <b-media v-if="estatus.usuario">
                        <template #aside>
                           <b-avatar :src="`/storage/img-perfil/${ estatus.usuario.avatar }`" />
                        </template>
                        <h6>{{ estatus.usuario.nombre }} {{ estatus.usuario.apellido }}</h6>
                        <p>{{ estatus.usuario.rol.nombre }}</p>
                     </b-media>

                  </app-timeline-item>

                  <!-- <app-timeline-item variant="secondary" icon="UserIcon">

                     <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                        <h6>Client Meeting</h6>
                        <small class="text-muted">45 min ago</small>
                     </div>
                     <p>Project meeting with john @10:15am.</p>
                     <b-media>
                        <template #aside>
                           <b-avatar :src="require('@/assets/images/avatars/12-small.png')" />
                        </template>
                        <h6>John Doe (Client)</h6>
                        <p>CEO of Infibeam</p>
                     </b-media>
                  </app-timeline-item>

                  <app-timeline-item variant="success" icon="FileTextIcon">

                     <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                        <h6>Financial Report</h6>
                        <small class="text-muted">2 hours ago</small>
                     </div>
                     <p>Click the button below to read financial reports</p>
                     <b-button v-b-toggle.report-list-with-icon v-ripple.400="'rgba(113, 102, 240, 0.15)'" size="sm"
                        variant="outline-primary">
                        Show Report
                     </b-button>
                     <b-collapse id="report-list-with-icon">
                        <b-list-group flush class="mt-1">
                           <b-list-group-item href="#"
                              class="d-flex justify-content-between align-items-center bg-transparent">
                              <span>Last Year's Profit: $20,000</span>
                              <feather-icon icon="Share2Icon" />
                           </b-list-group-item>
                           <b-list-group-item href="#"
                              class="d-flex justify-content-between align-items-center bg-transparent">
                              <span>This Year's Profit: $25,000</span>
                              <feather-icon icon="Share2Icon" />
                           </b-list-group-item>
                           <b-list-group-item href="#"
                              class="d-flex justify-content-between align-items-center bg-transparent">
                              <span>Last Year's Commision: $5,000</span>
                              <feather-icon icon="Share2Icon" />
                           </b-list-group-item>
                           <b-list-group-item href="#"
                              class="d-flex justify-content-between align-items-center bg-transparent">
                              <span>This Year's Commision: $7,000</span>
                              <feather-icon icon="Share2Icon" />
                           </b-list-group-item>
                           <b-list-group-item href="#"
                              class="d-flex justify-content-between align-items-center bg-transparent">
                              <span>This Year's Total Balance: $70,000</span>
                              <feather-icon icon="Share2Icon" />
                           </b-list-group-item>
                        </b-list-group>
                     </b-collapse>
                  </app-timeline-item>

                  <app-timeline-item variant="warning" icon="MapPinIcon">
                     <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                        <h6>Interview Schedule</h6>
                        <small class="text-muted">03:00 PM</small>
                     </div>
                     <p>Have to interview Katy Turner for the developer job.</p>
                     <div class="d-flex flex-sm-row flex-column justify-content-between align-items-start">
                        <b-media>
                           <template #aside>
                              <b-avatar :src="require('@/assets/images/avatars/1-small.png')" />
                           </template>
                           <h6>Katy Turner</h6>
                           <span class="text-muted">Javascript Developer</span>
                        </b-media>
                        <div>
                           <feather-icon icon="MessageSquareIcon" class="mr-1" />
                           <feather-icon icon="PhoneCallIcon" />
                        </div>
                     </div>
                  </app-timeline-item>

                  <app-timeline-item variant="danger" icon="ShoppingBagIcon">

                     <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                        <h6>Online Store</h6>
                        <small class="text-muted">03:00 PM</small>
                     </div>
                     <p>Develop an online store of electronic devices for the provided layout, as well as
                        develop a mobile version of it. The must be compatible with any CMS.</p>
                     <div class="d-flex flex-sm-row flex-column justify-content-between align-items-start">
                        <div class="mb-1 mb-sm-0">
                           <span class="text-muted mb-50">Developers</span>

                           <div>
                              <b-avatar text="A" class="mr-50" size="24" variant="light-primary" />
                              <b-avatar text="B" class="mr-50" size="24" variant="light-success" />
                              <b-avatar text="C" class="mr-50" size="24" variant="light-danger" />
                           </div>
                        </div>
                        <div class="mb-1 mb-sm-0">
                           <span class="text-muted mb-50 d-block">Deadline</span>
                           <span>20 Dec 2077</span>
                        </div>
                        <div>
                           <span class="text-muted mb-50 d-block">Budget</span>
                           <span>$50,000</span>
                        </div>
                     </div>
                  </app-timeline-item>

                  <app-timeline-item variant="info" icon="GridIcon">

                     <div
                        class="d-flex align-items-start flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-50">
                        <h6>Designing UI</h6>
                        <b-badge pill variant="light-primary">
                           Design
                        </b-badge>
                     </div>
                     <p>Our main goal is to design a new mobile application for our client. The customer wants
                        a clean &amp; flat design.</p>
                     <div>
                        <span class="text-muted">
                           Participants
                        </span>
                        <b-avatar-group size="32px" class="mt-50">
                           <b-avatar v-b-tooltip.hover class="pull-up" title="Jenny Looper"
                              :src="require('@/assets/images/portrait/small/avatar-s-5.jpg')" />
                           <b-avatar v-b-tooltip.hover class="pull-up" title="Jennifer Lopez"
                              :src="require('@/assets/images/portrait/small/avatar-s-6.jpg')" />
                           <b-avatar v-b-tooltip.hover class="pull-up" title="Arya Stark"
                              :src="require('@/assets/images/portrait/small/avatar-s-7.jpg')" />
                        </b-avatar-group>
                     </div>
                  </app-timeline-item> -->
               </app-timeline>
            </b-col>


         </b-row>
      </b-container>
   </b-card>
</template>

<script>
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import Ripple from 'vue-ripple-directive'

import { ValidationObserver, ValidationProvider } from 'vee-validate'
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
   BFormTextarea,

} from 'bootstrap-vue'


import store from '@/store';

import {computed,ref,toRefs,onMounted,onActivated} from 'vue'

import {required} from '@validations';

import { optionsSituaciones } from '@core/utils/utils';

export default {

   props:['id'],

   components:{
      AppTimeline,
      AppTimelineItem,
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
      BListGroup,
      BListGroupItem,
      BAvatarGroup,
      BBadge,
      ValidationObserver,
      ValidationProvider,
      BFormTextarea

   },

   directives:{
      Ripple,
      'b-tooltip': VBTooltip,
      'b-toggle': VBToggle
   },

   setup(props,{emit}) {

      const formValidate =ref(null)

      const buscadormap = ref('');
      const visibleMarker = ref(true);
      const zoom_map = ref(10);
      const markers = ref([]);
      const iconMarker = ref('');
      const input = ref(null)

      const { estatuses,estatus:formulario } = toRefs(store.state.estatus)

      onActivated(() => {
         store.dispatch('estatus/fetchEstatuses', props.id)
      })

      onMounted(() => {
         
         store.dispatch('estatus/fetchEstatuses', props.id)
         // if(!estatuses.value.length){
            // store.dispatch('estatus/fetchEstatuses',props.id)
         // }

         input.value.$mapPromise.then((map) => {
            var myControl = document.getElementById('myAutocomplete');
            myControl.index = 1;
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(myControl);
         });

      })

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

         zoom_map.value = 17

         formulario.value.lat = Number(place.geometry.location.lat());
         formulario.value.lng = Number(place.geometry.location.lng());

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
         formulario.value.lat = Number(dato.latLng.lat())
         formulario.value.lng = Number(dato.latLng.lng())
      }

      const posicionCambiada = () => {

      }

      const getLatitud = () => {
         return Number(formulario.value.lat)
      }

      const getLongitud = () => {
         return Number(formulario.value.lng);
      }

      const guardar = () => {
         formulario.value.entrega_id = props.id

         store.dispatch('estatus/guardar',formulario.value).then(({result,estatus}) => {

            if(result){
               
               toast.success('Estatus Asignado correctamente')
               store.commit('estatus/clear')

            }else{
               
               toast.info('Estatus no se pudo crear inténtelo de nuevo')
            
            }

         }).catch(e => {
            
            console.log(e)

            if(e.response.status === 422){
               formValidate.value.setErrors(e.response.data.errors)
            }

         })
      }


      return {
         formulario,
         estatuses,
         loading:computed(() => store.state.loading),
         required,
         formValidate,
         optionsSituaciones,
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
         getLatitud,
         getLongitud,
guardar

      }
   },
}

</script>

<style lang="scss">
   .btn.active{
      background-color: rgba(7, 7, 7, 0.925) !important;
   }
</style>