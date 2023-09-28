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
        ? ['id', 'code', 'description', 'units', 'has_pre', 'flag', 'action']
        : ['id', 'code', 'description']
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
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="units" :props="props">
          <q-chip color="primary" text-color="white" v-if="props.row.unit_lecture > 0"
            >Lecture:
            <span style="font-weight: bold; margin-left: 2px">{{
              props.row.unit_lecture
            }}</span></q-chip
          >

          <q-chip color="primary" text-color="white" v-if="props.row.unit_lab > 0"
            >Laboratory:
            <span style="font-weight: bold; margin-left: 2px">{{
              props.row.unit_lab
            }}</span></q-chip
          >
          <q-chip color="primary" text-color="white" v-if="props.row.unit_practicum > 0"
            >Practicum:
            <span style="font-weight: bold; margin-left: 2px">{{
              props.row.unit_practicum
            }}</span></q-chip
          >
        </q-td>

        <q-td key="has_pre" :props="props">
          <q-icon name="check_box" color="primary" v-if="props.row.has_pre == 1" />
          <q-icon name="cancel" color="red" v-else />
          {{ props.row.has_pre == 1 ? "Yes" : "No" }}
        </q-td>

        <q-td key="flag" :props="props">
          <q-icon name="check_box" color="primary" v-if="props.row.flag == 1" />
          <q-icon name="cancel" color="red" v-else />
          {{ props.row.flag == 1 ? "Yes" : "No" }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          />

          <q-btn
            color="green"
            icon="add_to_photos"
            size="sm"
            v-if="props.row.has_pre == 1"
            @click="preDialog(props.row.id)"
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

          <!-- <q-btn
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
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Dialog -->
  <q-dialog v-model="showEditDialog">
    <editSubjectDialog
      :sub-id="sub_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Prerequisite Subject Dialog -->
  <q-dialog v-model="showPreDialog">
    <PrerequisiteDialog
      :sub-id="sub_id"
      @hide-prere-dialog="showPreDialog = !showPreDialog"
    />
  </q-dialog>
</template>

<script>
import editSubjectDialog from "src/components/subjects/editSubject.vue";
import PrerequisiteDialog from "src/components/subjects/preReqDialog.vue";

import { api } from "src/boot/axios";
import store from "src/store/subjects/subjectManage/store";
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
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
  },
  {
    name: "units",
    label: "Unit(s)",
    field: "units",
    align: "left",
  },

  {
    name: "has_pre",
    label: "Has Prerequisite",
    field: "has_pre",
    align: "left",
  },
  {
    name: "flag",
    label: "Payable Unit",
    field: "flag",
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
      sub_id: null,
      showEditDialog: false,
      showPreDialog: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    editDialog(sub_id) {
      this.showEditDialog = true;
      this.sub_id = null;
      this.sub_id = sub_id;
    },
    preDialog(sub_id) {
      this.showPreDialog = true;
      this.sub_id = null;
      this.sub_id = sub_id;
    },
  },
  mounted() {},
  components: {
    editSubjectDialog,
    PrerequisiteDialog,
  },
};
</script>

<style></style>
