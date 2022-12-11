<script>

import {mapState,mapMutations, mapActions,mapGetters} from 'vuex';

import Form from './form.vue';


import {h,onMounted,watch,toRefs} from 'vue'

import store from '@/store'
import router from '@/router'
import {Notification} from 'element-ui'

export default {

  name: 'hotel-edit',
   
  props:['id'],

  setup(props){

    const { hoteles } = toRefs(store.state.hotel)
    const {id} = toRefs(props)


    const cargarForm = () => {

      if (hoteles.value.length) {
        store.commit('hotel/capturarHotel', Number(id.value))
      } else {
        // store.dispatch('hotel/getHotel', id.value);
      }

    }

    onMounted(() => {
      store.commit('hotel/clearHotel')
      cargarForm();
    })
    
    watch([hoteles,id],() => {
      cargarForm();
      // store.commit('hotel/capturarHotel',id.value)
    })

    return () => h(Form,{

      on:{
        
        save:(data,formValidate) => {


          store.dispatch('hotel/guardarHotel',data).then(({data}) => {

            if (data.result) {
              Notification.success('Actualización exitosa')
              store.commit('hotel/updateHotel',data.hotel)
            } else {
              Notification.info('Actualización no exitosa, intentelo mas tarde');
            }

          }).catch(e => {

            if (e.response.status == 422) {
              formValidate.setErrors(e.response.data.errors);
            }
            console.log(e)

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