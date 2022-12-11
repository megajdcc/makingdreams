<template>
   <div class="container-fluid px-0 mx-0">

      <div class="row w-100 px-0 mx-0">
         <div class="col-12 px-0 mx-0">
            <router-view></router-view>
         </div>

      </div>

   </div>

</template>



<script>

import {mapActions} from 'vuex';
export default {


   mounted(){
         this.cargarHoteles();
        this.cargarUsuarios();
        this.cargarPagos();

   },

   methods:{
      
      ...mapActions('hotel',['cargarHoteles']),
      ...mapActions('usuario',['cargarUsuarios']),
      ...mapActions('pagoHotel',['cargarPagos']),

   }
}
</script>