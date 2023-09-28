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
        ? ['id', 'year', 'due', 'status', 'action']
        : ['id', 'year', 'due', 'status', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="year" :props="props">
          {{ props.row.year }}
        </q-td>
        <q-td key="due" :props="props">
          {{ props.row.due }}
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

  <q-dialog v-model="showEditDialog">
    <editAcademic
      :acad-id="acad_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Deactivate User -->
  <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :acad-id="acad_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog>

  <!-- Activate User -->
  <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :acad-id="acad_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog>
</template>

<script>
import deactivateStatusDialog from "src/components/settings/academic/deactivateAcademicYear.vue";
import activateStatusDialog from "src/components/settings/academic/activateAcademicYear.vue";
import editAcademic from "src/components/settings/academic/editAcademic.vue";

import { api } from "src/boot/axios";
import store from "src/store/settings/academic/store";
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
    name: "year",
    label: "Year",
    field: "year",
    align: "left",
    sortable: true,
  },

  {
    name: "due",
    label: "Payment Due",
    field: "due",
    align: "left",
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
      acad_id: null,
      showStatusDialog: false,
      showStatusDialogActive: false,
      showEditDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      year: null,
      due: null,
    };
  },
  methods: {
    changeStatusDialogActive(acad_id, event) {
      this.showStatusDialogActive = true;
      this.acad_id = null;
      this.acad_id = acad_id;
    },
    changeStatusDialog(acad_id, event) {
      this.showStatusDialog = true;
      this.acad_id = null;
      this.acad_id = acad_id;
    },
    async editDialog(acad_id, event) {
      this.acad_id = null;
      this.acad_id = acad_id;
      this.showEditDialog = true;
      // await api
      //   .get("/api/settings/academic-year/" + acad_id + "/edit", {
      //     headers: {
      //       Authorization: "Bearer " + this.newToken,
      //     },
      //   })
      //   .then((response) => {
      //     // console.log(response);
      //     this.year = response.data.academic.year ? response.data.academic.year : "";
      //     this.due = response.data.academic.payment_due
      //       ? response.data.academic.payment_due
      //       : "";
      //     console.log(this.year);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
  },
  mounted() {},
  components: {
    deactivateStatusDialog,
    activateStatusDialog,
    editAcademic,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
