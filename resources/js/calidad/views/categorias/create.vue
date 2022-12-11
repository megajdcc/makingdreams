<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('categoria/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('categoria/guardar', data).then(({ result, categoria }) => {

                  if (result) {
                     toast.success('Categoría creada con éxito')
                     router.push({ name: 'edit.categoria', params: { id: categoria.id } })
                  } else {
                     toast.error('No se pudo crear la categoría')
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