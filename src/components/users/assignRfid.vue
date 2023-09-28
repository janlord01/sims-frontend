<template>
  <q-card
    style="max-width: 500px; width: 500px"
    class="rfid_card"
    @click="rfidCard('f1')"
  >
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Scan to Assign </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none" style="margin-top: -20px">
          <q-input
            filled
            v-model="formData.code"
            label="RFID"
            name="name"
            class="q-mr-sm full-width"
            id="rfitInput"
            style="opacity: 0"
            ref="f1"
            autofocus
            type="text"
            @keyup="scanRfid"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code_scanner" />
            </template>
          </q-input>

          <div class="text-center items-center item-center full-width">
            <p class="text-h5">Tap To Scan</p>
            <q-icon name="qr_code_scanner" :size="$q.screen.gt.xs ? '200px' : '150px'" />
            <p>
              <!-- code:  -->
              {{ formData.code }}
            </p>

            <p class="text-h6 text-negative">
              Please dont type anything in the keyboard.
            </p>
          </div>
        </div>
        <!-- <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div> -->
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideRfidDialog"],
  props: ["userId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        code: null,
      },
      loadingSpinner: true,
      requiredRule,
      getDean: [],
      activeInput: null,
    };
  },
  methods: {
    ...mapActions("RfidStore", ["getAllRfids"]),
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
    scanRfid() {
      if (this.formData.code !== null) {
        setTimeout(() => {
          if (this.formData.code.length <= 7) {
            this.$q.notify({
              type: "negative",
              position: "top",
              message: "Please dont type anything in the keyboard",
              timeout: 5000,
            });
            this.formData.code = null;
          } else {
            console.log(this.formData.code);
            this.onSubmit();
          }
        }, 300);
      }
    },
    rfidCard(ref) {
      // console.log(this.formData.code);
      this.activeInput = ref;

      this.$nextTick(() => this.$refs[this.activeInput].focus());
      // console.log(this.$refs[this.activeInput]);
    },

    async onSubmit() {
      this.$q.loading.show();
      await api
        .patch(
          "/api/rfid/assign/" + this.userId,
          {
            // params: {
            rfid: this.formData.code,
            // },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          // console.log(response);
          this.formData.code = null;

          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              // this.formData.code = null;
              // this.getAllRfids();
              this.$q.loading.hide();
              this.$emit("hideRfidDialog");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                position: "top",
                timeout: 5000,
                message: response.data.message,
              });
              this.$q.loading.hide();
              this.getAllParent();
              this.getAllTeacher();
              this.getAllEmployee();
              this.getAllStudent();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          //   this.$q.notify({
          //     type: "positive",
          //     message: error.data.errors.message,
          //     icon: "save",
          //   });
        });
    },
    ...mapActions("CollegeStore", ["getAllColleges"]),
  },
  mounted() {},
};
</script>
