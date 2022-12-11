<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('puerto/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('puerto/guardar', data).then(({ result, puerto }) => {

                  if (result) {
                     toast.success('Registro del Puerto creado con éxito')
                     router.push({ name: 'edit.puerto', params: { id: puerto.id } })
                  } else {
                     toast.error('No se pudo crear el puerto')
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