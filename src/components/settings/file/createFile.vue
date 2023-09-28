<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Upload File </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!loadingSpinner"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.title"
            label="Docs (ex. Student File.docx)"
            name="title"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.descr"
            label="Description"
            class="q-mr-sm col-3 q-mt-md full-width"
          >
            <template v-slot:prepend>
              <q-icon name="description"> </q-icon>
            </template>
          </q-input>
          <q-uploader
            label="Select File"
            class="q-mr-sm col-3 q-mt-md full-width"
            color="secondary"
            accept="image/*,.csv,.txt,.xlx,.xls,.xlsx,.pdf,.doc,.docx"
            :max-file-size="20000000"
            square
            hide-upload-btn
            flat
            @added="file_selected"
            bordered
          >
          </q-uploader>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Upload"
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
  emits: ["hideCreateDialog"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        title: "",
        descr: "",
        file: "",
      },
      loadingSpinner: true,
    };
  },
  methods: {
    file_selected: function (file) {
      console.log(file);
      this.formData.file = file[0];
    },
    async onSubmit() {
      const fileData = new FormData();
      fileData.append("title", this.formData.title);
      fileData.append("descr", this.formData.descr);
      fileData.append("file", this.formData.file);
      //   fileData.append("_method", "POST");
      await api
        .post("/api/settings/file", fileData, {
          headers: {
            Authorization: "Bearer " + this.newToken,
            //   "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          this.loadingSpinner = false;
          let errs = null;

          errs = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errs !== null) {
            setTimeout(() => {
              //   Object.entries(errors).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: errs,
                icon: "error",
              });
              //   });
              this.loadingSpinner = true;
              this.formData.year = "";
              this.formData.due = "";
            }, 2000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              //   Object.entries(response.data.message).forEach((msg) => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
              });
              //   });
              this.$emit("hideCreateDialog");
              this.getAllFiles();
            }, 2000);
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
    ...mapActions("FileStore", ["getAllFiles"]),
  },
};
</script>
