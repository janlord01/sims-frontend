<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'course', 'descr', 'action']
        : ['id', 'course', 'descr', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="course" :props="props">
          {{ props.row.code }}
        </q-td>
        <q-td key="descr" :props="props">
          {{ props.row.descr }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="orange"
            icon="library_add"
            size="sm"
            @click="addFunc(props.row.id, props.row.course_id)"
          />

          <q-btn
            color="green"
            icon="visibility"
            size="sm"
            :to="
              '/subjects/prospectus/course/' +
              props.row.code.toLowerCase() +
              '/' +
              props.row.id
            "
          />
          <!-- <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Dialog -->
  <q-dialog v-model="showEditDialog">
    <editScheduleDialog
      :sub-sched-id="subject_sched_id"
      :sem-id="semId"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Teacher Dialog -->
  <q-dialog v-model="showAddTeacherDialog">
    <AddTeacherDialog
      :sub-sched-id="subject_sched_id"
      :sem-id="semId"
      @hide-teacher-dialog="showAddTeacherDialog = !showAddTeacherDialog"
    />
  </q-dialog>

  <!-- Add Subject Dialog -->
  <q-dialog v-model="showAddDialog">
    <addDialog
      :pros-id="pros_id"
      :course-id="course_id"
      @hide-add-dialog="showAddDialog = !showAddDialog"
    />
  </q-dialog>
</template>

<script>
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
import AddTeacherDialog from "src/components/subjects/schedules/addTeacher.vue";
import addDialog from "src/components/subjects/prospectus/addSubject.vue";

import { api } from "src/boot/axios";
import store from "src/store/subjects/prospectus/store";
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
    name: "course",
    label: "Course",
    field: "code",
    align: "left",
    sortable: true,
  },

  {
    name: "descr",
    label: "Description",
    field: "descr",
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
      pros_id: null,
      course_id: null,
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
    };
  },
  methods: {
    addFunc(pros_id, course_id) {
      this.pros_id = null;
      this.pros_id = pros_id;
      this.course_id = null;
      this.course_id = course_id;
      this.showAddDialog = true;
      // console.log("course  id:" + course_id);
      // console.log("pros  id:" + pros_id);
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
  mounted() {},
  components: {
    editScheduleDialog,
    AddTeacherDialog,
    addDialog,
  },
};
</script>

<style></style>
