<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { atraques } = toRefs(store.state.atraque)

      const cargarForm = () => {
         if (!atraques.value.length) {
            store.dispatch('atraque/fetchAtraque', id.value).then(() => {
               store.commit('atraque/capturar', Number(id.value))
            })
         } else {
            store.commit('atraque/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch([id,atraques], () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('atraque/guardar', data).then(({ result, atraque }) => {

                  if (result) {
                     toast.success('Registro del atraque actualizado con éxito')
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