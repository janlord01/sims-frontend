<template>
  <q-card style="max-width: 400px; width: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Import Employee </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!statusSent"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onImport"
      >
        <div class="">
          <q-file
            v-model="files"
            label="Attach Excel File"
            square
            flat
            counter
            outlined
            use-chips
            clearable
            name="files"
            accept=".xls,.xlsx"
            max-file-size="5120000"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-btn
            unelevated
            label="Import"
            class="text-center"
            color="green"
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
  emits: ["hideImportDialog"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      files: null,
      statusSent: true,

      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    onImport() {
      let formData = new FormData();
      formData.append("files", this.files);
      api
        .post("/api/employee/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          const message = response.data.data.message ? response.data.data.message : null;

          if (message) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                message: response.data.data.message,
                icon: "check_circle",
              });
              this.rowDatas = [];
              this.statusSent = true;
              this.$emit("hideImportDialog");
            }, 2000);

            this.statusSent = false;
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: "Some are imported successfully but errors bellow are not!",
                icon: "error",
              });
              Object.entries(response.data.data.errors.message).forEach((err) => {
                this.$q.notify({
                  type: "negative",
                  message: err[1]["errors"] + " " + err[1]["values"]["email"],
                  icon: "error",
                });
                this.$emit("hideImportDialog");
                this.statusSent = true;
              });
            }, 2000);

            this.statusSent = false;
          }
          this.getAllEmployee();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
  },
};
</script>
