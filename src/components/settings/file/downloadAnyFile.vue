<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Semester </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!loadingSpinner"
      />
      <div class="row q-mt-lg align-center">
        <a :href="file" style="text-decoration: none; margin: 10px auto" target="_blank">
          <q-btn
            unelevated
            icon="download"
            label="Download file"
            class="text-center"
            style=""
            color="secondary"
            size="md"
            type="submit"
          />
        </a>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
export default {
  props: ["fileId", "file"],
  emits: ["showDowloadDialog"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        title: "",
        no_of_months: "",
      },
      loadingSpinner: true,
    };
  },
  methods: {
    // async getFile() {
    //   await api
    //     .get("/api/settings/file/download/{id}" + this.fileId, {
    //       headers: {
    //         Authorization: "Bearer " + this.newToken,
    //       },
    //     })
    //     .then((response) => {
    //       // console.log(response);
    //       this.formData.title = response.data.semester.title
    //         ? response.data.semester.title
    //         : "";
    //       this.formData.no_of_months = response.data.semester.no_of_months
    //         ? response.data.semester.no_of_months
    //         : "";
    //       //   console.log(this.formData.title);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // async onSubmit() {
    //   await api
    //     .patch(
    //       "/api/settings/semester/" + this.semId,
    //       {
    //         title: this.formData.title,
    //         no_of_months: this.formData.no_of_months,
    //       },
    //       {
    //         headers: {
    //           Authorization: "Bearer " + this.newToken,
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       // console.log(response);
    //       this.loadingSpinner = false;
    //       const errors = response.data.error ? response.data.error : null;
    //       if (response.data.error) {
    //         setTimeout(() => {
    //           //   Object.entries(errors).forEach((msg) => {
    //           this.$q.notify({
    //             type: "negative",
    //             message: response.data.error,
    //             icon: "error",
    //           });
    //           //   });
    //           this.loadingSpinner = true;
    //           this.formData.title = "";
    //           this.formData.no_of_months = "";
    //         }, 2000);
    //       } else {
    //         setTimeout(() => {
    //           this.loadingSpinner = true;
    //           //   Object.entries(response.data.message).forEach((msg) => {
    //           this.$q.notify({
    //             type: "positive",
    //             message: response.data.message,
    //             icon: "save",
    //           });
    //           //   });
    //           this.$emit("hideEditDialog");
    //           this.getAllSemester();
    //         }, 2000);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    ...mapActions("FileStore", ["getAllFiles"]),
  },
  mounted() {
    // this.getFile();
  },
};
</script>
