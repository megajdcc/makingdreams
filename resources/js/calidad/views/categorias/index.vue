<template>
   <div class="container-fluid px-0 mx-0">
      <div class="row w-100 px-0 mx-0">
         <div class="col-12 px-0 mx-0">
            <router-view></router-view>
         </div>
      </div>
   </div>
</template>

<script>

import useAppConfig from '@core/app-config/useAppConfig'

export default {

   setup(props) {
      let {
         routerTransition
      } = useAppConfig();

      return {
         routerTransition
      }
   }

}
</script>
