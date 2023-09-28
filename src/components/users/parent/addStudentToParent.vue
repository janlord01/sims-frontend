<template>
  <q-card style="max-width: 700px; width: 700px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Assign Student </q-toolbar-title>
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
        <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="getAssignedStudents"
          :columns="columns"
          row-key="role"
          separator="cell"
          :visible-columns="$q.screen.gt.xs ? ['name', 'action'] : ['name', 'action']"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="removeStudent(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-col-gutter-none q-mt-lg">
          <q-select
            filled
            v-model="formData.student"
            class="full-width"
            use-input
            input-debounce="0"
            label="Search Student"
            :options="studentList"
            @filter="filterFn"
            style="width: 250px"
            @update:model-value="getStudent"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="row align-center q-mt-md">
          <q-btn
            unelevated
            label="Save"
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
  emits: ["hideAddStudent"],
  props: ["userId"],
  setup() {
    return {
      pagination,
      columns,
      moment,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        student: null,
      },
      loadingSpinner: true,
      showEditDialog: false,
      requiredRule,
      getCollege: [],
      getSubjects: [],
      getSchedules: [],
      subSchedDayId: null,
      studentOptions: [],
      studentList: [],
      student_id: null,
      getAssignedStudents: [],
      //   sem: this.semId,
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    removeStudent(studentId) {
      this.$q.loading.show();
      api
        .delete(
          "/api/parent/students/assign/remove",
          {
            params: {
              parent: this.userId,
              student: studentId,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          //   console.log(response);

          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                timeout: 3000,
                message: response.data.message,
                position: "top",
              });
              this.getParentStudents();
              this.$q.loading.hide();
              // this.formData.student = null;
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                timeout: 3000,
                message: response.data.message,
                position: "top",
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          // this.$q.notify({
          //   type: "negative",
          //   position: "top",
          //   timeout: 3000,
          //   message: error.data.errors.message,
          // });
        });
    },
    async getParentStudents() {
      await api
        .get("/api/parent/students/" + this.userId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.getAssignedStudents = [];
          Object.entries(response.data.data).map(([key, val]) => {
            this.getAssignedStudents.push(val);
          });
          // console.log(this.getAssignedStudents);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getStudent() {
      this.student_id = this.formData.student != null ? this.formData.student.value : "";
      // console.log(this.student_id);
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.studentList = this.studentOptions;

          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.studentList = this.studentOptions.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    async getAllStudent() {
      await api
        .get("api/student", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.users).map(([key, val]) => {
            this.studentOptions.push({
              value: val.id,
              label:
                val.lastname +
                ", " +
                val.firstname +
                " " +
                (val.middlename !== null ? val.middlename : ""),
            });
          });
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            message: error.response.data.message,
          });
        });
    },

    async onSubmit() {
      this.$q.loading.show();
      await api
        .post(
          "/api/parent/students/assign/store",
          {
            parent: this.userId,
            student: this.student_id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          //   console.log(response);

          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                timeout: 3000,
                message: response.data.message,
                position: "top",
              });
              this.getParentStudents();
              this.$q.loading.hide();
              this.formData.student = null;
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                timeout: 3000,
                message: response.data.message,
                position: "top",
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          // this.$q.notify({
          //   type: "negative",
          //   position: "top",
          //   timeout: 3000,
          //   message: error.data.errors.message,
          // });
        });
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    this.getAllStudent();
    this.getParentStudents();
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
