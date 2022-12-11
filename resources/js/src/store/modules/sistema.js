export default{

   namespaced:true,

   state: () => ({
      sistema:{
         
         id:null,
         nombre:'',
         monto_inicial:3.5,
         terminos:'',
         logotipo_oscuro:null,
         logotipo_claro:null
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
      }


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

         const formData = new FormData()

         Object.keys(datos).forEach((val) => {
            formData.append(val,datos[val])
         })

         formData.append('_method','put')

         return new Promise((resolve, reject) => {
            axios.post(`/api/sistemas/${state.sistema.id}`,formData).then(({data}) => {

               if(data.result){
                  commit('update',data.sistema)
               }

               resolve(data)

            }).catch(e => reject(e))

         })
      }

   }

}