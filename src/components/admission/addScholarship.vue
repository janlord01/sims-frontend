<template>
  <q-card style="max-width: 1200px; width: 1200px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Scholarship </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-white bg-primary"
          active-color="white"
          indicator-color="white"
          align="justify"
          narrow-indicator
        >
          <!-- <q-tab name="course" label="Asigned Course Subject" />
          <q-tab name="block" label="Blocked Section Subject" />
          <q-tab name="all" label="All Subject" /> -->
          <!-- <q-tab name="billing" label="Billings" />
          <q-tab name="group_billing" label="Group Billings" /> -->
          <q-tab name="discount" label="Schoolarship" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="discount">
            <DiscountList />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card-section>
  </q-card>
</template>
<script>
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import addDayDialog from "src/components/subjects/schedules/addDay.vue";
import { mapActions, mapState } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/admission/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";
import BillingList from "./billing-list.vue";
import DiscountList from "./discount-list.vue";

const pagination = {
  sortBy: "code",
  rowsPerPage: 10,
};
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
    name: "code",
    label: "Code",
    field: "code",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "Subject Code",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
  },
  {
    name: "teacher",
    label: "Teacher",
    field: "teacher",
    align: "left",
  },

  {
    name: "course",
    label: "Course",
    field: "course",
    align: "left",
  },
  {
    name: "schedule",
    label: "Schedule",
    field: "schedule",
    align: "left",
  },
  {
    name: "available",
    label: "Available Slot",
    field: "available",
    align: "left",
  },

  {
    name: "price",
    label: "Unit Price",
    field: "price",
    align: "left",
  },
  {
    name: "total_units",
    label: "Total Units",
    field: "total_units",
    align: "left",
  },

  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  props: ["semId", "courseId"],
  setup() {
    return {
      pagination,
      columns,
      moment,
      date,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      subject_sched_id: null,
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
      studentSubjects: [],
      searchSubject: null,
      studentCourse: null,
      searchAllSubject: null,
      tab: "discount",
    };
  },
  methods: {
    ...mapActions("AdmissionStore", ["onSearch"]),
    ...mapActions("AdmissionStore", ["onSearchAllSubject"]),
    ...mapActions("AdmissionStore", ["getTemporarySubject"]),
    ...mapActions("AdmissionStore", ["getAllUnenrolledStudent"]),
    async getStudentCourse() {
      await api
        .get(
          "/api/admission/student-" +
            this.$route.params.student_id +
            "/course/",
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response.data);
          this.studentCourse = response.data.data.code;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async addSubject(subject_sched_id, description, available) {
      // console.log(this.courseId);
      let a = 0;
      if (available == 0) {
        a++;
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Slot availability is 0! Please choose other schedule!",
          class: "z-max",
        });
        return;
      }

      store.state.tempDataSubject.forEach((element) => {
        // console.log(element);
        if (
          element.id == subject_sched_id ||
          element.description == description
        ) {
          // console.log("error");
          a++;
          this.$q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: "Already Added on the list!",
            class: "z-max",
          });
          return;
        }
      });
      if (a >= 1) {
        return false;
      } else {
        await api
          .get(
            "/api/admission/subject-" + subject_sched_id + "/temp/store/",
            {
              params: {
                course_id: this.courseId,
                user_id: this.$route.params.student_id,
              },
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            // console.log(response);
            if (response.data.status == 404) {
              setTimeout(() => {
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                  class: "z-max",
                });
              }, 100);
            } else {
              setTimeout(() => {
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                  class: "z-max",
                });
              }, 100);
              this.getTemporarySubject(response.data.data);
            }
            // this.studentSubjects = response.data.data;
            // console.log(this.studentSubjects);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // console.log(store.state.rowSubjectDatas);
    },
    async getStudentSubjects() {
      await api
        .get(
          "/api/admission/student/" +
            this.$route.params.student_id +
            "/subject",
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          this.studentSubjects = response.data.data;
          // console.log(this.studentSubjects);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addSchedule(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showAddScheduleDialog = true;
      //   console.log("subject schedule id:" + this.subject_sched_id);
    },
    addTeacher(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showAddTeacherDialog = true;

      //   console.log("subject schedule id:" + this.subject_sched_id);
    },
    editDialog(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showEditDialog = true;
    },
    preDialog(sub_id) {
      this.showPreDialog = true;
      this.sub_id = null;
      this.sub_id = sub_id;
    },
    onSearchSubmit() {
      var name = this.searchSubject;
      this.onSearch([
        name,
        this.$route.params.student_id,
        this.$route.params.id,
      ]);
    },
    onSearchSubmitAllSubject() {
      var name = this.searchAllSubject;
      this.onSearchAllSubject([
        name,
        this.$route.params.student_id,
        this.$route.params.id,
      ]);
    },
  },
  mounted() {
    // this.getStudentSubjects();
    // this.getStudentCourse();
    // this.getAllUnenrolledStudent(this.$route.params.student_id);
    // this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  },
  components: {
    editScheduleDialog,
    AddTeacherDialog,
    addDayDialog,
    BillingList,
    DiscountList,
  },
};
</script>

<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
