<template>
  <q-card style="max-width: 400px; width: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Import Parent </q-toolbar-title>
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
      this.$q.loading.show();
      // console.log(this.files);
      // let f = e.target.files[0];
      let formData = new FormData();
      formData.append("files", this.files);
      // formData.append("_method", "PATCH");
      // console.log(formData);
      api
        .post("/api/parent/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          //   console.log(response.data.data.data.message);
          // const message = response.data.data.message ? response.data.data.message : null;
          //   console.log(message);
          if (response.data.status === 200) {
            // console.log(response.data.data.message);
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                timeout: 3000,
                message: response.data.message,
              });
              this.rowDatas = [];
              // this.statusSent = true;
              this.$q.loading.hide();

              this.$emit("hideImportDialog");
            }, 2000);

            // this.statusSent = false;
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
                icon: "error",
                timeout: 3000,
              });
            }, 2000);

            // this.statusSent = false;
          }
          this.getAllParent();
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.loading.hide();

            this.$q.notify({
              type: "negative",
              color: "negative",
              position: "top",
              timeout: 3000,
              message: "Something went wrong! Please try again..",
            });
          }, 3000);
        });
    },
    ...mapActions("ParentStore", ["getAllParent"]),
  },
};
</script>
