<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('atraque/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('atraque/guardar', data).then(({ result, atraque }) => {

                  if (result) {
                     toast.success('Registro del atraque creado con éxito')
                     router.push({ name: 'edit.atraque', params: { id: atraque.id } })
                  } else {
                     toast.error('No se pudo crear el atraque')
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