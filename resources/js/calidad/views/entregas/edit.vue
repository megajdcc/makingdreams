<script>

   import {h,onMounted,toRefs} from 'vue'
   import store from '@/store'
   import router from '@/router'

   import form from './form.vue'

export default {
   
   props:['id'],

   setup(props) {
      

      const { entregas } = toRefs(store.state.entrega)

      const cargarForm = () => {
         if(!entregas.value.length){
            store.dispatch('entrega/fetchEntrega',props.id)
         }else{
            store.commit('entrega/capturar',props.id)
         }
      }

      onMounted(() => cargarForm())


      return () => h(form,{
         on:{
            
            save(data,formValidate){

               store.dispatch('entrega/guardar',data).then(({result}) => {

                  if(result){
                     toast.success('Se ha guardado con éxito la entrega')
                     router.push({name:'listar.entregas'})
                  }else{
                     toast.info('No se pudo guardar el registro, inténtelo de nuevo mas tarde.')
                  }
               }).catch(e => {
                  if(e.response.status === 422){
                     formValidate.setErrors(e.response.data.errors)
                  }
               })

            }

         }
      })
   },
}
</script>