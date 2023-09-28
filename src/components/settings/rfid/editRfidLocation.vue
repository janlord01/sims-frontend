<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Location </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.location"
            label="Location"
            name="title"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" />
            </template>
          </q-input>
          <q-select
            filled
            :options="scanners"
            v-model="formData.scanner"
            label="Assign Scanner"
            class="q-mr-sm col-3 q-mt-md full-width"
            stack-label
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" />
            </template>
          </q-select>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
export default {
  emits: ["hideEditDialog"],
  props: ["locationId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        location: "",
        scanner: [],
        scanner_id: "",
      },
      scanners: [],
    };
  },
  methods: {
    ...mapActions("RfidStore", ["getAllLocations"]),
    async getLocation() {
      await api
        .get("/api/qrcode/rfid/location/" + this.locationId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          this.formData.location = response.data.data.location;
          this.formData.scanner_id = response.data.data.user_id;
          this.formData.scanner.label = response.data.data.name;
          this.formData.scanner.value = response.data.data.user_id;
          // Object.entries(response.data.data).map(([key, val]) => {
          //   this.formData.scanner.push({
          //     label: val.name,
          //     value: val.user_id,
          //   });
          // });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getScannerUser() {
      await api
        .get("/api/qrcode/rfid/scanners", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.scanners.push({
              label: val.name,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();
      await api
        .patch(
          "/api/qrcode/rfid/location/update/" + this.locationId,
          {
            location: this.formData.location,
            scanner:
              this.formData.scanner.value !== ""
                ? this.formData.scanner.value
                : null,
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
                message: response.data.message,
                timeout: 3000,
                position: "top",
              });
              this.$q.loading.hide();
              this.$emit("hideEditDialog");
              this.getAllLocations();
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
                timeout: 3000,
                position: "top",
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
          this.$q.notify({
            type: "positive",
            message: error.data.errors.message,
            icon: "save",
          });
        });
    },
    ...mapActions("FileStore", ["getAllFiles"]),
  },
  mounted() {
    this.getScannerUser();
    this.getLocation();
  },
};
</script>
