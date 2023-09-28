<template>
  <q-page style="margin-right: 10px">
    <table
      style="
        width: 40%;
        border-collapse: collapse;
        font-size: 8px;
        margin-left: 1%;
      "
    >
      <thead>
        <tr>
          <th style="border: 1px solid #000; width: 50px">Name</th>
          <th style="border: 1px solid #000; width: 50px">Qr Code</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in students">
          <td style="text-align: left">
            <span style="display: block">
              {{ item.name }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              <vue-qrcode
                v-if="item.qrcode"
                :value="item.qrcode"
                :options="{
                  errorCorrectionLevel: 'Q',
                  width: 100,
                }"
                id="qrcode_canvas"
                crossorigin="anonymous"
              ></vue-qrcode>
              <!-- {{ item.qrcode }} -->
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";
import VueQrcode from "@chenfengyuan/vue-qrcode";

const students = reactive([]);

// const $q = useQuasar();
const print = async () => {
  await api
    .get("api/student", {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      console.log(response);
      Object.entries(response.data.users).map(([key, val]) => {
        students.push({
          name: val.lastname + ", " + val.firstname + " " + val.middlename,
          qrcode: val.qrcode,
        });
      });
    })
    .catch((error) => {
      console.log(error);
      Notify.create({
        type: "negative",
        color: "negative",
        timeout: 3000,
        message: error.response.data.message,
      });
    });
};
const newToken = ref(LocalStorage.getItem("jwt"));

onMounted(() => {
  // getCodesFunc();
  print();
  // console.log(codes);
});
</script>
<style>
.search_input {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
