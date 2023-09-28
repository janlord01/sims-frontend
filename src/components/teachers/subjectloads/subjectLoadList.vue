<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="subjectLoad"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? [
            'id',
            'code',
            'name',
            'description',
            'course',
            'semester',
            'schedule',
            'action',
          ]
        : [
            'id',
            'code',
            'name',
            'description',
            'course',
            'semester',
            'schedule',
            'action',
          ]
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
        <q-td key="semester" :props="props">
          {{ props.row.semester }}
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
            <span style="font-weight: bold; margin-left: 10px"
              >-Building:
            </span>
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

        <!-- <q-td key="has_pre" :props="props">
          <q-icon name="check_box" color="primary" v-if="props.row.has_pre == 1" />
          <q-icon name="cancel" color="red" v-else />
          {{ props.row.has_pre == 1 ? "Yes" : "No" }}
        </q-td>

        <q-td key="flag" :props="props">
          <q-icon name="check_box" color="primary" v-if="props.row.flag == 1" />
          <q-icon name="cancel" color="red" v-else />
          {{ props.row.flag == 1 ? "Yes" : "No" }}
        </q-td> -->

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="visibility"
            size="sm"
            label="View Student"
            style="width: 140px"
            @click="
              viewStudent(props.row.id, props.row.name + ' - ' + props.row.code)
            "
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Dialog -->
  <q-dialog v-model="showViewDialog">
    <subjectStudentList
      :sub-sched-id="subject_sched_id"
      :code-id="code"
      @hide-view-dialog="showViewDialog = !showViewDialog"
    />
  </q-dialog>
</template>

<script>
import subjectStudentList from "src/components/teachers/subjectLoads/subjectStudentList.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import addDayDialog from "src/components/subjects/schedules/addDay.vue";

import { api } from "src/boot/axios";
import store from "src/store/subjects/schedule/store";
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
    label: "Schedule Code",
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
    label: "Course Assigned",
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
  props: ["semId"],
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
      showViewDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
      subjectLoad: [],
      code: null,
    };
  },
  methods: {
    async getAllSchedules(state, payload) {
      await api
        .get("/api/teachers/subject/load", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          // commit("getAllSchedules", response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.subjectLoad.push({
              id: val.id,
              code: val.code,
              name: val.name,
              description: val.descr,
              teacher: val.teacherName,
              // time_start: val.time_start,
              // time_end: val.time_end,
              semester: val.title,
              available: val.available,
              limit: val.limit,
              price: val.overide_unit_price,
              schedules: val.schedules,
              course: val.course_code,
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
    viewStudent(sub_sched_id, code) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showViewDialog = true;
      this.code = code;
    },
    preDialog(sub_id) {
      this.showPreDialog = true;
      this.sub_id = null;
      this.sub_id = sub_id;
    },
  },
  mounted() {
    this.getAllSchedules();
  },
  components: {
    subjectStudentList,
  },
};
</script>

<style></style>
