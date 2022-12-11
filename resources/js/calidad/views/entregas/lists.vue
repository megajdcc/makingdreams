<template>

   <div class="container-fluid px-0 mx-0">

      <!-- Table Container Card -->
      <b-card no-body class="mb-0">

         <div class="m-2">
            <!-- Table Top -->
            <b-row>
               <!-- Per Page -->
               <b-col cols="12" md="3" class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
                  <per-page v-model="perPage" :perPageOptions="perPageOptions" />
               </b-col>

               <b-col md="9" class="d-flex">

                  <b-input-group size="sm">

                     <b-form-input v-model="searchQuery" placeholder="Buscar... " type="search" />

                     <template #append>
                        <b-button-group size="sm">
                           <b-button variant="primary" :to="{ name: 'create.entrega' }"
                              v-if="$can('write', 'entregas')">
                              <feather-icon icon="PlusSquareIcon" />
                              Añadir
                           </b-button>

                           <b-button variant="dark" title="Cargar Registros de forma masiva" v-b-tooltip
                              v-if="$can('write','entregas')" :to="{name:'cargar.registros'}">
                              <feather-icon icon="UploadIcon" />
                              Cargar
                           </b-button>

                           <b-button variant="dark" title="Descargar Registros" v-b-tooltip  @click="descargarExcel">
                              <feather-icon icon="DownloadIcon" />
                              Descargar
                           </b-button>
                           
                        </b-button-group>
                     </template>
                  </b-input-group>

               </b-col>

            </b-row>

            <b-row>
               <b-col>
                  <ul class="list-group list-group-sm">
                     <li class="list-group-item">
                        <span class="mr-1">   
                           <feather-icon icon="CircleIcon" class="bg-danger text-danger" /> : Importado
                        </span>

                        <span class="mr-1">
                           <feather-icon icon="CircleIcon" class="bg-warning text-warning" /> : Por Asignar
                        </span>


                        <span class="mr-1">
                           <feather-icon icon="CircleIcon" class="bg-info text-info" /> : Asignado
                        </span>
                       
                        <span class="mr-1">
                           <feather-icon icon="CircleIcon" class="bg-info text-info" /> : En Ruta
                        </span>

                        <span class="mr-1">
                           <feather-icon icon="CircleIcon" class="bg-success text-success" /> : Entregado
                        </span>

                        <span class="mr-1">
                           <feather-icon icon="CircleIcon" class="bg-warning text-warning" /> : En Espera o demorado
                        </span>
                       
                     </li>
                  </ul>
                
               </b-col>
            </b-row>

         </div>

         <b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
            :sort-by.sync="sortBy" empty-text="No se encontró ninguna entrega" :sort-desc.sync="isSortDirDesc"
            sticky-header="700px" :no-border-collapse="false" small :busy="loading" show-empty>

            <template #empty>
               <span class="text-nowrap text-center d-block">
                  No se encontró nínguna entrega...
               </span>
            </template>

            <template #table-busy>
               <div class="text-center my-2">
                  <b-spinner class="align-middle" variant="primary"></b-spinner>
                  <strong>Cargando...</strong>
               </div>
            </template>

            <template #cell(id)="{ item, toggleDetails, detailsShowing }">
               <b-button variant="primary" @click="toggleDetails" class="mx-auto text-nowrap" size="sm">
                  <span class="mr-1 fas" :class="detailsShowing ? 'fa-angle-up' : 'fa-angle-down'" />
                  # - {{ item.id }}
               </b-button>
            </template>

            <template #row-details="{ item }">
               <b-container fluid class="content-toggle-table">
                  <b-row>
                     <b-col cols="12" md="6">
                        <table class="table table-hover table-sm">
                           <tr>
                              <td class="text-black">Status:</td>
                              <td><strong class="text-nowrap"> {{ item.status | situacion }}</strong></td>
                           </tr>
                           <tr>
                              <td class="text-black">Contenedor:</td>
                              <td> <strong class="text-nowrap"> {{ item.contenedor ? item.contenedor.contenedor.numero : 'Sin definir' }}</strong></td>
                           </tr>

                           <tr>
                              <td class="text-black">Destino:</td>
                              <td> <strong class="text-nowrap"> {{ item.destino.destino }}</strong></td>
                           </tr>

                           <tr>
                              <td class="text-black">Destinatario:</td>
                              <td>
                                 <strong class="text-nowrap"> {{ item.compania ?
                                 `${item.compania.nombre}` : 'Sin definir' }}</strong>

                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Origen:</td>
                              <td>
                                 <strong class="text-nowrap" v-if="item.contenedor.origen">{{
                                 item.contenedor.origen
                                 }}</strong>
                                 <strong v-else class="text-nowrap text-danger">Sin definir</strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Fecha de llegada:</td>
                              <td v-if="item.contenedor.atraque">
                                 <strong class="text-nowrap" v-if="item.contenedor.atraque.llegada">{{
                                 item.contenedor.atraque.llegada | fecha('D/MM/YYYY') }}</strong>
                                 <strong v-else class="text-nowrap text-danger">Sin definir</strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Barco:</td>
                              <td>
                                 <strong class="text-nowrap" v-if="item.contenedor.atraque">
                                 {{ item.contenedor.atraque.barco.nombre }}</strong>
                                 <strong v-else class="text-nowrap text-danger">Sin definir</strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Viaje:</td>
                              <td>
                                 <strong class="text-nowrap" v-if="item.contenedor.atraque">
                                    {{ item.contenedor.atraque.viaje }}</strong>
                                 <strong v-else class="text-nowrap text-danger">Sin definir</strong>
                              </td>
                           </tr>


                           <tr>
                              <td class="text-black">Puerto de Atraque:</td>
                              <td>
                                 <strong class="text-nowrap" v-if="item.contenedor.atraque">
                                    {{ item.contenedor.atraque.puerto.nombre }}</strong>
                                 <strong v-else class="text-nowrap text-danger">Sin definir</strong>
                              </td>
                           </tr>

                           <tr v-if="item.contenedor.fecha_demora">
                              <td class="text-black">Fecha demora:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.fecha_demora | fecha('D/MM/YYYY') }}
                                 </strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Seal:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.seal ? item.contenedor.seal : 'Sin definir' }}
                                 </strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Hazmat ?:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.hazmat ? 'Sí' : 'Nó' }}
                                 </strong>
                              </td>
                           </tr>


                           <tr>
                              <td class="text-black">Booking:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.booking ? item.contenedor.booking : 'Sin definir' }}
                                 </strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Tipo de carga:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.tipo_carga ? item.contenedor.tipo_carga : 'Sin definir' }}
                                 </strong>
                              </td>
                           </tr>

                           <tr>
                              <td class="text-black">Origen:</td>
                              <td>
                                 <strong class="text-nowrap">
                                    {{ item.contenedor.origen ? item.contenedor.origen : 'Sin definir' }}
                                 </strong>
                              </td>
                           </tr>

                           <tr v-if="item.cita">
                              <td colspan="2">
                                 <strong>Cita de entrega</strong>
                              </td>

                           </tr>

                           <tr v-if="item.cita" >
                              <td>Compañía o particular quien recibe:</td>
                              <td>{{ item.cita.nombre }}</td>
                           </tr>

                           <tr v-if="item.cita">
                              <td>Teléfono:</td>
                              <td>{{ item.cita.telefono }}</td>
                           </tr>

                           <tr v-if="item.cita">
                              <td>Fecha de entrega pautada en la cita:</td>
                              <td>{{ item.cita.fecha | fecha('D/MM/YYYY') }}</td>
                           </tr>

                           <tr v-if="item.cita">
                              <td>Hora de entrega pautada en la cita:</td>
                              <td>{{ `1991-12-30 ${item.cita.hora}` | fecha('h:mm a') }}</td>
                           </tr>

                           <tr v-if="item.cita">
                              <td>Confirmación o nombre:</td>
                              <td>{{ item.cita.confirmacion }}</td>
                           </tr>

                        </table>
                     </b-col>
                     <b-col cols="12" md="6">
                        <h3>Estatus creados</h3>


                        <vue-perfect-scrollbar class="scroll-area"  :settings="{maxScrollbarLength:700}">
                           <app-timeline>
                              <app-timeline-item icon="MapPinIcon" v-for="(estatus, i ) in item.statuses" :key="i">

                                 <div
                                    class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
                                    <h6>
                                       <b-badge variant="primary">{{ estatus.situacion | situacion }}</b-badge>
                                    </h6>
                                    <small class="text-muted">{{ estatus.created_at | fecha('D/MM/YYYY h:mm a') }}</small>
                                 </div>

                                 <p>{{ estatus.comentario }}</p>

                                 <b-media v-if="estatus.usuario">
                                    <template #aside>
                                       <b-avatar :src="`/storage/img-perfil/${ estatus.usuario.avatar }`" />
                                    </template>
                                    <h6>{{ estatus.usuario.nombre }} {{ estatus.usuario.apellido }}</h6>
                                    <p>{{ estatus.usuario.rol.nombre }}</p>
                                 </b-media>

                              </app-timeline-item>
                           </app-timeline>
                        </vue-perfect-scrollbar>

                     </b-col>
                  </b-row>
               </b-container>
            </template>



            <template #cell(status)="{item}">
               <b-button :to="{name:'show.status',params:{id:item.id}}" title="Mostrar Estatus" plain size="sm"
                  variant="outline-primary" v-b-tooltip.hover.topright>
                  {{ item.status | situacion }}
                  <feather-icon icon="MapIcon" />
               </b-button>
            </template>

            <template #cell(contenedor)="{item}">
               <strong class="text-nowrap"> {{ item.contenedor ? item.contenedor.contenedor.numero : 'Sin definir' }}</strong>
            </template>

            <template #cell(destino)="{item}">

               <b-button size="sm" variant="dark" @click="showDestino(item.destino.id)">
                  <feather-icon icon="DownloadIcon" />
                  {{ item.destino.destino }}
               </b-button>
            
            </template>

            <template #cell(destinatario)="{item}">
               <strong class="text-nowrap"> {{ item.compania ?
               `${item.compania.nombre}` : 'Sin definir' }}</strong>
            </template>

            <template #cell(origen)="{item}">
               <strong class="text-nowrap" v-if="item.contenedor.origen">{{
               item.contenedor.origen
               }}</strong>
               <strong v-else class="text-nowrap text-danger">Sin definir</strong>
            </template>

            <template #cell(fecha_llegada)="{item}">
               <strong class="text-nowrap" v-if="item.contenedor.atraque && item.contenedor.atraque.llegada">{{
               item.contenedor.atraque.llegada | fecha('D/MM/YYYY') }}</strong>
               <strong v-else class="text-nowrap text-danger">Sin definir</strong>

            </template>

            <!-- Column: Actions -->
            <template #cell(actions)="{ item }">

               <b-button-group size="sm">


                  <b-button variant="success" title="Generar orden de entrega"  :to="{name:'create.orden',params:{entrega_id:item.id}}" v-if="$can('write', 'ordenes') && !item.orden">
                     <feather-icon icon="CheckIcon" />
                  </b-button>

                  <b-button variant="primary" title="Ver orden de entrega" :to="{name:'show.orden',params:{id:item.orden.id}}"
                     v-if="$can('read', 'ordenes') && item.orden">
                     <feather-icon icon="EyeIcon" />
                  </b-button>

                  <b-button variant="warning" title="Asignar viajes de entregas y retorno" :to="{name:'listar.viajes',params:{id:item.id}}" v-if="$can('read', 'viajes')">
                     <feather-icon icon="TruckIcon" />
                  </b-button>

                  <b-button variant="info" title="Confirmar cita" @click="mostrarCita(item)"
                     v-if="$can('read', 'entregas')">
                     <feather-icon icon="CheckCircleIcon" />
                  </b-button>

                  <b-button variant="secondary" title="Información Adicional" @click="mostrarInformacionAdicional(item)" v-if="$can('read', 'entregas')">
                     <feather-icon icon="InfoIcon" />
                  </b-button>


                  <b-button variant="dark" title="Comentarios" @click="showComentarios(item)"
                     v-if="$can('read', 'comentarios')">
                     <feather-icon icon="MessageSquareIcon" />
                  </b-button>


                  <b-button variant="warning" title="Archivos" :to="{name:'listar.archivos',params:{id:item.id}}"
                     v-if="$can('read', 'archivos')">
                     <span class="fas fa-archive"></span>
                  </b-button>


                  <b-button variant="primary" title="Editar" :to="{ name: 'edit.entrega', params: { id: item.id } }"
                     v-if="$can('update', 'entregas')">
                     <feather-icon icon="EditIcon" />
                  </b-button>

                  <b-button variant="danger" @click="eliminar(item.id)" title="Eliminar entrega"
                     v-if="$can('delete', 'entregas')">
                     <feather-icon icon="Trash2Icon" />
                  </b-button>
               </b-button-group>

            </template>

         </b-table>

         <paginate-table :dataMeta="dataMeta" :currentPage.sync="currentPage" :perPage="perPage" :total="total" />

         <chat-dialog size="lg" :id="id" :showDialog.sync="showDialog" :chat="comentarios"
            @handleSubmit="guardarComentario" ref="chat" />

      </b-card>

      <b-sidebar v-model="showCita" left title="Cita de entrega" backdrop>
         <b-container fluid>
            <b-row>
               <b-col cols="12">
                  <validation-observer ref="formValidate" #default="{handleSubmit}">
                     <b-form @submit.prevent="handleSubmit(guardar)">

                         <b-form-group description="Compañía o persona que va a recibir al Container">
                           <template #label>
                              Compañía o Nombre: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="fecha" rules="required" #default="{errors}">
                              
                              <b-form-input v-model="formulario.nombre" :state="errors.length ? false : null" />

                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           
                           </validation-provider>
                        </b-form-group>

                        <b-form-group description="Teléfono de la persona encargada de recibir">
                           <template #label>
                              Teléfono:
                           </template>
                        
                           <validation-provider name="telefono" #default="{errors}">
                              <b-form-input v-model="formulario.telefono" :state="errors.length ? false : null" type="tel" />
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>


                        <b-form-group>
                           <template #label>
                              Fecha: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="fecha" rules="required" #default="{errors}">
                              <flat-pickr v-model="formulario.fecha" class="form-control"
                                 :config="{ dateFormat: 'Y-m-d'}" placeholder="YYYY-MM-DD" />
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                        <b-form-group>
                           <template #label>
                              Hora: <span class="text-danger">*</span>
                           </template>
                        
                           <validation-provider name="hora" #default="{errors}">
                              <flat-pickr v-model="formulario.hora" class="form-control" :config="{ dateFormat: 'H:i', enableTime:true,noCalendar:true}"
                                 placeholder="00:00" />
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group>
                           <template #label>
                              Confirmación o nombre: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="confirmacion" rules="required" #default="{errors}">
                              <b-form-input v-model="formulario.confirmacion" :state="errors.length ? false : null" />
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                           </validation-provider>
                        </b-form-group>

                       

                        <b-button-group size="sm">
                           <b-button type="submit" variant="primary" title="Guardar" v-b-tooltip.hover v-if="$can('write','citas')">
                              <feather-icon icon="SaveIcon" />
                              Guardar
                           </b-button>
                        </b-button-group>


                     </b-form>
                  </validation-observer>
               </b-col>
            </b-row>

         </b-container>
      </b-sidebar>

      <b-sidebar v-model="showAdicional" left title="Información adicional" backdrop>
         <b-container fluid>
            <b-row>
               <b-col cols="12" v-if="entrega">
                  <validation-observer ref="validateForm" #default="{handleSubmit}">
                     <b-form @submit.prevent="handleSubmit(guardarInformacionAdicional)">
      
                        <b-form-group>
                           <template #label>
                              PO:
                           </template>
      
                           <validation-provider name="po" #default="{errors}">
      
                              <b-form-input v-model="entrega.informacion_adicional.po" :state="errors.length ? false : null" />
      
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
      
                           </validation-provider>
                        </b-form-group>
      
                        <b-form-group>
                           <template #label>
                              Invoice Nro:
                           </template>
                        
                           <validation-provider name="invoice" #default="{errors}">
                        
                              <b-form-input v-model="entrega.informacion_adicional.invoice" :state="errors.length ? false : null" />
                        
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>
      
      
                     <b-form-group>
                        <template #label>
                           Sales Order :
                        </template>
                     
                        <validation-provider name="sales_order" #default="{errors}">
                     
                           <b-form-input v-model="entrega.informacion_adicional.sales_order" :state="errors.length ? false : null" />
                     
                           <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                           </b-form-invalid-feedback>
                     
                        </validation-provider>
                     </b-form-group>
      
                        <b-form-group>
                           <template #label>
                              Shipment:
                           </template>
                        
                           <validation-provider name="shipment" #default="{errors}">
                        
                              <b-form-input v-model="entrega.informacion_adicional.shipment" :state="errors.length ? false : null" />
                        
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>

                        </b-form-group>
      
                        <b-button-group size="sm">
                           <b-button type="submit" variant="primary" title="Guardar" v-b-tooltip.hover v-if="$can('write','entregas')">
                              <feather-icon icon="SaveIcon" />
                              Guardar
                           </b-button>
                        </b-button-group>
      
      
                     </b-form>
                  </validation-observer>
               </b-col>
            </b-row>
      
         </b-container>
      </b-sidebar>

      <b-sidebar v-model="isShowDestino" left title="Destino de la entrega" backdrop>
         <b-container fluid>
            <b-row>
               <b-col cols="12">
                  <validation-observer ref="formValidateDestino" #default="{handleSubmit}">
                     <b-form @submit.prevent="handleSubmit(guardarDatosDestino)">
      
                        <b-form-group description="Nombre del destino">
                           <template #label>
                              Nombre: <span class="text-danger">*</span>
                           </template>
                        
                           <validation-provider name="destino" rules="required" #default="{ errors }">
                              <b-form-input v-model="formDestino.destino" :state="errors.length ? false : null" />
                        
                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>

      
                       <b-form-group>
                        <template #label>
                           Compañía: <span class="text-danger">*</span>
                        </template>

                        <validation-provider name="compania_id" rules="required" #default="{errors}">
                           <v-select v-model="formDestino.compania_id" :reduce="(val) => val.id"  :options="companias" label="nombre" disabled />
                           
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                              {{ errors[0] }}
                              </b-form-invalid-feedback>
                        </validation-provider> 
                     </b-form-group>
      
      
                        <b-form-group>
                           <template #label>
                              Pais: <span class="text-danger">*</span>
                           </template>
                        
                           <validation-provider name="pais_id" rules="required" #default="{ errors }">
                              <v-select v-model="pais_id" @change="cargarEstados(pais_id)" :reduce="(option) => option.value"
                                 placeholder="Seleccione" :options="paises.map(val => { return {label:val.pais,value:val.id} })" />
                        
                              <b-form-invalid-feedback :state="errors.length ? false : null">
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>
                        
                           </validation-provider>
                        </b-form-group>

                        <b-form-group>
                           <template #label>
                              Estado: <span class="text-danger">*</span>
                           </template>

                           <validation-provider name="estado_id" rules="required" #default="{ errors }">
                              <v-select v-model="formDestino.estado_id" placeholder="Seleccione"
                                 @input="cargarCiudades(formDestino.estado_id)" :reduce="(option) => option.value"
                                 :options="estados.map(val => { return {label:val.estado,value:val.id} })" />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>

                        <b-form-group>
                           <template #label>
                              Municipio (Pueblo):
                           </template>

                           <validation-provider name="ciudad_id" #default="{ errors }">
                              <v-select v-model="formDestino.ciudad_id" placeholder="Seleccione"
                                 :options="ciudades.map(val => { return {label:val.ciudad,value:val.id} })"
                                 :reduce="(option) => option.value " />

                              <b-form-invalid-feedback>
                                 {{ errors[0] }}
                              </b-form-invalid-feedback>

                           </validation-provider>
                        </b-form-group>


      
                    
      
                        <b-button-group size="sm">
                           <b-button type="submit" variant="primary" title="Guardar" v-b-tooltip.hover
                              v-if="$can('write','entregas')">
                              <feather-icon icon="SaveIcon" />
                              Guardar
                           </b-button>
                        </b-button-group>
      
      
                     </b-form>
                  </validation-observer>
               </b-col>
            </b-row>
      
         </b-container>
      </b-sidebar>

   </div>

</template>

<script>

import {
   BCard,
   BRow,
   BCol,
   BTable,
   BBadge,
   BFormInput,
   BInputGroup,
   BButton,
   BButtonGroup,
   BSpinner,
   BAvatar,
   BMedia,
   BLink,
   VBTooltip,
   BContainer,
   BSidebar,
   BForm,
   BFormGroup,
   BFormInvalidFeedback
} from 'bootstrap-vue';

import { computed,ref,toRefs,onMounted } from 'vue';
import store from '@/store';
import useEntregaList from './useEntregaList';

import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter';
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import flatPickr from 'vue-flatpickr-component'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import {required} from '@validations'
import xlsx from 'xlsx';

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { getStatus } from '@core/utils/utils'
import useDireccion from '@core/utils/useDireccion';
export default {
   props: ['id'],

   components: {
      BCard,
      BRow,
      BCol,
      BTable,
      BInputGroup,
      BBadge,
      BFormInput,
      vSelect,
      BButton,
      BButtonGroup,
      BSpinner,
      BAvatar,
      BMedia,
      BLink,
      BContainer,
      BForm,
      PaginateTable: () => import('components/PaginateTable'),
      PerPage: () => import('components/PerPage'),
      ChatDialog:() => import('components/ChatDialog.vue'),
      BSidebar,
      BFormGroup,
      BFormInvalidFeedback,
      ValidationObserver,
      ValidationProvider,
      flatPickr,
      AppTimeline,
      AppTimelineItem,
      VuePerfectScrollbar


   },

   directives:{
      'b-tooltip':VBTooltip
   },

   setup(props) {

      const showDialog = ref(false)
      const comentarios = ref([])
      const id  = ref(null)
      const showCita = ref(false)
      const showAdicional = ref(false)
      const entrega = ref(null)
      const isShowDestino = ref(false)
      const formValidateDestino = ref(null)

      const {destinos} = toRefs(store.state.destino)
      const {companias} = toRefs(store.state.compania)


      const formDestino = computed(() => store.getters['destino/draft']) 

      const formulario = ref({
         id          : null,
         nombre:null,
         fecha       : null,
         hora        : null,
         telefono    : null,
         entrega_id  : null,
         confirmacion: null
      });



      const {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refTable,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData,
         cliente_id,
         estatus,
         estatusOptions,
         entregas,


      } = useEntregaList()


      const {
         paises,
         ciudades,
         estados,
         cargarPaises,
         cargarEstados,
         cargarCiudades,
         pais_id,
      } = useDireccion()


      const showComentarios = (entrega) => {
         id.value = entrega.id
         comentarios.value = entrega.comentarios
         showDialog.value = true
      }

      const guardarComentario = (data) => {

         store.dispatch('entrega/addComentario',data).then(({result,comentario}) => {

            if(result){
               toast.success('Comentario generado con éxito')
               comentarios.value.push(comentario);
            }else{
               toast.error('El comentario no se registró')
            }
            
         }).catch(e => {
            console.log(e)
         })

      }  

      const guardar = () => {

         store.dispatch('entrega/guardarCita',formulario.value).then(({result}) => {
            
            if(result){
               toast.success('Se ha guardado con éxito la cita')
               setTimeOut(() => {
                  refetchData();
               },3000)
            }else{
               toast.error('No se pudo guardar, inténtelo de nuevo')
            }

         }).catch(e => console.log(e))

      }
      
      const mostrarCita = (entrega) => {
         
         formulario.value = {
            id: null,
            nombre:null,
            fecha: null,
            hora:null,
            telefono:null,
            entrega_id: entrega.id,
            confirmacion: null
         }

         if(entrega.cita){
            formulario.value = entrega.cita;
         }

         showCita.value = true

      }

      const mostrarInformacionAdicional = (val) => {

         // console.log(val);

         if (!val.informacion_adicional){

            val.informacion_adicional = {
               po         : null,
               invoice    : null,
               sales_order: null,
               shipment   : null
            }

         }

         entrega.value = val

         showAdicional.value = true

      }


      const descargarExcel = () => {

         let dataExport = entregas.value.map((val) => {

            let fecha_sacado = 'Sin definir'
            let chofer = 'Sin definir'
            let chofer_trae = 'Sin definir'
            let fecha_devuelto = 'Sin definir'


            if(val.viajes.length){

               let viaje = val.viajes.find(v => v.tipo_viaje == 1)

               if(viaje != undefined){
                
                  fecha_sacado = viaje.fecha
                  chofer = viaje.chofer ? viaje.nombre +' '+viaje.chofer.apellido : 'Sin definir'
               
               }


               const traida = val.viajes.find(v => v.tipo_viaje == 2)

               if (traida != undefined) {

                  fecha_devuelto = traida.fecha
                  chofer_trae = traida.chofer ? traida.nombre + ' ' + traida.chofer.apellido : 'Sin definir'

               }


            }

            return {
               'Entrega Nro': val.id,
               'LLegada':val.contenedor.atraque.llegada ? val.contenedor.atraque.llegada : 'Sin definir',
               'Status':getStatus(val.status),
               'Barco':val.contenedor.atraque.barco.nombre,
               'Viaje':val.contenedor.atraque.viaje,
               'Seal':val.contenedor.seal,
               'Demora':val.contenedor.fecha_demora,
               'Contenedor': val.contenedor ? val.contenedor.contenedor.numero : 'SIn definir',
               'Fecha Sacado': fecha_sacado,
               'Tipo carga' :val.contenedor.tipo_carga,
               'Fecha entrega':val.cita ? val.cita.fecha : 'Sin definir',
               'Cliente':val.compania.nombre,
               'Pueblo':val.destino.destino,
               'Chofer': chofer,
               'Fecha de Dev': fecha_devuelto,
               'Chofer devuelve': chofer_trae,
               'PO':val.informacion_adicional ? val.informacion_adicional.po : 'Sin definir',
               'Sales Order': val.informacion_adicional ? val.informacion_adicional.sales_order : 'Sin definir',
               'Invoice Nro': val.informacion_adicional ? val.informacion_adicional.invoice : 'Sin definir',
               'Shipment': val.informacion_adicional ? val.informacion_adicional.shipment : 'Sin definir',
               'Delivery':val.orden ? val.orden.numero : 'Sin definir'
            }

         })



         let data = xlsx.utils.json_to_sheet(dataExport)
         // console.log(data);
         // data.Cells["Adultos"].AutoFitColumns();
         // var ws = xlsx.utils.aoa_to_sheet(data);
         // console.log(ws);
         // data.Cells['a1:l50'].AutoFitColumns();

         var wscols = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
         ];

         data['!cols'] = wscols;

         const workbook = xlsx.utils.book_new()

         const filename = 'Entregas'
         xlsx.utils.book_append_sheet(workbook, data, filename)
         xlsx.writeFile(workbook, `${filename}.xlsx`)

      }

      
      const guardarInformacionAdicional = () => {

         store.dispatch('entrega/guardarInformacionAdicional',entrega.value).then(({result,entrega}) => {

            if(result){
               toast.success('Información adicional guardada con éxito')
               
               setTimeout(() => {
                  refetchData();
               },1000)

               entrega.value = entrega
            }else{
               toast.info('No se pudo guardar la información adicional, inténtelo de nuevo mas tarde')
            }

         }).catch(e => {
            console.log(e)
         })
      }  


      onMounted(() => {
         setTimeout(() => {
            refetchData()
         },1500)
       
      })

      const showDestino = (destino_id) => {

         if(!paises.value.length){
            cargarPaises()
         }

         if(!companias.value.length){

            store.dispatch('compania/getCompanias')

         }

         if(!destinos.value.length){
            
            store.dispatch('destino/fetchDestino',destino_id).then((data) => {
               store.commit('destino/setDestino',data)

               if(data.estado_id){

                  pais_id.value = data.estado.pais_id
                  cargarCiudades(data.estado_id)
                  formDestino.value.estado_id = data.estado_id;
                
               }

       
            })

         }else{
            store.commit('destino/capturar',destino_id)
         }

         isShowDestino.value = true

      }

      const guardarDatosDestino = () => {

         store.dispatch('destino/guardar',formDestino.value).then(({result}) => {
            
            if(result){
               toast.success("Se ha guardado con éxito el destino...")
               // store.commit('destino/clear')
               isShowDestino.value = false;

            }else{

               toast.info('No se ha podido guardar el destino')
            
            }

         }).catch(e => {
            if(e.response.status === 422){
               formValidateDestino.value.setErrors(e.response.data.errors)
            }

            console.log(e)

         })

      }

      return {
         perPageOptions,
         currentPage,
         perPage,
         searchQuery,
         sortBy,
         isSortDirDesc,
         refTable,
         total,
         dataMeta,
         refetchData,
         eliminar,
         tableColumns,
         fetchData,
         camiones: computed(() => store.state.camion.camiones),
         loading: computed(() => store.state.loading),
         avatarText,
         cliente_id,
         estatus,
         estatusOptions,
         showComentarios,
         showDialog,
         comentarios,
         guardarComentario,
         id,
         showCita,
         required,
         guardar,
         mostrarCita,
         formulario,
         mostrarInformacionAdicional,
         showAdicional,
         guardarInformacionAdicional,
         entrega,
         descargarExcel,
         showDestino,
         isShowDestino,
         formValidateDestino,
         guardarDatosDestino,
         formDestino,
         companias,

         // Destinos
         paises,
         ciudades,
         estados,
         cargarEstados,
         cargarCiudades,
         pais_id,

      }


   },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';

.scroll-area {
   position: relative;
   margin: auto;
   width: 400px;
   height: 300px;
}

.content-toggle-table{

   color:black !important;

   td,h3,h6,small{
    color: black !important;
   }


   
}

</style>
