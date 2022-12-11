<template>
  <div id="app" class="h-100" :class="[skinClasses]">
    <component :is="layout">
      <router-view />
    </component>
    <scroll-to-top v-if="enableScrollToTop" />
  </div>
</template>

<script>

  import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'

  import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'

  import { watch,onMounted,computed,ref } from 'vue'

  import useAppConfig from '@core/app-config/useAppConfig'

  import { useWindowSize, useCssVar } from '@vueuse/core'

  import store from '@/store'

  import {Notification} from 'element-ui'

  import { useRoute } from 'vue2-helpers/vue-router';

  import LayoutHorizontal from '@/layouts/horizontal/LayoutHorizontal.vue';
  import LayoutVertical from '@/layouts/vertical/LayoutVertical.vue';
  import LayoutFull from '@/layouts/full/LayoutFull.vue';

  export default{

    components:{
      LayoutHorizontal,
      LayoutVertical,
      LayoutFull,
      ScrollToTop
    },
    

    beforeCreate(){
      // Set colors in theme
      const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

      // eslint-disable-next-line no-plusplus

      colors.forEach((val, i) => {
        $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
      })

      // for (let i = 0; i < colors.length; i++) {
      //   $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
      // }

      // Set Theme Breakpoints
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

      // eslint-disable-next-line no-plusplus
      // for (let i = 0; i < breakpoints.length; i++) {
      //   $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
      // }

      breakpoints.forEach((val, i) => {
        $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
      })
    },


    computed:{

      contentLayoutType(){
        return this.$store.state.appConfig.layout.type
      },

      layout(){
        if (this.$route.meta.layout === 'full') {
          return 'layout-full'
        } else {
          return `layout-${this.contentLayoutType}`
        }
      }

    },


    setup(){
      const { skin, skinClasses } = useAppConfig()
      const { enableScrollToTop } = $themeConfig.layout

      // If skin is dark when initialized => Add class to body
      if (skin.value === 'dark') document.body.classList.add('dark-layout')

      // Set Window Width in store
      store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
      const { width: windowWidth } = useWindowSize()

      watch(windowWidth, (val) => {
        store.commit('app/UPDATE_WINDOW_WIDTH', val)
      })

      onMounted(() => {

       
        
        if (localStorage.getItem('token')) {
          store.commit('usuario/cargarUser', JSON.parse(localStorage.getItem('userData')));
        }

      })

      return {
        skinClasses,
        skin,
        enableScrollToTop
      }
      
    }


  }

 


  
  
</script>

