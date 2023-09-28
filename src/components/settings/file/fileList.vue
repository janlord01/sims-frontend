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
        ? ['id', 'title', 'description', 'type', 'action']
        : ['id', 'title', 'description', 'type', 'action']
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
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="type" :props="props">
          <q-chip color="green" class="text-white">{{ props.row.type }}</q-chip>
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="visibility"
            size="sm"
            @click="downloadFile(props.row.id, $event)"
          >
            <span style="margin-left: 2px">View</span>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Download Dialog -->
  <q-dialog v-model="showDowloadDialog">
    <downloadAnyFile
      :file-id="file_id"
      :file="file"
      @hide-download-dialog="showDowloadDialog = !showDowloadDialog"
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
import downloadAnyFile from "src/components/settings/file/downloadAnyFile.vue";

import { api } from "src/boot/axios";
import store from "src/store/settings/file/store";
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
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
  },
  {
    name: "type",
    label: "Type",
    field: "type",
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
      file_id: null,
      file: null,

      showDowloadDialog: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    async downloadFile(file_id, event) {
      // console.log(file_id);
      this.file_id = null;
      this.file_id = file_id;
      this.showDowloadDialog = true;
      await api
        .get("/api/settings/file/download/" + file_id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.file = response.data.data.path ? response.data.data.path : null;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {},
  components: {
    deactivateStatusDialog,
    activateStatusDialog,
    downloadAnyFile,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
