<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowOnlineStudentDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? [
            'id',
            'name',
            'email',
            'number',
            'role',
            'year',
            'transferee',
            'course',
            'action',
          ]
        : ['id', 'name']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          <!-- <q-btn round>
            <q-avatar size="42px">
              <q-img :src="props.row.profile_image" width="50px" />
            </q-avatar>
          </q-btn> -->

          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>

        <q-td key="number" :props="props">
          {{ props.row.number }}
        </q-td>
        <q-td key="role" :props="props">
          {{ props.row.role }}
        </q-td>
        <q-td key="year" :props="props">
          {{ props.row.year }}
        </q-td>
        <q-td key="course" :props="props">
          {{ props.row.course }}
        </q-td>
        <q-td key="transferee" :props="props">
          {{ props.row.transferee }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="visibility"
            size="sm"
            @click="EditDialog(props.row.id)"
          />

          <q-btn
            color="green"
            icon="check_circle"
            size="sm"
            @click="approvedUser(props.row.id)"
          />
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            @click="deleteRegistration(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Change Edit  Dialog -->
  <q-dialog v-model="showEditDialog">
    <editOnlineRegistration
      :user-image="user_image"
      :user-id="user_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script>
import editOnlineRegistration from "src/components/users/student/editOnlineStudent.vue";
import changePasswordDialog from "src/components/users/changePasswordDialog.vue";
import deactivateStatusDialog from "src/components/users/deactivateUser.vue";
import activateStatusDialog from "src/components/users/activateUser.vue";
import changeRoleDialogFile from "src/components/users/changeRole.vue";

import { api } from "src/boot/axios";
import store from "src/store/users/student/store";
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
    name: "year",
    label: "Grade/Year Level",
    field: "year",
    align: "left",
  },
  {
    name: "course",
    label: "Preferred Course",
    field: "course",
    align: "left",
  },
  {
    name: "transferee",
    label: "Transferee",
    field: "transferee",
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
      showEditDialog: false,
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
    ...mapActions("StudentStore", ["onSearch", "getAllOnlineRegStudent"]),
    deleteRegistration(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this student registration?",
          ok: {
            label: "yes, delete",
            push: true,
            color: "negative",
          },
          cancel: {
            push: true,
            color: "grey",
          },
          persistent: true,
        })
        .onOk(() => {
          // console.log('>>>> OK')
          this.$q.loading.show();

          api
            .delete("/api/student/online-registration/delete/" + id, {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            })
            .then((response) => {
              //   console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  this.leave = true;
                  this.$q.notify({
                    type: "positive",
                    message: response.data.message,
                    icon: "save",
                    timeout: 5000,
                    position: "top",
                  });
                  this.getAllOnlineRegStudent();
                  this.$q.loading.hide();
                  //   this.$emit("hideEditDialog");
                }, 1000);
              } else {
                setTimeout(() => {
                  this.$q.notify({
                    type: "negative",
                    message: response.data.message,
                    icon: "error",
                    timeout: 3000,
                    position: "top",
                  });
                  this.$q.loading.hide();
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
                  position: "top",

                  message: error.response.data.message,
                });
              }, 3000);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    approvedUser(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Did you check all the details before approving this user?",
          ok: {
            label: "yes, approve",
            push: true,
            color: "positive",
          },
          cancel: {
            push: true,
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          // console.log('>>>> OK')
          this.$q.loading.show();

          api
            .post("/api/student/online-registration/approve/" + id, {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  this.leave = true;
                  this.$q.notify({
                    type: "positive",
                    message: response.data.message,
                    icon: "save",
                    timeout: 5000,
                    position: "top",
                  });
                  this.getAllOnlineRegStudent();
                  this.$q.loading.hide();
                  //   this.$emit("hideEditDialog");
                }, 1000);
              } else {
                setTimeout(() => {
                  this.$q.notify({
                    type: "negative",
                    message: response.data.message,
                    icon: "error",
                    timeout: 3000,
                    position: "top",
                  });
                  this.$q.loading.hide();
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
                  position: "top",

                  message: error.response.data.message,
                });
              }, 3000);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    EditDialog(user_id) {
      this.user_id = null;
      this.showEditDialog = true;
      this.user_id = user_id;
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
    editOnlineRegistration,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
