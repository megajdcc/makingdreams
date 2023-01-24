export default{

  namespaced:true,

  state(){
    return {
      etapa:{
        id:null,
        monto:0,
        nombre:'',
        remuneracion:0,
        etapa_id:null,
        descripcion:'',
        etapa:null
      },

      etapas:[]
    }
  },


  getters:{

    draft(state){
      return clone(state.etapa)
    }

  },


  mutations:{
    setEtapas(state, data) {
      state.etapas = data;
    },

    setEtapa(state, etapa) {
      state.etapa = etapa;
    },

    push(state, etapa) {
      state.etapas.push(etapa);
    },

    put(state, etapa_id) {
      state.etapas.splice(
        state.etapas.findIndex(val => val.id === etapa_id),
        1
      )
    },


    capturar(state, etapa_id) {
      state.etapa = state.etapas.find((val) => val.id == etapa_id)
    },

    clear(state) {
      state.etapa = {
        id: null,
        monto: 0,
        nombre: '',
        remuneracion: 0,
        etapa_id: null,
        descripcion: '',
        etapa: null
      }
    },


    update(state, data) {

      var i = state.etapas.findIndex((val) => val.id == data.id);

      if (i != -1) {
        state.etapas[i] = data;
      }

      if (state.etapa.id === data.id) {
        state.etapa = data
      }


    },

  },

  actions:{

    getAll({commit}){
      return new Promise((resolve, reject) => {
        axios.get(`/api/etapas/get/all`).then(({data}) => {

          commit('setEtapas',data)
          resolve(data)

        }).catch(e => reject(e))
      })
    },
    

    fetchData({ state, commit }, datos) {
      return new Promise((resolve, reject) => {
        axios.post('/api/etapas/fetch/data', datos).then(({ data }) => {

          commit('setEtapas', data.etapas)

          resolve(data)
        }).catch(e => reject(e))

      })
    },


    fetch({ state, commit }, etapa_id) {
      return new Promise((resolve, reject) => {

        axios.get(`/api/etapas/${etapa_id}/fetch/data`).then(({ data }) => {
          commit('setEtapa', data.etapa)
          resolve(data)
        }).catch(e => reject(e))


      })
    },

    guardar({commit},datos){

      return new Promise((resolve, reject) => {
        
        if(datos.id){

          axios.put(`/api/etapas/${datos.id}`,datos).then(({data}) => {

            if(data.result){

              commit('update',data.etapa)
            }

            resolve(data)

          }).catch(e => reject(e))
        }else{

          axios.post(`/api/etapas`, datos).then(({ data }) => {

            if (data.result) {

              commit('push', data.etapa)
            }

            resolve(data)

          }).catch(e => reject(e))
        }
      })
    },


    eliminar({ commit }, etapa_id) {


      return new Promise((resolve, reject) => {

        axios.delete(`/api/etapas/${etapa_id}`).then(({ data }) => {

          if (data.result) {
            commit('put', etapa_id)
          }
          resolve(data)
        }).catch(e => reject(e))


      })
    },
 
  }


}