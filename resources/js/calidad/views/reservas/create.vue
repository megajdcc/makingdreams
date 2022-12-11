
<script>

import form from './form';

import {h,onMounted,toRefs} from 'vue'

import store from '@/store'

import { Notification } from 'element-ui';

import router from '@/router'

export default {

   props:{
      bodaid:{
         type:Number|String,
         default:null,
         required:false
      }
   },


   setup(props){

      const {bodaid} = toRefs(props)

      onMounted(() => {

         store.commit('reserva/clearReserva')

      })
      
      return () => h(form,{

         props: {
            boda_id: bodaid.value
         },

         on:{
            save: (data,formValidate) => {
               
               store.dispatch('reserva/guardarReserva',data).then(({result,reserva}) => {

                  if (result){
                     Notification.success({
                        message:'Se ha registrado con éxito la reserva',
                        position:'bottom-right'
                     })

                     store.commit('reserva/pushReserva',reserva)
                     
                     router.push({name:'edit.reservacion',params:{id:reserva.id}})

                  }else{
                     Notification.info({
                        message: 'No se pudo registrar la reserva',
                        position: 'bottom-right'
                     })
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
   }

}
</script>