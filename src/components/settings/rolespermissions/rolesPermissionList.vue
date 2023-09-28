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
        ? ['id', 'name', 'permission', 'action']
        : ['id', 'name', 'permission', 'action']
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

        <q-td key="permission" :props="props">
          <span v-for="item in props.row.permissions">
            <!-- <span v-for="i in item"> -->
            <q-chip color="blue" class="text-white float-left" size="sm">{{
              item.name
            }}</q-chip>
            <!-- </span> -->
          </span>
        </q-td>

        <q-td key="action" :props="props">
          <span>
            <q-btn
              disable
              color="grey"
              icon="add"
              size="sm"
              v-if="props.row.name == 'super-admin'"
            />
            <q-btn
              color="green"
              icon="add"
              size="sm"
              v-else
              @click="AddPermissionFunc(props.row.name)"
            />
          </span>
          <span>
            <q-btn
              disable
              color="grey"
              icon="edit"
              size="sm"
              v-if="props.row.name == 'super-admin'"
            />
            <q-btn
              color="blue"
              icon="edit"
              size="sm"
              v-else
              @click="editDialog(props.row.id, $event)"
            />
          </span>
          <span>
            <q-btn
              color="grey"
              icon="delete"
              disable
              size="sm"
              v-if="
                props.row.name == 'super-admin' ||
                props.row.name == 'student' ||
                props.row.name == 'parent' ||
                props.row.name == 'teacher' ||
                props.row.name == 'registrar' ||
                props.row.name == 'cashier' ||
                props.row.name == 'staff' ||
                props.row.name == 'scanner' ||
                props.row.name == 'dean' ||
                props.row.name == 'program head'
              "
            />
            <q-btn
              @click="removeFunc(props.row.name)"
              color="red"
              icon="delete"
              size="sm"
              v-else
            />
          </span>
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

  <!-- Add Permission -->
  <q-dialog v-model="showAddDialog">
    <AddPermission
      :role="role"
      @hide-add-dialog="showAddDialog = !showAddDialog"
    />
  </q-dialog>
</template>

<script>
import deactivateStatusDialog from "src/components/settings/requirement/deactivateRequirement.vue";
import activateStatusDialog from "src/components/settings/requirement/activateRequirement.vue";
import editRequirement from "src/components/settings/requirement/editRequirement.vue";

import { api } from "src/boot/axios";
import store from "src/store/settings/rolespermissions/store.js";
import { LocalStorage } from "quasar";
import { mapActions } from "vuex";
import AddPermission from "./addPermission.vue";
const pagination = {
  sortBy: "id",
  rowsPerPage: 20,
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
    label: "Role",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "permission",
    label: "Permission",
    field: "permission",
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
      permission_id: null,
      role: null,
      showEditDialog: false,
      showAddDialog: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    ...mapActions("RolesPermissionsStore", ["getAllRolesWithPermissions"]),

    removeFunc(roleName) {
      this.$q
        .dialog({
          title: "Confirm",
          message:
            "Are you sure you want to remove this role? Note: All the data assigned to this will be removed, too.",
          ok: {
            push: true,
            label: "remove",
            color: "red-8",
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
            .delete(
              "/api/settings/roles-permissions/remove-role",
              {
                params: {
                  role: roleName,
                  //   permission: permissionName,
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              }
            )
            .then((response) => {
              //   console.log(response.data.data.permissions);

              if (response.data.status === 200) {
                setTimeout(() => {
                  //   Object.entries(errors).forEach((msg) => {
                  this.$q.notify({
                    type: "positive",
                    color: "green",
                    message: response.data.message,
                    icon: "save",
                    timeout: 3000,
                    position: "top",
                  });
                  //   });
                  this.$q.loading.hide();

                  //   this.$emit("hideAddDialog");

                  this.getAllRolesWithPermissions();
                  //   this.getPermissions();
                  //   this.formData.role = "";
                }, 1000);
              } else {
                setTimeout(() => {
                  //   Object.entries(response.data.message).forEach((msg) => {
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
              //   console.log(this.ownPermission);
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
              }, 1000);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    AddPermissionFunc(role) {
      this.showAddDialog = true;
      this.role = role;
    },
    // ...mapActions("RolesPermissionsStore", ["getAllRolesWithPers"]),
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
  mounted() {
    // this.getAllRolesWithPers();
  },
  components: {
    deactivateStatusDialog,
    activateStatusDialog,
    editRequirement,
    AddPermission,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
