<script>
import form from './form'

import { h, onMounted, toRefs, watch } from 'vue';
import store from '@/store'

export default {

   props: ['id'],

   setup(props) {

      const { id } = toRefs(props)

      const { facturas } = toRefs(store.state.factura)

      const cargarForm = () => {
         if (!facturas.value.length) {
            store.dispatch('factura/fetchFactura', id.value).then(() => {
               store.commit('factura/capturar', Number(id.value))
            })
         } else {
            store.commit('factura/capturar', Number(id.value))
         }
      }

      onMounted(() => {
         cargarForm();
      })

      watch(facturas, () => cargarForm())

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('factura/guardar', data).then(({ result, barco }) => {

                  if (result) {
                     toast.success('Registro de factura actualizado con éxito')
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