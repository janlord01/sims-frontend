<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Schedule </q-toolbar-title>
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
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.title"
            label="Title (ex. Lecture)"
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
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
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
  emits: ["hideEditDialog", "getSchedule"],
  props: ["semId", "subSchedDayId"],
  //   props: {
  //     getSchedule: { type: Function },
  //   },
  setup() {
    return {
      pagination,
      columns,
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
        room: null,
        building: null,
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
      getSubjects: [],
      getSchedules: [],
    };
  },
  methods: {
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),

    async getSchedulesDay() {
      await api
        .get("/api/subjects/get/schedule/day/" + this.subSchedDayId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(this.semId);

          this.formData.title = response.data.subject.title;
          this.formData.day = response.data.subject.day;
          this.formData.start_time = response.data.subject.time_start;
          this.formData.end_time = response.data.subject.time_end;
          this.formData.room = response.data.subject.room;
          this.formData.building = response.data.subject.building;
          //   Object.entries(response.data.subjects).map(([key, val]) => {
          //     this.getSchedules.push({
          //       id: val.id,
          //       title: val.title,
          //       day: val.day,
          //       schedule: val.time_start + "-" + val.time_end,
          //     });
          //   });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // async getSchedulesMethod() {
    //   await api
    //     .get("/api/subjects/get/schedule/" + this.subSchedId, {
    //       headers: {
    //         Authorization: "Bearer " + this.newToken,
    //       },
    //     })
    //     .then((response) => {
    //       //   console.log(this.subSchedDayId);
    //       Object.entries(response.data.subjects).map(([key, val]) => {
    //         this.getSchedules.push({
    //           id: val.id,
    //           title: val.title,
    //           day: val.day,
    //           schedule: val.time_start + "-" + val.time_end,
    //         });
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
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
        .patch(
          "/api/subjects/get/schedule/" + this.subSchedDayId,
          {
            title: this.formData.title,
            day: this.formData.day,
            room: this.formData.room,
            building: this.formData.building,
            start_time: this.formData.start_time,
            end_time: this.formData.end_time,
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
              this.$emit("hideEditDialog");
              this.$emit("getSchedule");
              //   this.getSchedule();
              this.onSemSelect(this.semId);
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
    // this.getSchedulesMethod();
    this.getSchedulesDay();
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
