<script>

import form from './form.vue'

import {h,computed,onMounted, toRefs} from 'vue';


import store from '@/store'
import router from '@/router'

export default {

  
  setup(){
    
    onMounted(() => store.commit('etapa/clear'))

    return () => h(form,{
        on:{
          save:(datos,formValidate) => {
            store.dispatch('etapa/guardar',datos).then(({result,etapa})  => {
              if(result){
                toast.success('Se ha guardado con éxito la etapa',{position:'bottom-right'})
                router.push({name:'etapa.edit',params:{id:etapa.id}})
              }else{
                toast.info('No se pudo guardar la etapa, inténte de nuevo', { position: 'bottom-right' })

              }
            }).catch(e => {
              if(e.response.status === 422){
                formValidate.setErrors(e.response.data.errors)
              }

              console.log(e)

            })
          }

        }
    })
  }
}
</script>