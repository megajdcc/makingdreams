
<script>

import {mapGetters,mapMutations,mapActions,mapState} from 'vuex';

import form from './form';

export default {
   props:['idhotel','id'],

   render:function(elem){
      return elem(form,{

         props:{
            idhotel:this.idhotel
         },
         on:{
            save:(data) => {


               data.hotel_id = this.idhotel


               this.guardarHabitacion(data).then(respon => {

                  if(respon.data.result){
                     this.$notify.success('Se ha actualizado con éxito la habitación');

                     this.updateHabitacion(respon.data.habitacion);

                   

                  }else{
                     this.$notify.info('No se pudo actualizar, inténtelo de nuevo')
                  }

                  this.clearErrors();

               }).catch(e => {   

                  if(e.response.status === 422){
                     this.setError(e.response.data.errors)
                  }

               }).then(() => {
               })

            },
            refresh:(id) => {
                  this.cargarHabitaciones(this.idhotel);
            }
         }
      })
   },

   created(){
      this.clearErrors();
      this.capturarHabitacion(this.id)
   },

   activated(){
      this.clearErrors();
      this.capturarHabitacion(this.id)
   },

   computed:{
      ...mapState('habitacion',['habitaciones'])
   },


   methods:{
      ...mapMutations(['setError','clearErrors']),
      ...mapMutations('habitacion',['clearHabitacion','updateHabitacion','capturarHabitacion']),
      ...mapActions('habitacion',['guardarHabitacion','cargarHabitaciones'])
   },

   watch:{
      
      id(){
         this.capturarHabitacion(this.id)
      },

      habitaciones(){
         this.capturarHabitacion(this.id)
      }

   }
}
</script>