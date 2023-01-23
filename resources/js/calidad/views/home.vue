<template>
  
  <section id="dashboard">
    
    <b-container fluid v-if="usuario.rol.nombre === 'Usuario' ">
      <template v-if="!usuario.backoffice">
          <h2 class="font-weight-bolder">Bienvenido {{ `${usuario.nombre} ${usuario.apellido} (${usuario.username})` }}</h2>
          <p class="p-1">Es hora de envíar tu única donación al programa de {{ sistema.monto_inicial | currency }} para activar tu oficina administrativa.
            <ul>
              <li>Paso 1:Para comenzar, elija cómo le gustaría enviar su donacion <b-link :to="{name:'donacion.backoffice'}">aquí.</b-link></li>
              <li>Paso 2:Después de enviar tu donación al programa de {{  sistema.monto_inicial | currency  }}, adjunte soporte por la casilla o envíe <strong>su nombre de usuario y una captura de pantalla o recibo de pago</strong> que muestre la cantidad al corréo: <b-link href="mailto:makingdreams.manager@gmail.com" target="_blank">makingdreams.manager@gmail.com</b-link> </li>

              <li>
                Paso 3: Entra a tu <b-link :to="{name:'perfil'}"> Perfil </b-link> en la pestaña de información Bancaria y Datos de Información de Contacto y actualiza tus datos.
              </li>

            </ul>

            Su Backoffice se activará en el orden en que se reciban, carguen y confirmen sus datos.
            <br>
            <strong class="text-danger">Aviso Importante:</strong> <br>
            <strong class="text-danger">
              Debe activarse dentro de las 24 horas posteriores a la verificación de su donación al sistema, cuando esté activado, al iniciar sesión en tu Backoffice ya no verá esta página y podrá unirse a la Junta de {{ 6 | currency }} ¡Gracias!
            </strong>
            <br>
            Si Aun ve esta página después de 24 horas, puede enviar un correo electrónico a <b-link href="mailto:makingdreams.manager@gmail.com" target="_blank">makingdreams.manager@gmail.com</b-link> para obtener ayuda.
          </p>
      </template>

      <template v-else>
          <h2 class="font-weight-bolder text-center">Bienvenido {{ `${usuario.nombre} ${usuario.apellido} (${usuario.username})` }}</h2>

          <p class="text-center p-1 ">
            Ahora puedes unirte a la junta de {{ 6 | currency }}, será tu primera etapa y podrás escoger tu cupo en el tablero, recuerda que tus siguientes donaciones saldran de las que recibas, iniciaras una gran experiencia en esta gran comunidad.
          </p>
          
          <h2 class="text-danger text-center font-weight-bolder">¡Atención!</h2>

          <p class="text-center text-danger p-1">No escojas tu cupo hasta no estar seguro de enviar tu regalo, ten en cuenta que al momento de escoger tu cupo, tendrás 3 días para enviarlo , de lo contrario el sistema te sacará de tu cupo y luego tendrás que unirte a la junta nuevamente.</p>

          <p class="p-1 text-center">
            Recuerda que esta es una comunidad de ayuda mutua y trabajar en equipo es esencial para que los usuarios puedan capitalizarse y cumplir sus sueños, somos un programa la cual nos brinda la posibilidad de mejorarnos financieramente y con el compromiso de los usuarios lo lograremos.

          </p>

      </template>
    
    </b-container>

    <b-container v-else>

    </b-container>
  </section>

</template>

<script>

import { BRow, BCol,
  BContainer,
  BCard,
  BCardTitle,
  BLink
}
from 'bootstrap-vue'
import { ref, onMounted, watch, toRefs, computed } from 'vue';

import StatisticCardWithLineChart from 'components/dashboard/StaticCardWithLineChart.vue'
import TarjetasAgrupadasStaticas from 'components/dashboard/TarjetasAgrupadasStaticas.vue';

import store from '@/store';
import ApexChart from 'components/ApexChart/ApexChart.vue';

import StatisticCardHorizontal from 'components/dashboard/StatisticCardHorizontal.vue'

import ChartjsPolarArea from 'components/charts/ChartjsPolarArea.vue'

import { chartColors} from '@core/utils/utils';
import { $themeColors } from '@themeConfig'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  
  components: {
    BRow,
    BCol,
    BContainer,
    BCard,
    BCardTitle,
    StatisticCardWithLineChart,
    StatisticCardHorizontal,
    TarjetasAgrupadasStaticas,
    BLink,
    LineChart:() => import('components/charts/LineChart.ts')
  },
  
  setup(props){  
    
    const siteTraffic = ref({});
    const {usuario} = toRefs(store.state.usuario)
    const {sistema} = toRefs(store.state.sistema)

    return {
      usuario,
      siteTraffic,
      sistema
    };

  }


}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '~@core/scss/vue/libs/chart-apex.scss';
.p-1{
  font-size: 16pt;
  line-height: 24pt;
}
</style>
