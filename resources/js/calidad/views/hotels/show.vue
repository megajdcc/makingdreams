<template>
  <div class="container-fluid">
    <!-- Header del Hotel -->
    <div class="row">
      <div class="col-12 px-0">
        <div class="detail-banner" :style="background_portada">
          <div class="container d-flex justify-content-between flex-md-wrap flex-column flex-md-row py-3">
            <div class="detail-banner-left">
              <h1 class="detail-title" v-text="hotel.nombre"></h1>
              <div class="detail-banner-address">
                <p><i class="fas fa-map mr-2"></i><strong v-html="hotel.direccion"></strong></p>
              </div>

              <div class="detail-banner-rating">
                <!-- <star-rating :rating="5" :glow="5" :star-size="30" text-class="d-none" read-only :increment="1" :max-rating="5"></star-rating>  -->
              </div>

            </div>

            <div
              class="detail-banner-right d-flex flex-column justify-content-between align-items-start align-items-md-end">
              <article class="content-log elevation-2 bg-white rounded-lg p-1">
                <img :src="`${hotel.logo}`" alt="Logo del Hotel..." class="logo_hotel rounded-lg"
                  style="width:100px;height:auto;">
              </article>

              <b-button-group size="sm">

                <b-button :to="{name:'hotel.planes',params:{idhotel:hotel.id}}" variant="primary"
                  title="Planes del hotel">
                  <feather-icon icon="ListIcon" />
                  Planes
                </b-button>

                <b-button variant="primary" :to="{name:'edit.hotel',params:{id:hotel.id}}" title="Editar Hotel"
                  v-b-tooltip.hover>
                  <feather-icon icon="EditIcon" />
                </b-button>

                <b-button variant="info" v-b-tooltip.hover title="Ver tipo de habitaciones"
                  :to="{name:'hotel.habitaciones',params:{id:hotel.id}}">
                  <feather-icon icon="ListIcon" />
                </b-button>

                <b-button variant="dark" :to="{name:'pagos.hotel',params:{id:hotel.id}}" title="Pagos al  Hotel"
                  v-b-tooltip.hover>
                  <feather-icon icon="DollarSignIcon" />
                </b-button>

              </b-button-group>



            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-7 col-lg-8 py-3 px-0 order-2 order-md-1">
        <div class="container-fluid">
          <div class="row card rounded-sm p-2">
            <div class="col-12">
              <GmapMap :center="map_position" :zoom="zoom_map" :options="options_map"
                style="width:100%; height:350px; display: flex; justify-content:center;">
                <GmapMarker :key="0" :position="map_position" :draggable='false' :clickable="true" :title="hotel.nombre"
                  :visible="visibleMarker" :icon="iconMarker">
                  <GmapInfoWindow :options="optionsPlace">
                  </GmapInfoWindow>
                </GmapMarker>
              </GmapMap>
            </div>
          </div>

          <b-row v-if="hotel.planes && hotel.planes.length">

                  <b-col cols="12" >
                    <el-divider content-position="left">Planes de Hotel</el-divider>
                  </b-col>

                  <b-col md="6" cols="12"  v-for="(plan,i) in hotel.planes" :key="i">
                    <b-jumbotron bg-variant="dark" header-tag="h3" lead-tag="h3" text-variant="primary" header-level="5" class="p-2">

                      <template #header>
                        <h6 class="text-white">{{ plan.plan }}</h6>
                      </template>

                      <small class="text-white text-justify">{{ plan.descripcion }}</small>

                    </b-jumbotron>

                  </b-col>

          </b-row>


          <!-- <el-divider content-position="left">Bodas en el Hotel</el-divider>
          <div class="row card rounded-sm p-2">
            <div class="col-12">
              <FullCalendar :options="configBodas"></FullCalendar>
            </div>
          </div> -->

        </div>
      </div>

      <div class="col-12 col-md-5 col-lg-4 py-3 order-1 order-md-2">
        <div class="container-fluid">

          <div class="row">
            <div class="col-12 mb-1">
              <h2>Sobre <strong class="text-primary">{{ hotel.nombre }}</strong></h2>
              <el-divider></el-divider>
            </div>
          </div>

          <div class="row card rounded-sm ">
            <div class="col-12">
              <div class="container-fluid px-0">

                <div class="row">

                  <div class="col-12 col-sm-4 col-md-12 col-lg-4 px-0">
                    <article class="content-logo h-100 d-flex justify-content-center">
                      <img :src="hotel.logo" alt="Logo del Hotel..." class="logo_hotel rounded-lg"
                        style="width:100px;height:auto; object-fit:contain">
                    </article>
                  </div>

                  <div class="col-12 col-sm-8 col-md-12 col-lg-8">
                    <table class="table table-hover table-sm w-100 table-borderless">

                      <tr>
                        <td><span class="fas fa-globe"></span></td>
                        <td><a :href="hotel.website" target="_blank">{{ hotel.website }}</a></td>
                      </tr>

                      <tr>
                        <td><span class="fas fa-map"></span></td>
                        <td v-html="hotel.direccion"></td>
                      </tr>

                      <tr v-if="hotel.telefonos.length">
                        <td><span class="fas fa-phone"></span></td>
                        <td v-html="hotel.telefonos[0].telefono"></td>
                      </tr>


                      <tr>

                        <td colspan="2" class="text-center">
                          <el-button circle size="mini" v-b-tooltip.hover title="Twitter" type="primary"
                            v-if="hotel.redes && hotel.redes.twitter" @click="irUrl('twitter')">
                            <feather-icon icon="TwitterIcon" />
                          </el-button>

                          <el-button circle size="mini" v-b-tooltip.hover title="Facebook" type="primary"
                            v-if="hotel.redes && hotel.redes.facebook" @click="irUrl('facebook')">
                            <feather-icon icon="FacebookIcon" />
                          </el-button>

                          <el-button circle size="mini" type="primary" v-b-tooltip.hover title="Instagram"
                            v-if="hotel.redes && hotel.redes.instagram" @click="irUrl('instagram')">
                            <feather-icon icon="InstagramIcon" />
                          </el-button>


                        </td>
                      </tr>

                    </table>



                  </div>
                </div>

                <b-row v-if="hotel.breve">
                  <b-col>
                    <p class="text-center ">{{ hotel.breve }}</p>
                  </b-col>
                </b-row>

                 <b-row v-if="hotel.amenidades && hotel.amenidades.length">

                  <b-col md="12">
                    <el-divider content-position="left">Amenidades</el-divider>
                  </b-col>

                  <b-col md="12">

                    <b-form-checkbox-group  :checked="hotel.amenidades.map(val => val.id)" :options="hotel.amenidades.map(val => { return {
                      text:val.nombre,
                      value:val.id,
                      disabled:true
                    }})"></b-form-checkbox-group>

                  </b-col>

                </b-row>


                <!-- <b-row v-if="hotel.planes && hotel.planes.length">

                  <b-col md="12">
                    <el-divider content-position="left">Planes de Hotel</el-divider>
                  </b-col>

                  <b-col md="12" v-for="(plan,i) in hotel.planes" :key="i">
                    <b-jumbotron bg-variant="dark" header-tag="h3" lead-tag="h3" text-variant="primary" header-level="5" class="p-2">

                      <template #header>
                        <h6 class="text-white">{{ plan.plan }}</h6>
                      </template>

                      <small class="text-white text-justify">{{ plan.descripcion }}</small>

                    </b-jumbotron>

                  </b-col>

                </b-row> -->

                <div class="row" v-if="hotel.get_coordinador">

                  <div class="col-12">
                    <el-divider content-position="left"><strong>Coordinador del hotel</strong></el-divider>
                  </div>

                  <div class="col-12">

                    <b-card no-body class="overflow-hidden">

                      <div class="row">
                        <div class="col-12 col-md-4">
                          <b-card-img style="max-width:100px" :src="hotel.get_coordinador.avatar"
                            :alt="hotel.get_coordinador.nombre" />
                        </div>

                        <div class="col-12 col-md-8 py-1 d-flex flex-column justify-content-between">
                          <h4 class="mb-0 text-center">
                            {{ hotel.get_coordinador.nombre + ' ' +hotel.get_coordinador.apellido }}
                          </h4>
                          <div class="row">
                            <div class="col-6 border-right d-flex flex-column justify-content-around align-items-center"
                              v-if="hotel.get_coordinador.telefono">
                              <span class="fas fa-mobile"></span>
                              <a :href="'tel:'+hotel.get_coordinador.telefono" target="_blank">{{
                                hotel.get_coordinador.telefono }}</a>
                            </div>
                            <div class="col-6 d-flex flex-column justify-content-around align-items-center">
                              <span class="fas fa-envelope"></span>
                              <a :href="'mailto:'+hotel.get_coordinador.email" target="_blank">{{
                                hotel.get_coordinador.nombre }}</a>
                            </div>
                          </div>
                        </div>

                      </div>

                    </b-card>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <div class="row" v-if="hotel.id && hotel.imagenes.length">
            <div class="col-12 swipper">
              <swiper class="swiper swiper-autoplay" :options="swipperOptions"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" @click="ingresarIndex">
                <swiper-slide v-for="(imagen,index) in imagenes()" :key="index">

                  <b-img :src="imagen.url" fluid thumbnail />

                </swiper-slide>
                <div slot="pagination" class="swiper-pagination swiper-pagination-white" />
              </swiper>

              <small>Al hacer click sobre la imagen, se expande la galeria.</small>

            </div>
          </div>


        </div>
      </div>

    </div>

    <b-row>
      <b-col cols="12">
        <b-button-group size="sm">
          <b-button @click="regresar">
            <feather-icon icon="ArrowLeftIcon" />
            Regresar
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <vue-gallery-slideshow :images="imagenes()" :index="index" @close="index = null"></vue-gallery-slideshow>
  </div>

</template>

<script>

import { ref,onMounted,watch, toRefs,computed } from 'vue'
import store from '@/store'
import {mapState} from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import Ripple from 'vue-ripple-directive'
import 'animate.css';

import FullCalendar from '@fullcalendar/vue';

import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

import optionsComponents from 'mixins/optionsComponents';

import {
  BCard,
  BCardImg,
  VBTooltip,
  BImg,
  BButton,
  BButtonGroup,
  BRow,
  BCol,
  BJumbotron,
  BFormCheckboxGroup
 
} from 'bootstrap-vue';

export default {
   props:['id'],


   components:{
      'VueGallerySlideshow':()=> import('vue-gallery-slideshow'),
      BCard,
      BCardImg,
      Swiper,
      SwiperSlide,
      BImg,
       FullCalendar,
       BButton,
     BJumbotron,
  BButtonGroup,
  BRow,
  BCol,
  BFormCheckboxGroup

   },
   directives:{
     'b-tooltip':VBTooltip,
     Ripple
   },

   mixins:[optionsComponents],

    data(){
      return{
        zoom_map:14,
        ano:moment(Date.now()).format('YYYY'),
        coord:{
          lat:10,
          lng:10,
        },
        visibleMarker:true, 
        markers:[],
          options_map:{
            mapTypeControl:true,
            zoomControl:true,
        },
      }
    },

    computed:{

      map_position(){

            if(this.hotel.id){
              return {
                lat:Number(this.hotel.lat),
                lng:Number(this.hotel.lng),
              }
              this.markers = {
                lat:Number(this.coord.lat),
                lng:Number(this.coord.lng),
              }

            }else{
              return {
                lat:10,
                lng:10,
              }
            }
      },


      iconMarker(){
        
        // return {
        //     // url: place.icon,
        //     size: new google.maps.Size(71, 71),
        //     origin: new google.maps.Point(0, 0),
        //     anchor: new google.maps.Point(17, 34),
        //     scaledSize: new google.maps.Size(35, 35)
        // };
        return '';
      },


      optionsPlace(){
        return {content:`<div><strong>${this.hotel.nombre}</strong><br>${this.hotel.direccion}`}
      },

      configOptions(){
        return{
          height     : 450,
          locale     :esLocale,
          aspectRatio:1.5,
          plugins    :[ dayGridPlugin, interactionPlugin ],
          defaultView:'dayGridMonth',
          selectable :false,
          events     :this.bodas,
        }
      },

      eventHandlers(){
        return{
          eventClick:this.verBoda,
        }
      },

      configBodas(){
        return{
          ...this.configOptions,
            ...this.eventHandlers,
        }
      },

   },


   methods:{
     verBoda(arg){

        this.$swal({
            title: arg.event.title,
            text: arg.event.extendedProps.descripcion,
            icon: 'info',
            customClass: {
                confirmButton: 'btn btn-primary',
            },

            showClass: {
                popup: 'animate__animated animate__tada',
            },

            buttonsStyling: false,
            })
     }
   },

   setup(props){
      const {id} = toRefs(props);
      const bodas = ref([]);
      const { hoteles } = toRefs(store.state.hotel)
      const hotel = computed(() => store.state.hotel.hotel)
      const background_portada = ref('')

      const cargarForm = () => {
         
         if(hoteles.value.length){
            
            store.commit('hotel/capturarHotel',Number(id.value));

            if(hotel.value.id){
              
              if(hotel.value.imagenes.length){
                let imagen = '/storage/hotel/imagenes/' + hotel.value.imagenes[0].imagen
                background_portada.value = `background-image:url(${imagen})`;
              }
             

              if (hotel.value.bodas.length) {
                  bodas.value = hotel.value.bodas.map(val => {
                    return {
                      title: `Boda de ${val.novios.novia} & ${val.novios.novio}`,
                      start: val.check_in + ' 00:00',
                      end: val.check_out + ' 23:59',
                      backgroundColor: colorRand(),
                      className: 'eventClass',
                      descripcion: `Habitaciones habilitadas:${val.hab_habilitadas}`,
                      id: val.id,
                      allDay: true
                    };
                  })
              }

            }

            

         }

        
      }

      onMounted(() => {
         cargarForm();
      })

      watch([id,hoteles] ,() => {
        cargarForm();
      })



      const index = ref(null);

      const irUrl = (red) => {

         switch (red) {
            case 'twitter':
              window.location.href = hotel.value.redes.twitter
               break;

            case 'facebook':
               window.location.href = hotel.value.redes.facebook
               break;

             case 'instagram':
               window.location.href =  hotel.value.redes.instagram
               break;

         }
         
      }

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
      
      const imagenes = () => {
         let imagenes = (hotel.value.imagenes.length) ? hotel.value.imagenes : [];

         return imagenes.map(val => {
            return {url:`/storage/hotel/imagenes/${val.imagen}`}
         });

      }

      const ingresarIndex = (swip) => {
         index.value = 0
      }

    

      return {
         hotel,
         cargarForm,
         background_portada,
         index,
         irUrl,
         swipperOptions,
         imagenes,
         ingresarIndex,
         bodas,
        hoteles
      }

   }

}
</script>

<style lang="scss" scoped>

  .detail-banner {

    background-position: center center;
    background-size: 100% auto;
    height: 250px;
    position: relative; 
    
    }
    
    @media (max-width: 767px) {
      .detail-banner {
        height: 400px;
        background-size: 100% 100%; 
      } 
    }
    
    .detail-banner:before {
      background: -webkit-linear-gradient(to right, rgba(0, 0, 0, 0.3) -10%, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0.5) 40%, transparent 80%);
      background: -moz-linear-gradient(to right, rgba(0, 0, 0, 0.3) -10%, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0.5) 40%, transparent 80%);
      background: linear-gradient(to right, rgba(0, 0, 0, 0.3) -10%, rgba(0, 0, 0, 0.5) 20%, rgba(0, 0, 0, 0.5) 40%, transparent 80%);
      bottom: 0px;
      content: '';
      left: 0px;
      position: absolute;
      right: 0px;
      top: 0px;
      z-index: 2; 

    }
    
    .detail-banner .container {
      height: 100%;
      position: relative; 
    }

    .detail-banner .detail-banner-left, .detail-banner .detail-banner-right {
      z-index: 3; 
    }

    @media (max-width: 767px) {
        .detail-banner .detail-banner-left, .detail-banner .detail-banner-right {
        } 
    }
    
    .detail-banner .detail-banner-left {

    }

    .detail-banner .detail-banner-right {
      align-self:stretch;
    }
    .detail-banner h1 {
      color: #fff;
      font-size: 36px;
      text-shadow: 0px 0px 20px #000;
      margin-bottom: 10px; 
    }
    
    @media (max-width: 767px) {
      .detail-banner h1 {
          font-size: 30px; 
        } 
    }
    
    .detail-banner .detail-banner-address {
      color: #fff;
      font-weight: 300;
      text-shadow: 0px 0px 20px #000; 
    }
    
    .detail-banner .detail-banner-address i {
        margin-right: 10px; 
    }
    
    .detail-banner .detail-banner-rating {
      color: #ffd925;
      font-size: 21px;
      margin-top: 10px;
      text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5); 
    }
    
    .detail-banner .detail-banner-btn {
      text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
      border: 1px solid #fff;
      color: #fff;
      display: inline-block;
      margin-top: 20px;
      margin-right: 20px;
      padding: 9px 15px;
      cursor: pointer;
      transition: all linear .15s;
    }

    .btn-reserva{
        background: transparent;
        margin: 0px;
        width: 100px;
        flex: 0 1 250px;
    }
    
    .content-btn-reserva{
      display: flex;
      justify-content: flex-start;
    }

    .content-btn-reserva .detail-banner-btn {
        text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        border: 1px solid #fff;
        color: #fff;
        display: inline-block;
        margin-top: 20px;
        margin-right: 20px;
        padding: 9px 15px;
        cursor: pointer;
        transition: all linear .15s;
    }

    .detail-banner .detail-banner-btn i {
        font-size: 16px;
        margin-right: 5px; 
    }
    
    .detail-banner .detail-banner-btn:hover,
    .content-btn-reserva .detail-banner-btn:hover{
        background-color: #fff;
        color: #363636;
        text-shadow: none; 
    }
    
    .detail-banner .detail-banner-btn.heart.marked {
        background-color: #fff;
        color: #444;
        text-shadow: none; 
    }
    
    .detail-banner .detail-banner-btn.heart.marked i:before {
        content: "\f004";
        color: #d81814; 

    }
    
    .detail-banner .detail-banner-btn.bookmark.marked {
        background-color: #fff;
        color: #444;
        text-shadow: none; 
    }
    
    .detail-banner .detail-banner-btn.bookmark.marked i:before {
        content: "\f02e";
        color: #0082b7; 
    }

</style>