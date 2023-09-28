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
        ? ['id', 'title', 'status', 'action']
        : ['id', 'title', 'status', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="title" :props="props">
          {{ props.row.title }}
        </q-td>

        <q-td key="status" :props="props">
          <q-chip v-if="props.row.status == 1" color="green" class="text-white"
            >Active</q-chip
          >
          <q-chip v-else color="red" class="text-white">Inactive</q-chip>
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id, $event)"
          />

          <q-btn
            color="red"
            icon="no_accounts"
            size="sm"
            v-if="props.row.status == 1"
            @click="changeStatusDialog(props.row.id, $event)"
          />
          <q-btn
            color="green"
            icon="check_circle"
            size="sm"
            v-if="props.row.status == 0"
            @click="changeStatusDialogActive(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Semester -->
  <q-dialog v-model="showEditDialog">
    <editRequirement
      :req-id="req_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Deactivate User -->
  <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :req-id="req_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog>

  <!-- Activate User -->
  <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :req-id="req_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog>
</template>

<script>
import deactivateStatusDialog from "src/components/settings/requirement/deactivateRequirement.vue";
import activateStatusDialog from "src/components/settings/requirement/activateRequirement.vue";
import editRequirement from "src/components/settings/requirement/editRequirement.vue";

import { api } from "src/boot/axios";
import store from "src/store/settings/requirement/store";
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
    name: "title",
    label: "Title",
    field: "title",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
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
      req_id: null,
      showStatusDialog: false,
      showStatusDialogActive: false,

      showEditDialog: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    changeStatusDialogActive(req_id, event) {
      this.showStatusDialogActive = true;
      this.req_id = null;
      this.req_id = req_id;
    },
    changeStatusDialog(req_id, event) {
      this.showStatusDialog = true;
      this.req_id = null;
      this.req_id = req_id;
    },
    editDialog(req_id, event) {
      this.req_id = null;
      this.req_id = req_id;
      this.showEditDialog = true;
    },
  },
  mounted() {},
  components: {
    deactivateStatusDialog,
    activateStatusDialog,
    editRequirement,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
