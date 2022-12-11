<script>
import form from './form'

import { h, onMounted } from 'vue';
import store from '@/store'
import router from '@/router'


export default {
   
   props:['id'],
   
   setup(props) {

      onMounted(() => {
         store.commit('viaje/clear')
      })

      return () => h(form, {

         props:{
            id:props.id
         },
         
         on: {
            save: (data, formValidate) => {

               store.dispatch('viaje/guardar', data).then(({ result, viaje }) => {

                  if (result) {
                     toast.success('Registro del viaje creado con éxito')
                     // store.commit('viaje/clear')
                     router.push({ name: 'listar.viajes', params: { id: props.id } })
                  } else {
                     toast.error('No se pudo crear el viaje')
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