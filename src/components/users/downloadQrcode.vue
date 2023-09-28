<template>
  <q-card style="max-width: 400px; width: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Save QRcode </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mr-sm text-center">
            <!-- <vue-qrcode
              size="200px"
              :value="formData.code"
              :options="{ width: 300 }"
              v-model="qrcodevalue"
              tag="img"
            ></vue-qrcode> -->
            <vue-qrcode
              v-if="formData.code"
              :value="formData.code"
              :options="{
                errorCorrectionLevel: 'Q',
                width: 200,
              }"
              @ready="onReady"
              id="qrcode_canvas"
              crossorigin="anonymous"
            ></vue-qrcode>
          </div>
        </div>

        <div class="row align-center text-center">
          <q-btn
            unelevated
            label="Save"
            class="text-center"
            icon="save"
            style="margin: auto"
            color="secondary"
            size="md"
            type="button"
            @click="downloadFunc"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
const emit = defineEmits(["hidePasswordDialog"]);
const props = defineProps(["memberId"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const isPwd = ref(true);
const isPwdCon = ref(true);

const qrcodevalue = ref(null);

const onReady = (canvas) => {
  const context = canvas.getContext("2d");
  const image = new Image();
  // console.log(canvas);
  image.src = "https://avatars.githubusercontent.com/u/3456749";
  image.crossorigin = "anonymous";
  image.onload = () => {
    const coverage = 0.15;
    const width = Math.round(canvas.width * coverage);
    const x = (canvas.width - width) / 2;

    // drawImage(context, image, x, x, width, width);
  };
};

const drawImage = (context, image, x, y, width, height, radius = 4) => {
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 4;
  context.shadowColor = "#00000040";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.strokeStyle = "#fff";
  context.stroke();
  context.clip();
  context.fillStyle = "#fff";
  context.fillRect(x, x, width, height);
  context.drawImage(image, x, x, width, height);
};

const codes = reactive([]);
const $q = useQuasar();
const getMemberData = () => {
  api
    .get("/api/student/" + props.memberId + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.firstname = response.data.users.firstname;
      formData.code = response.data.users.qrcode;
    })
    .catch((error) => {
      console.log(error);
    });
};

const downloadFunc = () => {
  // console.log(formData.code);
  var canvas = document.getElementById("qrcode_canvas");
  // Convert the canvas to data
  var imageUrl = canvas.toDataURL();
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = formData.firstname + formData.code + ".png";
  // Attach the data to the link
  aDownloadLink.href = imageUrl;
  // Get the code to click the download link

  aDownloadLink.click();
};
// const getCodesFunc = () => {
//   Object.entries(codesStore.rowDatas).map(([key, val]) => {
//     codes.push({
//       label: val.code,
//       value: val.id,
//     });
//   });
// };

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/member/change-password/" + props.memberId,
      {
        password: formData.password,
        password_confirmation: formData.confirmed_password,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
      if (response.data.status == 200) {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          userStore.getAllMembers();
          emit("hidePasswordDialog");
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            icon: "error",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  // getCodesFunc();
  getMemberData();
  // console.log(codes);
});

const formData = reactive({
  code: null,
  firstname: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
