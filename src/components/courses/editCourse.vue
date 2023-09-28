<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Course </q-toolbar-title>
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
            v-model="formData.code"
            label="Code (ex. BSIT)"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please type code of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="numbers" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.name"
            label="Name (ex. Bachelor of Science in Information Technology"
            name="name"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please type name of the course',
            ]"
            lazy-rules
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
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="description"> </q-icon>
            </template>
          </q-input>
          <!-- <q-input
            filled
            v-model="formData.year"
            label="Number of Year(ex. 4)"
            type="number"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="loop"> </q-icon>
            </template>
          </q-input> -->
          <q-input
            filled
            v-model="formData.college"
            label="Current College"
            class="q-mr-sm col-3 q-mt-md full-width"
            readonly
            disable
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the college',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="description"> </q-icon>
            </template>
          </q-input>
          <q-separator dark />
          <p>Change College</p>
          <q-select
            filled
            :options="getCollege"
            v-model="formData.cou_id"
            label="Select College"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
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
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideEditDialog"],
  props: ["couId"],

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
        college: "",
        cou_id: "",
        // year: "",
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
    };
  },
  methods: {
    async getCourseData() {
      await api
        .get("/api/courses/get-data/" + this.couId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          //   this.formData.dean_id = response.data.college.id;
          this.formData.descr = response.data.course.descr;
          this.formData.name = response.data.course.courseName;
          this.formData.code = response.data.course.code;
          this.formData.college = response.data.course.collegeName;
          //   this.formData.year = response.data.course.year;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCollegesList() {
      await api
        .get("/api/courses/list/colleges/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
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
      await api
        .patch(
          "/api/courses/" + this.couId,
          {
            col_id: this.formData.cou_id.value ? this.formData.cou_id.value : null,
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
          //   console.log(response);
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
              this.$emit("hideEditDialog");
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
    this.getCourseData();
  },
};
</script>
