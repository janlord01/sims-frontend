<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowRegustrarStudentDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'course', 'year', 'action']
        : ['name', 'course', 'year', 'action']
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
        <q-td key="course" :props="props">
          {{ props.row.course }}
        </q-td>

        <q-td key="year" :props="props">
          {{ props.row.year }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn color="purple" icon="print" size="sm" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div>
    <q-btn
      icon="print"
      color="grey"
      size="sm"
      style="height: 50px; margin-top: 10px; margin-bottom: 10px; margin-left: 10px"
      :label="$q.screen.gt.xs ? 'Print All' : ''"
    />
  </div>
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
import store from "src/store/reports/collected/store";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
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
    name: "course",
    label: "Course",
    field: "course",
    align: "left",
    sortable: true,
  },
  {
    name: "year",
    label: "Year/Grade Level",
    field: "year",
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
    ...mapActions("ReportCollectedStore", ["getAllRegistrarStudent"]),
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
  mounted() {
    this.getAllRegistrarStudent();
  },
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
