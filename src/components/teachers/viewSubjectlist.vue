<template>
  <q-card style="max-width: 1200px; width: 1200px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> View Blocked Seciton Subject Schedule </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Blocked Subject Schedule ({{ sectionName }})</q-toolbar-title
        >
        <!-- <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="
            height: 50px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-right: 5px;
          "
          :label="$q.screen.gt.xs ? 'Add Subject Schedule' : ''"
          @click="onShowCreateDialog"
        /> -->
      </q-toolbar>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="storeSection.state.tempRowDatas"
        :columns="columns"
        row-key="id"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs
            ? ['code', 'name', 'description', 'teacher', 'course', 'schedule', 'action']
            : ['code', 'name', 'description', 'teacher', 'course', 'schedule', 'action']
        "
      >
        <template #body="props">
          <!-- <p v-for="item in studentSubjects"> -->
          <q-tr :props="props">
            <!-- {{ item.code }} -->
            <!-- {{ props.row.name }} -->
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="code" :props="props">
              {{ props.row.code }}
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>

            <q-td key="description" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="teacher" :props="props">
              {{ props.row.teacher }}
            </q-td>

            <q-td key="course" :props="props">
              {{ props.row.course }}
            </q-td>

            <q-td key="schedule" :props="props">
              <!-- {{ props.row.teacher }} -->

              <span v-for="item in props.row.schedules">
                <span style="font-weight: bold">Schedule: </span>
                <span style="text-decoration: underline">{{
                  item.title ? item.title : ""
                }}</span>
                {{ ": " + item.day ? "(" + item.day + ")" : "" }}
                {{
                  " - " + item.time_start
                    ? moment(item.time_start, "hh:mm a").format("hh:mm a")
                    : ""
                }}

                {{
                  "-" + item.time_end
                    ? moment(item.time_end, "hh:mm a").format("hh:mm a")
                    : ""
                }}
                <br />
              </span>
              <!-- <span
            >Schedule:
            {{ props.row.title ? props.row.title : "" }}
            {{ ": " + props.row.day ? props.row.day : "" }}
            {{ " - " + props.row.time_start ? props.row.time_start : "" }}
            {{ "-" + props.row.time_end ? props.row.time_end : "" }}</span
          > -->
            </q-td>

            <q-td key="available" :props="props">
              {{ props.row.available }}
            </q-td>

            <q-td key="units" :props="props">
              <q-chip color="primary" text-color="white" v-if="props.row.unit_lecture > 0"
                >Lecture:
                <span style="font-weight: bold; margin-left: 2px">{{
                  props.row.unit_lecture
                }}</span></q-chip
              >

              <q-chip color="primary" text-color="white" v-if="props.row.unit_lab > 0"
                >Laboratory:
                <span style="font-weight: bold; margin-left: 2px">{{
                  props.row.unit_lab
                }}</span></q-chip
              >
              <q-chip
                color="primary"
                text-color="white"
                v-if="props.row.unit_practicum > 0"
                >Practicum:
                <span style="font-weight: bold; margin-left: 2px">{{
                  props.row.unit_practicum
                }}</span></q-chip
              >
            </q-td>

            <q-td key="total_units" :props="props">
              {{ props.row.total_units }}
            </q-td>

            <q-td key="price" :props="props">
              {{ props.row.price }}
            </q-td>
            <q-td key="action" :props="props">
              <div class="q-gutter-sm">
                <q-btn
                  style="width: 140px"
                  color="primary"
                  icon="visibility"
                  size="sm"
                  label="view student"
                  @click="
                    viewStudentFunc(props.row.id, props.row.name + ' - ' + props.row.code)
                  "
                />
              </div>
            </q-td>
          </q-tr>
          <!-- </p> -->
        </template>
      </q-table>
      <!-- <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Save"
            icon="save"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form> -->

      <!-- Add Day Dialog -->
      <q-dialog v-model="viewStudentDialog">
        <viewStudent
          :sub-sched-id="sub_sched_id"
          :code-id="code"
          @hide-add-dialog="viewStudentDialog = !viewStudentDialog"
        />
      </q-dialog>
    </q-card-section>
  </q-card>
</template>
<script>
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import viewStudent from "src/components/teachers/viewStudentListPerSubject.vue";
import { mapActions, mapState } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/subjects/schedule/store";
import storeSection from "src/store/subjects/block-section/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";

const pagination = {
  sortBy: "id",
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
    label: "Subject",
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
    label: "Course Assigned",
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
    name: "limit",
    label: "Limit",
    field: "limit",
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
    label: "Overide Unit Price",
    field: "price",
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
  props: ["courseId", "courseName", "sectionName", "sectionId", "semesterId"],
  emits: ["hideViewDialog"],
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
      storeSection,
      // semesterId:null,
      subject_sched_id: null,
      showEditDialog: false,
      showPreDialog: false,
      viewStudentDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
      getSemesters: [],
      search: null,
      code: null,
    };
  },
  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    ...mapActions("SubjectScheduleStore", ["onSearch"]),
    ...mapActions("SectionStore", ["getSectionSubjectData"]),
    ...mapActions("SectionStore", ["removeSubject", "emptyAll"]),
    viewStudentFunc(id, code) {
      this.viewStudentDialog = true;
      this.code = code;
      this.sub_sched_id = id;
    },
    // removeSubjectFunc(subject_sched_id) {
    //   this.$q.loading.show();
    //   setTimeout(() => {
    //     this.removeSubject(subject_sched_id);
    //     this.$q.loading.hide();
    //   }, 500);
    // },

    // onShowCreateDialog() {
    //   this.viewStudentDialog = true;
    // },
    onSearchSubmit() {},
    async onSubmit() {
      this.$q.loading.show();

      var fileData = new FormData();
      let subs = [];
      Object.entries(this.tempRowDatas).map(([key, val]) => {
        subs[key] = val.id;
      });

      fileData.append("subjects", subs ? subs : null);
      fileData.append("section", this.sectionId);

      await api
        .post("/api/section/schedule-subject/store", fileData, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
                class: "z-max",
              });
              this.emptyAll();
              this.$emit("hideAddDialog");
              // this.$router.back();
            }, 2000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
                class: "z-max",
              });
              // this.$emit("hideCalculateDialog");
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
              position: "bottom",
              message: error.response.data.message,
              class: "z-max",
            });
          }, 3000);
        });
    },
    async addSubject(subject_sched_id, description, available) {
      // console.log(subject_sched_id);
      this.$q.loading.show();
      let a = 0;
      if (available == 0) {
        a++;
        this.$q.loading.hide();

        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Slot availability is 0! Please choose other schedule!",
        });

        return;
      }

      storeSection.state.tempRowDatas.forEach((element) => {
        // console.log(element);
        if (element.id == subject_sched_id || element.description == description) {
          // console.log("error");
          a++;

          this.$q.loading.hide();
          this.$q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: "Already Added on the list!",
          });

          return;
        }
      });
      if (a >= 1) {
        this.$q.loading.hide();

        return false;
      } else {
        await api
          .get(
            "/api/section/subject/temp/" + subject_sched_id,
            {
              params: {
                course_id: this.courseId,
              },
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            console.log(response);
            if (response.data.status == 400) {
              setTimeout(() => {
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                });
                this.$q.loading.hide();
              }, 100);
            } else {
              setTimeout(() => {
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                });
                this.$q.loading.hide();
              }, 100);
              this.addTempData(response.data.data);
            }
            // this.studentSubjects = response.data.data;
            // console.log(this.studentSubjects);
          })
          .catch((error) => {
            console.log(error);
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message: error.response.data.message,
              });
              this.$q.loading.hide();
            }, 100);
          });
      }

      // console.log(store.state.rowSubjectDatas);
    },
    ChangeSemester() {
      var sem = this.sem;
      this.onSemSelect(sem);
    },
    async showSemesters() {
      await api
        .get("/api/subjects/show/semesters", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          //   console.log(response);
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
  },
  computed: {
    ...mapState("SectionStore", ["tempRowDatas"]),
  },
  mounted() {
    this.showSemesters();
    this.getSectionSubjectData(this.sectionId);
  },
  components: {
    editScheduleDialog,
    AddTeacherDialog,
    viewStudent,
  },
};
</script>

<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
