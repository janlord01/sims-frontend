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
        ? ['id', 'code', 'name', 'description', 'college', 'action']
        : ['id', 'code']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="code" :props="props">
          {{ props.row.code }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="college" :props="props">
          {{ props.row.college }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          />

          <!-- <q-btn
            color="info"
            icon="camera_alt"
            size="sm"
            @click="changeImageDialog(props.row.id, $event)"
          /> -->
          <!-- <q-btn
            color="indigo"
            icon="key"
            size="sm"
            @click="changePasswordDialog(props.row.id, $event)"
          /> -->

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

  <!-- Edit Dialog -->
  <q-dialog v-model="showEditDialog">
    <editCourseDialog
      :cou-id="cou_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Deactivate Course -->
  <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :cou-id="cou_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog>

  <!-- Activate Course -->
  <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :cou-id="cou_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog>
</template>

<script>
import changeImageDialogChild from "src/components/users/changeProfileImage.vue";
import editCourseDialog from "src/components/courses/editCourse.vue";
import deactivateStatusDialog from "src/components/courses/deactivateCourse.vue";
import activateStatusDialog from "src/components/courses/activateCourse.vue";

import { api } from "src/boot/axios";
import store from "src/store/courses/course-list/store";
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
    name: "code",
    label: "Code",
    field: "code",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "Name",
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
    name: "college",
    label: "College",
    field: "college",
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
      cou_id: null,
      showEditDialog: false,
      showStatusDialog: false,
      showImportDialog: false,
      showStatusDialogActive: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    editDialog(cou_id) {
      this.showEditDialog = true;
      this.cou_id = null;
      this.cou_id = cou_id;
    },

    changeStatusDialogActive(cou_id, event) {
      this.showStatusDialogActive = true;
      this.cou_id = null;
      this.cou_id = cou_id;
    },
    changeStatusDialog(cou_id, event) {
      this.showStatusDialog = true;
      this.cou_id = null;
      this.cou_id = cou_id;
    },
    ImportDialog(e) {
      this.showImportDialog = true;
    },
  },
  mounted() {},
  components: {
    editCourseDialog,
    deactivateStatusDialog,
    activateStatusDialog,
  },
};
</script>

<style></style>
