<script>

import form from './form.vue'

import {h,onMounted, toRefs,watch} from 'vue';


import store from '@/store'

export default {

  props:['id'],
  
  setup(props ){
    
    const {id} = toRefs(props)
    const {etapas} = toRefs(store.state.etapa)

    const cargarForm = () => {
      if(!etapas.value.length){
        store.dispatch('etapa/fetch',id.value)
      }else{
        store.commit('etapa/capturar',id.value)

      }
    }

    onMounted(() => cargarForm())
    watch([id,etapas],() => cargarForm())

    
    return () => h(form,{
        on:{
          save:(datos,formValidate) => {
            store.dispatch('etapa/guardar',datos).then(({result,etapa})  => {
              if(result){
                toast.success('Se ha actualizado con éxito la etapa',{position:'bottom-right'})
             
              }else{
                toast.info('No se pudo actualizar la etapa, inténte de nuevo', { position: 'bottom-right' })

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