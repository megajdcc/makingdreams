export default{

  namespaced:true,

  state:() => ({


    tablero:{
      id:null,
      beneficiario_id:null,
      beneficiario:null,
      tablero_id:null,
      tablero:null,
      cierre:null,
      tablero_id:null,
      tablero:null,
      abonadores:[],
      
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
        cierre: null,
        tablero_id:null,
        tablero:null,
        abonadores: [],

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
          commit('setTableros', data.tableros)
          resolve(data)
        }).catch(e => reject(e))

      })
    },


    fetch({ state, commit }, tablero_id) {
      return new Promise((resolve, reject) => {

        axios.get(`/api/tableros/${tablero_id}/fetch/data`).then(({ data }) => {
          commit('settablero', data.tablero)
          resolve(data)
        }).catch(e => reject(e))


      })
    },

    guardar({ commit }, datos) {

      return new Promise((resolve, reject) => {

        if (datos.id) {

          axios.put(`/api/tableros/${datos.id}`, datos).then(({ data }) => {

            if (data.result) {

              commit('update', data.tablero)
            }

            resolve(data)

          }).catch(e => reject(e))
        } else {

          axios.post(`/api/tableros`, datos).then(({ data }) => {

            if (data.result) {

              commit('push', data.tablero)
            }

            resolve(data)

          }).catch(e => reject(e))
        }
      })
    },


    eliminar({ commit }, tablero_id) {


      return new Promise((resolve, reject) => {

        axios.delete(`/api/tableros/${tablero_id}`).then(({ data }) => {

          if (data.result) {
            commit('put', tablero_id)
          }
          resolve(data)
        }).catch(e => reject(e))


      })
    },
  }

}