<template>
  <q-card style="max-width: 700px; width: 700px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Schedule </q-toolbar-title>
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
        <!-- <div class="row q-col-gutter-none">
          <q-select
            filled
            :options="getSubjects"
            v-model="formData.sub_id"
            label="Subjects"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div> -->
        <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="getSchedules"
          :columns="columns"
          row-key="role"
          separator="cell"
          :visible-columns="
            $q.screen.gt.xs
              ? ['title', 'day', 'room', 'schedule', 'action']
              : ['title', 'day', 'room', 'schedule', 'action']
          "
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>

              <q-td key="day" :props="props">
                {{ props.row.day }}
              </q-td>
              <q-td key="room" :props="props">
                {{ props.row.room }}
              </q-td>
              <q-td key="schedule" :props="props">
                {{ props.row.schedule }}
              </q-td>

              <q-td key="action" :props="props">
                <q-btn
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="removeMet(props.row.id)"
                />
                <q-btn
                  color="blue"
                  icon="edit"
                  size="sm"
                  @click="editMet(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.title"
            label="Title (ex. Lecture)"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type code of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="formData.day"
            label="Day (ex. MWF)"
            name="code"
            class="q-mr-sm col-3 full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type code of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.room"
            label="Room"
            name="code"
            class="q-mr-sm col-3 full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="bedroom_child" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.building"
            label="Building"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="apartment" />
            </template>
          </q-input>

          <div class="row q-mb-lg">
            <div class="col q-mr-sm">
              <q-input
                filled
                label="Start Time"
                v-model="formData.start_time"
                mask="fulltime"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Required, Please select start time',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="formData.start_time" with-seconds>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <p style="margin-top: 20px; margin-right: 10px">to</p>

            <div class="col q-mr-sm">
              <q-input
                filled
                label="End Time"
                mask="fulltime"
                v-model="formData.end_time"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Required, Please select end time',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="formData.end_time" with-seconds>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="row align-center">
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
    name: "title",
    label: "Title",
    field: "title",
    align: "left",
    sortable: true,
  },
  {
    name: "day",
    label: "Day",
    field: "day",
    align: "left",
    sortable: true,
  },

  {
    name: "room",
    label: "Building/Room",
    field: "room",
    align: "left",
    sortable: true,
  },

  {
    name: "schedule",
    label: "Schedule",
    field: "schedule",
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
  emits: ["hideDayDialog"],
  props: ["semId", "subSchedId"],
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
        title: "",
        day: "",
        start_time: null,
        end_time: null,
        building: null,
        room: null,
      },
      loadingSpinner: true,
      showEditDialog: false,
      requiredRule,
      getCollege: [],
      getSubjects: [],
      getSchedules: [],
      subSchedDayId: null,
      //   sem: this.semId,
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    editMet(id) {
      this.subSchedDayId = null;
      this.subSchedDayId = id;
      this.showEditDialog = true;
    },
    async removeMet(id) {
      await api
        .delete("/api/subjects/get/schedule/" + id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          this.loadingSpinner = false;
          const errors = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errors != null) {
            setTimeout(() => {
              Object.entries(response.data.data.errors).forEach((msg) => {
                this.$q.notify({
                  type: "negative",
                  message: msg[1],
                  icon: "error",
                });
              });
              this.loadingSpinner = true;
              this.formData.password = "";
              this.formData.password_confirmation = "";
            }, 1000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              this.showChangePasswordeDialog = false;
              Object.entries(response.data.message).forEach((msg) => {
                this.$q.notify({
                  type: "positive",
                  message: msg[1],
                  icon: "save",
                });
              });
              this.$emit("hideRoleDialog");
              // this.getAllParent();
              // this.getAllTeacher();
              // this.getAllEmployee();
              // this.getAllStudent();
              this.formData.preSub = null;
              this.getSchedules = [];
              this.getSchedulesMethod();
              this.onSemSelect(this.semId);
              this.getUserRoless = [];
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSchedulesMethod() {
      await api
        .get("/api/subjects/get/schedule/" + this.subSchedId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);

          this.getSchedules = [];
          this.onSemSelect(this.semId);
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getSchedules.push({
              id: val.id,
              title: val.title,
              day: val.day,
              room:
                val.room != null || val.building != null
                  ? val.room + "/" + val.building
                  : "",
              schedule:
                moment(val.time_start, "hh:mm a").format("hh:mm a") +
                "-" +
                moment(val.time_end, "hh:mm a").format("hh:mm a"),
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSubj() {
      await api
        .get("/api/subjects/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(this.subSchedId);
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getSubjects.push({
              label: val.code + " (" + val.descr + ")",
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      await api
        .post(
          "/api/subjects/add/schedule",
          {
            title: this.formData.title,
            day: this.formData.day,
            room: this.formData.room,
            building: this.formData.building,
            start_time: this.formData.start_time,
            end_time: this.formData.end_time,
            subject_sched_id: this.subSchedId,
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
          this.loadingSpinner = false;
          let errs = null;
          errs = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errs !== null) {
            setTimeout(() => {
              //   Object.entries(errors).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: errs,
                icon: "error",
              });
              //   });
              this.loadingSpinner = true;
            }, 2000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              //   Object.entries(response.data.message).forEach((msg) => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
              });
              //   });
              this.$emit("hideDayDialog");
              this.getSchedules = [];
              this.getSchedulesMethod();
              this.onSemSelect(this.semId);
              //   this.formData.title = " ";
              //   this.formData.day = " ";
              //   this.formData.start_time = "00:00:00";
              //   this.formData.end_time = "00:00:00";
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          //   this.$q.notify({
          //     type: "positive",
          //     message: error.data.errors.message,
          //     icon: "save",
          //   });
        });
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    this.getSubj();
    this.getSchedulesMethod();
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
