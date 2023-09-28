<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Roles & Permissions</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Create Role' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <rolespermissionList />

      <q-dialog v-model="showCreateDialog">
        <createRole
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import rolespermissionList from "src/components/settings/rolespermissions/rolesPermissionList.vue";
import createRole from "src/components/settings/rolespermissions/createRole.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      showCreateDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    //   ...mapActions("RequirementStore", ["getAllRequirement"]),
    ...mapActions("RolesPermissionsStore", ["getAllRolesWithPermissions"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllRolesWithPermissions();
  },
  components: {
    rolespermissionList,
    createRole,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
