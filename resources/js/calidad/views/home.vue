<template>
  <section id="dashboard">
    <b-container fluid>

    </b-container>
  </section>
</template>

<script>

import { BRow, BCol,
  BContainer,
  BCard,
  BCardTitle,
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
    LineChart:() => import('components/charts/LineChart.ts')
  },
  
  setup(props){  
    
    const siteTraffic = ref({});

    return {
      siteTraffic,
    };

  }


}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '~@core/scss/vue/libs/chart-apex.scss';
</style>
