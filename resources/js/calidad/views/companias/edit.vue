<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { companias } = toRefs(store.state.compania)

      const cargarForm = () => {
         if (!companias.value.length) {
            store.dispatch('compania/fetchCompania', id.value).then(() => {
               store.commit('compania/capturar', Number(id.value))
            })
         } else {
            store.commit('compania/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch(companias, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('compania/guardar', data).then(({ result, compania }) => {

                  if (result) {
                     toast.success('Registro de la compañia actualizada con éxito')
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