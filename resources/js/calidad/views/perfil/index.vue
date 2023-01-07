<template>
  <b-tabs
    vertical
    content-class="col-12 col-md-9 mt-1 mt-md-0"
    pills
    nav-wrapper-class="col-md-3 col-12"
    nav-class="nav-left"
  >

    <!-- general tab -->
    <b-tab active>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="UserIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">General</span>
      </template>

      <configuracion-general/>
    </b-tab>
    <!--/ general tab -->

    <b-tab>

        <template #title>
          <feather-icon icon="Share2Icon" />
          <span class="font-weight-bold">Invitar</span>
        </template>

        <Invitados />

    </b-tab>

    <b-tab lazy>

        <template #title>
          <feather-icon icon="PhoneIcon" />
          <span class="font-weight-bold">Teléfonos</span>
        </template>
        
        <user-telefonos />

    </b-tab>

    <b-tab lazy>
    
      <template #title>
        <feather-icon icon="ListIcon" />
        <span class="font-weight-bold">Datos Bancarios</span>
      </template>
    
      <datos-bancario />
    
    </b-tab>


    <!-- <b-tab lazy >
      
      <template #title>
         <span class="fas fa-signature" />
        <span class="font-weight-bold">Firma Digital</span>
      </template>

      <firma-digital />


    </b-tab> -->

    <!-- change password tab -->
    <b-tab>

      <!-- title -->
      <template #title>
        <feather-icon
          icon="LockIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">Cambiar contraseña</span>
      </template>

      <cambiar-password />
    </b-tab>
    <!--/ change password tab -->

  

  

  </b-tabs>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import ConfiguracionGeneral from './ConfiguracionGeneral.vue'
import CambiarPassword from './CambiarPassword.vue'
import CuentaInformacionForm from './CuentaInformacionForm.vue'

import {mapState,} from 'vuex';

export default {
  components: {
    BTabs,
    BTab,
    ConfiguracionGeneral,
    CambiarPassword,
    Invitados:() => import('./invitados/index.vue'),
    // FirmaDigital:() => import('./FirmaDigital.vue')
    UserTelefonos: () => import('./UserTelefonos.vue'),
    DatosBancario: () => import('./DatosBancario.vue')

  },
  data() {
    return {
      options: {},
    }
  },

  computed:{
    ...mapState('usuario',['usuario']),

  },
  beforeCreate() {
    // this.$http.get('/account-setting/data').then(res => { this.options = res.data })
  },
}
</script>
