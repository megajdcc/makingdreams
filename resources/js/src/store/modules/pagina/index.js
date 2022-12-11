
export default {
   namespaced: true,
   state() {
      return {
         pagina: {
            id          : null,
            contenido   : '',
            titulo      : null,
            ruta        : null,
            usuario_id  : null,
            usuario     : null,
            categorias   : [],
         },

         paginas: []
      }

   },

   getters: {

      draft(state) {
         return clone(state.pagina)
      }

   },

   mutations: {
      setPaginas(state, data) {
         state.paginas = data
      },

      clear(state) {
         state.pagina = {
            id: null,
            contenido: '',
            titulo: null,
            ruta: null,
            usuario_id: null,
            usuario: null,
            categorias: [],
         }
      },

      capturar(state, pagina_id) {

         let pagina = state.paginas.find(val => val.id === pagina_id)

         if (pagina) {
            state.pagina = pagina
         }

      },

      update(state, pagina) {
         let i = state.paginas.findIndex(val => val.id === pagina.id)

         if (i != -1) {
            state.paginas[i] = pagina

            if (state.pagina.id == pagina.id) {
               state.pagina = pagina
            }

         }
      },

      push(state, pagina) {
         state.paginas.push(pagina)

      },

      put(state, pagina_id) {

         state.paginas.splice(
            state.paginas.findIndex(v => v.id === pagina_id),
            1
         )

      },

      setPagina(state,pagina){
         state.pagina = pagina
      }
   },


   actions: {

      async fetchData({ commit }, data) {
         return await new Promise((resolve, reject) => {
            axios.post('/api/paginas/fetch/data', data).then(({ data }) => {
               commit('setPaginas', data.paginas)
               resolve(data)
            }).catch(e => reject(e))
         })
      },


      async guardar({ state, commit }, data) {

         // let form = new FormData();
         // Object.keys(data).forEach(v => {
         //    form.append(v, data[v]);
         // })


         return await new Promise((resolve, reject) => {

            if (data.id) {
               axios.put(`/api/paginas/${data.id}`, data).then(({ data: datos }) => {
                  resolve(datos)
               }).catch(e => reject(e))

            } else {
               axios.post(`/api/paginas`, data).then(({ data: datos }) => {
                  commit('push', datos.pagina)
                  resolve(datos)
               }).catch(e => reject(e))
            }


         })

      },

      async eliminar({ commit }, pagina_id) {

         return await new Promise((resolve, reject) => {


            axios.delete(`/api/paginas/${pagina_id}`).then(({ data }) => {

               if (data.result) {
                  commit('put', pagina_id)
               }

               resolve(data)

            }).catch(e => reject(e))

         })
      },

      async getPagina({ commit }, pagina_id) {

         return await new Promise((resolve, reject) => {
            axios.get(`/api/paginas/${pagina_id}/get`).then(({ data }) => {
               commit('push', data)
               resolve(data)
            }).catch(e => reject(e))
               .then(() => {
               })
         })
      },

      async getPaginaPorRuta({commit},ruta){

         return await new Promise((resolve, reject) => {
            

            axios.get(`/api/paginas/get/ruta/${ruta}`).then(({data}) => {
               
               commit('setPagina',data)
               resolve(data)

            }).catch(e => reject(e))
            .then(() => {
            })

         })
      }


   }
}