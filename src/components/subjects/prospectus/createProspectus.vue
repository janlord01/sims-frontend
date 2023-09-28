<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Course Prospectus </q-toolbar-title>
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
          <q-select
            filled
            :options="getCourses"
            v-model="formData.course_id"
            label="Select Course"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div>

        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Save"
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
import moment from "moment";
const NAMED_MASKS = {
  date: "####/##/##",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####",
};
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideCreateDialog"],
  props: ["semId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        code: "",
        course_id: "",
        // start_time: null,
        // end_time: null,
        limit: null,
        price: null,
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
      getCourses: [],
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    ...mapActions("ProspectusStore", ["getAllProspectus"]),
    async getCoursesFunc() {
      await api
        .get("/api/prospectus/courses/list", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          Object.entries(response.data.courses).map(([key, val]) => {
            this.getCourses.push({
              label: val.code + " (" + val.descr + ")",
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
        .post(
          "/api/prospectus/courses/store",
          {
            course_id: this.formData.course_id.value,
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
              this.$emit("hideCreateDialog");
              this.getAllProspectus();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    this.getCoursesFunc();
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
