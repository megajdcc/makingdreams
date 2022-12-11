<script>

   import {h,onMounted} from 'vue'
   import store from '@/store'
   import router from '@/router'

   import form from './form.vue'

export default {
   
   setup() {
      

      onMounted(() => store.commit('entrega/clear'))

      return () => h(form,{
         on:{
            
            save(data,formValidate){

               store.dispatch('entrega/guardar',data).then(({result,entrega}) => {

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