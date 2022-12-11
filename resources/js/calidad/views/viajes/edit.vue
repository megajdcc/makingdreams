<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'
import router from '@/router'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { viajes } = toRefs(store.state.viaje)

      const cargarForm = () => {

         if (!viajes.value.length) {
            store.dispatch('viaje/fetchViaje', id.value).then(() => {
               store.commit('viaje/capturar', Number(id.value))
            })
         } else {
            store.commit('viaje/capturar', Number(id.value))
         }

      }

      onMounted(() => {
         cargarForm();
      })

      watch(viajes, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('viaje/guardar', data).then(({ result, viaje }) => {

                  if (result) {
                     toast.success('Registro del viaje actualizado con éxito')
                     router.push({name:'listar.viajes',params:{id:viaje.entrega_id}})
                  } else {
                     toast.error('No se pudo actualizar el registro')
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