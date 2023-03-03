export default{

   namespaced:true,

   state: () => ({
      sistema:{
         
         id:null,
         nombre:'',
         monto_inicial:3.5,
         terminos:'',
         logotipo_oscuro:null,
         logotipo_claro:null,

         direccion_bitcoin:null,

         paypal:{
            cliente_id:null,
            secret:null,
            production:false,
         },
         wompi:{
            sandbox:{
               llave_publica:null,
               llave_privada:null,
            },
            production:{
               llave_publica:null,
               llave_privada:null,
            },
            is_production:false,
         },

         mercado_pago:{
            public_key:null,
            token:null,
            cliente_id:null,
            cliente_secret:null,
            is_production:false,
         },
      }
   }),


   mutations:{

      setSistema(state,sistema){

         if(sistema){
            state.sistema = sistema
         }

      },


      update(state,sistema){
         localStorage.setItem('sistema',JSON.stringify(sistema))
         state.sistema = sistema
      },



   },


   actions:{

      fetch({commit}){

         return new Promise((resolve, reject) => {
            axios.get(`/api/sistema/fetch/data`).then(({data}) => {

               commit('setSistema',data)
               resolve(data)

            }).catch(e => reject(e))
         })
      },


      guardar({state,commit},datos){


         return new Promise((resolve, reject) => {
            axios.put(`/api/sistemas/${state.sistema.id}`,datos).then(({data}) => {

               if(data.result){
                  commit('update',data.sistema)
               }

               resolve(data)

            }).catch(e => reject(e))

         })
      },

      updateLogo({state,commit},datos){
         
         let formData = new FormData();

         Object.keys(datos).forEach(val => {
            formData.append(val,datos[val])
         })

         formData.append('_method','PUT')

         return new Promise((resolve, reject) => {
            axios.post(`/api/sistemas/${state.sistema.id}/update/logo/modo/${datos.modo}`,formData,{
               headers:{
                  ContentType:'multipart/form-data'
               }
            }).then(({data}) => {
               if(data.result){
                  commit('update',data.sistema)
               }

               resolve(data)
            }).catch(e => reject(e))
         })
      }

  

   }

}