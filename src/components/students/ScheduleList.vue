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
        ? ['name', 'description', 'teacher', 'schedule']
        : ['name', 'description', 'teacher', 'schedule']
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
            <span style="font-weight: bold; margin-left: 10px">-Room: </span>
            {{ item.room }}
            <br />
            <span style="font-weight: bold; margin-left: 10px">-Building: </span>
            {{ item.building }}
            <q-separator />
            <br />
          </span>
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
