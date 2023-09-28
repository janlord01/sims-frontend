<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Block Section </q-toolbar-title>
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
            v-model="formData.name"
            label="Section Name"
            name="code"
            class="q-mr-sm col-3 full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-select
            filled
            @filter="filterCourse"
            :options="courseOptions"
            :disable="haveItem === true"
            use-chips
            input-debounce="0"
            behavior="menu"
            stack-label
            v-model="formData.course"
            label="Courses"
            :class="
              $q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
          </q-select>
          <q-select
            filled
            :disable="haveItem === true"
            @filter="filterSemester"
            :options="semesterOptions"
            use-chips
            stack-label
            input-debounce="0"
            behavior="menu"
            v-model="formData.semester"
            label="Semesters"
            :class="
              $q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
          <q-select
            filled
            :disable="haveItem === true"
            @filter="filterYear"
            :options="yearOptions"
            use-chips
            stack-label
            input-debounce="0"
            behavior="menu"
            v-model="formData.year"
            label="Year/Grade Level"
            :class="
              $q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
          <q-select
            filled
            @filter="filterTeacher"
            :options="teacherOptions"
            use-chips
            stack-label
            input-debounce="0"
            behavior="menu"
            v-model="formData.user"
            label="Teacher Adviser"
            :class="
              $q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="person" />
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
  props: ["sectionId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        name: null,
        course: [],
        semester: [],
        user: [],
        year: [],
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
      courseOptions: [],
      courses: [],
      semesterOptions: [],
      semesters: [],
      teacherOptions: [],
      teachers: [],
      yearOptions: [],
      years: [],
      haveItem: false,
    };
  },
  methods: {
    ...mapActions("SectionStore", ["getAllSections"]),
    async checkSectionItems() {
      await api
        .get("/api/section/check/item/" + this.sectionId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.data === true) {
            this.haveItem = true;
          } else {
            this.haveItem = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSectionDetatils() {
      await api
        .get("/api/section/" + this.sectionId + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.formData.name = response.data.data.name;

          this.formData.course.label = response.data.data.code;
          this.formData.course.value = response.data.data.courseId;

          this.formData.user.label = response.data.data.userName;
          this.formData.user.value = response.data.data.userId;

          this.formData.semester.label = response.data.data.title;
          this.formData.semester.value = response.data.data.semesterId;

          this.formData.year.value = response.data.data.yearId;
          this.formData.year.label = response.data.data.yearName;
          //   Object.entries(response.data.data).map(([key, val]) => {
          //     this.formData.course.push({
          //       label: val.code,
          //       value: val.courseId,
          //     });
          //   });
          // console.log(this.formData.course);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterYear(val, update) {
      if (val === "") {
        update(() => {
          this.yearOptions = this.years;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.yearOptions = this.years.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async getYearLevels() {
      await api
        .get("/api/year-level", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.years.push({
              value: val.id,
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterTeacher(val, update) {
      if (val === "") {
        update(() => {
          this.teacherOptions = this.teachers;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.teacherOptions = this.teachers.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async getTeachers() {
      await api
        .get("/api/teacher", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.users).map(([key, val]) => {
            this.teachers.push({
              value: val.id,
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterSemester(val, update) {
      if (val === "") {
        update(() => {
          this.semesterOptions = this.semesters;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.semesterOptions = this.semesters.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async getSemesters() {
      await api
        .get("/api/settings/semesters/active", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.semesters).map(([key, val]) => {
            this.semesters.push({
              value: val.id,
              label: val.title,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    filterCourse(val, update) {
      // console.log(val);
      if (val === "") {
        update(() => {
          this.courseOptions = this.courses;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.courseOptions = this.courses.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async getCourses() {
      await api
        .get("/api/courses", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.courses).map(([key, val]) => {
            this.courses.push({
              value: val.id,
              label: val.code,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      //   console.log(this.formData.course);
      //   console.log(this.formData.semester);
      //   console.log(this.formData.user);
      //   console.log(this.formData.name);
      if (
        this.formData.course.value == null ||
        this.formData.semester.value == null ||
        this.formData.user.value == null ||
        this.formData.name == null
      ) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          message: "Please fill out the necessary field!",
          position: "top",
        });
      } else {
        this.$q.loading.show();
        await api
          .patch(
            "/api/section/update/" + this.sectionId,
            {
              user: this.formData.user.value,
              semester: this.formData.semester.value,
              course: this.formData.course.value,
              name: this.formData.name,
              year_level: this.formData.year.value,
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            // console.log(response);
            if (response.data.status === 200) {
              setTimeout(() => {
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                });
                this.$q.loading.hide();
                this.getAllSections();
                this.$emit("hideEditDialog");
              }, 1000);
            } else {
              setTimeout(() => {
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                });
                this.$q.loading.hide();

                // this.$emit('hideCreateDialog')
              }, 3000);
            }
          })
          .catch((error) => {
            console.log(error);
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                message: error.response.data.message,
              });
            }, 3000);
          });
      }
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    this.getCourses();
    this.getSemesters();
    this.getTeachers();
    this.getYearLevels();
    this.getSectionDetatils();
    this.checkSectionItems();
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
