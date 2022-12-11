<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { puertos } = toRefs(store.state.puerto)

      const cargarForm = () => {
         if (!puertos.value.length) {
            store.dispatch('puerto/fetchPuerto', id.value).then(() => {
               store.commit('puerto/capturar', Number(id.value))
            })
         } else {
            store.commit('puerto/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch(puertos, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('puerto/guardar', data).then(({ result, puerto }) => {

                  if (result) {
                     toast.success('Registro del puerto actualizado con éxito')
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