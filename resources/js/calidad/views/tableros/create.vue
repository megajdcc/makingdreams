<script>

import {toRefs,onMounted,ref,h} from 'vue'
import form  from './form.vue'
import store from '@/store';

import router from '@/router'

export default {

  setup(){

    store.commit('tablero/clear')

    return () => h(form,{

      on:{
        save:(data,formValidate) => {

          store.dispatch('tablero/guardar',data).then(({result}) => {

            if(result){
              toast.success('Se ha creado con éxito el Tablero',{position:'bottom-right'})
              router.push({name:'tableros'})
            }else{
              toast.info('No se pudo crear el tablero, inténte de nuevo..Hol', { position: 'bottom-right' })
            }

          }).catch(e => {
            if(e.response.status === 422){
              formValidate.setErrors(e.response.data.errors)
            }

            console.log(e)

          })
        }
      }
    })

  }
  
}
</script>