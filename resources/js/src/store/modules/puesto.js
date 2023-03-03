
export default{
  namespaced:true,

  state:() =>({
    puesto:{
      id:null,
      usuario_id:null,
      tablero_id:null,
      usuario:null,
      tablero:null,
      ubicacion:0,
      cierre:null,
      is_beneficiario:false
    },

    puestos:[]
  }),

  getters:{ 

    draft(state){
      return clone(state.puesto)
    }

  },

  mutations:{
    setPuestos(state, data) {
      state.puestos = data;
    },

    setPuesto(state, puesto) {
      state.puesto = puesto;
    },

    push(state, puesto) {
      state.puestos.push(puesto);
    },

    put(state, puesto_id) {
      state.puestos.splice(
        state.puestos.findIndex(val => val.id === puesto_id),
        1
      )
    },


    capturar(state, puesto_id) {
      state.puesto = state.puestos.find((val) => val.id == puesto_id)
    },

    clear(state) {
      state.puesto = {
        id: null,
        usuario_id: null,
        tablero_id: null,
        usuario: null,
        tablero: null,
        ubicacion: 0,
        cierre: null,
        is_beneficiario: false
      }
    },


    update(state, data) {

      var i = state.puestos.findIndex((val) => val.id == data.id);

      if (i != -1) {
        state.puestos[i] = data;
      }

      if (state.puesto.id === data.id) {
        state.puesto = data
      }


    },
  },

  actions:{
    
    getAll({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get(`/api/puestos/get/all`).then(({ data }) => {

          commit('setPuestos', data)
          resolve(data)

        }).catch(e => reject(e))
      })
    },


    fetchData({ state, commit }, datos) {
      return new Promise((resolve, reject) => {
        axios.post('/api/puestos/fetch/data', datos).then(({ data }) => {

          commit('setPuestos', data.puestos)

          resolve(data)
        }).catch(e => reject(e))

      })
    },


    fetch({ state, commit }, puesto_id) {
      return new Promise((resolve, reject) => {

        axios.get(`/api/puestos/${puesto_id}/fetch/data`).then(({ data }) => {
          commit('setpuesto', data.puesto)
          resolve(data)
        }).catch(e => reject(e))

      })
    },

    guardar({ commit }, datos) {

      return new Promise((resolve, reject) => {

        if (datos.id) {

          axios.put(`/api/puestos/${datos.id}`, datos).then(({ data }) => {

            if (data.result) {

              commit('update', data.puesto)
            }

            resolve(data)

          }).catch(e => reject(e))
        } else {

          axios.post(`/api/puestos`, datos).then(({ data }) => {

            if (data.result) {

              commit('push', data.puesto)
            }

            resolve(data)

          }).catch(e => reject(e))
        }
      })
    },


    eliminar({ commit }, puesto_id) {


      return new Promise((resolve, reject) => {

        axios.delete(`/api/puestos/${puesto_id}`).then(({ data }) => {

          if (data.result) {
            commit('put', puesto_id)
          }
          resolve(data)
        }).catch(e => reject(e))


      })
    },

  
  }

}