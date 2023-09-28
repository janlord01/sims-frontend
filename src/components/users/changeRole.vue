<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Role </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center z-max"
        v-if="!passwordSent"
      />
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="getUserRoless"
        :columns="columns"
        row-key="role"
        separator="cell"
        :visible-columns="$q.screen.gt.xs ? ['role', 'action'] : ['role', 'action']"
      >
        <template #body="props">
          <q-tr :props="props">
            <!-- <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td> -->

            <q-td key="role" :props="props">
              {{ props.row.role }}
            </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="red"
                icon="delete"
                size="sm"
                @click="removeRole(props.row.role, $event)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onChangeRole"
      >
        <div class="row q-col-gutter-none">
          <q-select
            filled
            :options="getRoles"
            v-model="formData.role"
            label="Roles"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
            </template>
          </q-select>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Add"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import store from "src/store/courses/course-list/store";
const pagination = {
  sortBy: "role",
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
    name: "role",
    label: "Role",
    field: "role",
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
  emits: ["hideRoleDialog"],
  props: ["userId"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        role: "",
      },
      passwordSent: true,
      getRoles: [],
      getUserRoless: [],
    };
  },
  methods: {
    async removeRole(role) {
      this.$q.loading.show();
      await api
        .patch(
          "/api/user/remove-role",
          {
            user_id: this.userId,
            role: role,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "error",
                timeout: 3000,
                position: "top",
              });
              this.$q.loading.hide();
              this.$emit("hideRoleDialog");
              this.getAllParent();
              this.getAllTeacher();
              this.getAllEmployee();
              this.getAllStudent();

              this.getUserRoless = [];
              this.getUserRoles();
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

              this.getUserRoless = [];
              this.getUserRoles();
            }, 3000);
          }

          this.user_id = null;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onChangeRole() {
      this.$q.loading.show();

      if (this.formData.role.length === 0) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Role",
          icon: "error",
        });
      } else {
        await api
          .patch(
            "/api/user/change-role",
            {
              user_id: this.userId,
              role: this.formData.role.label,
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            // console.log(response);
            if (response.data.status === 200) {
              setTimeout(() => {
                this.$q.notify({
                  type: "positive",
                  message: response.data.message,
                  icon: "error",
                  timeout: 3000,
                  position: "top",
                });
                this.$q.loading.hide();
                this.$emit("hideRoleDialog");
                this.getAllParent();
                this.getAllTeacher();
                this.getAllEmployee();
                this.getAllStudent();

                this.getUserRoless = [];
                this.getUserRoles();
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

                this.getUserRoless = [];
                this.getUserRoles();
              }, 3000);
            }
            this.user_id = null;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async getAllRoles() {
      await api
        .get("/api/employee/roles/all", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response.data.data.roles);
          Object.entries(response.data.data.roles).map(([key, val]) => {
            this.getRoles.push({
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserRoles() {
      await api
        .get("/api/employee/roles/" + this.userId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data.roles).map(([key, val]) => {
            this.getUserRoless.push({
              role: val,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
  },
  mounted() {
    this.getAllRoles();
    this.getUserRoles();
  },
};
</script>
