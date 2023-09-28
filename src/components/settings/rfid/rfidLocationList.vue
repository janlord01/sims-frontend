<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDataLocation"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['location', 'assign', 'action']
        : ['location', 'assign', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="location" :props="props">
          {{ props.row.location }}
        </q-td>
        <q-td key="assign" :props="props">
          {{ props.row.assign }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="showEditFunc(props.row.id)"
          >
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Download Dialog -->
  <q-dialog v-model="showEditDialog">
    <editLocation
      :location-id="location_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Deactivate User -->
  <!-- <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :sem-id="sem_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog> -->

  <!-- Activate User -->
  <!-- <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :sem-id="sem_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog> -->
</template>

<script>
import deactivateStatusDialog from "src/components/settings/semester/deactivateSemester.vue";
import activateStatusDialog from "src/components/settings/semester/activateSemester.vue";
import editLocation from "src/components/settings/rfid/editRfidLocation.vue";

import { api } from "src/boot/axios";
import store from "src/store/rfid/store";
import { LocalStorage } from "quasar";
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
    name: "location",
    label: "Location",
    field: "location",
    align: "left",
    sortable: true,
  },
  {
    name: "assign",
    label: "Assigned Scanner",
    field: "assign",
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
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      location_id: null,
      file: null,
      showEditDialog: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    async showEditFunc(id) {
      this.location_id = id;
      this.showEditDialog = true;
    },
  },
  mounted() {},
  components: {
    deactivateStatusDialog,
    activateStatusDialog,
    editLocation,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
