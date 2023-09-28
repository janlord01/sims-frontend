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
        ? ['id', 'name', 'email', 'role', 'action']
        : ['id', 'name']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          <q-btn round>
            <q-avatar size="42px">
              <q-img :src="props.row.profile_image" width="50px" />
            </q-avatar>
          </q-btn>

          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>

        <q-td key="role" :props="props">
          <q-chip
            color="primary"
            text-color="white"
            v-for="role in props.row.role"
            >{{ role }}</q-chip
          >
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            label="edit"
            color="primary"
            icon="edit"
            size="sm"
            :to="'/user/employee/' + props.row.id + '/edit'"
          />

          <q-btn
            label="id photo"
            color="info"
            icon="camera_alt"
            size="sm"
            @click="changeImageDialog(props.row.id, $event)"
          />
          <q-btn
            label="change password"
            color="indigo"
            icon="password"
            size="sm"
            @click="changePasswordDialog(props.row.id, $event)"
          />

          <q-btn
            label="change role"
            color="blue-grey"
            icon="lock_person"
            size="sm"
            @click="changeRoleDialog(props.row.id, $event)"
          />

          <q-btn
            label="deactivate user"
            color="red"
            icon="no_accounts"
            size="sm"
            v-if="props.row.status == 1"
            @click="changeStatusDialog(props.row.id, $event)"
          />
          <q-btn
            label="activate user"
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

  <!-- Change Profile Image Dialog -->
  <q-dialog v-model="showChangeImageDialog">
    <changeImageDialogChild
      :user-image="user_image"
      :user-id="user_id"
      @hide-image="showChangeImageDialog = !showChangeImageDialog"
    />
  </q-dialog>

  <!-- Change Password Dialog -->
  <q-dialog v-model="showChangePasswordeDialog">
    <changePasswordDialog
      :user-id="user_id"
      @hide-password-dialog="
        showChangePasswordeDialog = !showChangePasswordeDialog
      "
    />
  </q-dialog>

  <!-- Deactivate User -->
  <q-dialog v-model="showStatusDialog">
    <deactivateStatusDialog
      :user-id="user_id"
      @hide-status-dialog="showStatusDialog = !showStatusDialog"
    />
  </q-dialog>

  <!-- Activate User -->
  <q-dialog v-model="showStatusDialogActive">
    <activateStatusDialog
      :user-id="user_id"
      @hide-status-dialog="showStatusDialogActive = !showStatusDialogActive"
    />
  </q-dialog>
  <q-dialog v-model="showRoleDialog">
    <changeRoleDialogFile
      :user-id="user_id"
      @hide-role-dialog="showRoleDialog = !showRoleDialog"
    />
  </q-dialog>
</template>

<script>
import changeImageDialogChild from "src/components/users/changeProfileImage.vue";
import changePasswordDialog from "src/components/users/changePasswordDialog.vue";
import deactivateStatusDialog from "src/components/users/deactivateUser.vue";
import activateStatusDialog from "src/components/users/activateUser.vue";
import changeRoleDialogFile from "src/components/users/changeRole.vue";

import { api } from "src/boot/axios";
import store from "src/store/users/employee/store";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";

// const ro = store.state.rowDatas.roles.split(/\s*,\s*/).forEach(function (myString) {
//   console.log(myString);
// });
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Cellphone #",
    field: "number",
    align: "left",
  },
  {
    name: "role",
    label: "Role",
    field: "role",
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
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      user_id: null,
      showChangeImageDialog: false,
      showChangePasswordeDialog: false,
      showStatusDialog: false,
      showImportDialog: false,
      showStatusDialogActive: false,
      showRoleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      datas: store,
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
          // console.log(response.data);
          this.user_image = response.data.data.image_path;
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(this.user_id);
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
    changeRoleDialog(user_id, event) {
      this.showRoleDialog = true;
      this.user_id = null;
      this.user_id = user_id;
    },
    ImportDialog(e) {
      this.showImportDialog = true;
    },
    // ...mapActions("Employeestore", ["getAllEmployee"]),
    // getAllUsers() {
    //   return store.state.rowDatas;
    //   console.log(store.state.rowDatas);
    // },
  },
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
  components: {
    changeImageDialogChild,
    changePasswordDialog,
    deactivateStatusDialog,
    activateStatusDialog,
    changeRoleDialogFile,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
