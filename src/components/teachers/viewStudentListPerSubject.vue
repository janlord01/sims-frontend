<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> View Students </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Subject Schedule ({{ codeId }})</q-toolbar-title>
      </q-toolbar>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="studentList"
        :columns="columns"
        row-key="id"
        separator="cell"
        :visible-columns="$q.screen.gt.xs ? ['name'] : ['name']"
      >
        <template #body="props">
          <!-- <p v-for="item in studentSubjects"> -->
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{
                props.row.lastname +
                ", " +
                props.row.firstname +
                " " +
                props.row.middlename
              }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script>
import { mapActions, mapState } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/subjects/schedule/store";
import storeSection from "src/store/subjects/block-section/store";
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
];
export default {
  props: ["codeId", "subSchedId"],
  emits: ["hideViewDialog"],
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
      storeSection,
      // semesterId:null,
      studentList: [],
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    async getStudentlist() {
      await api
        .get("/api/teachers/subject/student/" + this.subSchedId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.studentList.push({
              firstname: val.firstname,
              middlename: val.middlename,
              lastname: val.lastname,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {},
  mounted() {
    this.getStudentlist();
  },
  components: {},
};
</script>

<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
