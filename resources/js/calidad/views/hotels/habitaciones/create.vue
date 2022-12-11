
<script>

import {mapGetters,mapMutations,mapActions} from 'vuex';

import form from './form';

export default {
   props:['idhotel'],

   render:function(elem){
      return elem(form,{

         props:{
            idhotel:this.idhotel
         },
         on:{
            save:(data)=>{


               data.hotel_id = this.idhotel


               this.guardarHabitacion(data).then(respon => {

                  if(respon.data.result){
                     this.$notify.success('Se ha registrado con éxito la habitación');

                     this.pushHabitacion(respon.data.habitacion);

                     this.$router.push({name:'edit.habitacion',params:{id:respon.data.habitacion.id}})

                  }else{
                     this.$notify.info('No se pudo registrar, inténtelo de nuevo')
                  }

                  this.clearErrors();

               }).catch(e => {   

                  if(e.response.status === 422){
                     this.setError(e.response.data.errors)
                  }

               }).then(() => {
               })

            }
         }
      })
   },

   created(){
      this.clearErrors();
      this.clearHabitacion();
      this.clearHabitacion();
   },

   methods:{
      ...mapMutations(['setError','clearErrors']),
      ...mapMutations('habitacion',['clearHabitacion','pushHabitacion']),
      ...mapActions('habitacion',['guardarHabitacion']),
   }
}
</script>