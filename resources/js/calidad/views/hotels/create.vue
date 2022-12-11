<script>

import Form from './form.vue';
import {h,onMounted} from 'vue'
import store from '@/store'
import router from '@/router'

import {Notification} from 'element-ui'

export default {

  name: 'hotel-create',

  setup(){

    onMounted(() => {
      store.commit('hotel/clearHotel')
    })

    return () => h(Form,{
      on:{
        save:(data,formValidate) => {
          

          store.dispatch('hotel/guardarHotel',data).then(({data}) => {


            if (data.result) {

              Notification.success('Registro exitoso')

              store.commit('hotel/pushHotel',data.hotel)
              router.push({ name: 'edit.hotel', params: { id: data.hotel.id } });

            } else {

              Notification.info('Registro no éxitoso, inténtelo de nuevo')
            }



          }).catch(e => {
            console.log(e)

            if (e.response.status == 422) {
              formValidate.setErrors(e.response.data.errors)
            }


          }).then(() => {
          });
        }

      }
    })
  }
}
</script>

<style lang="css" scoped>

</style>