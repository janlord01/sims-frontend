<template>
  <q-card style="max-width: 1000px; width: 1000px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add/Update Subject Schedule </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Available Subject Schedule</q-toolbar-title>
        <!-- <q-form class="row" ref="formName" @submit="changeSem"> -->
        <div class="row" style="width: 250px; margin-top: -10px; margin-right: 10px">
          <!-- <q-select
            filled
            :options="getSemesters"
            v-model="sem"
            label="Select Semester"
            :class="$q.screen.gt.sm ? 'full-width ' : 'full-width'"
            @update:model-value="ChangeSemester"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select> -->
        </div>
        <!-- <div class="column">
            <q-btn
              unelevated
              label="Select"
              class="text-center"
              color="secondary"
              size="md"
              type="submit"
            />
          </div> -->
        <!-- </q-form> -->
        <q-input
          bottom-slots
          v-model="search"
          @keyup="onSearchSubmit"
          label="Search Schedule Subject"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append size="sm">
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
      </q-toolbar>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="store.state.rowDatas"
        :columns="columns"
        row-key="id"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs
            ? ['code', 'name', 'description', 'teacher', 'course', 'schedule', 'action']
            : ['id', 'code', 'name']
        "
      >
        <template #body="props">
          <q-tr :props="props">
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
                <span style="font-weight: bold; margin-left: 10px">-Room: </span>
                {{ item.room }}
                <br />
                <span style="font-weight: bold; margin-left: 10px">-Building: </span>
                {{ item.building }}
                <q-separator />
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

            <q-td key="limit" :props="props">
              {{ props.row.limit }}
            </q-td>
            <q-td key="available" :props="props">
              {{ props.row.available }}
            </q-td>
            <q-td key="price" :props="props">
              {{ props.row.price }}
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

            <q-td key="action" :props="props">
              <q-btn
                color="primary"
                icon="add"
                size="sm"
                @click="
                  addSubject(props.row.id, props.row.description, props.row.available)
                "
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <!-- Add Day Dialog -->
      <q-dialog v-model="showAddScheduleDialog">
        <addDayDialog
          :sub-sched-id="subject_sched_id"
          @hide-day-dialog="showAddScheduleDialog = !showAddScheduleDialog"
        />
      </q-dialog>
    </q-card-section>
  </q-card>
</template>
<script>
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import addDayDialog from "src/components/subjects/schedules/addDay.vue";
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
      subject_sched_id: null,
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: null,
      getSemesters: [],
      search: null,
    };
  },
  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    ...mapActions("SubjectScheduleStore", ["onSearch"]),
    ...mapActions("SectionStore", ["addTempData"]),
    onSearchSubmit() {
      // if (this.sem == null) {
      //   this.$q.notify({
      //     type: "negative",
      //     message: "Please Select Semester",
      //     icon: "error",
      //   });
      // } else {
      var name = this.search;
      var sem = this.semesterId;
      // console.log(sem);
      this.onSearch([name, sem]);
      // }
    },
    onSubmit() {},
    async addSubject(subject_sched_id, description, available) {
      //   console.log(subject_sched_id);
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
            // console.log(response);
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
      var sem = this.semesterId;
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
  mounted() {
    this.showSemesters();
    this.ChangeSemester();
  },
  components: {
    editScheduleDialog,
    AddTeacherDialog,
    addDayDialog,
  },
};
</script>

<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
