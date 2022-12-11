<script>

import form from './form'

import {h,onMounted,toRefs,watch} from 'vue'
import store from '@/store'
import router from '@/router'

export default {
   
   props: ['entrega_id'],

   setup(props) {

      const { entrega_id } = toRefs(props)

      onMounted(() => {
         
         store.commit('orden/clear')
         store.commit('orden/setEntrega', Number(entrega_id.value))

      })

      watch(entrega_id,(val) => {
         store.commit('orden/setEntrega', Number(entrega_id.value))
      })

      
      return () => h(form,{

         on:{

            save(data,formValidate){

               store.dispatch('orden/guardar',data).then(({result,orden}) => {
                  
                  if(result){
                     toast.success('Se ha generado con éxito la orden de entrega, Hemos notificados al cliente y al chofer que procedan a firmarla digitalmente, para dar inicio al proceso de despacho')
                     router.push({name:'show.orden',params:{id:orden.id}})
                  }else{
                     toast.info('No se pudo generar la orden de entrega, inténtelo de nuevo mas tarde')
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