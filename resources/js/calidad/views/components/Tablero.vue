<template>
  <section>
     <organization-chart :datasource="beneficiario" class="h-auto border-0" v-loading="loading" @node-click="nodoSeleccionado"> 
            <template #default="{ nodeData: data }">
                  <section class="d-flex flex-column align-items-center justify-content-center cursor-pointer">
                   <b-avatar size="lg" rounded="circle" :src="data.avatar"></b-avatar>
                    <b-card no-body class="my-0" style="padding:.5rem">
                      <h6 class="mt-0 font-weight-bolder">{{ data.title }}</h6>
                    </b-card>
                 </section>
        
            </template>
          </organization-chart>

          <b-sidebar v-model="isShowASignacion" no-close-on-esc no-close-on-backdrop title="Asignación de Puesto">
            <validation-observer ref="formValidate" #default="{handleSubmit}">
              <b-form @submit.prevent="handleSubmit(asignar)">
                 <b-container fluid>
                    <b-row>
                      <b-col cols="12">
                        <b-form-group >
                          <template #label>
                            Usuario: <span clas="text-danger">*</span>
                          </template>

                          <validation-provider name="usuario_id" rules="required" #default="{valid,errors}">
                            <v-select v-model="formulario.usuario_id"  :options="usuarios" :reduce="option => option.id" label="nombre"></v-select>

                            <b-form-invalid-feedback :state="valid">
                              {{ errors[0]  }}
                            </b-form-invalid-feedback>
                          </validation-provider>

                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row>
                      <b-col cols="12">
                        <b-button-group size="sm">
                          <b-button variant="primary" type="submit" title="guardar" v-loading="loading" :disabled="loading">
                            <font-awesome-icon icon="fas fa-save"/>
                            Guardar
                          </b-button>
                        </b-button-group>
                      </b-col>
                    </b-row>
                </b-container>
              </b-form>
            </validation-observer>
           
          </b-sidebar>
  </section>
   
</template>

<script>

import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'
import store from '@/store'
import {computed,onMounted,toRefs,ref,watch,inject} from 'vue'
import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate'

import {required} from '@validations'
import vSelect from 'vue-select'


import {
  BAvatar,
  BCard,
  BSidebar,
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButtonGroup,
  BButton
} from 'bootstrap-vue'

export default {
  
  components:{
    OrganizationChart,
    BAvatar,
    BCard,
    BSidebar,

    BContainer,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButtonGroup,
    BButton,
    ValidationObserver,
    ValidationProvider,

    vSelect


  },

  props:{
    puestos:Array,
    tableroId:Number,
    etapa:Number
  },

  setup(props,{emit}){
    const {puestos, tableroId,etapa } = toRefs(props)
    
    const noBeneficiarios = ref([])
    const swal = inject('swal')
    const isShowASignacion = ref(false)
    const {puesto:formulario} = toRefs(store.state.puesto)
    const {usuarios} = toRefs(store.state.usuario)
    const formValidate = ref(null)

    const beneficiario = ref({
      id:1,
      identificador:1,
      title: 'Sin ocupar',
      name: 'Sin ocupar',
      avatar: null,
      position: 1,
      ocupado:false,
      tablero_id:null,
      children: []
    });

    const nodos = ref({});
    
    store.dispatch('usuario/cargarUsuarios')


    const cargarChart = () => {
      // if(!usuarios.value.length){
        
      // }
      
      let benef = puestos.value.find(val => val.is_beneficiario);

      if(benef){
        beneficiario.value = {
          ...beneficiario.value,
          ...{
            id: 1,
            identificador:benef.id,
            title: `${benef.beneficiario.username}`,
            name: `${benef.beneficiario.username}`,
            avatar: benef.beneficiario.avatar,
            ocupado: true,
            position: benef.ubicacion,
          },

        }
      }else{
        beneficiario.value  = {
          id: 1,
          identificador: 1,
          title: 'Sin ocupar',
          name: 'Sin ocupar',
          avatar: null,
          position: 1,
          ocupado: false,
          tablero_id: null,
          children: []
        } 
      }

      cargarPuestos()
     
    }
    
    const cargarPuestos = () => {

      let hijo2 = puestos.value.find(val => val.ubicacion == 2);
      let hijo3 = puestos.value.find(val => val.ubicacion == 3);
      let hijo4 = puestos.value.find(val => val.ubicacion == 4);
      let hijo5 = puestos.value.find(val => val.ubicacion == 5);
      let hijo6 = puestos.value.find(val => val.ubicacion == 6);
      let hijo7 = puestos.value.find(val => val.ubicacion == 7);
      let hijo8 = puestos.value.find(val => val.ubicacion == 8);
      let hijo9 = puestos.value.find(val => val.ubicacion == 9);
      let hijo10 = puestos.value.find(val => val.ubicacion == 10);
      let hijo11 = puestos.value.find(val => val.ubicacion == 11);
      let hijo12 = puestos.value.find(val => val.ubicacion == 12);
      let hijo13 = puestos.value.find(val => val.ubicacion == 13);
      let hijo14 = puestos.value.find(val => val.ubicacion == 14);
      let hijo15 = puestos.value.find(val => val.ubicacion == 15);

      let hijos = [
        {
          id: 2,
          identificador: hijo2 ? hijo2.id : 2,
          name: hijo2 ? hijo2.beneficiario.username : 'Sin Ocupar',
          title: hijo2 ? hijo2.beneficiario.username : 'Sin Ocupar',
          ocupado: hijo2 ? true : false,
          position: 2,
          padre:1,
          children: [
            {
              id: 4,
              identificador: hijo4 ? hijo4.id : 4,
              name: hijo4 ? hijo4.beneficiario.username : 'Sin Ocupar',
              title: hijo4 ? hijo4.beneficiario.username : 'Sin Ocupar',
              ocupado: hijo4 ? true : false,
              padre:2,
              position: 4,
              children: [
                {
                  id:8,
                  identificador: hijo8 ? hijo8.id : 8,
                  name: hijo8 ? hijo8.beneficiario.username : 'Sin Ocupar',
                  title: hijo8 ? hijo8.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo8 ? true : false,
                  padre:4,
                  position: 8,
                },
                {
                  id: 9,
                  identificador: hijo9 ? hijo9.id : 9,
                  name: hijo9 ? hijo9.beneficiario.username : 'Sin Ocupar',
                  title: hijo9 ? hijo9.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo9 ? true : false,
                  padre:4,
                  position: 9,
                },
              ]
            },
            {
              id:5,
              identificador: hijo5 ? hijo5.id : 5,
              name: hijo5 ? hijo5.beneficiario.username : 'Sin Ocupar',
              title: hijo5 ? hijo5.beneficiario.username : 'Sin Ocupar',
              ocupado: hijo5 ? true : false,
              position: 5,
              padre:2,
              children: [
                {
                  id: 10,
                  identificador: hijo10 ? hijo10.id : 10,
                  name: hijo10 ? hijo10.beneficiario.username : 'Sin Ocupar',
                  title: hijo10 ? hijo10.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo10 ? true : false,
                  padre:5,
                  position: 10,
                },
                {
                  id: 11,
                  identificador: hijo11 ? hijo11.id : 11,
                  name: hijo11 ? hijo11.beneficiario.username : 'Sin Ocupar',
                  title: hijo11 ? hijo11.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo11 ? true : false,
                  position: 11,
                  padre: 5,

                },
              ]
            },
          ]
        },
        {
          id: 3,
          identificador: hijo3 ? hijo3.id : 3,
          name: hijo3 ? hijo3.beneficiario.username : 'Sin Ocupar',
          title: hijo3 ? hijo3.beneficiario.username : 'Sin Ocupar',
          ocupado: hijo3 ? true : false,
          position: 3,
          padre:1,
          children: [
            {
              id: 6,
              identificador: hijo6 ? hijo6.id : 6,

              name: hijo6 ? hijo6.beneficiario.username : 'Sin Ocupar',
              title: hijo6 ? hijo6.beneficiario.username : 'Sin Ocupar',
              ocupado: hijo6 ? true : false,
              position: 6,
              padre:3,
              children: [
                {
                  id:12,
                  identificador: hijo12 ? hijo12.id : 12,
                  name: hijo12 ? hijo12.beneficiario.username : 'Sin Ocupar',
                  title: hijo12 ? hijo12.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo12 ? true : false,
                  position: 12,
                  padre: 6,

                },
                {
                  id: 13,
                  identificador: hijo13 ? hijo13.id : 13,
                  name: hijo13 ? hijo13.beneficiario.username : 'Sin Ocupar',
                  title: hijo13 ? hijo13.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo13 ? true : false,
                  position: 13,
                  padre:6
                },
              ]
            },
            {
              id:7,
              identificador: hijo7 ? hijo7.id : 7,
              name: hijo7 ? hijo7.beneficiario.username : 'Sin Ocupar',
              title: hijo7 ? hijo7.beneficiario.username : 'Sin Ocupar',
              ocupado: hijo7 ? true : false,
              position: 7,
              padre:3,
              children: [
                {
                  id: 14,
                  identificador: hijo14 ? hijo14.id : 14,
                  name: hijo14 ? hijo14.beneficiario.username : 'Sin Ocupar',
                  title: hijo14 ? hijo14.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo14 ? true : false,
                  position: 14,
                  padre:7,
                },
                {
                  id: 15,
                  identificador: hijo15 ? hijo15.id : 15,
                  name: hijo15 ? hijo15.beneficiario.username : 'Sin Ocupar',
                  title: hijo15 ? hijo15.beneficiario.username : 'Sin Ocupar',
                  ocupado: hijo15 ? true : false,
                  position: 15,
                  padre: 7,

                },
              ]
            },
          ]
        }
      ];

      
      noBeneficiarios.value = hijos;  
      beneficiario.value.children = noBeneficiarios.value
      nodos.value = beneficiario.value

    }

    onMounted(() => {
      cargarChart();
    })

    watch([puestos,etapa],() => cargarChart())

    const nodoSeleccionado = (nodo) => {
        

      const showMensaje = () => {
          swal({
          icon: 'info',
          title: 'Oops',
          text: 'Debes seleccionar un nodo libre que esté por encima de este',

        })
      }


      const estaOcupado = (position, children) => {
        for (let i = 0; i < children.length; i++) {
          const objeto = children[i];
          if (objeto.position === position) {
            return objeto.ocupado;
          }
          if (objeto.children && objeto.children.length > 0) {
            const estaOcupadoEnHijos = estaOcupado(position, objeto.children);
            if (estaOcupadoEnHijos !== false) {
              return estaOcupadoEnHijos;
            }
          }
        }
        return false;
      };




      const isOcupado = (ubi_verificar,children) => {
        
            return children.find(val => {
              
              if(val.position == ubi_verificar){
                console.log(val.position)
                return true;
              }else{
                return val.children ? isOcupado(ubi_verificar,val.children) : false;
              }

            })

        
       
      }
 
      const verificarPosition = (position) => {
        // console.log('position',position)
        // console.log('estaOcupado', estaOcupado(position, nodos.value.children));

        if(position == 1){
          return beneficiario.value.ocupado  ? true : estaOcupado(position, nodos.value.children)
        }

        return estaOcupado(position, nodos.value.children);

        // const encontrado = position == 1 ? beneficiario.value :  

        // if(encontrado){
        //   console.log('encontrado',encontrado)
        //   return encontrado.ocupado ? true : encontrado.padre ? verificarPosition(encontrado.padre) : false
        // }
      }


      const isForm = () => {
        formulario.value.ubicacion = nodo.position
        formulario.value.tablero_id = tableroId.value
        isShowASignacion.value = true
      }

        if(nodo.ocupado){
          swal({
            icon: 'info',
            title: 'Oops, ya ocupado por otro usuario',
            text: 'Intenta con otro puesto, que diga sin ocupar',
          })
        }else{
          switch (nodo.position) {

              case 1 :
                  if (nodo.ocupado) {
                     swal({
                          icon: 'info',
                          title: 'Oops, ya ocupado por otro usuario',
                          text: 'Intenta con otro usuario puesto, que diga sin ocupar',
                        })
                  } else {
                    isForm()
                  }
                break;
              case 2:
                  if(!beneficiario.value.ocupado){
                      showMensaje()
                  }else{
                    isForm()
                  }
                break;

              case 3:
                if (!beneficiario.value.ocupado) {
                  showMensaje()
                } else {
                  isForm()
                }
              break;
          
            default:
                if(verificarPosition(nodo.padre)){
                    isForm()
                }else{
                  showMensaje()
                }

              break;
          }
          
        }


    }

    const asignar = () => {
      store.dispatch('puesto/guardar',formulario.value).then(({result,puesto}) => {
        if(result){
          swal({
            icon: 'success',
            title: 'Asignación con éxito',
            text: !puesto.is_beneficiario ? 
                    `El usuario ${puesto.beneficiario.nombre} ${puesto.beneficiario.apellido}, tiene 6 horas para realizar el deposito al Beneficiario` 
                    : '',
          })
          isShowASignacion.value = false
          emit('reload')
        }else{
          toast.info('No se pudo asignar al puesto',{position:'bottom-right'})
        }
      }).catch(e => {
        if(e.response.status === 422){
          formValidate.value.setErrors(e.response.data.errors)
        }
      })
    }

    return {
      loading:computed(() => store.state.loading),
      nodos,
      nodoSeleccionado,
      isShowASignacion,
      required,
      asignar,
      formulario,
      usuarios,
      formValidate,
      noBeneficiarios,
      beneficiario,
    }
  }

}
</script>

<style lang="scss">
@import '@/assets/scss/variables/variables';

.tablero {
  width: 100%;
  overflow-x: scroll;

  article {
    width: 130px;
    max-width: 130px;
  }
}

.orgchart {
  background-image: none;
  background-size: none;
}

.orgchart .lines .topLine {
  border-top: 2px solid $primary;
}

.orgchart .lines .rightLine {
  border-right: 1px solid $primary;
  float: none;
  border-radius: 0
}

.orgchart .lines .leftLine {
  border-left: 1px solid $primary;
  float: none;
  border-radius: 0
}

.orgchart .lines .downLine {
  background-color: $primary;
  margin: 0 auto;
  height: 20px;
  width: 2px;
  float: none;
}</style>