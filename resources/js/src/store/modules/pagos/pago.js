export default{

   namespaced:true,

   state:() => ({

      pago:{
         id      : null,
         monto   : 0,
         aprobado: false,
         status  : 1,
         concepto: '',
         detalles: null,
         usuario : null,
         usuario_id:null,
         metodo:1,
         comprobante:null
      },

      pagos:[]
   }),

   getters:{

      draft(state) {
         return clone(state.pago)
      }

   },


   mutations:{
      setPagos(state, data) {
         state.pagos = data;
      },

      setPago(state, pago) {
         state.pago = pago;
      },

      push(state, pago) {
         state.pagos.push(pago);
      },

      put(state,pago_id){
         state.pagos.splice(
            state.pagos.findIndex(val => val.id === pago_id),
            1
         )
      },


      capturar(state, pago_id) {
         state.pago = state.pagos.find((val) => val.id == pago_id)
      },

      clear(state) {
         state.user = {
            id: null,
            monto: 0,
            aprobado: false,
            status: 1,
            concepto: '',
            detalles: null,
            usuario: null,
            usuario_id: null,
            metodo: 1,
            comprobante: null




         }
      },


      update(state, data) {

         var i = state.pagos.findIndex((val) => val.id == data.id);

         if (i != -1) {
            state.pagos[i] = data;
         }

         if(state.pago.id === data.id){
            state.pago = data
         }

      },


   },


   actions:{


      fetchData({state,commit},datos){
         return new Promise((resolve, reject) => {
            axios.post('/api/pagos/fetch/data',datos).then(({data}) => {

               commit('setPagos',data.pagos)

               resolve(data)
            }).catch(e => reject(e))

         })
      },


      fetch({state,commit},pago_id){
         return new Promise((resolve, reject) => {
            
            axios.get(`/api/pagos/${pago_id}/fetch/data`).then(({data}) => {
               commit('setPago',data.pago)
               resolve(data)
            }).catch(e => reject(e))


         })
      },


      guardar({commit},datos){

         return new Promise((resolve, reject) => {
            
            if(datos.metodo === 3){
               const formData = new FormData()


               Object.keys(datos).forEach(val => {

                  formData.append(val, datos[val]);

               })

               if (datos.id) {

                  formData.append('_method', 'put');

                  axios.post(`/api/pagos/${datos.id}`, formData, {
                     headers: {
                        ContentType: 'multipart/form-data'
                     }
                  }).then(({ data }) => {
                     if (data.result) {
                        commit('update', data.pago)
                     }

                     resolve(data)
                  }).catch(e => reject(e))


               } else {

                  axios.post(`/api/pagos`, formData, {
                     headers: {
                        ContentType: 'multipart/form-data'
                     }
                  }).then(({ data }) => {
                     if (data.result) {
                        commit('push', data.pago)
                     }

                     resolve(data)
                  }).catch(e => reject(e))


               }
            
            }else{


               if (datos.id) {

                

                  axios.put(`/api/pagos/${datos.id}`, datos).then(({ data }) => {
                     if (data.result) {
                        commit('update', data.pago)
                     }

                     resolve(data)
                  }).catch(e => reject(e))


               } else {

                  axios.post(`/api/pagos`, datos).then(({ data }) => {
                     if (data.result) {
                        commit('push', data.pago)
                     }

                     resolve(data)
                  }).catch(e => reject(e))


               }

            }
           



           
            
         })
      },

      eliminar({commit},pago_id){
 

         return new Promise((resolve, reject) => {
            
            axios.delete(`/api/pagos/${pago_id}`).then(({data}) => {

               if(data.result){
                  commit('put',pago_id)
               }
               resolve(data)
            }).catch(e => reject(e))


         })
      },

      aprobarPago({commit},pago_id){

         return new Promise((resolve, reject) => {
            axios.get(`/api/pagos/${pago_id}/aprobar/pago`).then(({data}) => {

               if(data.result){
                  commit('update',data.pago)
               }

               resolve(data)

            }).catch( e => reject(e))
         })
      }


    
   }

}