import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'



// Import Modulos

import usuario from './modules/usuario';
import rol from './modules/configuracion/rol.js';
import permiso from './modules/configuracion/permiso.js';
// 
import notificacion from './modules/notificaciones.js';

// Tableros 

import AdminTablero from './modules/tableros/AdminTablero.js';
import UserTablero from './modules/tableros/UserTablero.js';

import dashboard from './modules/dashboard/dashboard.js'

//  Home Dashboard
import home from './modules/home.js'


// Pais , Estados y Municipios

import pais from './modules/pais.js'
import estado from './modules/estado.js'
import ciudad from './modules/ciudad.js'

// SIstema
import sistema from './modules/sistema.js'

// EstadoCuentas y Movimientos

import cuenta from './modules/estado_cuentas/cuenta.js'
import movimiento from './modules/estado_cuentas/movimiento.js';
 

// Pagos
import pago from './modules/pagos/pago.js'

// Etapa

import etapa from './modules/etapa.js'

// Tablero

import tablero from './modules/tablero.js'

// Puesto

import puesto from './modules/puesto.js'

// Contacto

import contacto from './modules/contacto.js'

Vue.use(Vuex)

export default new Vuex.Store({

  
	state: {
		errors: {},
		loading: false,
    token:null,
    canales:[],
    auth:{
      message:null
    }
	},

	mutations: {



		cerrarApp(state) {
			state.usuario = null
		},

		toggleLoading(state,bol = null) {
			state.loading = (bol != null) ? bol : !state.loading
		},



		setError(state, data) {

      
      if (typeof data === 'string'){
        state.errors.message = data;
      }else{
        state.errors = data;
      }

		},

		clearErrors(state) {

			state.errors = {
				carta: {}
			}

		},
    setAuthMessage(state,data){
      state.auth.message = data;

    },


    setToken(state,token){
      state.token = token
    },

    pushCanal(state,canal){
      state.canales.push(canal)
    }


	},

	actions: {

    async cerrarSesion({ state, commit }) {
      return await axios.get('/api/auth/logout',null,{
        headers: {
          'WWW-Authenticate': 'Bearer', 'Authorization': (state.token) ? state.token : localStorage.getItem('accessToken')
        }
      });

    }


	},

  modules: {
    app,
    appConfig,
    verticalMenu,
    usuario,
    rol,
    notificacion,
    permiso,
    'user-tablero': UserTablero,
    dashboard,
    home,
    pais,
    estado,
    ciudad,
    sistema,

    // Estado de Cuentas
    cuenta,
    movimiento,
    pago,
    etapa,
    tablero,
    puesto,
    contacto
    
  },

  strict: process.env.DEV,

})
