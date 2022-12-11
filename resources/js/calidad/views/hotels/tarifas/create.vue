<script>

import form from './form';

import {mapMutations, mapActions }from 'vuex';

export default {
   
   props:['idhabitacion'],

   render:function(element){
      return element(form,{
            props:{
               id:this.idhabitacion
            },
            on:{
               save:(data) => {

                  data.habitacion_id = this.idhabitacion
                  
                  this.guardarTarifa(data).then(respon => {

                     if(respon.data.result){
                        this.$notify.success('Se ha creado con éxito la tarifa')

                        this.pushTarifa(respon.data.tarifa);

                        this.$router.push({name:'edit.tarifa',params:{id:respon.data.tarifa.id}})

                     }else{
                        this.$notify.info('No se pudo registrar la tarifa, inténtelo de nuevo mas tarde')
                     }

                     this.clearErrors()
                  }).catch(e => {

                     if(e.response.status === 422){
                        this.setError(e.response.data.errors);

                     }else{
                        console.log(e)
                     }

                  }).then(() => {
                  })


                  
               }
            }
      })

   }, 


   created(){
      this.clearErrors();
      this.clearTarifa();
   },


   methods:{
      ...mapActions('tarifa',['guardarTarifa']),
      ...mapMutations('tarifa',['clearTarifa','pushTarifa']),
      ...mapMutations(['setError','clearErrors'])
   }
}
</script>