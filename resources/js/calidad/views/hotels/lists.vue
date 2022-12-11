
	<template>

	<el-tabs type="border-card">
		<el-tab-pane>

			<template #label>
				<span><i class="fas fa-hotel"></i> Hoteles</span>

			</template>


			<div class="input-group input-group-sm">
				<input type="search" v-model="busqueda" class="form-control " placeholder="Busque su hotel"
					@keyup="buscarHotel">
			</div>




			<div
				class="contain-categorias d-flex align-items-center flex-wrap py-3 justify-content-center justify-content-md-start"
				v-loading="loading">

				<template v-if="getSearchHoteles(usuario).length > 0">

					<div class="card-categoria d-flex flex-column mr-1" v-for="hotel in getSearchHoteles(usuario)"
						:key="hotel.id">


						<el-badge value="activo" type="success" class="badge my-2">
							<el-card :body-style="{padding:'0px'}" style="width:200px; height:auto" class="img-hotel box-card"
								:header="hotel.nombre">
								<!-- <div style="padding:14px" slot="header" class="clearfix p-0 d-flex justify-content-between w-100">
															<strong class="font-weight-bold text-center"></strong>
														</div> -->

								<div class="d-flex flex-column">
									<img :src="hotel.logo" class="rounded-lg w-100 h-auto" :alt="hotel.nombre"
										@click.stop="mostrarHotel(hotel)" style="cursor:pointer">


									<div class="d-flex mt-1">

										<b-button-group size="sm" class="w-100">

											<b-button :to="{name:'hotel.planes',params:{idhotel:hotel.id}}"
												title="Planes de hotel">
												<feather-icon icon="ListIcon" />
											</b-button>

											<b-button @click="editar(hotel)" variant="primary" title="Editar">
												<feather-icon icon="EditIcon" />

											</b-button>

											<b-button variant="info" @click="verHabitaciones(hotel)" size="mini"
												title="Ver Tipo de habitaciones">
												<i class="fas fa-door-open"></i>
											</b-button>

											<b-button variant="danger" @click="eliminar(hotel)" title="Eliminar Hotel">
												<feather-icon icon="TrashIcon" />

											</b-button>

										</b-button-group>


									</div>
								</div>


							</el-card>

						</el-badge>
						<!-- <article class="img-hotel elevation-2 rounded-lg" style="width:160px; height:105px">
														<img :src="hotel.imagen"  class="rounded-lg w-100 h-auto" :alt="hotel.nombre">
													</article>
												<span class="font-weight-bold text-center mt-2">{{ hotel.nombre }}</span> -->





					</div>
				</template>

				<template v-else>
					<div class="d-flex justify-content-center">
						<span>Sin Hoteles</span>
					</div>
				</template>


			</div>


			<el-button-group>
				<el-button type="primary" @click="nuevoHotel" size="small">Nuevo Hotel</el-button>

			</el-button-group>
		</el-tab-pane>

	</el-tabs>


</template>





<script>

	import { mapActions, mapMutations, mapState, mapGetters} from 'vuex';
	import optionsComponents from 'mixins/optionsComponents';

	import { BButtonGroup,BButton } from 'bootstrap-vue';
 	export default{

      mixins:[optionsComponents],
		components:{
			BButtonGroup,
			BButton
		},

		computed:{
			...mapState('hotel',['hotel','hoteles','searchHotel']),
			...mapState(['loading','errors']),
			...mapGetters('hotel',['filterHoteles','getSearchHoteles']),
			...mapState('usuario',['usuario'])

		},



		methods:{

			...mapMutations('hotel',['clearHotel','capturarHotel','search','limpiarBusqueda','putHotel']),
			...mapActions('hotel',['eliminarHotel']),

			buscarHotel(){

				if(this.busqueda != ''){
					
					this.search(this.busqueda);

				}else{
					this.limpiarBusqueda()
				}
	
			},

			mostrarHotel(hotel){

				this.$router.push({name:'show.hotel',params:{id:hotel.id}});

			},


			nuevoHotel(){
					
				this.$router.push({name:'create.hotel'});

			},


			verHabitaciones(hotel){

				this.$router.push({name:'hotel.habitaciones',params:{id:hotel.id}});


			},

			
			editar(data){

				this.$router.push({name:'edit.hotel',params:{id:data.id}});
			},

			eliminar(data){

					this.$swal({
						title            :'Estas seguro de eliminar el Hotel?',
						icon             :'question',
						showCloseButton  :true,
						showCancelButton :true,
						focusConfirm     :false,
						confirmButtonText:'Sí',
						cancelButtonText :'Nó',
					}).then((result) => {
						if (result.isConfirmed) {
							this.eliminarHotel(data.id).then(respon => {

								if (respon.data.result) {

									this.$notify({
										title: 'Hotel eliminado',
										type: 'info',
									})
									// this.$refs.table.reload();

									this.putHotel(data.id)

								} else {
									this.$notify({
										title: 'El Hotel no se pudo eliminar',
										message: 'Es posible que el hotel este siendo usado',
										type: 'danger',
									})
								}


							}).catch(e => {
								console.log(e);
							});
						}
					})
					

			},

			verUsuarios(hotel){
				// this.capturarHotel(hotel.id);

				// this.$router.push({name:'hotel.usuarios',params:{id:hotel.id}});

			},

		},


	}
</script>

<style scope lang="scss">

.img-hotel img{
	height:105px !important;
	object-fit:contain;
}

.el-card__header{
	height:30px;
	padding:3px .5em !important;
	display: flex;
    align-items: center;
}

.el-badge__content.is-fixed{

    right: 0px;
    transform: translateY(-50%) translateX(-50%);
}

	
</style>