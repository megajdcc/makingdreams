<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { destinos } = toRefs(store.state.destino)

      const cargarForm = () => {
         if (!destinos.value.length) {
            store.dispatch('destino/fetchDestino', id.value).then(() => {
               store.commit('destino/capturar', Number(id.value))
            })
         } else {
            store.commit('destino/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch(destinos, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('destino/guardar', data).then(({ result, destino }) => {

                  if (result) {
                     toast.success('Registro del destino actualizado con éxito')
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