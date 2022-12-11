<template>
   <div class="container-fluid">
      <!-- Header del Hotel -->
      <div class="row">
         <div class="col-12 px-0">
            <div class="detail-banner" :style="background_portada">
               <div class="container d-flex justify-content-between flex-md-wrap flex-column flex-md-row py-3">
                  <div class="detail-banner-left">
                     <h1 class="detail-title" v-text="compania.nombre"></h1>
                     <div class="detail-banner-address">
                        <p><i class="fas fa-map mr-2"></i><strong v-html="compania.direccion"></strong></p>
                     </div>

                     <div class="detail-banner-rating">
                        <!-- <star-rating :rating="5" :glow="5" :star-size="30" text-class="d-none" read-only :increment="1" :max-rating="5"></star-rating>  -->
                     </div>

                  </div>

                  <div
                     class="detail-banner-right d-flex flex-column justify-content-between align-items-start align-items-md-end">
                     <article class="content-log elevation-2 bg-white rounded-lg p-1">
                        <img :src="`/storage/companias/logos/${compania.logo}`" alt="Logo de la compañia..."
                           class="logo_hotel rounded-lg" style="width:100px;height:auto;">
                     </article>

                     <b-button-group size="sm">

                        <b-button v-b-tooltip.hover.v-primary title="Ver Empleados" v-if="$can('update','compañias')"
                           variant="secondary" :to="{name:'compania.empleados',params:{id:compania.id}}">
                           <feather-icon icon="UsersIcon" />
                           Empleados
                        </b-button>

                        <b-button v-b-tooltip.hover.v-primary title="Editar Registro" variant="primary"
                           v-if="$can('update','compañias')" :to="{name:'edit.compania',params:{id:compania.id}}">
                           <feather-icon icon="EditIcon" />
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
                        <GmapMarker :key="0" :position="map_position" :draggable='false' :clickable="true"
                           :title="compania.nombre" :visible="visibleMarker" :icon="iconMarker">
                           <GmapInfoWindow :options="optionsPlace">
                           </GmapInfoWindow>
                        </GmapMarker>
                     </GmapMap>
                  </div>
               </div>

            </div>
         </div>

         <div class="col-12 col-md-5 col-lg-4 py-3 order-1 order-md-2">
            <div class="container-fluid">

               <div class="row">
                  <div class="col-12 mb-1">
                     <h2>Sobre <strong class="text-primary">{{ compania.nombre }}</strong></h2>
                     <el-divider></el-divider>
                  </div>
               </div>

               <div class="row card rounded-sm ">
                  <div class="col-12">
                     <div class="container-fluid px-0">

                        <div class="row">

                           <div class="col-12 col-sm-4 col-md-12 col-lg-4 px-0">
                              <article class="content-logo h-100 d-flex justify-content-center">
                                 <img :src="`/storage/companias/logos/${compania.logo}`" alt="Logo de la compañía..."
                                    class="logo_hotel rounded-lg" style="width:100px;height:auto; object-fit:contain">
                              </article>
                           </div>

                           <div class="col-12 col-sm-8 col-md-12 col-lg-8">
                              <table class="table table-hover table-sm w-100 table-borderless">

                                 <tr>
                                    <td><span class="fas fa-map"></span></td>
                                    <td v-html="compania.direccion"></td>
                                 </tr>

                                 <tr v-if="compania.telefono">
                                    <td><span class="fas fa-phone"></span></td>
                                    <td v-html="compania.telefono"></td>
                                 </tr>

                              </table>

                           </div>
                        </div>

                        <b-row v-if="compania.breve">
                           <b-col>
                              <p class="text-center ">{{ compania.breve }}</p>
                           </b-col>
                        </b-row>



                     </div>
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
   </div>

</template>

<script>

import { ref,onMounted,watch, toRefs,computed } from 'vue'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import 'animate.css';
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
      BCard,
      BCardImg,
      BImg,
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


    setup(props){
       const { id } = toRefs(props);
       const { compania,companias } = toRefs(store.state.compania)

       const cargarForm = () => {
         if(companias.value.length){
            store.commit('compania/capturar',Number(id.value))
         }else{
            store.dispatch('compania/fetchCompania',Number(id.value)).then((data) => {
               store.commit('compania/capturar',Number(id.value))
            })
         }

        
       } 


       onMounted(() => {
         cargarForm()
       })



       return {
         background_portada:computed(() => {
            return `background-image:url(/storage/companias/portadas/${compania.value.portada})`;
         }),
         compania,
         map_position:computed(() => {

            if(compania.value.id){
               return {
                  lat: Number(compania.value.lat),
                  lng: Number(compania.value.lng),
               }
            }else{
               return {
                  lat: 10,
                  lng: 10,
               }
            }
           
          }),
          iconMarker:computed(() => {
            return ''
          }),

          optionsPlace:computed(() => {
             return { content: `<div><strong>${compania.value.nombre}</strong><br>${compania.value.direccion}` }
          })


       }
    },
 
}
</script>

<style lang="scss" scoped>

  .detail-banner {

      background-position: center center;
      background-size: cover;
      height: 250px;
      position: relative;
      background-repeat: no-repeat;
    
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