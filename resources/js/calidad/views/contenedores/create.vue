<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('contenedor/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('contenedor/guardar', data).then(({ result, contenedor }) => {

                  if (result) {
                     toast.success('Registro del contenedor creado con éxito')
                     router.push({ name: 'edit.contenedor', params: { id: contenedor.id } })
                  } else {
                     toast.error('No se pudo crear el contenedor')
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