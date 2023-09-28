<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Print SOA/Student Schedule </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-mt-sm align-center">
          <q-btn
            unelevated
            label="Print SOA"
            class="text-center q-mr-sm q-ml-lg"
            color="secondary"
            size="md"
            type="button"
            icon="print"
            :to="'/admission/' + admissionId + '/print-soa'"
            target="_blank"
          />
          <q-btn
            unelevated
            label="Print Student Schedule"
            class="text-center"
            color="secondary"
            size="md"
            :to="'/admission/' + admissionId + '/print-schedule'"
            target="_blank"
            type="button"
            icon="print"
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
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideCreateDialog"],
  props: ["admissionId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        code: "",
        descr: "",
        name: "",
        col: "",
        // year: "",
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
    };
  },
  methods: {
    async getCollegesList() {
      await api
        .get("/api/courses/list/colleges/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.colleges).map(([key, val]) => {
            this.getCollege.push({
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
      //   const fileData = new FormData();
      //   fileData.append("name", this.formData.name);
      //   fileData.append("descr", this.formData.descr);
      //   fileData.append("file", this.formData.file);
      //   fileData.append("_method", "POST");
      await api
        .post(
          "/api/courses",
          {
            col_id: this.formData.col_id.value
              ? this.formData.col_id.value
              : null,
            name: this.formData.name,
            code: this.formData.code,
            descr: this.formData.descr,
            // year: this.formData.year,
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
              this.getAllCourses();
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
    ...mapActions("CourseStore", ["getAllCourses"]),
  },
  mounted() {
    this.getCollegesList();
  },
};
</script>
