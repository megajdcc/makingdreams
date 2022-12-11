<template >
   <b-card>
      <b-contatiner fluid>
         <b-row>
            <b-col cols="12">
               
               <el-upload class="upload-demo w-100 d-flex justify-content-center" drag multiple thumbnail-mode accept=".xlsx,.xls,.ods,.csv"
                  auto-upload :limit="limiteCarga" name="archivos" :action="urlAction" list-type="text"
                  :on-exceed="limiteAlcanzado" :headers="headerPeticion" :on-success="archivoCargado"
                  :before-upload="confirmarCarga">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">Suelta tus archivos o <em> haz clic para cargar</em></div>
               </el-upload>

               <strong>Asuntos a tener en cuenta antes de cargar archivos</strong>

               <ul>
                  <li>Descargue el <b-link class="font-weight-bolder" href="/storage/upload-example.xlsx" download target="_blank"> <feather-icon icon="DownloadIcon" /> Archivo de ejemplo</b-link> 
                   y tenga en cuenta que su archivo debe tener los mismos nombre de columnas y su posición.</li>
                  <li>El archivo debe ser xls, xlsx (excel) o csv.</li>
                  <li>El archivo no debe pesar menos de 8mb.</li>
                  <li>Solo puedes cargar 5 archivos a la vez.</li>
                  <li>En la carga se considera que los nombre de columnas estén en la primera linea</li>
                  <li>Los nombre de la columnas deben llamarse tal cual al del ejemplo</li>
                  <li>Es importante no olvidar que despues de la carga puede necesitar agregar mas información asociada a la entrega</li>
                  <li>Las columnas marcadas en color Verde son Obligatoria</li>
                  <li>Las fechas deben tener el siguiente formato MM/DD/YYYY Ejemplo 12/30/1991</li>
               </ul>
            </b-col>
         </b-row>
         <b-row>
         </b-row>
      </b-contatiner>
   </b-card>
</template>


<script>

import {ref,onMounted,toRefs,computed} from 'vue';
import store from '@/store'

import {
   BCard,
   BContainer,
   BRow,
   BCol,
   BForm,
   BLink
   
} from 'bootstrap-vue'

export default{  

   components:{
       BCard,
      BContainer,
      BRow,
      BCol,
      BForm,
      BLink
   },

   setup(props,{emit}){
      const limiteCarga = ref(5)
      const urlAction = ref('/api/entregas/upload/archivos');
      const headerPeticion = ref({
         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      })

      const archivoCargado = ({fallas,result}, file, fileList) => {
         if (fallas.length > 0) {
            toast.error('Error al cargar el archivo')
         } else {
            toast.success('Carga exitosa de registros')
         }
      }

      const confirmarCarga = (file) => {

         const isValidPeso = file.size / 8098 / 8098 < 2;

         if (!isValidPeso) {
            toast.info('El archivo no debe exceder los 8mb!');
         }

         return isValidPeso;
      }
      
      return{
         loading:computed(() => store.state.loading),
         limiteCarga,
         urlAction,
         limiteAlcanzado:(files, fileList) => {
            toast.info('Es un solo archivo, si quieres subir mas, limpia e intentalo de nuevo')
         },

         headerPeticion,
         archivoCargado,
         confirmarCarga

      }
   }

}
</script>