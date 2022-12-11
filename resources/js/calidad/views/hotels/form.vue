<template>
	<b-overlay :show="loading">
		<validation-observer ref="formValidate" #default="{handleSubmit}">
			<b-form @submit.prevent="handleSubmit(guardarHotel)">

				<b-container fluid>
					<!-- Nombre del hotel -->
					<b-row>
						<b-col lg="8">

							<b-form-group>
								<template #label>
									Nombre del Hotel: <span class="text-danger">*</span>
								</template>

								<validation-provider name="nombre" rules="required" #default="{errors}">

									<b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" />

									<b-form-invalid-feedback>
										{{errors[0]}}
									</b-form-invalid-feedback>

								</validation-provider>
							</b-form-group>

						</b-col>


						<b-col lg="4">

							<b-form-group>
								<template #label>
									Coordinador:
								</template>

								<validation-provider name="coordinador" rules="required" #default="{errors}">

									<el-select v-model="formulario.coordinador" placeholder="Selecione " filterable class="w-100"
										clearable>

										<el-option v-for="(user,i) in getCoordinador('Hotel')" :key="i" :value="user.id"
											:label="`${user.nombre} ${user.apellido}`"></el-option>

									</el-select>

									<b-form-invalid-feedback :state="errors.length ? false : null">
										{{errors[0]}}
									</b-form-invalid-feedback>

								</validation-provider>
							</b-form-group>


						</b-col>


					</b-row>

					<!-- sitio web, habitaciones y breve-->
					<b-row>
						<b-col md="4">
							<b-form-group label="Sitio web del hotel"
								description="Si no tienes sitio web, deja el espacio en blanco.">

								<validation-provider name="website" :rules="{ regex:/^(http[s]?:)?(\/\/)?([\w]+[\.])?[\w]+([\.][\w]{1,3})+$/}"
									#default="{errors}">
									<b-input-group>
										<b-input-group-prepend is-text>
											<span class="fas fa-globe-americas"></span>
										</b-input-group-prepend>

										<b-form-input v-model="formulario.website" :state="errors.length ? false : null" />

									</b-input-group>

									<b-form-invalid-feedback>
										{{errors[0]}}
									</b-form-invalid-feedback>

								</validation-provider>

							</b-form-group>

						</b-col>
						<b-col md="4">
							<b-form-group :label="`Cantidad de habitaciones: ${formulario.cant_habitaciones}`">

								<validation-provider name="cant_habitaciones" rules="required" #default="{errors}">


									<el-slider v-model="formulario.cant_habitaciones" :min="1" :max="1000" />
									<!-- <b-form-input v-model="formulario.cant_habitaciones" type="range" :min="0" :max="1000"
									:state="errors.length ? false : null" /> -->

									<b-form-invalid-feedback>
										{{ errors[0] }}
									</b-form-invalid-feedback>

								</validation-provider>

							</b-form-group>
						</b-col>

						<b-col md="4">
							<b-form-group label="Breve" description="Un mensaje corto sobre el Hotel">

								<validation-provider name="breve" #default="{errors}">

									<b-form-input v-model="formulario.breve" :state="errors.length ? false : null" />

									<b-form-invalid-feedback>
										{{ errors[0] }}
									</b-form-invalid-feedback>

								</validation-provider>

							</b-form-group>
						</b-col>


					</b-row>

					<el-divider content-position="left">Datos de contacto del Hotel</el-divider>

					<!-- Telefonos y redes sociales -->
					<b-row>
						<b-col md="6">
							<el-divider content-position="center">Números telefónicos</el-divider>

							<b-form-group label="Agregar nuevo número telefónico"
								v-if="formulario.telefonos && formulario.telefonos.length < 5">

								<b-input-group>

									<b-input-group-prepend is-text>
										<span class="fas fa-phone"></span>
									</b-input-group-prepend>

									<the-mask type="tel" placeholder="Número de teléfono" class="form-control" v-model="telefono"
										:mask="masks" :masked="masked" />



									<b-input-group-append>
										<b-button @click="guardarTelefono(telefono)" :disabled="!telefono" v-loading="loading"
											variant="primary">
											<feather-icon icon="SaveIcon" />
											Anexar
										</b-button>

									</b-input-group-append>




								</b-input-group>

							</b-form-group>

							<div class="rounded-sm bg-light p-3 content-draggable" v-loading="loading">

								<draggable v-model="formulario.telefonos" class="list-group" group="telefonos" tag="ul"
									@start="drag = true" @end="drag = false" animation="200" ghostClass="ghost"
									@change="cambiarPosition">

									<transition-group type="transition" :name="!drag ? 'flip-list' : null">

										<li class="list-group-item d-flex justify-content-between align-items-center"
											v-for="(element, i)  in formulario.telefonos" :key="element.id">
											<div class="d-flex justify-content-between align-items-center">

												<div class="input-group d-flex align-items-center">
													<div class="input-group-prepend mr">
														<div class="input-group-text">
															<span class="fas fa-phone-alt"></span>
														</div>
													</div>


													<label for="" class="mx-3 my-0 p-0">{{ element.telefono }}</label>
												</div>



											</div>
											<span class="badge badge-secondary">{{ (i + 1) }}</span>
											<el-button type="danger" :loading="loading" circle icon="fas fa-trash" title="Eliminar"
												@click="quitarTelefono(i)"></el-button>
										</li>

									</transition-group>

								</draggable>

								<label class="font-weight-bold my-2"><em>Nota: Puedes tener hasta 5 nro telefónicos
									</em><br><em>El número de teléfono que esté primero se considera el principal,
										considere
										arrastrar al primer lugar el que desee.</em></label>

							</div>

						</b-col>

						<b-col md="6">
							<el-divider content-position="center">Redes sociales</el-divider>

							<b-form-group label="Twitter">
								<b-input-group class="input-group-merge">
									<b-input-group-prepend is-text>
										<feather-icon size="16" icon="TwitterIcon" />
									</b-input-group-prepend>
									<b-form-input id="twitter" v-model="formulario.redes.twitter" />
								</b-input-group>
							</b-form-group>

							<b-form-group label="Facebook" label-for="facebook">
								<b-input-group class="input-group-merge">
									<b-input-group-prepend is-text>
										<feather-icon size="16" icon="FacebookIcon" />
									</b-input-group-prepend>
									<b-form-input id="facebook" v-model="formulario.redes.facebook" type="url" />
								</b-input-group>
							</b-form-group>

							<b-form-group label="Instagram" label-for="instagram">
								<b-input-group class="input-group-merge">
									<b-input-group-prepend is-text>
										<feather-icon size="16" icon="InstagramIcon" />
									</b-input-group-prepend>
									<b-form-input id="instagram" v-model="formulario.redes.instagram" type="url" />
								</b-input-group>
							</b-form-group>

						</b-col>

					</b-row>

					<el-divider content-position="left">Ubicación del hotel</el-divider>

					<!-- direccion y codigo postal -->
					<b-row>
						<b-col md="8">

							<b-form-group description="Dirección física del hotel">
								<template #label>
									Dirección del hotel
									<span class="text-danger">*</span>
									<i class="fa fa-question-circle text-secondary"></i>
								</template>
								<validation-provider name="direccion" rules="required" #default="{errors}">

									<b-input-group>
										<b-input-group-prepend is-text>
											<span class="fas fa-map"></span>
										</b-input-group-prepend>

										<b-form-input v-model="formulario.direccion" placeholder="Dirección"
											:state="errors.length ? false : null" />

										<b-form-invalid-feedback>
											{{ errors[0] }}
										</b-form-invalid-feedback>

									</b-input-group>

								</validation-provider>

							</b-form-group>

						</b-col>

						<b-col md="4">

							<b-form-group>

								<template #label>
									Código postal: <span class="required">*</span> <i
										class="fa fa-question-circle text-secondary"></i>
								</template>
								<validation-provider name="codigo_postal" rules="required" #default="{errors}">
									<b-input-group>
										<b-input-group-prepend is-text>
											<span class="fas fa-envelope"></span>
										</b-input-group-prepend>

										<b-form-input v-model="formulario.codigo_postal" :state="errors.length ? false : null" />

									</b-input-group>
									<b-form-invalid-feedback :state="errors.length ? false : null">
										{{ errors[0] }}
									</b-form-invalid-feedback>
								</validation-provider>
							</b-form-group>

						</b-col>
					</b-row>

					<!-- Pais,estado y ciudad -->
					<b-row>

						<b-col md="4">

							<b-form-group>
								<template #label>
									Pais: <span class="required">*</span>
								</template>

								<validation-provider name="pais_id" rules="required" #default="{errors}">
									<el-select v-model="formulario.pais_id" filterable placeholder="Seleccione" size="small"
										@change="cargarEstados" class="w-100">
										<el-option v-for="pais in paises" :key="pais.id" :value="pais.id" :label="pais.pais">
										</el-option>
									</el-select>

									<b-form-invalid-feedback :state="errors.length ? false : null">
										{{ errors[0] }}
									</b-form-invalid-feedback>

								</validation-provider>
							</b-form-group>

						</b-col>


						<b-col md="4">

							<b-form-group>
								<template #label>
									Estado: <span class="required">*</span>
								</template>

								<validation-provider name="estado_id" rules="required" #default="{errors}">
									<el-select v-model="formulario.estado_id" filterable placeholder="Seleccione" size="small"
										@change="cargarCiudades" class="w-100">
										<el-option v-for="estado in estados" :key="estado.id" :value="estado.id"
											:label="estado.estado">
										</el-option>
									</el-select>

									<b-form-invalid-feedback :state="errors.length ? false : null">
										{{ errors[0] }}
									</b-form-invalid-feedback>

								</validation-provider>
							</b-form-group>

						</b-col>

						<b-col md="4">

							<b-form-group>
								<template #label>
									Ciudad: <span class="required">*</span>
								</template>

								<validation-provider name="ciudad_id" rules="required" #default="{errors}">
									<el-select v-model="formulario.ciudad_id" filterable placeholder="Seleccione" size="small"
										class="w-100">
										<el-option v-for="ciudad in ciudades" :key="ciudad.id" :value="ciudad.id"
											:label="ciudad.ciudad"></el-option>
									</el-select>

									<b-form-invalid-feedback :state="errors.length ? false : null">
										{{ errors[0] }}
									</b-form-invalid-feedback>

								</validation-provider>
							</b-form-group>

						</b-col>
					</b-row>

					<el-divider></el-divider>

					<b-row>
						<b-col>
							<div class="form-group">
								<label for="map-canvas">Posici&oacute;n en el mapa <span class="required">*</span></label>
								<p class="text-grey">
								<ul>
									<li class="text-grey">Arrastra el marcador hacia la ubicaci&oacute;n del hotel.</li>
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
						}" :visible="visibleMarker" :draggable="true" :clickable="true" :icon="iconMarker" @mouseup="moviendomapa"
									@position_changed="posicionCambiada()">
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



					<!-- Logotipo e imagenes del hotel -->
					<b-row>

						<b-col md="4" v-if="formulario.id">
							<el-divider content-position="center">Logotipo </el-divider>

							<el-upload class="avatar-uploader" :action="`/api/upload/logo/hotel/${formulario.id}`"
								:show-file-list="false" :headers="cabecera" :on-success="LogoCargado"
								:before-upload="beforeLogoUpload" accept="image/*" ref="inputLogo">
								<img v-if="formulario.logo" :src="formulario.logo" class="Logo"
									style="height: auto !important; max-width: 100%;">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>


							<span v-if="errores.logo" class="text-dager" v-text="errores.logo"></span>


						</b-col>


						<b-col md="8" v-if="formulario.id">
							<el-divider content-position="center">Imagenes del Hotel</el-divider>
							<el-upload :action="`/api/upload/imagenes/hotel/${formulario.id}`" :headers="cabecera"
								list-type="picture-card" :on-preview="mostrarImagenHotel" :on-remove="removerImagenHotel"
								:on-success="imagenCargada" ref="inputImagen" :file-list="imagenes" accept="image/*">
								<i class="el-icon-plus"></i>
							</el-upload>

							<span v-if="errores.imagenes" class="text-dager" v-text="errores.imagenes"></span>
							<el-dialog :visible.sync="dialogVisible">
								<img :src="dialogImageUrl" alt=""
									style="max-height: 450px;max-width: 100%;object-fit: contain;">
							</el-dialog>
						</b-col>



					</b-row>

					<b-row>
						<b-col>
							<b-form-group label="Amenidades" description="Agregue tantas amenidades como quiera que tenga el hotel">

								<b-form-checkbox-group v-model="formulario.amenidades" :options="amenidades.map(val => { return {text:val.nombre, value:val.id}})" ></b-form-checkbox-group>
							</b-form-group>
						</b-col>
					</b-row>

					<b-row>
						<b-col>
							<b-button-group size="sm">
								<b-button @click="regresar">
									<feather-icon icon="ArrowLeftIcon" />
									Regresar
								</b-button>

								<b-button variant="primary" type="submit">
									<feather-icon icon="SaveIcon" />
									Guardar
								</b-button>
							</b-button-group>
						</b-col>
					</b-row>

				</b-container>
			</b-form>
		</validation-observer>
	</b-overlay>
</template>

<script>

import {mapState, mapActions,mapGetters } from 'vuex';
import optionsComponents from 'mixins/optionsComponents'
import store from '@/store'
import { ref,onMounted, watch,computed,toRefs } from 'vue';

import { TheMask }from 'vue-the-mask';
import draggable  from 'vuedraggable'
import {
 
   BFormGroup,
	BFormInput,
   BInputGroup,
	BInputGroupPrepend,
	BFormFile,
	BButton,
	BButtonGroup,
	BContainer,
	BCol,
	BRow,
	BForm,
	BFormInvalidFeedback,
	BOverlay,
	BInputGroupAppend,
	BFormCheckboxGroup,
	BFormCheckbox,

} from 'bootstrap-vue'
import CurrencyInput from 'components/CurrencyInput';

import { ValidationObserver,ValidationProvider } from 'vee-validate';

import {required,regex} from '@validations';

export default {
	components:{
			TheMask,
			draggable,
			BFormGroup,
			BFormInput,
   		BInputGroup,
			BInputGroupPrepend,
			BFormFile,
			CurrencyInput,
			BButton,
			BButtonGroup,
			BContainer,
			BCol,
			BRow,
		BForm,
		ValidationObserver,
		ValidationProvider,
		BFormInvalidFeedback,
		BOverlay,
		BInputGroupAppend,
		BFormCheckboxGroup,
		BFormCheckbox,
	},
   mixins:[optionsComponents],

   setup(props,{emit}){
   
      const buscadormap = ref('');
		const dialogImageUrl = ref('');
		const dialogVisible = ref(false);
		const telefonos = ref([])
		const formValidate = ref(null)
		const input = ref(null)

		const amenidades = computed(() => store.state.amenidad.amenidades)

		const cabecera = {
			'Authorization': `bearer ${localStorage.getItem('token')}`,
			'Accept': "application/json, text/plain, */*, text/html",
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
		}

		const errores = ref({
			logo:'',
			imagenes:''
		});

		const formulario = computed(() => store.getters['hotel/draft'])
      const visibleMarker = ref(true);	
      const zoom_map = ref(10);
      const markers = ref([]);
      const iconMarker = ref('');
      const getCoordinador = ref(
         store.getters['usuario/getCoordinadoresHotel']
      )
      const optionsPlace = ref({
         content:'<strong>Méxio City</strong>',
      })

		const imagenes = ref([])
		

		const telefono = ref(null);
		const drag = ref(false)
      const options_map = ref({
         mapTypeControl:false,
         zoomControl   :true,
      })

      const cargarForm = () => {
		
			if(formulario.value.telefonos.length){

				formulario.value.telefonos =  formulario.value.telefonos.map((val,i) => {
					return {
						telefono:val.telefono ? val.telefono : 0,
						principal:(i == 0) ? true : false,
						id:i
					}

				})
			}

			if(formulario.value.imagenes.length){

				imagenes.value = formulario.value.imagenes.map((val) =>  { 
					return { name:formulario.value.nombre,
								id:val.imagen,
								url:`/storage/hotel/imagenes/${val.imagen}`};
							})
			}


			if(formulario.value.id){
				formulario.value.pais_id = formulario.value.estado.pais_id
				formulario.value.amenidades = formulario.value.amenidades.map(val => val.id)
			}

			if(!amenidades.value.length){
				store.dispatch('amenidad/cargarAmenidades');
			}

      }
      
      const getLatitud = () => {
         return Number(formulario.value.lat)
      }

      const getLongitud = () => {
         return Number(formulario.value.lng);
      }
		
		const guardarHotel = () => {

			emit('save',formulario.value,formValidate.value)
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

					iconMarker.value ={
							url       : place.icon,
							size      : new google.maps.Size(71, 71),
							origin    : new google.maps.Point(0, 0),
							anchor    : new google.maps.Point(17, 34),
							scaledSize: new google.maps.Size(35, 35)
					};

					visibleMarker.value = true;

					optionsPlace.value.content = '<div><strong>' + place.name + '</strong><br>' + address
      }


      const moviendomapa = (dato) => {
         formulario.value.lat = Number(dato.latLng.lat())
			formulario.value.lng = Number(dato.latLng.lng())
      } 
      const posicionCambiada = (dato) => {}
		
		const guardarTelefono = (telef) => {
			
			formulario.value.telefonos.push({
				telefono:telef,
				principal:false,
				id:formulario.value.telefonos.length + 1,
			})
			
			telefono.value = '';
		}

		const cambiarPosition = () => {
			formulario.value.telefonos.forEach((elem,i) => {
				(i == 0) ? elem.principal = true : elem.principal = false
			});
		}

		const quitarTelefono = (index ) => {
			formulario.value.telefonos.splice(index,1)
		}


		const mostrarImagenHotel = (file) => {
			dialogImageUrl.value = file.url
			dialogVisible.value = true
		}

		const removerImagenHotel = (file) => {

				axios.post(`/api/delete/imagen/hotel/${formulario.value.id}`,{imagen:file.id}).then(response => {
					console.log(response.data.result)
				})

		}

		const beforeLogoUpload = (file) => {

			const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isImg) {
				errores.value.logo = 'La imagen debe estar en formato JPG!';
			}

			if (!isLt2M) {
				errores.value.logo = 'La imagen excede los 2MB!';
			}

			return isImg && isLt2M;

		}

		const LogoCargado = (response) => {
			
			if(response.result){
				store.commit('hotel/updateLogo',response.logo)
				formulario.value.logo = response.logo;
				cargarForm();
			}
			
		}

		const imagenCargada = (response) => {
			if(response.result){
				store.commit('hotel/updateImagenes',response.imagenes)
			}
		}

      onMounted(() => {
			
         cargarForm();

			input.value.$mapPromise.then((map) => {
				var myControl = document.getElementById('myAutocomplete');
				myControl.index = 1;
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(myControl);
			});
		
      })

      watch(formulario,() => {
         cargarForm();
      })


     return {
        buscadormap,
        formulario,
        visibleMarker,
        zoom_map,
        markers,
        iconMarker,
        optionsPlace,
        getLatitud,
        getLongitud,
		  guardarHotel,
        setPlace,
        moviendomapa,
        posicionCambiada,
        options_map,
        getCoordinador,
		  telefono,
		  guardarTelefono,
		  cambiarPosition,
		  quitarTelefono,
		  drag,
		  mostrarImagenHotel,
		  removerImagenHotel,
		  dialogImageUrl,
		  dialogVisible,
		  beforeLogoUpload,
		  errores,
		  LogoCargado,
		  imagenes,
		  imagenCargada,
		  cargarForm,
		  telefonos,
		  cabecera,
		  loading:computed(() => store.state.loading),
		  required,
		  regex,
		  formValidate,
		input,
		amenidades
		  

     };


  },



	created(){
		
		if(this.formulario.id){
			
			if(this.formulario.estado){
				this.cargarEstados(this.formulario.estado.pais_id);
			}

			if(this.formulario.estado_id){
				this.cargarCiudades(this.formulario.estado_id);
			}
			
		
		}

	},

	watch:{

		formulario(){

			if (this.formulario.id) {

				if (this.formulario.estado) {
					this.cargarEstados(this.formulario.estado.pais_id);
				}

				if (this.formulario.estado_id) {
					this.cargarCiudades(this.formulario.estado_id);
				}

			}
			
		}

	}


}
</script>

<style lang="scss" scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>