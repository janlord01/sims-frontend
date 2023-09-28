<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDataLogs"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['checkin_location', 'checkin', 'checkout_location', 'checkout']
        : ['checkin_location', 'checkin', 'checkout_location', 'checkout']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="checkin_location" :props="props">
          {{ props.row.time_in_location }}
        </q-td>
        <q-td key="checkin" :props="props">
          {{ date.formatDate(props.row.time_in, "MMMM D, YYYY hh:mm:ss") }}
        </q-td>
        <q-td key="checkout_location" :props="props">
          {{ props.row.time_out_location }}
        </q-td>
        <q-td key="checkout" :props="props">
          {{ date.formatDate(props.row.time_out, "MMMM D, YYYY hh:mm:ss") }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/students/store";
import { LocalStorage, date } from "quasar";
import { mapActions, mapState } from "vuex";
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
    name: "checkin_location",
    label: "Time In Location",
    field: "checkin_location",
    align: "left",
    sortable: true,
  },

  {
    name: "checkin",
    label: "Time-in",
    field: "checkin",
    align: "left",
    sortable: true,
  },
  {
    name: "checkout_location",
    label: "Time Out Location",
    field: "checkout_location",
    align: "left",
    sortable: true,
  },

  {
    name: "checkout",
    label: "Time-Out",
    field: "checkout",
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
  props: ["searchData"],
  setup() {
    return {
      pagination,
      columns,
      date,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      user_id: null,
      newToken: LocalStorage.getItem("jwt"),
      datas: store,
    };
  },
  methods: {},
  computed: {
    getAllUsers() {
      return store.state.rowDatas;
    },
  },
  beforeMount() {
    // this.getAllUsers();
  },
  mounted() {},
  watch: {
    getAllUsers(newVal, oldVal) {
      console.log("New :" + newVal + "/ Old " + oldVal);
    },
  },
  components: {},
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
