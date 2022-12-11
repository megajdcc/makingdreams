<script>

import form from './form';

import { mapMutations, mapActions }from 'vuex';

export default {
   
   props:['id'],

   render:function(element){
      return element(form,{
            props:{
               id:this.id
            },
            on:{
               save:(data) => {


                  
                  this.guardarTarifa(data).then(respon => {

                     if(respon.data.result){
                        this.$notify.success('Se ha guardado con éxito la tarifa')

                        this.updateTarifa(respon.data.tarifa);

                       

                     }else{
                        this.$notify.info('No se pudo actualizar la tarifa, inténtelo de nuevo mas tarde')
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
      this.capturarTarifa(this.id)
   },


   methods:{
      ...mapActions('tarifa',['guardarTarifa']),
      ...mapMutations('tarifa',['capturarTarifa','updateTarifa']),
      ...mapMutations(['setError','clearErrors'])
   },

   watch:{
      id(val) {
         this.capturarTarifa(val)
      }
   }
}
</script>