<script>
import {h,onMounted} from 'vue'

import store from '@/store'
import router from '@/router'


import form from './form'

export default {
   setup() {
      
      onMounted(() => {
         store.commit('pagina/clear')
      })

      return () => h(form,{

            on:{

               save:(data,formValidate) => {

                  store.dispatch('pagina/guardar',data).then(({result,pagina}) => {
                     if(result){
                        toast.success('Se ha creado con éxito la pagina')
                        router.push({name:'edit.pagina',params:{id:pagina.id}})
                     }else{
                        toast.info('No se pudo registrar la pagina, inténtelo de nuevo mas tarde')
                     }

                  }).catch(e => {
                     console.log(e)
                     if(e.response.status === 422){
                        formValidate.setErrors(e.response.data.errors)
                     }

                  })

               }
            }


      })

   },
}
</script>