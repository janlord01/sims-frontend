<template>
  <q-card style="max-width: 960px; width: 960px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Print all {{ userType }} with QrCode </q-toolbar-title>
      <q-btn icon="print" color="purple" v-print="printObj" label="Print All" />

      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div id="printMe">
        <div v-for="item in students">
          <div
            style="
              float: left;
              width: 150px;
              border: solid 1px black;
              padding: 5px;
            "
          >
            <vue-qrcode
              v-if="item.qrcode"
              :value="item.qrcode"
              :options="{
                errorCorrectionLevel: 'Q',
                width: 76,
              }"
              id="qrcode_canvas"
              crossorigin="anonymous"
            ></vue-qrcode
            ><br />
            {{ item.name }}
          </div>
        </div>
        <!-- <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="students"
          :columns="columns"
          row-key="id"
          separator="cell"
          :visible-columns="$q.screen.gt.xs ? ['name'] : ['name']"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                <vue-qrcode
                  v-if="props.row.qrcode"
                  :value="props.row.qrcode"
                  :options="{
                    errorCorrectionLevel: 'Q',
                    width: 76,
                  }"
                  id="qrcode_canvas"
                  crossorigin="anonymous"
                ></vue-qrcode
                ><br />
                {{ props.row.name }}
              </q-td>
              <q-td key="qrcode" :props="props">
                <vue-qrcode
                  v-if="props.row.qrcode"
                  :value="props.row.qrcode"
                  :options="{
                    errorCorrectionLevel: 'Q',
                    width: 76,
                  }"
                  id="qrcode_canvas"
                  crossorigin="anonymous"
                ></vue-qrcode>
              </q-td>
            </q-tr>
          </template>
        </q-table> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";
import VueQrcode from "@chenfengyuan/vue-qrcode";

const props = defineProps(["userType"]);
const students = reactive([]);

// const $q = useQuasar();
const print = async () => {
  await api
    .get("api/" + props.userType, {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      console.log(response);
      Object.entries(response.data.users).map(([key, val]) => {
        students.push({
          name:
            val.lastname +
            ", " +
            val.firstname +
            " " +
            (val.middlename !== null ? val.middlename : ""),
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

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import print from "vue3-print-nb";

const pagination = {
  sortBy: "name",
  rowsPerPage: 0,
};
const columns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "qrcode",
    label: "Qr Code",
    field: "qrcode",
    align: "left",
    sortable: true,
  },
];

export default {
  emits: ["hideImportDialog"],
  props: ["userType"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  directives: {
    print,
  },
  data() {
    return {
      printLoading: true,
      printObj: {
        id: "printMe",
        // asyncUrl(reslove, vue) {
        //   setTimeout(() => {
        //     reslove("http://localhost:9000/user/student/print-all");
        //   }, 2000);
        // },
        // url: "http://localhost:9000/user/student/print-all",
        // preview: true,
        // previewTitle: "Test Title", // The title of the preview window. The default is 打印预览
        popTitle: "All " + this.userType,
        // preview: true,
        // previewTitle: "Test Title",
        // extraCss:
        //   "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        beforeOpenCallback(vue) {
          vue.printLoading = true;
          console.log("打开之前");
        },
        openCallback(vue) {
          vue.printLoading = false;
          console.log("执行了打印");
        },
        closeCallback(vue) {
          console.log("关闭了打印工具");
        },
      },
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    ...mapActions("StudentStore", ["getAllStudent"]),
  },
};
</script>
