<template>
   <div class="card">
      <div class="card-body">
         <div class="row">
            <div class="col-12">
                  <div class="input-group input-group-sm">
                     <div class="input-group-prepend">
                        <span class="input-group-text">Búsqueda rápida</span>
                     </div>

                     <input type="search" v-model="busqueda" class="form-control " placeholder="Busqueda inteligente..." @keyup="buscarTable">

                     <div class="input-group-append">
                        <button type="button" @click="recargarTabla" class="btn btn-outline-primary input-group-text"><i class="fas fa-redo"></i></button>
                     </div>


                  </div>
               </div>

               <div class="col-12 my-2">
                  
                  <vdtnet-table
                     ref="table"
                     :fields="data"
                     :opts="options"
                     hideFooter
                     @editar="editar"
                     @eliminar="eliminar"
                     className="table-bordered table table-sm table-hover responsive wrap display w-100">

                  </vdtnet-table>
                  
               </div>

            </div>

         
      </div>

      <div class="card-footer">
           <b-button variant="outline-secondary" size="sm" @click="$router.go(-1)"> <span class="fas fa-arrow-left"></span> Regresar</b-button>
            <b-button variant="outline-primary" size="sm" :to="{name:'create.tarifa',params:{idhabitacion:idhabitacion}}">Crear Tarifa</b-button>
      </div>




   </div>
</template>


<script>
	
	import VdtnetTable  from 'vue-datatables-net';

	import { mapState, mapMutations, mapActions, mapGetters} from 'vuex'; 


   import {ref,toRefs} from 'vue';

   import {BButton } from 'bootstrap-vue';


	export default{

		components:{
			VdtnetTable,
         BButton,
       
		},

      props:['idhabitacion'],

		data(){
			return{
				busqueda:'',

				data:{
						id     :{label:'#',sortable:false, width:"30px",responsivePriority:"1"},
						nombre   :{label:'Nombre',sortable:true},
                  precio   :{label:'Precio',sortable:true},
                  rango_edad   :{label:'Rango de edad',sortable:true},
                  edades   :{label:'Edades',sortable:true},
                  max_personas   :{label:'Cantidad max de personas',sortable:true},
                  habitacion :{label:'Habitación',sortable:false},
						actions:{label:'Actions',sortable:false,width:'150px'},
					}
            

		   };
      },

      computed:{
         ...mapState('tarifa',['tarifas']),
      },


      setup(props){

         const {idhabitacion} = toRefs(props);



         const options = ref({
               ajax:{
                       
                      url:'/api/tarifas/habitacion/'+idhabitacion.value+'/listar',
                     dataScr:(json) => {return json},
               },

               buttons:['csv','pdf'],
               // dom:"tr<'row vdtnet-footer'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7' pl>>",
               responsive:true,
               processing:true,
               searching:true,
               searchDelay:1500,
               destroy:false,
               ordering:true,
               lengthChange:true,
               serverSide:true,
               fixedHeader:true,
               saveState:true,
               paging:true,
               scrollY:'auto',
               autoWidth:true,
         });



         return {
            options
         };


      },

      created(){
         this.cargarTarifas(this.idhabitacion);

      },

		methods:{
         ...mapMutations('tarifa',['putTarifa']),
         ...mapMutations('tarifa',['capturarTarifa']),
			...mapActions('tarifa',['eliminarTarifa','cargarTarifas']),

			buscarTable(){

				this.$refs.table.search(this.busqueda);
			},

			recargarTabla(){
				this.cargarTarifas(this.idhabitacion);
				this.$refs.table.reload();
				
			},


			editar(data){	

				this.$router.push({name:'edit.tarifa',params:{id:data.id}})

			},

         showTarfas(data){
            this.$router.pus({name:'show.tarifas',params:{id:data.id}});
         },

			eliminar(data){

				this.eliminarTarifa(data.id).then(respon => { 
						if(respon.data.result){
							this.$notify({
								title:'Tarifa Eliminada con éxito',
								type:'info'
							});

							this.putTarifa(data.id);

						}else{
							this.$notify({
								title:'No pudimos eliminar la tarifa, inténtalo de nuevo mas tarde',
								type:'info',

							});

						}

				}).catch(e => {
					console.log(e);
				})

			}	


		},

		watch:{

			tarifas(){
				this.$refs.table.reload()
			}

		}

	}

</script>