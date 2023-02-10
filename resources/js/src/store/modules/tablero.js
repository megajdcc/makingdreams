export default{

  namespaced:true,

  state:() => ({


    tablero:{
      id:null,
      beneficiario_id:null,
      beneficiario:null,
      tablero_id:null,
      tablero:null,
      cierre:null
    },

    tableros:[]
  }),

  getters:{

    draft:(state) => clone(state.tablero)

  },


  mutations:{
    setTableros(state, data) {
      state.tableros = data;
    },

    setTablero(state, tablero) {
      state.tablero = tablero;
    },

    push(state, tablero) {
      state.tableros.push(tablero);
    },

    put(state, tablero_id) {
      state.tableros.splice(
        state.tableros.findIndex(val => val.id === tablero_id),
        1
      )
    },


    capturar(state, tablero_id) {
      state.tablero = state.tableros.find((val) => val.id == tablero_id)
    },

    clear(state) {

      state.tablero = {
        id: null,
        beneficiario_id: null,
        beneficiario: null,
        tablero_id: null,
        tablero: null,
        cierre: null
      }


    },


    update(state, data) {

      var i = state.tableros.findIndex((val) => val.id == data.id);

      if (i != -1) {
        state.tableros[i] = data;
      }

      if (state.tablero.id === data.id) {
        state.tablero = data
      }


    },

  },

  actions:{
    getAll({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(`/api/tableros/get/all`).then(({ data }) => {

          commit('setTableros', data)
          resolve(data)

        }).catch(e => reject(e))
      })
    },


    fetchData({ state, commit }, datos) {
      return new Promise((resolve, reject) => {
        axios.post('/api/tableros/fetch/data', datos).then(({ data }) => {

          commit('setTableros', data.etapas)

          resolve(data)
        }).catch(e => reject(e))

      })
    },


    fetch({ state, commit }, tablero_id) {
      return new Promise((resolve, reject) => {

        axios.get(`/api/tableros/${etapa_id}/fetch/data`).then(({ data }) => {
          commit('setEtapa', data.etapa)
          resolve(data)
        }).catch(e => reject(e))


      })
    },

    guardar({ commit }, datos) {

      return new Promise((resolve, reject) => {

        if (datos.id) {

          axios.put(`/api/etapas/${datos.id}`, datos).then(({ data }) => {

            if (data.result) {

              commit('update', data.etapa)
            }

            resolve(data)

          }).catch(e => reject(e))
        } else {

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