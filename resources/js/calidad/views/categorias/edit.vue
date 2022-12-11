<script>
import form from './form'

import { h, onMounted,toRefs,watch } from 'vue';
import store from '@/store'

export default {

   props:['id'],

   setup(props) {

      const {id} = toRefs(props)

      const {categorias} = toRefs(store.state.categoria)

      const cargarForm = () => {
         if(!categorias.value.length){
            // store.dispatch('categoria/getCategoria',id.value).then(() => {
            //    store.commit('categoria/capturar',Number(id.value))
            // })
         }else{
            store.commit('categoria/capturar', Number(id.value))
         }

         
      }

      onMounted(() => {
         cargarForm();
      })

      watch(categorias , () => cargarForm())

      return () => h(form,{

         on:{
            save:(data,formValidate) => {
               
               store.dispatch('categoria/guardar',data).then(({result,categoria}) => {

                  if(result){
                     toast.success('Categoría actualizada con éxito')
                  }else{
                     toast.error('No se pudo actualizar la categoría')
                  }

               }).catch(e => {

                  console.log(e)
                  if(e.response.status === 422){
                     formValidate.setErrors(e.response.data.errors)
                  }

               })

            }
         }

      })

   },
}
</script>t