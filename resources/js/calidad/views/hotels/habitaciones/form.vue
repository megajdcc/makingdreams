<template>
<form autocomplete="off" @submit.prevent="save"  v-loading="loading">
	<div class="card">
		<div class="card-body">
			
			<div class="container-fluid">
				
				<div class="row">
					<div class="col-12 col-lg-8">
											
						<div class="form-group" data-toggle="tooltip" title="Tipo de habitación" :class="{'has-danger': errors.nombre}">
							<label for="nombre">Nombre del tipo de habitación <span class="text-danger">*</span> <i class="fas fa-question-circle text-secondary"></i></label>
							<input  v-model="formulario.nombre" class="form-control form-control-sm" type="text" id="nombre" :class="{'is-invalid' : errors.nombre }" placeholder="Tipo de habitación"/>
							<div class="invalid-feedback d-flex" role="alert" v-if="errors.nombre">
									<strong v-text="errors.nombre[0]"></strong>
							</div>
						</div>
                  
                   

                  <div class="form-group" data-toggle="tooltip" title="Describa al tipo de habitación que esta registrando" :class="{'has-danger': errors.descripcion}">
							<label for="descripcion">Descripción de la habitación  <i class="fas fa-question-circle text-secondary"></i></label>
                     <div class="input-group">
                        <b-form-textarea
                           id="descripcion"
                           v-model="formulario.descripcion"
                           placeholder="Descripción de la habitación"
                           rows="3"></b-form-textarea>
                     </div>
							
						</div>

                

													
					</div>





            </div>
            <div class="row">
               <div class="col-12" v-if="formulario.id">
						<el-divider content-position="center">Imagenes de la habitación</el-divider>
						<el-upload
							:action="`/api/upload/imagenes/habitacion/${formulario.id}`"
							:headers="cabecera"
							list-type="picture-card"
							:on-preview="mostrarImagen"
							:on-remove="removerImagen"
							:on-success="imagenCargada"
							ref="inputImagen"
							:file-list="imagenes"
							accept="image/*"
							>
							<i class="el-icon-plus"></i>
							</el-upload>

						
							<el-dialog :visible.sync="dialogVisible">
								<img :src="dialogImageUrl" alt="" style="max-height: 450px;max-width: 100%;object-fit: contain;">
							</el-dialog>


					</div>
            </div>
         </div>
      </div>

      <div class="card-footer">
           <b-button  :to="{name:'hotel.habitaciones',params:{id:idhotel}}" size="sm"><span class="fas fa-arrow-left mr-1"></span> Regresar </b-button>
         <b-button variant="primary" @click="guardar" size="sm" v-loading="loading"><span class="fas fa-save mr-1"></span> Guardar</b-button>
      </div>
   </div>
</form>
</template>

<script>

import {ref,onMounted,watch} from 'vue';
import {BButton, BFormTextarea, BFormGroup} from 'bootstrap-vue';

import store from '@/store'
import {mapState} from 'vuex';
import CurrencyInput from 'components/CurrencyInput';
export default { 

   props:['idhotel'],

   components:{
      BButton,
      BFormTextarea,
      BFormGroup,
      CurrencyInput
   },
   
   computed:{
      ...mapState(['errors','loading'])
   },


   data(){
      return{

         cabecera:{
				'Authorization': `bearer ${localStorage.getItem('token')}`,
				'Accept':"application/json, text/plain, */*, text/html",
				'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content'),
			
			}
      }
   },

   setup(props,{emit}){
   

      const formulario = ref({
            id:null,
            nombre:'',
            descripcion:'',
            imagenes:[],
            hotel_id:null,
            hotel:null,
      })

      const dialogImageUrl = ref('');
		const dialogVisible = ref(false);
      const imagenes = ref([])

      // const loading = store.state.loading;
      // // const errors = store.state.errors;


      const cargarForm = () => {

         formulario.value = store.getters['habitacion/draft']

         if(formulario.value.imagenes){
				imagenes.value = formulario.value.imagenes.map((val) =>  { 
					return { name:formulario.value.nombre,
								id:val.imagen,
								url:`/storage/hotel/habitaciones/${val.imagen}`};
							})
			}

      
      }

      onMounted(() => {
      
         cargarForm();
      
      })

      watch(formulario,() => {
         cargarForm()
      })

      const guardar = () => {

         emit('save',formulario.value)

      }

      const mostrarImagen = (file) => {
			dialogImageUrl.value = file.url
			dialogVisible.value = true
		}

		const removerImagen = (file) => {

         axios.post(`/api/delete/imagen/habitacion/${formulario.value.id}`,{imagen:file.id}).then(response => {
            
            if(response.data.result){
               store.commit('habitacion/updateImagenes',{habitacion:formulario.value.id,imagenes:response.data.imagenes});
            }
            
         })

		}

      const imagenCargada = (response) => {
			if(response.result){
            if(formulario.value.id){
                emit('refresh',formulario.value.id)
            }
           
				store.commit('habitacion/pushImagen',{habitacion:formulario.value.id,imagen:response.imagen})
			}
		}





      return {
         formulario,
         guardar,
         mostrarImagen,
         removerImagen,
         imagenCargada,
         imagenes,
         dialogVisible,
         dialogImageUrl
      };

   }
}

</script>