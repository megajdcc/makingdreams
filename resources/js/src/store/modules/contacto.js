export default {
  namespaced:true,

  state:() => ({
    contacto:{
      id:null,
      whatsapp:'',
      correo:null,
      telefono_1:null,
      telefono_2:null,
      otro:'',
      usuario_id:null,
      usuario:null,
      mensaje:''
    },

    contactos:[]
  }),

  mutations:{
      setContactos(state, data) {
         state.contactos = data;
      },

      setContacto(state, contacto) {
         state.contacto = contacto;
      },

      push(state, contacto) {
         state.contactos.push(contacto);
      },

      put(state,contacto_id){
         state.contactos.splice(
            state.contactos.findIndex(val => val.id === contacto_id),
            1
         )
      },


      capturar(state, contacto_id) {
         state.contacto = state.contactos.find((val) => val.id == contacto_id)
      },

      clear(state) {
         state.user = {
            id:null,
            whatsapp:'',
            correo:null,
            telefono_1:null,
            telefono_2:null,
            otro:'',
            usuario_id:null,
            usuario:null,
            mensaje:''
         }
      },


      update(state, data) {

         var i = state.contactos.findIndex((val) => val.id == data.id);

         if (i != -1) {
            state.contactos[i] = data;
         }

         if(state.contacto.id === data.id){
            state.contacto = data
         }

      },
  },

  actions:{

     fetchData({state,commit},datos){
         return new Promise((resolve, reject) => {
            axios.post('/api/contactos/fetch/data',datos).then(({data}) => {

               commit('setContactos',data.contactos)

               resolve(data)
            }).catch(e => reject(e))

         })
      },


      fetch({state,commit},contacto_id){
         return new Promise((resolve, reject) => {
            
            axios.get(`/api/contactos/${contacto_id}/fetch/data`).then(({data}) => {
               commit('setContacto',data)
               resolve(data)
            }).catch(e => reject(e))


         })
      },

      fetchForUser({state,commit},usuario_id){
         return new Promise((resolve, reject) => {
            
            axios.get(`/api/contactos/user/${usuario_id}/fetch/data`).then(({data}) => {
               commit('setContacto',data)
               resolve(data)
            }).catch(e => reject(e))


         })
      },


      guardar({commit},datos){

         return new Promise((resolve, reject) => {
              if(datos.id){
                axios.put(`/api/contactos/${datos.id}`,datos).then(({data}) => {
                  if(data.result){
                    commit('update',data.contacto)
                  }

                  resolve(data)
                }).catch(e => reject(e))
              }else{
                axios.post(`/api/contactos`,datos).then(({data}) => {

                  if(data.result){
                    commit('push',data.contacto)
                    commit('setContacto',data.contacto)
                  }

                  resolve(data)

                })
              }            
         })
      },

      eliminar({commit},contacto_id){
 

         return new Promise((resolve, reject) => {
            
            axios.delete(`/api/contactos/${contacto_id}`).then(({data}) => {

               if(data.result){
                  commit('put',contacto_id)
               }
               resolve(data)
            }).catch(e => reject(e))


         })
      },
  }

}