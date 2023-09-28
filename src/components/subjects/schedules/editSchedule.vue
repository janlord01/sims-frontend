<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Schedule Subject </q-toolbar-title>
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
        <div class="">
          <!-- <q-select
            filled
            :options="getSubjects"
            v-model="formData.sub_id"
            label="Subjects"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select> -->
          <q-input
            filled
            v-model="searchSubject"
            label="Search Subject"
            name="code"
            class="col-3 full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchSubjectFunc"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width absolute bg-grey-10 text-white z-max"
            v-if="searchVisible"
            style="overflow: hidden; margin-top: -20px"
          >
            <q-item
              clickable
              v-ripple
              v-for="item in filterSubject"
              @click="selectSubject(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{ item.descr }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-input
            filled
            v-model="searchCourse"
            label="Search Course"
            name="code"
            class="col-3 full-width q-mb-md"
            type="text"
            @click="searchVisibleCourse = true"
            @keyup="searchCourseFunc"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width absolute bg-grey-10 text-white z-max"
            v-if="searchVisibleCourse"
            style="overflow: hidden; margin-top: -20px"
          >
            <q-item
              clickable
              v-ripple
              v-for="item in filterCourse"
              @click="selectCourse(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{ item.descr }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.code"
            label="Code Name(ex. G01)"
            name="code"
            class="q-mr-sm col-3 full-width"
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

          <!-- <div class="row q-mb-lg"> -->
          <!-- <div class="col q-mr-sm">
              <q-input
                filled
                label="Start Time"
                v-model="formData.start_time"
                mask="fulltime"
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Required, Please select start time',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formData.start_time" with-seconds>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div> -->
          <!-- <p style="margin-top: 20px; margin-right: 10px">to</p>

            <div class="col q-mr-sm">
              <q-input
                filled
                label="End Time"
                mask="fulltime"
                v-model="formData.end_time"
                :rules="[
                  (val) => (val && val.length > 0) || 'Required, Please select end time',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="formData.end_time" with-seconds>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div> -->
          <div class="row full-width" style="margin-top: -20px">
            <q-input
              filled
              v-model="formData.limit"
              label="Student Limit (Ex. 50)"
              name="code"
              class="q-mr-sm col-3 q-mt-md full-width"
              type="text"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Required, Please type limit of student can enroll',
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.available"
              label="Available Slot"
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              @update:model-value="availableSlot"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Required, Please type available slot of student can enroll',
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
          <div class="row full-width" style="margin-top: -20px">
            <q-input
              filled
              v-model="formData.price"
              label="Override Unit Price(optional)"
              name="code"
              class="q-mr-sm col-3 q-mt-md full-width"
              type="text"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
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
  emits: ["hideEditDialog"],
  props: ["semId", "subSchedId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        code: "",
        sub_id: "",
        course_id: "",
        // start_time: null,
        // end_time: null,
        limit: null,
        price: null,
        available: null,
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
      // getSubjects: [],

      allSubjects: [],
      searchVisible: false,
      searchSubject: null,
      filterSubject: [],
      selectedSubject: null,

      allCourses: [],
      searchVisibleCourse: false,
      searchCourse: null,
      filterCourse: [],
      selectedCourse: null,
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    // async getSubj() {
    //   await api
    //     .get("/api/subjects/", {
    //       headers: {
    //         Authorization: "Bearer " + this.newToken,
    //       },
    //     })
    //     .then((response) => {
    //       //   console.log(this.semId.value);
    //       Object.entries(response.data.subjects).map(([key, val]) => {
    //         this.getSubjects.push({
    //           label: val.code + " (" + val.descr + ")",
    //           value: val.id,
    //         });
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    availableSlot() {
      if (this.formData.available > this.formData.limit) {
        this.$q.notify({
          type: "negative",
          message: "Available slot should not be greater than limit",
          icon: "error",
          timeout: 3000,
        });
      }
    },
    searchSubjectFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        this.filterSubject = this.allSubjects;
      } else {
        this.filterSubject = this.allSubjects.filter((Subject) => {
          return Object.values(Subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterSubject);
    },
    searchCourseFunc() {
      this.searchVisibleCourse = true;
      const query = this.searchCourse != null ? this.searchCourse.toLowerCase() : "";
      if (this.searchCourse == "" || this.searchCourse == null) {
        this.filterCourse = this.allCourses;
      } else {
        this.filterCourse = this.allCourses.filter((Course) => {
          return Object.values(Course).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
    selectCourse(course) {
      this.selectedCourse = null;
      this.searchCourse = course.code + " (" + course.descr + ")";
      this.selectedCourse = course.id;
      this.formData.course_id = course.id;
      this.searchVisibleCourse = false;
    },
    selectSubject(subject) {
      this.selectedSubject = null;
      this.searchSubject = subject.code + " (" + subject.descr + ")";
      this.selectedSubject = subject.id;
      this.formData.subject_id = subject.id;
      this.searchVisible = false;
    },
    async getSubjects() {
      await api
        .get("/api/subjects/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allSubjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getCourses() {
      await api
        .get("/api/courses/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allCourses = response.data.courses;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSubjSched() {
      await api
        .get("/api/subjects/schedule/edit/" + this.subSchedId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          //   console.log(response.data.subjects[0].descr);
          this.searchSubject =
            response.data.subjects[0].name + "(" + response.data.subjects[0].descr + ")";
          this.searchCourse =
            response.data.subjects[0].course_code != null
              ? response.data.subjects[0].course_code +
                "(" +
                response.data.subjects[0].course_descr +
                ")"
              : "";

          // this.searchCourse = course.code + " (" + course.descr + ")";

          // this.formData.subject =
          //   response.data.subjects[0].name + "(" + response.data.subjects[0].descr + ")";
          this.formData.code = response.data.subjects[0].code;
          this.formData.limit = response.data.subjects[0].limit;
          this.formData.price = response.data.subjects[0].overide_unit_price;
          this.formData.available = response.data.subjects[0].available;
          this.selectedSubject = response.data.subjects[0].subject_id;
          this.selectedCourse = response.data.subjects[0].course_id;

          //   console.log(this.formData.subject.value);
          //   Object.entries(response.data.subjects).map(([key, val]) => {
          //     this.getSubjects.push({
          //       label: val.code + " (" + val.descr + ")",
          //       value: val.id,
          //     });
          //   });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      if (this.formData.available > this.formData.limit) {
        this.$q.notify({
          type: "negative",
          message: "Available slot should not be greater than limit",
          icon: "error",
          timeout: 3000,
        });
      }
      // else if (this.semId.value == null) {
      //   this.$q.notify({
      //     type: "negative",
      //     message: "Please Select Semester before editing",
      //     icon: "error",
      //     timeout: 3000,
      //   });
      // }
      else {
        await api
          .patch(
            "/api/subjects/schedule/update/" + this.subSchedId,
            {
              code: this.formData.code,
              // sub_id: this.formData.sub_id.value,
              sub_id: this.selectedSubject,
              course_id: this.selectedCourse,
              // start_time: this.formData.start_time,
              // end_time: this.formData.end_time,
              limit: this.formData.limit,
              available: this.formData.available,
              price: this.formData.price,
              // sem_id: this.semId.value,
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
                this.onSemSelect(this.semId);
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
      }
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    // this.getSubj();
    this.getSubjects();
    this.getCourses();
    this.getSubjSched();
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
