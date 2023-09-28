<template>
  <q-card style="max-width: 960px; width: 960px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Print all Parent with QrCode </q-toolbar-title>
      <q-btn icon="print" color="purple" v-print="printObj" label="Print All" />

      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div id="printMe">
        <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="students"
          :columns="columns"
          row-key="id"
          separator="cell"
          :visible-columns="
            $q.screen.gt.xs ? ['name', 'qrcode'] : ['name', 'qrcode']
          "
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="qrcode" :props="props">
                <!-- {{ props.row.qrcode }} -->
                <vue-qrcode
                  v-if="props.row.qrcode"
                  :value="props.row.qrcode"
                  :options="{
                    errorCorrectionLevel: 'Q',
                    width: 120,
                  }"
                  id="qrcode_canvas"
                  crossorigin="anonymous"
                ></vue-qrcode>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <!-- <table
          style="
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
            margin-left: 1%;
          "
        >
          <thead>
            <tr>
              <th style="border: 1px solid #000; width: 200px">Name</th>
              <th style="border: 1px solid #000; width: 50px">Qr Code</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in students">
              <td style="text-align: left">
                <span style="display: block; font-size: 16px">
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
                      width: 120,
                    }"
                    id="qrcode_canvas"
                    crossorigin="anonymous"
                  ></vue-qrcode>
                </span>
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
      <!-- <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onImport"
      >
        <div class="">
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum! Provident
              similique accusantium nemo autem. Veritatis obcaecati tenetur iure
              eius earum ut molestias architecto voluptate aliquam nihil,
              eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
              tenetur error, harum nesciunt ipsum debitis quas aliquid.
              Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa
              laudantium molestias eos sapiente officiis modi at sunt excepturi
              expedita sint? Sed quibusdam recusandae alias error harum maxime
              adipisci amet laborum. Perspiciatis minima nesciunt dolorem!
              Officiis iure rerum voluptates a cumque velit quibusdam sed amet
              tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat,
              temporibus enim commodi iusto libero magni deleniti quod quam
              consequuntur! Commodi minima excepturi repudiandae velit hic
              maxime doloremque. Quaerat provident commodi consectetur veniam
              similique ad earum omnis ipsum saepe, voluptas, hic voluptates
              pariatur est explicabo fugiat, dolorum eligendi quam cupiditate
              excepturi mollitia maiores labore suscipit quas? Nulla, placeat.
              Voluptatem quaerat non architecto ab laudantium modi minima sunt
              esse temporibus sint culpa, recusandae aliquam numquam totam
              ratione voluptas quod exercitationem fuga. Possimus quis earum
              veniam quasi aliquam eligendi, placeat qui corporis!
            </p>
          </div>

          <q-btn
            unelevated
            label="Print"
            class="text-center"
            color="green"
            size="md"
            type="submit"
          />
        </div>
      </q-form> -->
    </q-card-section>
  </q-card>
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
    .get("api/parent", {
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
        popTitle: "All Students",
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
