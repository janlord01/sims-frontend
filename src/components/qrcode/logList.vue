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
        ? [
            'name',
            'time_in_location',
            'time_in',
            'time_out_location',
            'time_out',
          ]
        : [
            'name',
            'time_in_location',
            'time_in',
            'time_out_location',
            'time_out',
          ]
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          <q-btn round>
            <q-avatar size="42px">
              <q-img :src="props.row.profile_image" width="50px" />
            </q-avatar>
          </q-btn>

          {{ props.row.name }}
        </q-td>
        <q-td key="time_in_location" :props="props">
          {{ props.row.time_in_location }}
        </q-td>

        <q-td key="time_in" :props="props">
          {{ date.formatDate(props.row.time_in, "MMMM D, YYYY hh:mm:ss") }}
        </q-td>

        <q-td key="time_out_location" :props="props">
          {{ props.row.time_out_location }}
        </q-td>

        <q-td key="time_out" :props="props">
          <!-- {{ props.row.time_out }} -->
          {{ date.formatDate(props.row.time_out, "MMMM D, YYYY hh:mm:ss") }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import changeImageDialogChild from "src/components/users/changeProfileImage.vue";
import changePasswordDialog from "src/components/users/changePasswordDialog.vue";
import deactivateStatusDialog from "src/components/users/deactivateUser.vue";
import activateStatusDialog from "src/components/users/activateUser.vue";
import changeRoleDialogFile from "src/components/users/changeRole.vue";
import assignRfid from "src/components/users/assignRfid.vue";

import { api } from "src/boot/axios";
import store from "src/store/rfid/store";
import { LocalStorage, date } from "quasar";
import { mapActions, mapState } from "vuex";
const pagination = {
  sortBy: "updated_at",
  rowsPerPage: 50,
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
    name: "time_in_location",
    label: "Time-in Location",
    field: "time_in_location",
    align: "left",
  },
  {
    name: "time_in",
    label: "Time In",
    field: "time_in",
    align: "left",
  },
  {
    name: "time_out_location",
    label: "Time-out Location",
    field: "time_out_location",
    align: "left",
  },
  {
    name: "time_out",
    label: "Time Out",
    field: "time_out",
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
