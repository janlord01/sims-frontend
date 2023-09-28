<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add/Update Subject Schedule </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="store.state.rowDatas"
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
                'teacher',
                'course',
                'schedule',
                'limit',
                'available',
                'price',
                'action',
              ]
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
                <span style="font-weight: bold; margin-left: 10px"
                  >-Room:
                </span>
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
                color="orange"
                icon="more_time"
                size="sm"
                @click="addSchedule(props.row.id)"
              />

              <q-btn
                color="green"
                icon="man"
                size="sm"
                @click="addTeacher(props.row.id)"
              />
              <q-btn
                color="primary"
                icon="edit"
                size="sm"
                @click="editDialog(props.row.id)"
              />
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

      <!-- Add Day Dialog -->
      <q-dialog v-model="showAddScheduleDialog">
        <addDayDialog
          :sub-sched-id="subject_sched_id"
          :sem-id="semId"
          @hide-day-dialog="showAddScheduleDialog = !showAddScheduleDialog"
        />
      </q-dialog>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-select
            filled
            @filter="filterSubject"
            :options="subjectOptions"
            use-chips
            input-debounce="0"
            behavior="menu"
            stack-label
            v-model="formData.course"
            label="Courses"
            :class="
              $q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
          </q-select>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
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
import editScheduleDialog from "src/components/subjects/schedules/editSchedule.vue";
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
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
    };
  },
  methods: {
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
  mounted() {},
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
