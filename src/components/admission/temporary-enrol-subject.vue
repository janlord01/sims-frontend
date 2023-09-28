<template>
  <q-toolbar class="">
    <q-toolbar-title class="text-h6">Subjects</q-toolbar-title>
  </q-toolbar>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.tempDataSubject"
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
            'total_units',
            'price',
            'action',
          ]
        : ['code', 'name']
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
          <q-chip color="primary" text-color="white" v-if="props.row.unit_practicum > 0"
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
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            @click="removeSubjectFunc(props.row.id)"
          />
        </q-td>
      </q-tr>
      <!-- </p> -->
    </template>
  </q-table>
</template>

<script>
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import addDayDialog from "src/components/subjects/schedules/addDay.vue";
import { mapActions, mapState, mapGetters } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/admission/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";

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
    name: "total_units",
    label: "Total Units",
    field: "total_units",
    align: "left",
  },

  {
    name: "price",
    label: "Unit Price",
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
      formData: {
        subjectTotal: 0,
      },
      subject_sched_id: null,
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
      studentSubjects: [],
      searchSubject: null,
    };
  },
  methods: {
    ...mapActions("AdmissionStore", ["onSearch"]),
    ...mapActions("AdmissionStore", ["removeSubject"]),
    removeSubjectFunc(subject_sched_id) {
      this.removeSubject(subject_sched_id);
      //   console.log(billing_id);
    },
    async getStudentSubjects() {
      await api("/api/admission/student/" + this.$route.params.student_id + "/subject", {
        headers: {
          Authorization: "Bearer " + this.newToken,
        },
      })
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
    getSubTotalSubject() {
      this.formData.subjectTotal = this.total;
    },
    onSearchSubmit() {
      var name = this.searchSubject;
      this.onSearch([name, this.$route.params.student_id, this.$route.params.id]);
    },
  },

  computed: {
    // getSubjectTotal() {
    //   return (this.formData.subjectTotal = store.state.total);
    // },
    ...mapState("AdmissionStore", ["total"]),
    // sometotal() {
    //   this.formData.subjectTotal = store.state.total;
    // }
  },
  beforeMount() {
    // this.getAllUsers();
  },
  watch: {
    total: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.subjectTotal = newVal;
      },
      deep: true,
    },
    // sometotal(newVal, oldVal) {
    //     console.log(`Updating from ${oldVal} to ${newVal}`);

    // }
  },
  mounted() {
    this.getStudentSubjects();
    this.getSubTotalSubject();
    // this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  },
  components: {
    editScheduleDialog,
    AddTeacherDialog,
    addDayDialog,
  },
};
</script>

<style></style>
