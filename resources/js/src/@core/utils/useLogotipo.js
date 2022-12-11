
import store from '@/store'
import {onMounted,computed,toRefs,ref,watch} from 'vue'
import useAppConfig from '@core/app-config/useAppConfig'


export default function useLogotipos(){

   const {sistema} = toRefs(store.state.sistema)

   const logo_fondo_claro = ref(localStorage.getItem('sistema') ? `/storage/logotipos/${JSON.parse(localStorage.getItem('sistema')).logotipo_claro}` : null)

   const logo_fondo_oscuro = ref(localStorage.getItem('sistema') ? `/storage/logotipos/${JSON.parse(localStorage.getItem('sistema')).logotipo_oscuro}` : null)


   onMounted(() => {
      if(!logo_fondo_claro.value){
         
         store.dispatch('sistema/fetch').then(() => {
            logo_fondo_claro.value = `/storage/logotipos/${sistema.value.logotipo_claro}`
            logo_fondo_oscuro.value = `/storage/logotipos/${sistema.value.logotipo_oscuro}`

         })

      }

   })

   watch(sistema,() => {
      logo_fondo_claro.value = `/storage/logotipos/${sistema.value.logotipo_claro}`
      logo_fondo_oscuro.value = `/storage/logotipos/${sistema.value.logotipo_oscuro}`
   })



   const {
      skin 
   } = useAppConfig()


   return {
      logotipo : computed(() => {
         return ['dark', 'semi-dark'].includes(skin.value) ? logo_fondo_oscuro.value : logo_fondo_claro.value
      } )

   }

   

}