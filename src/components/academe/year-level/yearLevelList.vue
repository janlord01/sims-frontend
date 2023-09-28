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
        ? ['name', 'status', 'action']
        : ['name', 'status', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="status" :props="props">
          <q-chip
            v-if="props.row.status === 'active'"
            color="green"
            class="text-white"
            >{{ props.row.status }}</q-chip
          >

          <q-chip v-else color="red" class="text-white">{{
            props.row.status
          }}</q-chip>
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            v-if="props.row.status === 'active'"
            color="red"
            icon="remove_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
          <q-btn
            v-else
            color="green"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
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

import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";
import store from "src/store/academe/year-level/store";
import { LocalStorage } from "quasar";
const pagination = {
  sortBy: "id",
  rowsPerPage: 10,
  descending: true,
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
    label: "Level",
    field: "name",
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
    ...mapActions("YearLevelStore", ["getAllYearLevel"]),
    changeStatus(id, status) {
      this.$q.loading.show();
      api
        .delete(
          "/api/year-level/" + id + "/destroy",
          {
            params: {
              status: status,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          //   console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "top",
                message: response.data.message,
              });
              this.$q.loading.hide();
              this.getAllYearLevel();
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message: response.data.message,
              });
              this.$q.loading.hide();
              this.getAllYearLevel();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              message: error.response.data.message,
            });
            this.$q.loading.hide();
          }, 3000);
        });
      // console.log(this.user_id);
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
