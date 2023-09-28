<template>
  <q-card style="max-width: 700px; width: 700px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Group Billing </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <!-- <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center z-max"
        v-if="!passwordSent"
      /> -->
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="allBillingGroup"
        :columns="columns"
        row-key="role"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs
            ? ['group_name', 'course', 'year_lvl', 'action']
            : ['group_name', 'course', 'year_lvl', 'action']
        "
      >
        <template #body="props">
          <q-tr :props="props">
            <!-- <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td> -->

            <q-td key="group_name" :props="props">
              {{ props.row.group_name }}
            </q-td>
            <q-td key="course" :props="props">
              {{ props.row.course }}
            </q-td>
            <q-td key="year_lvl" :props="props">
              {{ props.row.year_level }}
            </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="blue"
                icon="edit"
                size="sm"
                @click="editDialogFunc(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.groupName"
            label="Create Group Name"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="drive_file_rename_outline" />
            </template>
          </q-input>
          <q-select
            filled
            v-model="formData.course"
            :options="coursesOption"
            use-chips
            class="q-mr-sm col-3 q-mb-sm full-width"
            label="Select Course(Only One)"
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
          </q-select>
          <q-select
            filled
            v-model="formData.multiplBillings"
            :options="getAllbillings"
            use-chips
            multiple
            class="q-mr-sm col-3 q-mb-sm full-width"
            label="Select Billings(Multiple Billings)"
          >
            <template v-slot:prepend>
              <q-icon name="workspaces" />
            </template>
          </q-select>
          <q-select
            filled
            v-model="formData.year_level"
            :options="yearLevels"
            use-chips
            class="q-mr-sm col-3 q-mb-sm full-width"
            label="Select Year Level(Only one)"
          >
            <template v-slot:prepend>
              <q-icon name="signal_cellular_alt" />
            </template>
          </q-select>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
    <q-dialog v-model="editDialog">
      <editGroupBillingVue
        @hide-edit-dialog="editDialog = !editDialog"
        :group-id="group_id"
        :get-all-billing-group="getAllBillingGroup"
      />
    </q-dialog>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import store from "src/store/courses/course-list/store";
import editGroupBillingVue from "./editGroupBilling.vue";

const yearLevel = [
  {
    label: "Kinder 1",
    value: 1,
  },
];
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
    name: "group_name",
    label: "Group name",
    field: "group_name",
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
    name: "year_lvl",
    label: "Year Level",
    field: "year_lvl",
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
  emits: ["hideCreateGroupDialog"],
  props: ["subId"],
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
      category: null,
      getAllBillingCats: [],
      formData: {
        course: null,
        groupName: null,
        multiplBillings: [],
        year_level: null,
      },
      coursesOption: [],
      getAllbillings: [],
      yearLevels: [],
      allBillingGroup: [],
      editDialog: false,
      group_id: null,
    };
  },
  methods: {
    editDialogFunc(id) {
      this.group_id = id;
      this.editDialog = true;
    },
    async getAllBillingGroup() {
      this.allBillingGroup = [];
      //   console.log(this.formData.multiplBillings);
      await api
        .get("/api/billings/group/all", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          Object.entries(response.data.data).map(([key, val]) => {
            this.allBillingGroup.push({
              group_name: val.name,
              id: val.id,
              year_level: val.year_level,
              course: val.code,
            });
          });
        })
        .catch((error) => {
          console.log();
        });
    },
    async getAllYearLevel() {
      await api
        .get("/api/year-level", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.yearLevels.push({
              label: val.name,
              id: val.id,
            });
          });
        })
        .catch((error) => {
          console.log();
        });
    },
    async getAllCourse() {
      await api
        .get("/api/courses", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.courses).map(([key, val]) => {
            this.coursesOption.push({
              label: val.code,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getBillings() {
      await api
        .get("/api/billings", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.getAllbillings.push({
              value: val.id,
              label: val.name + " (" + val.amount + ")",
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();
      if (
        this.formData.groupName === null ||
        this.formData.course == null ||
        this.formData.year_level == null ||
        this.formData.multiplBillings.length == 0
      ) {
        this.$q.notify({
          type: "negative",
          message: "Please enter necessary data!",
          icon: "error",
          timeout: 3000,
        });
        this.$q.loading.hide();
      }
      await api
        .post(
          "/api/billings/group/store",
          {
            billings: this.formData.multiplBillings,
            course: this.formData.course.value,
            year_level_id: this.formData.year_level.id,
            year_level_label: this.formData.year_level.label,
            group_name: this.formData.groupName,
            // course_id: this.formData.course.id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          //   console.log(this.formData.year_level);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 3000,
                position: "top",
                message: response.data.message,
              });
              this.formData.groupName = null;
              this.formData.course = null;
              this.formData.year_level = null;
              this.formData.multiplBillings = [];
              this.getAllBillingGroup();
              //   emit("hideCreateGroupDialog");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message: response.data.message,
              });
              //   this.getAllBillingCats = [];
              //   this.category = null;
              //   this.getBillCats();
              // emit("hideCreateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$q.loading.hide();
          this.$q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: error.response.data.message,
          });
        });
    },
    async changeStatus(id) {
      this.$q.loading.show();
      await api
        .patch(
          "/api/prospectus/billings/categories/change",
          { id: id },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
              this.getAllBillingCats = [];
              this.getBillCats();
              //   emit("hideCreateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getAllCourse();
    this.getBillings();
    this.getAllYearLevel();
    this.getAllBillingGroup();
  },
  components: {
    editGroupBillingVue,
  },
};
</script>
