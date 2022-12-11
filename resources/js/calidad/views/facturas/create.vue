<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('factura/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('factura/guardar', data).then(({ result, factura }) => {

                  if (result) {
                     toast.success('Factura generada con éxito')
                     router.push({ name: 'show.factura', params: { id: factura.id } })
                  } else {
                     toast.error('No se pudo crear la factura')
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
</script>t