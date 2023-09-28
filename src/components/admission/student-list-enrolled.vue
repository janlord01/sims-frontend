<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.enrolled"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="$q.screen.gt.xs ? ['name', 'action'] : ['id', 'name']"
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
        <!-- <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>

        <q-td key="number" :props="props">
          {{ props.row.number }}
        </q-td> -->

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            :to="
              '/admission/semester-' +
              $route.params.id +
              '/student-' +
              props.row.id +
              '/' +
              props.row.admission_id +
              '/edit'
            "
          />
          <q-btn
            color="purple"
            icon="print"
            size="sm"
            @click="showPrintFunc(props.row.admission_id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-dialog v-model="showPrintDialog" class="z-max">
    <printOption
      :admission-id="admission_id"
      @hide-print-dialog="showPrintDialog = !showPrintDialog"
    />
  </q-dialog>
</template>

<script>
import printOption from "src/components/admission/printOption.vue";

import { api } from "src/boot/axios";
import store from "src/store/admission/store";
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
      showPrintDialog: false,
      admission_id: null,
    };
  },
  methods: {
    showPrintFunc(id) {
      this.showPrintDialog = true;
      this.admission_id = id;
    },
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
    printOption,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
