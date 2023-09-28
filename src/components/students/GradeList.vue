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
        ? [
            'name',
            'description',
            'teacher',
            'first_grading',
            'second_grading',
            'third_grading',
            'fourth_grading',
            'final_grade',
            'remark',
          ]
        : [
            'name',
            'description',
            'teacher',
            'first_grading',
            'second_grading',
            'third_grading',
            'fourth_grading',
            'final_grade',
            'remark',
          ]
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="teacher" :props="props">
          {{ props.row.teacher }}
        </q-td>
        <q-td key="first_grading" :props="props">
          {{ props.row.first_grading }}
        </q-td>
        <q-td key="second_grading" :props="props">
          {{ props.row.second_grading }}
        </q-td>
        <q-td key="third_grading" :props="props">
          {{ props.row.third_grading }}
        </q-td>

        <q-td key="fourth_grading" :props="props">
          {{ props.row.fourth_grading }}
        </q-td>

        <q-td key="final_grade" :props="props">
          {{ props.row.final_grade }}
        </q-td>
        <q-td key="remark" :props="props">
          {{ props.row.remark }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/students/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";

const pagination = {
  sortBy: "id",
  rowsPerPage: 20,
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
    name: "first_grading",
    label: "First Grading/Prelim",
    field: "first_grading",
    align: "left",
  },

  {
    name: "second_grading",
    label: "2nd Grading/Mid Term",
    field: "second_grading",
    align: "left",
  },

  {
    name: "third_grading",
    label: "3rd Grading/Semi Final",
    field: "third_grading",
    align: "left",
  },

  {
    name: "fourth_grading",
    label: "Fourth Grading/Final",
    field: "fourth_grading",
    align: "left",
  },
  {
    name: "final_grade",
    label: "Average",
    field: "final_grade",
    align: "left",
  },
  {
    name: "remark",
    label: "Remark",
    field: "remark",
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
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
    };
  },
  methods: {},
  mounted() {},
  components: {},
};
</script>

<style></style>
