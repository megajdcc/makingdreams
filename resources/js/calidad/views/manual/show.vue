<template>
   <!-- content -->
   <div class="blog-detail-wrapper">
      <b-overlay :show="loading">
         <b-row>
            <!-- blogs -->
            <b-col cols="12" v-if="pagina.id">
               <b-card :title="pagina.titulo">
                  <template #header v-if="pagina.id && pagina.categoria">
                     <b-carousel id="carousel-1" :interval="4000" background="#ababab"
                        style="text-shadow: 1px 1px 2px #333;" controls>

                        <b-carousel-slide v-for="(categoria,i) in pagina.categorias" :key="i"
                           :img-src="`/storage/banner/categoria/${categoria.banner}`">
                        </b-carousel-slide>

                     </b-carousel>

                  </template>

                  <b-media no-body>
                     <b-media-aside vertical-align="center" class="mr-50">
                        <b-avatar href="javascript:void(0)" size="24" :src="pagina.usuario.avatar" />
                     </b-media-aside>
                     <b-media-body>
                        <small class="text-muted mr-50">por</small>
                        <small>
                           <b-link class="text-body">{{ `${pagina.usuario.nombre} ${pagina.usuario.apellido} ` }}
                           </b-link>
                        </small>
                        <span class="text-muted ml-75 mr-50">|</span>
                        <small class="text-muted">{{ pagina.created_at | fecha }}</small>
                     </b-media-body>
                  </b-media>

                  <div class="my-1 py-25">
                     <b-link v-if="pagina.id && pagina.categorias.length">
                        <b-badge pill class="mr-75" variant="primary" v-for="(categoria,i) in pagina.categorias" :key="i">
                           {{ categoria.nombre }}
                        </b-badge>
                     </b-link>
                  </div>
                  <!-- eslint-disable vue/no-v-html -->
                  <div class="blog-content" v-html="pagina.contenido" />
               </b-card>
            </b-col>
         </b-row>

         <b-row>
            <b-col cols="12">
               <b-button-group size="sm">
                  <b-button @click="regresar" variant="dark">
                     <feather-icon icon="ArrowLeftIcon" />
                     Regresar
                  </b-button>
               </b-button-group>
            </b-col>
         </b-row>
      </b-overlay>
   </div>
</template>

<script>

import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BForm,
   BButton,
   BMedia,
   BMediaAside,
   BAvatar,
   BMediaBody,
   BLink,
   BBadge,
   BOverlay,
   BButtonGroup,
   BCarousel,
   BCarouselSlide
} from 'bootstrap-vue'

import {ref,computed,onMounted,watch,toRefs } from 'vue'
import store from '@/store'
import router from '@/router'

import { regresar } from '@core/utils/utils'

import ability from '@/libs/acl/ability'
export default {

   components:{
      BCard,
      BContainer,
      BRow,
      BCol,
      BForm,
      BButton,
      BMedia,
      BMediaAside,
      BAvatar,
      BMediaBody,
      BLink,
      BBadge,
      BOverlay,
      BButtonGroup,
      BCarousel,
      BCarouselSlide


   },

   props:['ruta'],


   setup(props) {
      
      const {ruta} = toRefs(props)

      const {pagina,paginas} = toRefs(store.state.pagina)

      const cargarForm = () => {
         
         store.dispatch('pagina/getPaginaPorRuta', ruta.value).then((page) => {
            // if (!ability('read',page.permiso.nombre)){
            // console.log('no tienes permisos')
            //   regresar()
            // }

         });

      }

      onMounted(() => cargarForm())
      watch([ruta,paginas],() => cargarForm());

      return {
         pagina,
         regresar,
         loading:computed(() => store.state.loading)
      }
   },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-blog.scss';

.blog-content img {
   max-width: 100%;
}

.card-img-top{
   flex-shrink: 0;
   width: 100%;
   max-height: 300px;
   object-fit: cover;
   object-position: center center;
}
.ql-video{
   width: 100%;
   max-height: 500px;
   height: 400px;
}

</style>

