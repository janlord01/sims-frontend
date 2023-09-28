<template>
  <q-page class="">
    <div
      class="text-black no-shadow q-pa-md rounded-borders"
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6">Time-Out</q-toolbar-title>
      </q-toolbar>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div
          class="row q-col-gutter-none relative-position stream border-solid"
        >
          <!-- <div class="q-col-5">
            <q-avatar size="180px"
              ><q-img
                spinner-color="white"
                style="height: 180px; max-width: 200px"
                :src="formData.image_path"
                v-if="formData.image_path"
              />
              <q-icon name="account_circle" color="grey" size="200px" />
            </q-avatar>
            <br />
          </div> -->
          <!-- <div class="center col-5 q-mr-sm stream">
            <qr-stream @decode="onDecode" class="mb">
              <div style="color: red" class="frame"></div>
            </qr-stream>
            <div class="result">Result: {{ data }}</div> -->
          <!-- <qrcode-stream @detect="onDetect">
              <div style="color: red" class="frame"></div>
            </qrcode-stream> -->

          <!-- <QrcodeStream @decode="onDecode" class="mb">
              <div style="color: red" class="frame"></div>
            </QrcodeStream> -->
          <!-- </div> -->
          <!-- <div class="col-12 q-mr-sm">
            <q-input
              filled
              v-model="searchMember"
              label="Search Member"
              class="col-3 full-width"
              type="text"
              @click="searchVisible = true"
              @keydown.esc="searchVisible = false"
              @update:model-value="searchVisible = true"
              @keyup="searchMemberFunc"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-list
              bordered
              separator
              class="full-width text-white z-max bg-grey-10"
              v-if="searchVisible && memberToggle"
            >
              <p
                clickable
                v-ripple
                v-for="item in filterMember"
                v-bind:key="item.id"
              >
                <q-item
                  clickable
                  v-ripple
                  v-for="member in item"
                  :key="member.id"
                  @click="selectStudent(member)"
                >
                  <q-item-section>
                    <q-item-label class="text-white">{{
                      member.name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </p>
            </q-list>
          </div> -->
        </div>
        <div>
          <div class="row q-col-gutter-none relative-position q-mt-lg q-mb-md">
            <div
              :class="
                $q.screen.gt.xs
                  ? 'col-5 text-center item-center'
                  : 'full-width text-center q-mb-sm'
              "
            >
              <div class="center q-mr-sm stream">
                <qr-stream @decode="onDecode" class="mb">
                  <div style="color: red" class="frame"></div>
                </qr-stream>
                <div class="result">Result: {{ sData }}</div>
                <!-- <qrcode-stream @detect="onDetect">
              <div style="color: red" class="frame"></div>
            </qrcode-stream> -->

                <!-- <QrcodeStream @decode="onDecode" class="mb">
              <div style="color: red" class="frame"></div>
            </QrcodeStream> -->
              </div>
              <!-- <div class="">
                <q-avatar size="180px"
                  ><q-img
                    spinner-color="white"
                    style="height: 180px; max-width: 200px"
                    :src="formData.image_path"
                    v-if="formData.image_path"
                  />
                  <q-icon name="account_circle" color="grey" size="140px" />
                </q-avatar>
                <br />
              </div> -->
            </div>
            <div
              :class="$q.screen.gt.xs ? 'col-6 q-ml-md ' : 'full-width q-mb-sm'"
            >
              <div class="row q-col-gutter-none relative-position">
                <div class="stream q-mb-md">
                  <q-avatar size="180px"
                    ><q-img
                      spinner-color="white"
                      style="height: 180px; max-width: 200px"
                      :src="formData.image_path"
                      v-if="formData.image_path"
                    />
                    <q-icon name="account_circle" color="grey" size="200px" />
                  </q-avatar>
                  <br />
                </div>
                <div
                  :class="
                    $q.screen.gt.xs
                      ? 'full-width q-mb-md q-mr-sm'
                      : 'full-width q-mb-sm'
                  "
                >
                  <q-input
                    filled
                    readonly
                    label="Name"
                    type="text"
                    v-model="formData.name"
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                </div>
                <div
                  :class="
                    $q.screen.gt.xs
                      ? 'full-width q-mb-md q-mr-sm'
                      : 'full-width q-mb-sm'
                  "
                >
                  <q-input
                    filled
                    readonly
                    label="Birthday"
                    type="text"
                    v-model="formData.dob"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" />
                    </template>
                  </q-input>
                </div>
                <div
                  :class="
                    $q.screen.gt.xs
                      ? 'full-width q-mr-sm'
                      : 'full-width q-mb-sm'
                  "
                >
                  <q-btn
                    unelevated
                    v-if="searchMember"
                    label="Time-in"
                    :class="
                      $q.screen.gt.xs ? 'text-center' : 'full-width q-mt-sm'
                    "
                    color="primary"
                    size="md"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </div>
    <!-- <q-dialog v-model="showCheckInDialog">
      <CheckIn @hide-checkin-dialog="showCheckInDialog = !showCheckInDialog" />
    </q-dialog> -->
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage, date } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
// import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
import { QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
// import VueQrcode from "@chenfengyuan/vue-qrcode";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      formData: {
        image_path: "",
        name: "",
        dob: "",
      },
      searchMember: null,
      searchVisible: false,
      memberToggle: true,
      filterMember: {},
      sData: null,
      newToken: LocalStorage.getItem("jwt"),
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
    ...mapActions("StudentStore", ["onSearch"]),
    onDecode(data) {
      // console.log(Date(Date.now()).toString());
      if (data !== "") {
        setTimeout(() => {
          this.sData = data;
          this.onSubmit(this.sData);
        }, 1000);
      }

      // console.log(data);
      //   qrcode.data = data;
    },
    async onSubmit(data) {
      this.$q.loading.show();
      await api
        .post(
          "/api/qrcode/rfid/scan",
          {
            type: "time-out",
            qrcode: data,
            // time: Date.now(),
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              this.formData.name = response.data.data.name;
              this.formData.image_path = response.data.data.profile_image;
              this.formData.dob = date.formatDate(
                response.data.data.dob,
                "YYYY-MMM-DD"
              );
              this.$q.loading.hide();
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchMemberFunc() {},
    selectStudent() {},
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllStudent();
  },
  components: {
    QrStream,
    QrCapture,
    QrDropzone,
    // QrcodeStream,
    // QrcodeDropZone,
    // QrcodeCapture,
  },
});
</script>
<style scope>
.stream {
  max-height: 500px;
  max-width: 500px;
  margin: auto;
}
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}

.frame {
  border-style: solid;
  border-width: 2px;
  border-color: red;
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
}
</style>
