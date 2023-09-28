<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="[]"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="$q.screen.gt.xs ? ['title', 'action'] : ['title', 'action']"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="title" :props="props"> </q-td>

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
  <!-- <q-dialog v-model="showEditDialog">
    <editOnlineRegistration
      :user-image="user_image"
      :user-id="user_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog> -->
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
    name: "title",
    label: "Title",
    field: "title",
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
      newToken: LocalStorage.getItem("jwt"),
      datas: store,
    };
  },
  methods: {},
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
