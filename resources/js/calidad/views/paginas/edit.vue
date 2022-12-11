<script>
import { h, onMounted,toRefs,computed,watch } from 'vue'

import store from '@/store'
import router from '@/router'


import form from './form'

export default {

   props:['id'],

   setup(props) {

      const {id} = toRefs(props)
      const paginas = computed(() => store.state.pagina.paginas)

      const cargarForm = () => {

         if(!paginas.value.length){
            store.dispatch('pagina/getPagina',id.value).then(() => {
               store.commit('pagina/capturar',Number(id.value))
            })
            
         }else{
            store.commit('pagina/capturar',Number(id.value))

         }


      }

      onMounted(() => {
         cargarForm()
      })

      watch(id,() => cargarForm())

      return () => h(form, {

         on: {

            save: (data, formValidate) => {



               store.dispatch('pagina/guardar', data).then(({ result, pagina }) => {
                  if (result) {
                     toast.success('Se ha actualizado con éxito la pagina')
                  } else {
                     toast.info('No se pudo actualizar la pagina, inténtelo de nuevo mas tarde')
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