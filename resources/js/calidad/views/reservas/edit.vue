
<script>

import form from './form';

import {toRefs,onMounted,h,watch,computed} from 'vue'

import store from '@/store'

import {Notification} from 'element-ui'

export default {

   props:['id'],

   setup(props){

      const reservaciones  = computed(() => store.state.reserva.reservaciones) 

      const { id } = toRefs(props)

      const cargarForm = () => {

         if(reservaciones.value.length){
            store.commit('reserva/capturarReserva',Number(id.value))
         }
        
      }

      onMounted(() => {
         cargarForm();
      })

      watch([reservaciones,id],() => {
         cargarForm()
      })

      return () => h(form,{

         on:{
            save:(data,formValidate) => {
               

               store.dispatch('reserva/guardarReserva',data).then(({result,reservacion}) => {
               
                  if(result) {

                     Notification.success({
                        message:'Se ha actualizado la reserva con éxito ',
                        position:'bottom-right'
                     })
                     
                     store.commit('reserva/updateReserva',reservacion);


                  }else{
                     Notification.info({
                        message:'No se pudo actualizar, inténte mas tarde.',
                        position:'bottom-right'
                     })
                  }

               }).catch(e => {
                  console.log(e);

                  if(e.response.status === 422){
                     formValidate.setErrors(e.response.data.errors)
                  }

               })
            }
         }



      })

   }


}
</script>