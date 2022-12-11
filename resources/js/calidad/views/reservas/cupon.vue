<template>
  <b-card>
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="row" v-if="reserva.cupon && reserva.pagada">


          <pdf :src="`/storage/reservas/cupones/${reserva.cupon}`"
            style="
              display: inline-block;
              width: 100%;
              max-heigth: 450px;
              overflow-y: auto !important;
            ">
            </pdf>
        </div>
      </div>

      <div class="col-12 col-md-4">

        <b-button-group size="sm">
           <b-button
              variant="primary"
              title="Enviar Cupón"
              v-b-tooltip.hover
              @click="enviarCupon" >
                <feather-icon icon="SaveIcon" />
          Enviar Cupón
        </b-button>

        <b-link :href="`/storage/reservas/cupones/${reserva.cupon}`" variant="primary" target="_blank" download>
            <feather-icon icon="DownloadIcon" />
            Descargar
        </b-link>
        </b-button-group>
      
        <el-divider></el-divider>

        <p>
          <strong>Importante:</strong> Los cupones se envían de forma automática
          a los invitados, una vez pagada la reserva, puedes volver a enviar
          cuando quieras, y a tí, te llegará una copia del mismo...
        </p>
        <p>
          <strong>Nota:</strong> Si el navegador fue incapaz de renderizar el cupón, recuerda que siempre lo puedes descargar con el link de descarga... 
        </p>

      </div>
    </div>
  </b-card>
</template>

<script>
import store from "@/store";
import { ref, toRefs, onMounted, watch } from "@vue/composition-api";
import { BCard, BButton, VBTooltip,BLink,BButtonGroup} from "bootstrap-vue";
import pdf from "vue-pdf";

import { Notification } from "element-ui";

export default {
  props: ["id"],

  components: {
    BCard,
    pdf,
    BButton,
    BLink,
    BButtonGroup
  },

  directives: {
    "b-tooltip": VBTooltip,
  },

  setup(props) {
    let { reservaciones } = toRefs(store.state.reserva);
    const reserva = ref({
      id: null,
      nro_reserva: null,
      reservante: "",
      email: "",
      telefono: null,
      pagada: false,
      total_pagar: 0,
      boda_id: null,
      facturacion: false,
      datos_facturacion: {},
      aprobada: null,
      check_in: null,
      check_out: null,
      noches: 0,
      boda: null,
      habitaciones: [],
      pagos: [],
      cupon: null,
    });

    const cargarForm = () => {
      // console.log(reservaciones.value);
      if (reservaciones.value.length > 0) {
        store.commit("reserva/capturarReserva", props.id);
        reserva.value = store.state.reserva.reserva;
        // if(!reserva.value.cupon){

        //    store.dispatch('reserva/createCupon',props.id).then(respon => {
        //       store.commit('setCupon',respon.data.cupon);

        //    })

        // }
      } else {
        store.dispatch("reserva/cargarReservaciones");
      }
    };

    onMounted(() => {
      cargarForm();
    });

    watch(reservaciones, () => {
      // console.log('cargando desde el oyente')
      cargarForm();
    });

    const enviarCupon = () => {
      store
        .dispatch("reserva/enviarCupon", props.id)
        .then((respon) => {
          if (respon.data.result) {
            Notification.success({
              title: "El cupón se ha enviado al invitado!",
              message: "Te hemos enviado a tu correo una copia del cupón.",
            });
          } else {
            Notification.info(
              "No se pudo enviar el cupón, inténtelo de nuevo mas tarde."
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      reserva,
      cargarForm,
      enviarCupon,
    };
  },
};
</script>