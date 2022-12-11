<template>
   <div>
      <section id="faq-search-filter">
         <b-card no-body class="faq-search"
            :style="{ backgroundImage: `url(${require('@/assets/images/banner/banner.png')})` }">
            <b-card-body class="text-center">
               <h2 class="text-primary">
                  Puedes buscar cualquier página registrada
               </h2>
               <b-card-text class="mb-2">
                  o elige también filtrar por categoría
               </b-card-text>

               <!-- form -->
               <b-form class="faq-search-input">
                  <b-container fluid>
                     <b-row>
                        <b-col cols="12" md="4">
                           <per-page v-model="perPage" :perPageOptions="perPageOptions" />
                        </b-col>

                        <b-col cols="12" md="4">
                           <el-select v-model="categoria_id" class="w-100" filterable clearable="" size="small"
                              placeholder="Categoría">
                              <el-option v-for="(categoria,i ) in categorias.filter(val => $can('read',val.permiso.nombre))" :key="i" :label="categoria.nombre"
                                 :value="categoria.id"></el-option>
                           </el-select>
                        </b-col>

                        <b-col cols="12" md="4">
                           <b-input-group class="input-group-merge" size="sm">
                              <b-input-group-prepend is-text>
                                 <feather-icon icon="SearchIcon" />
                              </b-input-group-prepend>
                              <b-form-input id="searchbar" v-model="searchQuery" placeholder="Buscar pagina..." />
                           </b-input-group>
                        </b-col>

                     </b-row>
                  </b-container>

               </b-form>
               <!-- form -->
            </b-card-body>
         </b-card>
      </section>

      <section id="faq-tabs">
         <b-container fluid class="px-0">

            <b-row>
               <b-col cols="12">
                  <b-overlay :show="loading">
                     <b-container fluid class="blog-wrapper px-0">
                        <b-row class="blog-list-wrapper">
                           <b-col v-for="pagina in paginas" md="4" sm="6" :key="pagina.id">
                              <b-card tag="article" no-body>
                                 <b-link :to="{ name: 'show.pagina', params: { ruta: pagina.ruta } }">

                                    <b-carousel id="carousel-1" :interval="4000" background="#ababab"
                                       style="text-shadow: 1px 1px 2px #333;">

                                       <b-carousel-slide v-for="(categoria,i) in pagina.categorias" :key="i"
                                          :img-src="`/storage/banner/categoria/${categoria.banner}`">
                                       </b-carousel-slide>

                                    </b-carousel>

                                 </b-link>
                                 <b-card-body>
                                    <b-card-title>
                                       <b-link :to="{ name: 'show.pagina', params: { ruta: pagina.ruta } }"
                                          class=" blog-title-truncate text-body-heading">
                                          {{ pagina.titulo }}
                                       </b-link>
                                    </b-card-title>
                                    <b-media no-body>
                                       <b-media-aside vertical-align="center" class="mr-50">
                                          <b-avatar href="javascript:void(0)" size="24" :src="pagina.usuario.avatar" />
                                       </b-media-aside>
                                       <b-media-body>
                                          <small class="text-muted mr-50">Por</small>
                                          <small>
                                             <b-link class="text-body">{{ `${pagina.usuario.nombre}
                                                ${pagina.usuario.apellido}` }}</b-link>
                                          </small>
                                          <span class="text-muted ml-75 mr-50">|</span>
                                          <small class="text-muted">{{ pagina.created_at | fecha }}</small>
                                       </b-media-body>
                                    </b-media>
                                    <div class="my-1 py-25" v-if="pagina.categorias.length">
                                       <b-badge pill class="mr-75" variant="primary" v-for="(categoria,i) in pagina.categorias" :key="i">
                                          {{ categoria.nombre }}
                                       </b-badge>
                                    </div>
                                    <!-- <b-card-text class="blog-content-truncate">
                                          {{ blog.excerpt }}
                                       </b-card-text> -->

                                 </b-card-body>
                              </b-card>
                           </b-col>
                        </b-row>
                     </b-container>
                  </b-overlay>
               </b-col>
            </b-row>
            <b-row>
               <b-col cols="12">
                  <b-card>
                     <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage.sync="perPage"
                        :total="total" />
                  </b-card>
               </b-col>
            </b-row>
         </b-container>


      </section>
   </div>

</template>

<script>

import {
   BCard,
   BCardBody,
   BCardText,
   BForm,
   BInputGroup,
   BInputGroupPrepend,
   BFormInput,
   BTabs,
   BImg,
   BTab,
   BNav,
   BCollapse,
   BFormRadioGroup,
   VBToggle,
   BContainer,
   BRow,
   BCol,
   BOverlay,
   BCardTitle,
   BLink,
   BMedia,
   BMediaBody,
   BMediaAside,
   BAvatar,
   BBadge,
   BCarousel,
   BCarouselSlide


} from 'bootstrap-vue'

import {ref,computed, onMounted} from 'vue'

import store from '@/store'

import useListManual from './useListManual'

export default {

   components:{
      BCard,
      BCardBody,
      BCardText,
      BForm,
      BLink,
      BInputGroup,
      BInputGroupPrepend,
      BFormInput,
      BTabs,
      BImg,
      BTab,
      BCollapse,
      BFormRadioGroup,
      BContainer,
      BBadge,
      BRow,
      BCol,
      BMedia,
      BCardTitle,
      BOverlay,
      PerPage:() => import('components/PerPage'),
      PaginateTable: () => import('components/PaginateTable'),
      BMediaBody,
      BMediaAside,
      BAvatar,
      BCarousel,
      BCarouselSlide



   },
   directives:{
      'b-toggle' : VBToggle
   },


   setup() {
      
      const categorias = computed(() => store.state.categoria.categorias)

      const slide = ref(0)
      onMounted(() => {
         
         if(!categorias.value.length){

            store.dispatch('categoria/getCategorias')
         }

      })
      const {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         total,
         dataMeta,
         fetchData,
         refetchData,
         paginas,
         categoria_id
      } = useListManual();
     
      onMounted(() => {
         refetchData()
      })


      return {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         total,
         dataMeta,
         fetchData,
         refetchData,
         paginas,
         categoria_id,
         loading:computed(() => store.state.loading),
         categorias,
         slide
      }
   },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-blog.scss';
   .faq-search{
      background-position: center center;
      background-size: cover;
   }
</style>