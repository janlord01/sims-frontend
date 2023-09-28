<template>
  <q-card style="max-width: 1200px; width: 1200px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Subject Schedule </q-toolbar-title>
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
          <q-tab name="course" label="Asigned Course Subject" />
          <q-tab name="block" label="Blocked Section Subject" />
          <q-tab name="all" label="All Subject" />
          <!-- <q-tab name="billing" label="Billings" />
          <q-tab name="group_billing" label="Group Billings" />
          <q-tab name="discount" label="Schoolarship" /> -->
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="course" default>
            <!-- <div class="text-h6">Assinged Course Subject</div> -->
            <q-toolbar class="q-mt-md">
              <q-toolbar-title class="text-h6"
                >Assigned Course Subject - {{ studentCourse }}</q-toolbar-title
              >
              <q-input
                bottom-slots
                v-model="searchSubject"
                @keyup="onSearchSubmit"
                label="Search Subject"
                outlined
                class="search_input"
                :style="!$q.screen.gt.sm ? 'display:none' : ''"
              >
                <template v-slot:append size="sm">
                  <!-- <q-icon
          v-if="searchUser !== ''"
          name="close"
          @click="onLoadAllData"
          class="cursor-pointer"
        /> -->
                  <q-icon name="search" size="sm" />
                </template>
              </q-input>
            </q-toolbar>
            <q-table
              :pagination="pagination"
              class="q-pa-sm"
              :rows="store.state.rowSubjectDatas"
              :columns="columns"
              row-key="id"
              separator="cell"
              :visible-columns="
                $q.screen.gt.xs
                  ? [
                      'code',
                      'name',
                      'description',
                      'teacher',
                      'schedule',
                      'available',
                      'price',
                      'total_units',
                      'action',
                    ]
                  : [
                      'code',
                      'name',
                      'description',
                      'teacher',
                      'schedule',
                      'available',
                      'price',
                      'total_units',
                      'action',
                    ]
              "
            >
              <template #body="props">
                <!-- <p v-for="item in studentSubjects"> -->
                <q-tr :props="props">
                  <!-- {{ item.code }}
        {{ props.row.name }} -->
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
                  </q-td>

                  <q-td key="available" :props="props">
                    {{ props.row.available }}
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }}
                  </q-td>

                  <q-td key="units" :props="props">
                    <q-chip
                      color="primary"
                      text-color="white"
                      v-if="props.row.unit_lecture > 0"
                      >Lecture:
                      <span style="font-weight: bold; margin-left: 2px">{{
                        props.row.unit_lecture
                      }}</span></q-chip
                    >

                    <q-chip
                      color="primary"
                      text-color="white"
                      v-if="props.row.unit_lab > 0"
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
                  <q-td key="action" :props="props">
                    <q-btn
                      color="primary"
                      icon="add"
                      size="sm"
                      @click="
                        addSubject(
                          props.row.id,
                          props.row.description,
                          props.row.available
                        )
                      "
                    />
                  </q-td>
                </q-tr>
                <!-- </p> -->
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="block" default>
            <!-- <div class="text-h6">Assinged Course Subject</div> -->
            <q-toolbar class="q-mt-md">
              <q-toolbar-title class="text-h6"
                >Blocked Section Subject for
                {{ studentCourse }}</q-toolbar-title
              >
              <q-input
                bottom-slots
                v-model="searchSubject"
                @keyup="onSearchBlockSubmit"
                label="Search Block Section"
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
              :rows="store.state.rowAllBlockSection"
              :columns="columns"
              row-key="id"
              separator="cell"
              :visible-columns="
                $q.screen.gt.xs
                  ? [
                      'name',
                      'teacher',
                      'course',
                      'semester',
                      'year',
                      'subject',
                      'action',
                    ]
                  : [
                      'name',
                      'teacher',
                      'course',
                      'semester',
                      'year',
                      'subject',
                      'action',
                    ]
              "
            >
              <template #body="props">
                <!-- <p v-for="item in studentSubjects"> -->
                <q-tr :props="props">
                  <!-- {{ item.code }}
        {{ props.row.name }} -->
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>

                  <q-td key="teacher" :props="props">
                    {{ props.row.teacher }}
                  </q-td>

                  <q-td key="course" :props="props">
                    {{ props.row.course }}
                  </q-td>

                  <q-td key="semester" :props="props">
                    {{ props.row.semester }}
                  </q-td>
                  <q-td key="year" :props="props">
                    {{ props.row.year }}
                  </q-td>
                  <q-td key="subject" :props="props">
                    <q-btn color="primary" label="View" size='sm' icon="visibility">
                        <q-menu class="z-top">
                        <q-list style="min-width: 100px">
                            <q-item>
                            <q-item-section>
                                <p v-for="items in props.row.schedules">
                                <p
                                    ><span class="text-bold">Subject:</span> <q-chip>{{ items.schedule.subject.code }} </q-chip>
                                    <!-- <q-chip>{{ items.schedule.schedules }}</q-chip> -->
                                    <span v-for="schedule in items.schedule.schedules">
                                    <p><span class="text-bold">Schedule: </span>{{ schedule.title }} -  {{schedule.subject_scheduele_id}} ({{ schedule.day }}) {{ moment(schedule.time_start, "hh:mm a").format("hh:mm a") }} - {{ moment(schedule.time_end, "hh:mm a").format("hh:mm a") }}</p>
                                    <p style="margin-top: -20px;"><span class="text-bold" >Building:</span>{{ schedule.building }}</p>
                                    <p style="margin-top: -20px;"><span class="text-bold">Room:</span>{{ schedule.room }}</p>
                                    </span>
                                </p>
                                <q-separator />
                                </p>
                            </q-item-section>
                            </q-item>

                        </q-list>
                        </q-menu>
                    </q-btn>

                  </q-td>

                  <q-td key="action" :props="props">
                    <q-btn
                      color="primary"
                      icon="add"
                      size="sm"
                      @click="
                        addSection(
                          props.row.id,
                        )
                      "
                    />
                  </q-td>
                </q-tr>
                <!-- </p> -->
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="all">
            <!-- <div class="text-h6">All Subject Schedules</div> -->
            <q-toolbar class="q-mt-md">
              <q-toolbar-title class="text-h6"
                >All Subject Schedules</q-toolbar-title
              >
              <q-input
                bottom-slots
                v-model="searchAllSubject"
                @keyup="onSearchSubmitAllSubject"
                label="Search Subject"
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
              :rows="store.state.rowAllSubjectDatas"
              :columns="columns"
              row-key="id"
              separator="cell"
              :visible-columns="
                $q.screen.gt.xs
                  ? [
                      'code',
                      'name',
                      'description',
                      'teacher',
                      'course',
                      'schedule',
                      'available',
                      'price',
                      'total_units',
                      'action',
                    ]
                  : [
                      'code',
                      'name',
                      'description',
                      'teacher',
                      'course',
                      'schedule',
                      'available',
                      'price',
                      'total_units',
                      'action',
                    ]
              "
            >
              <template #body="props">
                <!-- <p v-for="item in studentSubjects"> -->
                <q-tr :props="props">
                  <!-- {{ item.code }}
        {{ props.row.name }} -->
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
                  </q-td>

                  <q-td key="available" :props="props">
                    {{ props.row.available }}
                  </q-td>
                  <q-td key="price" :props="props">
                    {{ props.row.price }}
                  </q-td>

                  <q-td key="units" :props="props">
                    <q-chip
                      color="primary"
                      text-color="white"
                      v-if="props.row.unit_lecture > 0"
                      >Lecture:
                      <span style="font-weight: bold; margin-left: 2px">{{
                        props.row.unit_lecture
                      }}</span></q-chip
                    >

                    <q-chip
                      color="primary"
                      text-color="white"
                      v-if="props.row.unit_lab > 0"
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
                  <q-td key="action" :props="props">
                    <q-btn
                      color="primary"
                      icon="add"
                      size="sm"
                      @click="
                        addSubject(
                          props.row.id,
                          props.row.description,
                          props.row.available
                        )
                      "
                    />
                  </q-td>
                </q-tr>
                <!-- </p> -->
              </template>
            </q-table>
          </q-tab-panel>
          <q-tab-panel name="billing">
            <BillingList />
          </q-tab-panel>
          <q-tab-panel name="group_billing">
            <BillingList />
          </q-tab-panel>
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
// import moment from "moment";

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
    name: "semester",
    label: "Semester",
    field: "semester",
    align: "left",
  },
  {
    name: "year",
    label: "Year/Grade Level",
    field: "year",
    align: "left",
  },

  {
    name: "subject",
    label: "Subject Schedules",
    field: "subject",
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
  props: ["semId", "courseId","studentCourse"],
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
      // studentCourse: null,
      searchAllSubject: null,
      tab: "course",
    };
  },
  methods: {
    // ...mapActions("AdmissionStore", ["onSearch"]),
    // ...mapActions("AdmissionStore", ["onSearchAllSubject"]),
    // ...mapActions("AdmissionStore", ["getTemporarySubject"]),
    ...mapActions("AdmissionStore", [
      "getAllUnenrolledStudent",
      "getAllBlockSection",
      "getTemporarySubject",
      "onSearchAllSubject",
      "onSearch",
      "getSection",
      'onSearchBlockSection'
    ]),
    addSection(id) {
      this.getSection([id, this.courseId, this.$route.params.student_id])
    },
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
    onSearchBlockSubmit() {
      var name = this.searchSubject;
      this.onSearchBlockSection([
        this.courseId,
        this.$route.params.id,
        name,
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
    this.getAllBlockSection([this.courseId, this.$route.params.id]);
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
