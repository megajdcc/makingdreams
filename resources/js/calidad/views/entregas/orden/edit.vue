<script>

import form from './form'

import { h, onMounted, toRefs, watch,toRef } from 'vue'
import store from '@/store'
import router from '@/router'

export default {

   props: ['orden_id'],

   setup(props) {
      
      
      const { ordenes } = toRefs(store.state.orden)

      const {orden_id:orden} = toRefs(props)


      const cargarForm = () => {
         if(!ordenes.value.length){

            store.dispatch('orden/fetchOrden',orden.value).then((data) => {
               store.commit('orden/setOrden',data)
            })


         }else{
            store.commit('orden/capturar',orden.value)
         }


      }


      onMounted(() => {

         cargarForm()

      })

      watch([orden,ordenes], (val) => {
       cargarForm()
      })


      return () => h(form, {

         on: {

            save(data, formValidate) {

               store.dispatch('orden/guardar', data).then(({ result, orden:ord }) => {

                  if (result) {
                     toast.success('Se ha actualizado con éxito la orden de entrega...')
                     router.push({ name: 'show.orden', params: { id: orden.value } })
                  } else {
                     toast.info('No se pudo guardar la orden de entrega, inténtelo de nuevo mas tarde')
                  }

               }).catch(e => {

                  console.log(e)
                  if (e.response.status === 422) {
                     formValidate.setErrors(e.response.data.errors)
                  }

               })

            }

         }

      })
   },
}
</script>