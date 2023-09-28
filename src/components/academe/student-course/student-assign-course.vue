<template>
  <q-card style="max-width: 700px; width: 700px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Assign Course </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-input
            filled
            v-model="searchCourse"
            label="Search Course"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchCourseFunc"
            v-if="formData.blank == false"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="numbers" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width q-mb-sm absolute bg-grey-10 text-white z-max"
            style="margin-top: 70px"
            v-if="searchVisible"
          >
            <!-- <q-item clickable v-ripple>
              <q-item-section>Single line item</q-item-section>
            </q-item> -->

            <q-item
              clickable
              v-ripple
              v-for="item in filterSub"
              @click="selectCourse(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{
                  item.courseName
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Assign"
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

const pagination = {
  sortBy: "role",
  rowsPerPage: 10,
};

export default {
  emits: ["hideCourseDialog"],
  props: ["userId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        course_id: null,
        blank: false,
        sem_id: null,
        year: null,
      },
      searchVisible: false,
      searchCourse: null,
      selectedCourse: null,
      filterSub: [],
      allCourse: null,
      // course_id: null,
      //   sem: this.semId,
    };
  },
  methods: {
    ...mapActions("CollegeStore", ["getAllStudent"]),

    selectCourse(course) {
      // console.log(subject);
      // this.searchSubject = null;
      this.selectedCourse = null;
      this.searchCourse = course.code + "(" + course.courseName + ")";
      this.selectedCourse = course.id;
      this.formData.course_id = course.id;
      this.searchVisible = false;

      //   console.log(this.userId);
    },
    async getAllCourse() {
      await api
        .get("/api/courses", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          //   console.log(this.userId);

          //   this.code = response.data.code;
          this.allCourse = response.data.courses;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async onSubmit() {
      if (this.formData.course_id == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Course",
          icon: "error",
        });
      } else {
        this.$q.loading.show();
        await api
          .post(
            "/api/courses/course/students/store",
            {
              user_id: this.userId,
              course_id: this.formData.course_id,
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
    searchCourseFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchCourse != null ? this.searchCourse.toLowerCase() : "";
      if (this.searchCourse == "" || this.searchCourse == null) {
        this.filterSub = this.allCourse;
      } else {
        this.filterSub = this.allCourse.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterSub);
    },
  },
  computed: {},
  mounted() {
    this.getAllCourse();
  },
  components: {},
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
