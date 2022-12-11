
export default{

   namespaced:true,

   state(){
      return{
         solicitudes_entregas:0,
         solicitudes_procesadas:0,
         solicitudes_sin_procesar:0,
         barcos:0,
         camiones:0,
         contenedores:0,
         clientes:0,
         camioneros:0,
         companias:0,
         entregas_mensuales: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
               // {
               //    label: 'Solicitadas',
               //    backgroundColor: '#a03bb3',
               //    data: [40, 39, 10, 40, 39, 80, 40, 100, 80, 65, 36, 50]
               // },
               // {
               //    label: 'Entregadas',
               //    backgroundColor: '#4ab30d',
               //    data: [31, 2, 7, 40, 13, 20, 40, 30, 80, 65, 36, 78]
               // },
               // {
               //    label: 'Sin entregar',
               //    backgroundColor: '#dd8108',
               //    data: [40, 39, 10, 30, 23, 55, 89, 95, 80, 65, 36, 47]
               // }
            ]
         }

      }
   },

   mutations:{

      setData(state,data){
         const { solicitudes_entregas, solicitudes_procesadas, solicitudes_sin_procesar,barcos,camiones,contenedores,entregas_mensuales,clientes,choferes,companias } = data
         state.solicitudes_entregas = solicitudes_entregas
         state.solicitudes_procesadas = solicitudes_procesadas
         state.solicitudes_sin_procesar = solicitudes_sin_procesar
         state.barcos = barcos,
         state.camiones = camiones
         state.contenedores = contenedores
         state.entregas_mensuales.datasets = entregas_mensuales,
         state.clientes = clientes
         state.camioneros = choferes
         state.companias = companias

      }
   },


   actions:{

      getData({commit}){

         return new Promise((resolve, reject) => {

            axios.get(`/api/home/get/data`).then(({data}) => {
                  commit('setData',data)
                  resolve(data);
            }).catch(e => reject(e))
            .then(() => {
            })

         })
      }


   }

}
