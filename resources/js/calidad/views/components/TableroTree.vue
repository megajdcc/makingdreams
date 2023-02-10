<template>
    <section class="tableros-container bg-red d-flex flex-column h-100 w-100 align-items-center">
      <section v-for="(nodo, i) in nodos" :key="i" class="nodo d-flex flex-column align-items-center">
          <article class="tablero mt-3">

          </article>

      </section>
    </section>  
</template>

<script>

import {computed,toRefs,ref} from 'vue'
export default{

  props:{
    nodos:Number
  },


  setup(props){

    return {
      loading:computed(() => store.state.loading)
    }

  }

}

</script>

<style lang="scss">
.tableros-container {
  
      width: 100%;
      height: auto;
      overflow-y: scroll;
  
     
  
      .tablero {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: white;
        cursor: pointer;
        transition: 1.5s ease;
  

  
      }
  
    }
</style>