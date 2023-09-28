<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDataStudents"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'course', 'year', 'shift', 'reasons', 'action']
        : ['id', 'name', 'course', 'year', 'shift', 'reasons', 'action']
    "
  >
    <template #body="props">
      <q-tr
        :props="props"
        v-if="props.row.status == 1 || props.row.status === null"
      >
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          <q-btn round>
            <q-avatar size="42px">
              <q-img :src="props.row.profile_image" width="50px" />
            </q-avatar>
          </q-btn>

          {{ props.row.name }}
        </q-td>
        <q-td
          key="course"
          :props="props"
          :class="
            props.row.course == 'Please assign course'
              ? 'bg-red-4 text-white'
              : ''
          "
        >
          {{ props.row.course }}
        </q-td>

        <q-td key="year" :props="props">
          {{ props.row.year }}
        </q-td>
        <q-td key="shift" :props="props">
          {{ props.row.reasons !== "" ? "yes" : "no" }}
        </q-td>
        <q-td key="shift" :props="props">
          {{ props.row.reasons !== null ? props.row.reasons : "" }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="secondary"
            icon="assignment_turned_in"
            size="sm"
            @click="assignCourseDialog(props.row.id, $event)"
          />

          <q-btn
            color="primary"
            icon="track_changes"
            size="sm"
            @click="shiftCourseDialog(props.row.id, $event)"
          />
          <q-btn
            color="green"
            icon="import_export"
            size="sm"
            @click="yearLevelDialog(props.row.id, $event)"
          />
          <q-btn
            color="orange"
            icon="bookmark_add"
            size="sm"
            :to="'/courses/student/' + props.row.id + '/subject/add'"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Assign Course Dialog -->
  <q-dialog v-model="showAssignCourseDialog">
    <changeCourseDialog
      :user-id="user_id"
      @hide-course-dialog="showAssignCourseDialog = !showAssignCourseDialog"
    />
  </q-dialog>
  <!-- Shift Course -->
  <q-dialog v-model="showShiftCourseDialog">
    <shiftCourseDialog
      :user-id="user_id"
      @hide-course-dialog="showShiftCourseDialog = !showShiftCourseDialog"
    />
  </q-dialog>

  <!-- Change Year Level -->
  <q-dialog v-model="showYearLevelDialog">
    <changeYearLevelDialog
      :user-id="user_id"
      @hide-course-dialog="showYearLevelDialog = !showYearLevelDialog"
    />
  </q-dialog>
</template>

<script>
import changeCourseDialog from "src/components/academe/student-course/student-assign-course.vue";
import shiftCourseDialog from "src/components/academe/student-course/student-shift-course.vue";
import changeYearLevelDialog from "src/components/academe/student-course/student-level.vue";

import { api } from "src/boot/axios";
import store from "src/store/academe/colleges/store";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
const pagination = {
  sortBy: "name",
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "course",
    label: "Course",
    field: "course",
    align: "left",
    sortable: true,
  },
  {
    name: "year",
    label: "Year Level",
    field: "year",
    align: "left",
  },
  {
    name: "shift",
    label: "Shifted",
    field: "shift",
    align: "left",
  },
  {
    name: "reasons",
    label: "Reasons",
    field: "reasons",
    align: "left",
  },
  //   {
  //     name: "role",
  //     label: "Role",
  //     field: "role",
  //     align: "left",
  //   },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  props: ["searchData"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      user_id: null,
      showYearLevelDialog: false,
      showAssignCourseDialog: false,
      showShiftCourseDialog: false,
      showRoleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      datas: store,
    };
  },
  methods: {
    yearLevelDialog(user_id) {
      this.showYearLevelDialog = true;
      this.user_id = user_id;
    },
    shiftCourseDialog(user_id) {
      this.showShiftCourseDialog = true;
      this.user_id = user_id;
    },
    assignCourseDialog(user_id) {
      this.showAssignCourseDialog = true;
      this.user_id = user_id;
      // console.log(this.user_id);
    },
    changeImageDialog(user_id, event) {
      this.onProgressBar = 0;
      this.user_id = null;
      this.showChangeImageDialog = true;
      this.user_id = user_id;
      this.user_image = null;

      api
        .get("/api/user/profile-image/" + user_id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data);
          this.user_image = response.data.data.image_path;
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(this.user_id);
    },
    changePasswordDialog(user_id, event) {
      this.showChangePasswordeDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialogActive(user_id, event) {
      this.showStatusDialogActive = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialog(user_id, event) {
      this.showStatusDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialogActive(user_id, event) {
      this.showStatusDialogActive = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeRoleDialog(user_id, event) {
      this.showRoleDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    ImportDialog(e) {
      this.showImportDialog = true;
    },
    // ...mapActions("Employeestore", ["getAllEmployee"]),
    // getAllUsers() {
    //   return store.state.rowDatas;
    //   console.log(store.state.rowDatas);
    // },
  },
  computed: {
    getAllUsers() {
      return store.state.rowDatas;
    },
  },
  beforeMount() {
    // this.getAllUsers();
  },
  mounted() {},
  watch: {
    getAllUsers(newVal, oldVal) {
      console.log("New :" + newVal + "/ Old " + oldVal);
    },
  },
  components: {
    changeCourseDialog,
    shiftCourseDialog,
    changeYearLevelDialog,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
