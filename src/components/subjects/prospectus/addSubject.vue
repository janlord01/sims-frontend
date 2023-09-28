<template>
  <q-card style="max-width: 700px; width: 700px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Subject </q-toolbar-title>
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
          <q-toggle
            v-model="formData.blank"
            color="blue"
            label="Student Picked Subject"
            class="q-mb-sm"
          />
          <!-- <q-select
            filled
            :options="getSubjectss"
            v-model="formData.subject_id"
            label="Subject"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width q-mb-md' : 'full-width'"
            v-if="formData.blank == false"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select> -->
        </div>
        <div class="row q-col-gutter-none relative-position">
          <q-input
            filled
            v-model="searchSubject"
            label="Search Subject"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchSubjectFunc"
            v-if="formData.blank == false"
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
              @click="selectSubject(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{ item.descr }}</q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>OVERLINE</q-item-label>
                <q-item-label>Item with caption</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
          <div class="row q-col-gutter-none full-width z-top">
            <q-select
              filled
              :options="yearLevels"
              v-model="formData.year"
              label="Year Level(ex. 1st Year)"
              :class="$q.screen.gt.sm ? 'q-mr-sm full-width q-mb-md' : 'full-width'"
            >
              <template v-slot:prepend>
                <q-icon name="book" />
              </template>
            </q-select>
            <q-select
              filled
              :options="getSemesters"
              v-model="formData.sem_id"
              label="Semester/Summer"
              :class="$q.screen.gt.sm ? 'q-mr-sm full-width q-mb-md' : 'full-width'"
            >
              <template v-slot:prepend>
                <q-icon name="book" />
              </template>
            </q-select>
          </div>
          <!-- <q-select
            filled
            :options="[1, 2, 3, 4]"
            v-model="formData.sub_id"
            label="Sequence"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width'"
            :rules="[
              (val) => (val && val.length > 0) || 'Required, Please type sequence',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select> -->
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Add"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>

  <!-- Edit Day Dialog -->
  <q-dialog v-model="showEditDialog">
    <editDayDialog
      :sub-sched-day-id="subSchedDayId"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
      @get-schedule="getSchedulesMethod"
      :sem-id="semId"
    />
  </q-dialog>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import editDayDialog from "src/components/subjects/schedules/editDay.vue";

import moment from "moment";

const pagination = {
  sortBy: "role",
  rowsPerPage: 10,
};

// const year = [
//   {
//     label: "1st Year",
//     value: 1,
//   },
//   {
//     label: "2nd Year",
//     value: 2,
//   },
//   {
//     label: "3rd Year",
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
const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "title",
    label: "Title",
    field: "title",
    align: "left",
    sortable: true,
  },
  {
    name: "day",
    label: "Day",
    field: "day",
    align: "left",
    sortable: true,
  },

  {
    name: "schedule",
    label: "Schedule",
    field: "schedule",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
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
  emits: ["hideAddDialog", "firstYearSummerSem"],
  props: ["prosId", "courseId"],
  setup() {
    return {
      pagination,
      columns,
      moment,
      // year,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        subject_id: null,
        blank: false,
        sem_id: null,
        year: null,
      },
      loadingSpinner: true,
      showEditDialog: false,
      requiredRule,
      getCollege: [],
      getSubjectss: [],
      getSchedules: [],
      subSchedDayId: null,
      getSemesters: [],
      code: null,
      searchVisible: false,
      allSubjects: [],
      searchSubject: null,
      selectedSubject: null,
      filterSub: [],
      yearLevels: [],
      // course_id: null,
      //   sem: this.semId,
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    ...mapActions("ProspectusStore", ["getSubjects"]),
    selectSubject(subject) {
      // console.log(subject);
      // this.searchSubject = null;
      this.selectedSubject = null;
      this.searchSubject = subject.code + "(" + subject.descr + ")";
      this.selectedSubject = subject.id;
      this.formData.subject_id = subject.id;
      this.searchVisible = false;

      // console.log(this.formData.subject_id);
    },
    async getAllYearLevel() {
      await api
        .get("/api/year-level", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.yearLevels.push({
              label: val.name,
              id: val.id,
            });
          });
        })
        .catch((error) => {
          console.log();
        });
    },
    async getCourse() {
      await api
        .get("/api/prospectus/course/" + this.courseId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.code);
          this.code = response.data.code;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSemestersFunc() {
      await api
        .get("/api/prospectus/semesters/all", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.semesters).map(([key, val]) => {
            this.getSemesters.push({
              label: val.title,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getSubj() {
      await api
        .get("/api/subjects/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allSubjects = response.data.subjects;
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getSubjectss.push({
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
      if (this.formData.blank == false && this.formData.subject_id == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Subject",
          icon: "error",
        });
      }
      if (this.formData.sem_id == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Semester",
          icon: "error",
        });
      }

      if (this.formData.year == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Year Level",
          icon: "error",
        });
      }
      await api
        .post(
          "/api/prospectus",
          {
            blank: this.formData.blank,
            subject_id: this.formData.subject_id ? this.formData.subject_id : null,
            sem_id: this.formData.sem_id.value ? this.formData.sem_id.value : null,
            year: this.formData.year.id,
            course_id: this.courseId,
            pros_id: this.prosId,
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
              this.$emit("hideAddDialog");
              this.getSubjects(this.code);
              this.$emit("firstYearSummerSem");
              // this.getSchedules = [];
              // this.getSchedulesMethod();
              // this.onSemSelect(this.semId);
              //   this.formData.title = " ";
              //   this.formData.day = " ";
              //   this.formData.start_time = "00:00:00";
              //   this.formData.end_time = "00:00:00";
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
    ...mapActions("SubjectStore", ["getAllSubjects"]),
    searchSubjectFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        this.filterSub = this.allSubjects;
      } else {
        this.filterSub = this.allSubjects.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterSub);
    },
  },
  computed: {
    filteredSearch() {
      // console.log("work!!!");

      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        return this.allSubjects;
      } else {
        // console.log("test");
        // this.searchVisible = true;
        return this.allSubjects.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
  },
  mounted() {
    this.getSubj();
    this.getCourse();
    this.getSemestersFunc();
    this.getAllYearLevel();
  },
  components: {
    editDayDialog,
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
