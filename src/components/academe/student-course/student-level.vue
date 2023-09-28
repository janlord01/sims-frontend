<template>
  <q-card style="max-width: 700px; width: 700px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Change Year Level </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-select
            filled
            :options="year"
            v-model="formData.year"
            label="Year Level(ex. 1st Year)"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width q-mb-md' : 'full-width'
            "
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Change"
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
// const year = [
//   {
//     label: "Kinder 1",
//     value: 1,
//   },
//   {
//     label: "Kinder 2",
//     value: 2,
//   },
//   {
//     label: "Grade 1",
//     value: 3,
//   },
//   {
//     label: "4th Year",
//     value: 4,
//   },
//   {
//     label: "5th Year",
//     value: 5,
//   },
//   {
//     label: "6th Year",
//     value: 6,
//   },
// ];
const pagination = {
  sortBy: "role",
  rowsPerPage: 10,
};

export default {
  emits: ["hideCourseDialog"],
  props: ["userId"],
  setup() {
    return {
      // year,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        year: null,
      },
      searchVisible: false,
      searchCourse: null,
      selectedCourse: null,
      filterSub: [],
      allCourse: null,
      year: [],
      // course_id: null,
      //   sem: this.semId,
    };
  },
  methods: {
    ...mapActions("CollegeStore", ["getAllStudent"]),
    async getYearLevel() {
      await api
        .get("/api/year-level", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.year.push({
              value: val.id,
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      if (this.formData.year == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Year Level",
          icon: "error",
          timeout: 2000,
        });
      } else {
        this.$q.loading.show();
        await api
          .post(
            "/api/courses/course/students/year",
            {
              user_id: this.userId,
              year_id: this.formData.year.value,
              year_label: this.formData.year.label,
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
                //   "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            if (response.data.status === 200) {
              setTimeout(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 2000,
                  position: "bottom",
                  message: response.data.message,
                });
                this.getAllStudent();
                this.$emit("hideCourseDialog");
              }, 2000);
            } else {
              setTimeout(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 2000,
                  position: "bottom",
                  message: response.data.message,
                });
                this.getAllStudent();
                // this.$emit("hideCourseDialog");
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 2000,
                position: "bottom",
                message: error.message,
              });
              this.getAllStudent();
              //   this.$emit("hideCourseDialog");
            }, 2000);
            //   this.$q.notify({
            //     type: "positive",
            //     message: error.data.errors.message,
            //     icon: "save",
            //   });
          });
      }
    },
  },
  computed: {},
  mounted() {
    this.getYearLevel();
  },
  components: {},
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
