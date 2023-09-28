<template>
  <q-card style="max-width: 700px; width: 700px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add/Remove Permission </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="assigned" label="Assigned Permissions" />
          <q-tab name="unassign" label="Unassign Permissions" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="assigned">
            <div class="text-h6 q-mb-md">Assigned Permissions</div>
            <q-form
              class="column q-pa-md shawdow full-width block"
              ref="formName"
              @submit="onSubmit"
            >
              <div class="row q-col-gutter-none">
                <!-- <q-chip size="sm"
            > -->
                <span v-for="item in ownPermission">
                  <q-checkbox
                    filled
                    size="sm"
                    disable
                    color="grey"
                    :label="item.label"
                    v-model="formData.ownPermission"
                  >
                  </q-checkbox>
                  <q-btn
                    @click="removeFunc(item.label)"
                    flat
                    round
                    size="sm"
                    color="red"
                    icon="delete"
                  />
                </span>
                <!-- </q-chip> -->
              </div>
              <!-- <div class="row q-mt-lg align-center">
                  <q-btn
                    unelevated
                    label="Create"
                    class="text-center"
                    color="secondary"
                    size="md"
                    type="submit"
                  />
                </div> -->
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="unassign">
            <div class="text-h6">
              Available Permissions
              <span class="text-body"
                ><q-checkbox
                  style="font-size: 14px"
                  filled
                  size="sm"
                  label="Select All"
                  v-model="select"
                  @update:model-value="selectAllFunc"
                >
                </q-checkbox
              ></span>
            </div>
            <q-form
              class="column q-pa-md shawdow full-width block"
              ref="formName"
              @submit="onSubmit"
            >
              <div class="row q-col-gutter-none">
                <!-- <q-chip size="sm"
            > -->
                <span v-for="item in permissions">
                  <q-checkbox
                    filled
                    size="sm"
                    color="blue"
                    :val="item.label"
                    :label="item.label"
                    v-model="selection"
                  >
                  </q-checkbox>
                  <!-- <q-btn flat round size="sm" color="red" icon="delete" /> -->
                </span>
                <!-- </q-chip> -->
              </div>
              <div class="row q-mt-lg align-center">
                <q-btn
                  unelevated
                  label="Add Permissions"
                  class="text-center"
                  color="secondary"
                  size="md"
                  type="submit"
                />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
export default {
  emits: ["hideAddDialog"],
  props: ["role"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        ownPermission: [],
        permissions: [],
      },
      loadingSpinner: true,
      select: false,
      ownPermission: [],
      permissions: [],
      selection: [],
      tab: "assigned",
      selectAll: [],
    };
  },
  methods: {
    selectAllFunc() {
      //   console.log("select all");
      if (this.select === false) {
        this.selection = [];
      } else {
        Object.entries(this.selectAll).map(([key, val]) => {
          // this.selection.push({
          //   label: val.label,
          //   value: val.label,
          // });
          this.selection[key] = val;
        });
      }

      //   console.log(this.selection);
    },
    removeFunc(permissionName) {
      //   console.log(permissionName);
      this.$q
        .dialog({
          title: "Confirm",
          message:
            "Are you sure you want to remove this permission from this role?",
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
              "/api/settings/roles-permissions/remove-permission",
              {
                params: {
                  role: this.role,
                  permission: permissionName,
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
                  this.getPermissions();
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
    async getPermissions() {
      this.ownPermission = [];
      await api
        .get(
          "/api/settings/roles-permissions/get-permission",
          {
            params: {
              role: this.role,
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

          Object.entries(response.data.data.permissions).map(([key, val]) => {
            this.ownPermission.push({
              label: val.name,
              value: val.name,
            });
          });
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
            this.$emit("hideAddDialog");
          }, 500);
        });
    },
    async getUnassignPermissions() {
      await api
        .get(
          "/api/settings/roles-permissions/get-unassign-permission",
          {
            params: {
              role: this.role,
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

          Object.entries(response.data.data).map(([key, val]) => {
            this.permissions.push({
              label: val.name,
              value: val.name,
            });
            this.selectAll[key] = val.name;
          });
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
    },
    async onSubmit() {
      this.$q.loading.show();
      await api
        .patch(
          "/api/settings/roles-permissions/assign-permission",
          {
            role: this.role,
            permissions: this.selection,
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

              this.$emit("hideAddDialog");

              this.getAllRolesWithPermissions();
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
    },

    ...mapActions("RolesPermissionsStore", ["getAllRolesWithPermissions"]),
  },
  mounted() {
    this.getPermissions();
    this.getUnassignPermissions();
  },
};
</script>
