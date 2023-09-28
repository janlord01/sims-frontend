<template>
  <q-card style="max-width: 1000px; width: 1000px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> View Students </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Subject Schedule ({{ codeId }})</q-toolbar-title
        >
      </q-toolbar>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="studentList"
        :columns="columns"
        row-key="id"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs
            ? [
                'id',
                'name',
                'prelim',
                'midterm',
                'semifinal',
                'final',
                'average',
                'remarks',
                'action',
              ]
            : [
                'id',
                'name',
                'prelim',
                'midterm',
                'semifinal',
                'final',
                'average',
                'remarks',
                'action',
              ]
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
            <q-td key="prelim" :props="props">
              {{ props.row.prelim }}
              <q-popup-edit
                v-model="props.row.prelim"
                title="Update Prelim Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>

            <q-td key="midterm" :props="props">
              {{ props.row.midterm }}
              <q-popup-edit
                v-model="props.row.midterm"
                title="Update Midterm Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="semifinal" :props="props">
              {{ props.row.semifinal }}
              <q-popup-edit
                v-model="props.row.semifinal"
                title="Update Semi Final Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="final" :props="props">
              {{ props.row.final }}
              <q-popup-edit
                v-model="props.row.final"
                title="Update Final Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="average" :props="props">
              {{ props.row.average }}
              <q-popup-edit
                v-model="props.row.average"
                title="Update Semi Final Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="remarks" :props="props">
              {{ props.row.remarks }}
              <q-popup-edit
                v-model="props.row.remarks"
                title="Update Semi Final Grade"
                buttons
                v-slot="scope"
                label-set="Update"
                label-cancel="Close"
              >
                <q-input type="text" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="primary"
                icon="save"
                size="sm"
                @click="
                  updateFunc(
                    props.row.id,
                    props.row.prelim,
                    props.row.midterm,
                    props.row.semifinal,
                    props.row.final,
                    props.row.average,
                    props.row.remarks
                  )
                "
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/teachers/store";
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
    name: "prelim",
    label: "Prelim",
    field: "prelim",
    align: "left",
    sortable: true,
  },
  {
    name: "midterm",
    label: "Midterm",
    field: "midterm",
    align: "left",
    sortable: true,
  },
  {
    name: "semifinal",
    label: "Semi Final",
    field: "semifinal",
    align: "left",
    sortable: true,
  },
  {
    name: "final",
    label: "Final",
    field: "final",
    align: "left",
    sortable: true,
  },
  {
    name: "average",
    label: "Average",
    field: "average",
    align: "left",
    sortable: true,
  },
  {
    name: "remarks",
    label: "Remarks",
    field: "remarks",
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
  props: ["codeId", "subSchedId"],
  emits: ["hideViewDialog"],
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
      studentList: [],
    };
  },
  methods: {
    // ...mapActions("TeacherUserStore", ["getAllStudent"]),
    updateFunc(id, prelim, midterm, semifinal, final, average, remarks) {
      // console.log();
      this.$q.loading.show();
      api
        .patch(
          "/api/teachers/subject/student/grade/update/" + id,
          {
            prelim: prelim,
            midterm: midterm,
            semifinal: semifinal,
            final: final,
            average: average,
            remarks: remarks,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                position: "top",
                type: "positive",
                timeout: 3000,
                message: response.data.message,
              });
              this.$q.loading.hide();
              this.$emit("hideViewDialog");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                position: "top",
                type: "negative",
                timeout: 3000,
                message: response.data.message,
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllStudent({ commit }, payload) {
      await api
        .get("/api/teachers/subject/all/student/" + this.subSchedId, {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          console.log(response);
          this.studentList = [];
          // commit("getAllStudent", response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.studentList.push({
              id: val.id,
              name: val.lastname + ", " + val.firstname + " " + val.middlename,
              prelim: val.prelim,
              midterm: val.midterm,
              semifinal: val.semi_final,
              final: val.final,
              average: val.average_grade,
              remarks: val.remarks,
              profile_image: val.profile_image,
            });
          });

          // console.log(this.rowDatas);
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.notify({
              type: "negative",
              message: error.response.data.message,
              position: "top",
            });
          }, 3000);
        });
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
  mounted() {
    this.getAllStudent(this.subSchedId);
  },
  watch: {
    getAllUsers(newVal, oldVal) {
      console.log("New :" + newVal + "/ Old " + oldVal);
    },
  },
  components: {},
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
