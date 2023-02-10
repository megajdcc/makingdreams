<template>
      <tablero-tree  :nodos="nodos" />

      <!-- <section class="d-flex justify-content-center container-first  w-100 flex-column align-items-center">
      
            <article class="tablero">
            
            </article>

            <section class="d-flex justify-content-around  container-second w-100" >
            
              <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center " >
                    <article class="tablero">

                    </article>

                    <section class="d-flex justify-content-around  container-second w-100">
                    
                      <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center">

                        <article class="tablero"> 
                    
                        </article>

                        <section class="d-flex justify-content-around  container-second w-100">
                        
                          <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                            <article class="tablero">
                        
                            </article>
                          </section>
                        
                          <section class="flex-grow-1  d-flex justify-content-center ">
                            <article class="tablero">
                        
                            </article>
                          </section>
                        
                        </section>

                      </section>
                    
                      <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center  ">
                        <article class="tablero">
                    
                        </article>

                        <section class="d-flex justify-content-around  container-second w-100">
                        
                          <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                            <article class="tablero">
                        
                            </article>
                          </section>
                        
                          <section class="flex-grow-1  d-flex justify-content-center ">
                            <article class="tablero">
                        
                            </article>
                          </section>
                        
                        </section>

                      </section>
                    
                    </section>

                </section>

                <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center  ">
                    
                    <article class="tablero">
                    
                    </article>

                    <section class="d-flex justify-content-around  container-second w-100">
                      
                        <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                          <article class="tablero">
                      
                          </article>

                          <section class="d-flex justify-content-around  container-second w-100">
                            
                              <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                                <article class="tablero">
                            
                                </article>
                              </section>
                            
                                <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center">
                                  <article class="tablero">
                                
                                  </article>
                                
                                  <section class="d-flex justify-content-around  container-second w-100">
                                
                                    <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                                      <article class="tablero">
                                
                                      </article>
                                    </section>
                                
                                    <section class="flex-grow-1  d-flex justify-content-center ">
                                      <article class="tablero">
                                
                                      </article>
                                    </section>
                                
                                  </section>
                                
                                
                                </section>
                            
                          </section>

                        </section>
                      
                        <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center">
                          <article class="tablero">
                      
                          </article>


                          <section class="d-flex justify-content-around  container-second w-100">
                          
                            <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center">
                              <article class="tablero">
                          
                              </article>

                                <section class="d-flex justify-content-around  container-second w-100">
                                
                                  <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                                    <article class="tablero">
                                
                                    </article>
                                  </section>
                                
                                  <section class="flex-grow-1  d-flex justify-content-center ">
                                    <article class="tablero">
                                
                                    </article>
                                  </section>
                                
                                </section>

                            </section>
                          
                            <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center">
                              <article class="tablero">
                          
                              </article>

                                <section class="d-flex justify-content-around  container-second w-100">
                                
                                  <section class="flex-grow-1  d-flex justify-content-center flex-column align-items-center ">
                                    <article class="tablero">
                                
                                    </article>
                                  </section>
                                
                                  <section class="flex-grow-1  d-flex justify-content-center ">
                                    <article class="tablero">
                                
                                    </article>
                                  </section>
                                
                                </section>


                            </section>
                          
                          </section>


                        </section>
                      
                    </section>
                    
                </section>

            </section>

        </section> -->


</template>

<script>

import store from '@/store'

import {toRefs,ref,computed} from 'vue'


export default {

  components:{
    TableroTree:() => import('components/TableroTree.vue')
  },


  setup(){
    
  }

}

</script>

<style lang="scss">
.tableros-container{

    width:100%;
    height: auto;
    overflow-y: scroll;

    .container-first {
      // height : 60px;
      width: 100%;
      // border-radius: 50%;
      position:relative;
    }
  
    .container-second {
      // height: 60px;
      // width:75%;
      margin-top: 4rem;
      position: relative;
    }
  
    .tablero {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: white;
      cursor:pointer;
      transition:1.5s ease;
      &:hover{
        // transform: scale(1.4, 0.5);
        // width: 70px;
        // height: 70px;
        
      }

    }

}
</style>