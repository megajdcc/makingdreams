<template>
   <b-card>
      <validation-observer ref="formValidate" #default="{ handleSubmit }">
         <b-form @submit.prevent="handleSubmit(guardar)">
            <b-container fluid>
               <b-row>
                  <b-col cols="12" md="6">
                     <b-form-group description="Nombre de la compañia">
                        <template #label>
                           Nombre: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="nombre" rules="required" #default="{ errors }">
                           <b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>

                  </b-col>
                  <b-col cols="12" md="6">
                     <b-form-group description="Seleccione al usuario que es coordinador de la compañia">
                        <template #label>
                           Coordinador: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="coordinador_id" rules="required" #default="{ errors }">
                           <el-select v-model="formulario.coordinador_id" placeholder="seleccione" class="w-100"
                              clearable filterable>
                              <el-option v-for="(coordinador,i) in coordinadores" :key="i"
                                 :label="`${coordinador.nombre} ${coordinador.apellido} - ${coordinador.email}`" :value="coordinador.id">
                              </el-option>
                           </el-select>

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>


               </b-row>
               <b-row>

                  <b-col cols="12" md="6">

                     <b-form-group description="Una descripción corta de la compañia.">
                        <template #label>
                           Breve: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="breve" rules="required" #default="{ errors }">
                           <b-form-input v-model="formulario.breve" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>



                  </b-col>

                  <b-col cols="12" md="6">
                     <b-form-group description="Teléfono de la compañia">
                        <template #label>
                           Teléfono: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="telefono" rules="required" #default="{ errors }">
                           <b-form-input v-model="formulario.telefono" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>


               </b-row>
               <el-divider content-position="left">Dirección</el-divider>
               <b-row>
                  <b-col cols="12" md="8">
                     <b-form-group description="Dirección principal de la compañia">
                        <template #label>
                           Dirección: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="direccion" rules="required" #default="{ errors }">
                           <b-form-textarea v-model="formulario.direccion" :state="errors.length ? false : null"
                              :rows="2" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>

                  <b-col cols="12" md="4">
                     <b-form-group>
                        <template #label>
                           Código postal:
                        </template>

                        <validation-provider name="codigo_postal" #default="{ errors }">
                           <b-form-input v-model="formulario.codigo_postal" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback>
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>
                     </b-form-group>
                  </b-col>

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
                           <li class="text-grey">Arrastra el marcador hacia la ubicaci&oacute;n de la compañía.</li>
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
                  <b-col cols="12" md="6">
                     <b-form-group
                        title="Este logo aparecerá en el perfil de la compañia y en las busquedas, se recomienda una imagen cuadrada de mínimo 300x300 px y un peso inferior a 2mb. La imagen debe estar en formato jpg o png"
                        v-b-tooltip.hover.v-primary description="Presiona encima del recuadro para buscar una imagen.">
                        <template #label>
                           Adjunta el logo de la compañia: <span class="text-danger">*</span>
                           <feather-icon icon="HelpCircleIcon" class="text-warning" />
                        </template>

                        <section class="content-logo" @click="() => refLogo.$refs.input.click()"
                           :style="`background:url(${urlLogo})`">

                        </section>

                        <validation-provider name="logo" #default="{errors}">
                           <b-form-file v-model="logo" ref="refLogo" plain accept=".jpb, .png" class="d-none"
                              @input="logoSeleccionado" :state="errors.length ? false : null" />

                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>

                        </validation-provider>



                     </b-form-group>
                  </b-col>
                  <b-col cols="12" md="6">

                     <b-form-group
                        title="Esta será la imagen de portada de tu negocio. Se recomienda una imagen horizontal panoramica y un peso inferior a 2mb, la imagen debe estar en formato jgg o png."
                        v-b-tooltip.hover.v-primary description="Presiona encima del recuadro para buscar una imagen.">
                        <template #label>
                           Adjunta una fotografía de la compañia: <span class="text-danger">*</span>
                           <feather-icon icon="HelpCircleIcon" class="text-warning" />
                        </template>


                        <section class="content-logo" @click="refFoto.$refs.input.click()"
                           :style="`background:url(${urlFoto})`">
                        </section>

                        <validation-provider name="foto" #default="{errors}">

                           <b-form-file v-model="foto" ref="refFoto" plain accept=".jpb, .png" class="d-none"
                              @input="fotoSeleccionada" :state="errors.length ? false : null" />

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
   BRow, BCol,
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
      BRow, BCol,
      BFormGroup,
      BFormInput,
      BFormInvalidFeedback,
      BButtonGroup,
      BButton,
      BFormTextarea,
      vSelect,
      ValidationProvider,
      ValidationObserver,
      BCard,
      BFormFile,
      BImg,
      BFormTags,
      BInputGroup,
      BInputGroupPrepend

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
      const refLogo = ref(null)
      const refFoto = ref(null)
      const urlLogo = ref(null)
      const urlFoto = ref(null)
      const logo = ref(null)
      const foto = ref(null)

      const {usuarios} = toRefs(store.state.usuario)


      const { compania: formulario } = toRefs(store.state.compania)

      const guardar = () => {

         if (logo.value) {
            formulario.value.logo = logo.value
         }

         if (foto.value) {
            formulario.value.portada = foto.value
         }

         emit('save', formulario.value, formValidate)
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

         if(!usuarios.value.length){
            store.dispatch('usuario/cargarUsuarios');
         }

         if (formulario.value.id) {
            urlLogo.value = `/storage/companias/logos/${formulario.value.logo}`
            urlFoto.value = `/storage/companias/portadas/${formulario.value.portada}`
            formulario.value.logo = null
            formulario.value.portada = null
            pais_id.value = formulario.value.estado.pais_id
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

      const logoSeleccionado = (file) => {
         urlLogo.value = URL.createObjectURL(file)
      }

      const fotoSeleccionada = (file) => {
         urlFoto.value = URL.createObjectURL(file)
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
         refLogo,
         refFoto,
         urlLogo,
         urlFoto,
         logo,
         foto,
         logoSeleccionado,
         fotoSeleccionada,

         coordinadores:computed(() => {
            return usuarios.value.filter(val => val.rol.nombre == 'Cliente');
         })

         
      }
   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>


<style lang="scss" scoped>
.content-logo{
   border: 3px dotted rgba(44, 23, 23, 0.568);
   height: 150px;
   border-radius: 10px;
   box-shadow: -5px 10px 25px rgb(0 0 0 / 50%);
   cursor: pointer;
   background-repeat: no-repeat !important;
   background-size: contain !important;
   background-position: center center !important;

   &::after {
         content: "Buscar la imagen";
         display: flex;
         justify-content: center;
         align-items: center;
         height: 100%;
         font-weight: bolder;
   }
   
   &:hover{
          transform: scale3d(1.2, 1.2, 3.5);
         &::after {
               content: "" !important;
               display: flex;
               justify-content: center;
               align-items: center;
               height: 100%;
               font-weight:bolder;
         }
   }
}

</style>