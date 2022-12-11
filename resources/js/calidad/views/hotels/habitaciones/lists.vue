<template>
   <div class="card">
      <div class="card-body">
         <div class="row">
            <div class="col-12">
                  <div class="input-group input-group-sm">
                     <div class="input-group-prepend">
                        <span class="input-group-text">Búsqueda rápida</span>
                     </div>

                     <input type="search" v-model="busqueda" class="form-control " placeholder="Busqueda inteligente..." @keyup="buscarTable">

                     <div class="input-group-append">
                        <button type="button" @click="recargarTabla" class="btn btn-outline-primary input-group-text"><i class="fas fa-redo"></i></button>
                     </div>


                  </div>
               </div>

               <div class="col-12 my-2">
                  
                  <vdtnet-table
                     ref="table"
                     :fields="data"
                     :opts="options"
                     hideFooter
                     @editar="editar"
                     @eliminar="eliminar"
                     @verGaleria="verGaleria"
                     @verTarifas="verTarifas"
                     className="table-bordered table table-sm table-hover responsive wrap display w-100">

                  </vdtnet-table>
                  
               </div>

            </div>

         
      </div>

      <div class="card-footer">
         <b-button-group size="sm">
            <b-button @click="regresar">
               <feather-icon icon="ArrowLeftIcon" />
               Regresar
               </b-button>
              <b-button variant="outline-primary" size="sm" :to="{name:'create.habitacion',params:{idhotel:id}}">Crear Habitación</b-button>
         </b-button-group>
          
      </div>

      <b-sidebar v-model="showGallery" aria-controls="gallery" lazy right shado backdrop no-header>
         
         <template v-slot:title="{hide}">
            <h2 @click="hide">Galeria de la habitación</h2>
         </template>
         
         <div class="px-3 py-2">
           <!-- <b-carousel
               id="carousel-interval"
               controls
               indicators
               :interval="400"
            >
               <b-carousel-slide v-for="imagen in imagenes(habitacion_id)" :key="imagen.id" :img-src="imagen.url" />
            </b-carousel> -->

             <swiper
               class="swiper-cube-effect swiper-autoplay"
               :options="swipperOptions"
               :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            >
               <swiper-slide
                  v-for="(imagen,index) in imagenes(habitacion_id)"
                  :key="index"
               >
                  <b-img
                  :src="imagen.url"
                  fluid
                  />
               </swiper-slide>
               <div
                  slot="pagination"
                  class="swiper-pagination swiper-pagination-white"
               />
            </swiper>

            
            <div class="mt-2">
                <b-img v-for="(imagen,i) in imagenes(habitacion_id)" thumbnail style="cursor:pointer"  @click="index = i" :key="imagen.id" :src="imagen.url" fluid class="w-100 mt-1"/>
               
               
            </div>


           

           

         </div>
      </b-sidebar>

      <vue-gallery-slideshow :images="imagenes(habitacion_id)" :index="index" @close="index = null"></vue-gallery-slideshow>


   </div>
</template>


<script>
	
	import VdtnetTable  from 'vue-datatables-net';

	import { mapState, mapMutations, mapActions, mapGetters} from 'vuex'; 


   import {ref,toRefs} from 'vue';

   import {BButton,BSidebar,BCarousel, BCarouselSlide, BImgLazy, BImg,BButtonGroup } from 'bootstrap-vue';
   import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
   import 'swiper/css/swiper.css'
   import VueGallerySlideshow from 'vue-gallery-slideshow';
   import optionsComponents from 'mixins/optionsComponents';
	export default{

		components:{
			VdtnetTable,
         BButton,
         BSidebar,
         BCarousel,
         BCarouselSlide,
         BImgLazy,
         Swiper,
         SwiperSlide,
         BImg,
         VueGallerySlideshow,
         BButtonGroup
		},

      props:['id'],

      mixins:[optionsComponents],

		data(){
			return{
				busqueda:'',
				shownewAdministrador:false,
				rol:null,
				showDialog:false,
				


				data:{
						id     :{label:'#',sortable:false, width:"30px",responsivePriority:"1"},
						nombre   :{label:'Nombre',sortable:true},
						actions:{label:'Actions',sortable:false,width:'100px'},
					}
            

		   };
      },

      computed:{
         ...mapState('hotel',['hotel']),
         ...mapState('habitacion',['habitaciones']),
         ...mapGetters('habitacion',['imagenes'])
      },


      setup(props){

         const propiedades = toRefs(props);
         const habitacion_id = ref(null);
         const showGallery = ref(false);
         const index = ref(null);

         const swipperOptions = ref({
               effect: 'cube',
               grabCursor: true,
               autoplay: {
                  delay: 2500,
                  disableOnInteraction: false,
               },
               cubeEffect: {
                  shadow: true,
                  slideShadows: true,
                  shadowOffset: 20,
                  shadowScale: 0.94,
               },
               pagination: {
                  el: '.swiper-pagination',
               },
               
            });

         const options = ref({
               ajax:{
                       
                      url:'/api/habitacions/hotel/'+props.id+'/listar',
                     dataScr:(json) => {return json},
               },

               buttons:['csv','pdf'],
               // dom:"tr<'row vdtnet-footer'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7' pl>>",
               responsive:true,
               processing:true,
               searching:true,
               searchDelay:1500,
               destroy:false,
               ordering:true,
               lengthChange:true,
               serverSide:true,
               fixedHeader:true,
               saveState:true,
               paging:true,
               scrollY:'auto',
               autoWidth:true,
         });


         const verGaleria = (data) => {
            habitacion_id.value = data.id
            showGallery.value = true
         }


         return {
            options,
            showGallery,
            verGaleria,
            habitacion_id,
            swipperOptions,
            index
         };


      },

      created(){
         this.capturarHotel(this.id);
         this.cargarHabitaciones(this.id);

      },

		methods:{
         ...mapMutations('habitacion',['putHabitacion']),
         ...mapMutations('hotel',['capturarHotel']),
			...mapActions('habitacion',['eliminarHabitacion','cargarHabitaciones']),

			buscarTable(){

				this.$refs.table.search(this.busqueda);
			},

			recargarTabla(){
				this.cargarHabitaciones(this.id);
				this.$refs.table.reload();
				
			},


			editar(data){	

				this.$router.push({name:'edit.habitacion',params:{idhotel:this.id,id:data.id}})

			},

         verTarifas(data){
            this.$router.push({name:'habitacion.tarifas',params:{idhabitacion:data.id}});
            
         },
			eliminar(data){

				this.eliminarHabitacion(data.id).then(respon => { 
						if(respon.data.success){
							this.$notify({
								title:'Habitación Eliminada con éxito',
								type:'info'
							});

							this.putPermiso(data.id);

						}else{
							this.$notify({
								title:'No pudimos eliminar la habitación, inténtalo de nuevo mas tarde',
								type:'info',

							});

						}

				}).catch(e => {
					console.log(e);
				})

			}	


		},

		watch:{

			habitaciones(){
				this.$refs.table.reload()
			}

		}

	}

</script>