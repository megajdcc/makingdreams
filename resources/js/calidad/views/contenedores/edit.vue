<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { contenedores } = toRefs(store.state.contenedor)

      const cargarForm = () => {
         if (!contenedores.value.length) {
            store.dispatch('contenedor/fetchContenedor', id.value).then(() => {
               store.commit('contenedor/capturar', Number(id.value))
            })
         } else {
            store.commit('contenedor/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch(contenedores, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('contenedor/guardar', data).then(({ result, contenedor }) => {

                  if (result) {
                     toast.success('Registro del contenedor actualizado con éxito')
                  } else {
                     toast.error('No se pudo actualizar el registro')
                  }

               }).catch(e => {

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