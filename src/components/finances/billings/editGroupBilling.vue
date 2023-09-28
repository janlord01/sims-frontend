<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Group Billing </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
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
            stack-label
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
            stack-label
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
            stack-label
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
            label="Update"
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

const yearLevel = [
  {
    label: "Kinder 1",
    value: 1,
  },
];
const pagination = {
  sortBy: "role",
  rowsPerPage: 30,
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
  emits: ["hideEditDialog"],
  props: ["groupId", "getAllBillingGroup"],
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
        course: [],
        groupName: null,
        multiplBillings: [],
        year_level: [],
      },
      coursesOption: [],
      getAllbillings: [],
      yearLevels: [],
      allBillingGroup: [],
      groupDetails: [],
    };
  },
  methods: {
    async getGroupDetails() {
      this.allBillingGroup = [];
      //   console.log(this.formData.multiplBillings);
      await api
        .get("/api/billings/group/" + this.groupId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.formData.course.label = response.data.data[0].code;
          this.formData.course.value = response.data.data[0].courseId;
          this.formData.groupName = response.data.data[0].name;
          this.formData.year_level.label = response.data.data[0].year_level;
          this.formData.year_level.value = response.data.data[0].level_id;

          //   Object.entries(response.data.data).map(([key, val]) => {
          //     this.formData.course.push({
          //       label: val.code,
          //       value: val.courseId,
          //     });
          //   });
          Object.entries(response.data.items).map(([key, val]) => {
            this.formData.multiplBillings.push({
              label: val.name + " (" + val.amount + ")",
              value: val.id,
            });
          });
          //   Object.entries(response.data.data).map(([key, val]) => {
          //     this.formData.year_level.push({
          //       label: val.year_level,
          //       value: val.level_id,
          //     });
          //   });

          //   this.formData.course = response.data.courseName;
          //   Object.entries(response.data.data).map(([key, val]) => {
          //     this.groupDetails.push({
          //       group_name: val.name,
          //       id: val.id,
          //       year_level: val.year_level,
          //       course: val.code,
          //     });
          //   });
          //   console.log(this.formData.multiplBillings);
        })
        .catch((error) => {
          console.log(error);
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
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
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
        .patch(
          "/api/billings/group/update/" + this.groupId,
          {
            billings: this.formData.multiplBillings,
            course: this.formData.course.value,
            year_level_id: this.formData.year_level.value,
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
          //   console.log(this.formData.course);
          //   console.log(this.formData.year_level);
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
              //   this.getAllBillingGroup();
              this.$emit("hideEditDialog");
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
    // this.getAllBillingGroup();
    this.getGroupDetails();
  },
};
</script>
