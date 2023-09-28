<template>
  <div class="bg-white text-black shadow-2">
    <q-toolbar class="">
      <q-toolbar-title class="text-h6">Senior High School 2nd Semester</q-toolbar-title>
    </q-toolbar>
  </div>
  <q-spinner-ios
    color="primary"
    size="2em"
    class="absolute-center z-max"
    v-if="!loadingSpinner"
  />

  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.senior_second_sem"
    :columns="columns"
    row-key="code"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['code', 'descr', 'lecture', 'lab', 'practicum', 'prerequisite', 'action']
        : ['code', 'descr', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <!-- <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td> -->
        <q-td key="code" :props="props">
          {{ props.row.code }}
        </q-td>
        <q-td key="descr" :props="props">
          {{ props.row.descr }}
        </q-td>
        <q-td key="lecture" :props="props">
          {{ props.row.flag == 0 ? "(" + props.row.lec + ")" : props.row.lec }}
        </q-td>

        <q-td key="lab" :props="props">
          {{ props.row.lab }}
        </q-td>
        <q-td key="practicum" :props="props">
          {{ props.row.practicum }}
          <!-- {{ props.row.course_prospect_id }} -->
        </q-td>

        <q-td key="prerequisite" :props="props">
          <span v-for="pre in props.row.prerequisites">
            <span v-for="sub in pre.subject">
              <q-chip>{{ sub.code }}</q-chip>
            </span>
            <!-- {{ pre }} -->
          </span>
          <!-- {{ props.row.prerequisites }} -->
        </q-td>

        <q-td key="action" :props="props">
          <q-btn color="red" icon="delete" size="sm" @click="deleteFunc(props.row.id)" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/subjects/prospectus/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";
import { mapActions } from "vuex";

const pagination = {
  //   sortBy: "id",
  page: 1,
  rowsPerPage: 0,
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
    classes: "bg-grey-4",
  },

  {
    name: "descr",
    label: "Description",
    field: "descr",
    align: "left",
    sortable: true,
  },

  {
    name: "lecture",
    label: "Lec",
    field: "lecture",
    align: "left",
    sortable: true,
  },

  {
    name: "lab",
    label: "Lab",
    field: "lecture",
    align: "left",
    sortable: true,
  },

  {
    name: "practicum",
    label: "Practicum",
    field: "practicum",
    align: "left",
    sortable: true,
  },

  {
    name: "prerequisite",
    label: "Prerequisite",
    field: "prerequisite",
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
  props: ["code"],
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
      newToken: LocalStorage.getItem("jwt"),
      subjects: [],
      subject_id: null,
      sem_id: null,
      course_id: null,
      loadingSpinner: true,
    };
  },
  methods: {
    ...mapActions("ProspectusStore", ["getSubjects"]),
    async deleteFunc(id) {
      // console.log(id);
      await api
        .delete("/api/prospectus/" + id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.loadingSpinner = false;
          let errs = null;
          errs = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errs !== null) {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: errs,
                icon: "error",
              });
              this.loadingSpinner = true;
            }, 2000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
              });
              this.getSubjects(this.$route.params.code);
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getSubjects(this.$route.params.code);
  },
  components: {},
};
</script>

<style></style>
