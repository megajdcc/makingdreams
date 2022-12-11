<script>
import form from './form.vue'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {

   setup(props) {

      onMounted(() => {
         store.commit('destino/clear')
      })

      return () => h(form, {

         on: {
            save: (data, formValidate) => {

               store.dispatch('destino/guardar', data).then(({ result, destino }) => {

                  if (result) {
                     toast.success('Registro del destino creado con éxito')
                     router.push({ name: 'edit.destino', params: { id: destino.id } })
                  } else {
                     toast.error('No se pudo crear el destino')
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