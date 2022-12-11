<template>
  <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>

                  <b-col cols="12" md="6">
                     <b-form-group description="Nombre del destino">
                        <template #label>
                           Nombre: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="destino" rules="required" #default="{ errors }">
                           <b-form-input v-model="formulario.destino" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group>
                        <template #label>
                           Compañía: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="compania_id" rules="required" #default="{errors}">
                           <v-select v-model="formulario.compania_id" :reduce="(val) => val.id"  :options="companias" label="nombre"/>
                           
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                              </b-form-invalid-feedback>
                        </validation-provider> 
                     </b-form-group>
                  </b-col>
               </b-row>

               <el-divider content-position="left">Dirección</el-divider>
               <b-row>
                  <b-col cols="12" md="4">
                     <b-form-group>
                        <template #label>
                           Pais: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="pais_id" rules="required" #default="{ errors }">
                           <v-select v-model="pais_id" @change="cargarEstados(pais_id)"
                              :reduce="(option) => option.value" placeholder="Seleccione"
                              :options="paises.map(val => { return {label:val.pais,value:val.id} })" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="4">
                     <b-form-group>
                        <template #label>
                           Estado: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="estado_id" rules="required" #default="{ errors }">
                           <v-select v-model="formulario.estado_id" placeholder="Seleccione"
                              @input="cargarCiudades(formulario.estado_id)" :reduce="(option) => option.value"
                              :options="estados.map(val => { return {label:val.estado,value:val.id} })" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>


                  <b-col cols="12" md="4">
                     <b-form-group>
                        <template #label>
                           Ciudad:
                        </template>

                        <validation-provider name="ciudad_id" #default="{ errors }">
                           <v-select v-model="formulario.ciudad_id" placeholder="Seleccione"
                              :options="ciudades.map(val => { return {label:val.ciudad,value:val.id} })"
                              :reduce="(option) => option.value " />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>
               </b-row>
               <b-row>
                  <b-col>
                     <div class="form-group">
                        <label for="map-canvas">Posici&oacute;n en el mapa <span class="required">*</span></label>
                        <p class="text-grey">
                        <ul>
                           <li class="text-grey">Arrastra el marcador hacia la ubicaci&oacute;n del destino.</li>
                           <li class="text-grey">Puedes apoyarte escribiendo una ubicaci&oacute;n como una ciudad,
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
                        <validation-provider name="lat" rules="required" #default="{errors}">
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
                        <validation-provider name="lng" rules="required" #default="{errors}">
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
                        <b-button variant="primary" type="submit" title="Guardar registro" v-loading="loading">
                           <feather-icon icon="SaveIcon" />
                           Guardar
                        </b-button>
                        <b-button variant="dark" @click="regresar" title="Regresar" v-loading="loading">
                           <feather-icon icon="ArrowLeft" />
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

import {
   BForm,
   BContainer,
   BRow,
   BCol,
   BFormGroup,
   BFormInput,
   BFormTextarea,
   BFormInvalidFeedback,
   BButtonGroup,
   BButton,
   BCard,
   BFormFile,
   BImg,
   BFormTags,
   VBTooltip,
   BInputGroup,
   BInputGroupPrepend,

} from 'bootstrap-vue'

import vSelect from 'vue-select'

import { ValidationProvider, ValidationObserver } from 'vee-validate'

import { required } from '@validations'

import store from '@/store'
import { ref, toRefs, computed, onMounted, watch } from 'vue'

import { regresar } from '@core/utils/utils'
import useDireccion from '@core/utils/useDireccion'

export default {

   components: {
      BForm,
      BContainer,
      BRow,
      BCol,
      BFormGroup,
      BFormInput,
      BFormTextarea,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      BCard,
      BFormFile,
      BImg,
      BFormTags,
      VBTooltip,
      BInputGroup,
      BInputGroupPrepend,
      ValidationObserver,
      ValidationProvider,
      vSelect

   },

   directives: {
      'b-tooltip': VBTooltip
   },


   setup(props, { emit }) {
      const formValidate = ref(null)

      const buscadormap = ref('');
      const visibleMarker = ref(true);
      const zoom_map = ref(10);
      const markers = ref([]);
      const iconMarker = ref('');
      const input = ref(null)

      const { companias } = toRefs(store.state.compania)

      const { destino: formulario } = toRefs(store.state.destino)

      const guardar = () => {

         emit('save', formulario.value, formValidate.value)
      }

      const optionsPlace = ref({
         content: '<strong>Puerto Ríco</strong>',
      })

      const options_map = ref({
         mapTypeControl: false,
         zoomControl: true,
      })

      const {
         paises,
         ciudades,
         estados,
         cargarEstados,
         cargarCiudades,
         pais_id,
      } = useDireccion();


      const cargarForm = () => {


         if(!companias.value.length){
            store.dispatch('compania/getCompanias')
         }

         if (formulario.value.id) {
            
            if(formulario.value.estado){
               pais_id.value = formulario.value.estado.pais_id
            }

            cargarCiudades(formulario.value.estado_id)
            optionsPlace.value.content = '<div><strong>' + formulario.value.nombre + '</strong><br>' + formulario.value.direccion
            zoom_map.value = 17


         }
      }


      onMounted(() => {

         cargarForm()

         input.value.$mapPromise.then((map) => {
            var myControl = document.getElementById('myAutocomplete');
            myControl.index = 1;
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(myControl);
         });
      })

      const getLatitud = () => {
         return Number(formulario.value.lat)
      }

      const getLongitud = () => {
         return Number(formulario.value.lng);
      }


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

      watch(formulario, () => cargarForm())

      return {
         required,
         formValidate,
         loading: computed(() => store.state.loading),
         regresar,
         formulario,
         guardar,
         paises,
         ciudades,
         estados,
         cargarEstados,
         cargarCiudades,
         pais_id,
         buscadormap,
         visibleMarker,
         zoom_map,
         markers,
         iconMarker,
         optionsPlace,
         options_map,
         input,
         getLatitud,
         getLongitud,
         setPlace,
         moviendomapa,
         posicionCambiada,
         companias
      }
   
   }
}

</script>

<style lang="scss">
   @import '~@core/scss/vue/libs/vue-select.scss';
</style>