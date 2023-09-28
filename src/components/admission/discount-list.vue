<template>
  <q-toolbar>
    <q-toolbar-title class="text-h6">Schoolarship</q-toolbar-title>
    <q-input
      bottom-slots
      v-model="searchDiscount"
      @keyup="onSearchDiscount"
      label="Search Schoolarship"
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
    :rows="store.state.rowDiscountDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs ? ['name', 'price', 'action'] : ['name', 'price']
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
        <q-td key="name" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="price" :props="props">
          {{ props.row.number }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="add"
            size="sm"
            @click="addDiscount(props.row.id)"
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
import { mapActions, mapState } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/admission/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";

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
    label: "Schoolarship/Discount",
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
    name: "price",
    label: "Amount/Percentage",
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
      studentSubjects: [],
      searchDiscount: null,
    };
  },
  methods: {
    ...mapActions("AdmissionStore", ["onSearchAllBilling"]),
    ...mapActions("AdmissionStore", ["getTemporaryBilling"]),
    ...mapActions("AdmissionStore", ["getTemporaryDiscount"]),
    ...mapActions("AdmissionStore", ["onSearchAllDiscount"]),

    async addDiscount(discount_id) {
      // console.log(this.courseId);
      let a = 0;

      store.state.tempDataDiscount.forEach((element) => {
        // console.log(element);
        if (element.id == discount_id) {
          // console.log("error");
          a++;
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
        return false;
      } else {
        await api
          .get("/api/scholarship/" + discount_id, {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          })
          .then((response) => {
            // console.log(response);
            if (response.data.status == 200) {
              setTimeout(() => {
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 3000,
                  position: "top",
                  message: "Discount Added!",
                });
              }, 100);

              this.getTemporaryDiscount(response.data.data);
            } else {
              setTimeout(() => {
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message: response.data.message,
                });
              }, 100);
            }
            // this.studentSubjects = response.data.data;
            // console.log(this.studentSubjects);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async getStudentSubjects() {
      await api(
        "/api/admission/student/" + this.$route.params.student_id + "/subject",
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
    onSearchDiscount() {
      var name = this.searchDiscount;
      this.onSearchAllDiscount([
        name,
        this.$route.params.student_id,
        this.$route.params.id,
      ]);
    },
  },
  mounted() {
    this.getStudentSubjects();
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
