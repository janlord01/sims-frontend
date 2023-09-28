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
        ? ['id', 'college', 'description', 'dean', 'action']
        : ['id', 'college']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="college" :props="props">
          {{ props.row.college }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="dean" :props="props">
          {{ props.row.dean }}
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
          />
          <q-btn
            color="indigo"
            icon="key"
            size="sm"
            @click="changePasswordDialog(props.row.id, $event)"
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
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Change Profile Image Dialog -->
  <q-dialog v-model="showChangeImageDialog">
    <changeImageDialogChild
      :user-image="user_image"
      :user-id="user_id"
      @hide-image="showChangeImageDialog = !showChangeImageDialog"
    />
  </q-dialog>

  <!-- Change Password Dialog -->
  <!-- <q-dialog v-model="showChangePasswordeDialog">
    <changePasswordDialog
      :user-id="user_id"
      @hide-password-dialog="showChangePasswordeDialog = !showChangePasswordeDialog"
    />
  </q-dialog> -->

  <q-dialog v-model="showEditDialog">
    <editCollegeDialog
      :col-id="col_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Deactivate User -->
  <!-- <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :user-id="user_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog> -->

  <!-- Activate User -->
  <!-- <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :user-id="user_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog> -->
</template>

<script>
import changeImageDialogChild from "src/components/users/changeProfileImage.vue";
import changePasswordDialog from "src/components/users/changePasswordDialog.vue";
import deactivateStatusDialog from "src/components/users/deactivateUser.vue";
import activateStatusDialog from "src/components/users/activateUser.vue";
import editCollegeDialog from "src/components/academe/colleges/editCollege.vue";

import { api } from "src/boot/axios";
import store from "src/store/academe/colleges/store";
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
    name: "college",
    label: "College Name",
    field: "college",
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
    name: "dean",
    label: "Dean",
    field: "dean",
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
      col_id: null,
      showChangeImageDialog: false,
      showChangePasswordeDialog: false,
      showStatusDialog: false,
      showImportDialog: false,
      showEditDialog: false,
      showStatusDialogActive: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    changeImageDialog(user_id, event) {
      this.onProgressBar = 0;
      this.user_id = null;
      this.showChangeImageDialog = true;
      this.user_id = user_id;
      this.user_image = null;

      api
        .get("/api/user/profile-image/" + user_id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.user_image = response.data.data.image_path;
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(this.user_id);
    },
    editDialog(col_id) {
      this.showEditDialog = true;
      this.col_id = null;
      this.col_id = col_id;
    },
    changePasswordDialog(user_id, event) {
      this.showChangePasswordeDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialogActive(user_id, event) {
      this.showStatusDialogActive = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialog(user_id, event) {
      this.showStatusDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    changeStatusDialogActive(user_id, event) {
      this.showStatusDialogActive = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    ImportDialog(e) {
      this.showImportDialog = true;
    },
  },
  mounted() {},
  components: {
    changeImageDialogChild,
    changePasswordDialog,
    deactivateStatusDialog,
    activateStatusDialog,
    editCollegeDialog,
  },
};
</script>

<style></style>
