<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update Subject Prerequisite </q-toolbar-title>
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
        :visible-columns="
          $q.screen.gt.xs ? ['code', 'descr', 'action'] : ['code', 'action']
        "
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="code" :props="props">
              {{ props.row.code }}
            </q-td>

            <q-td key="descr" :props="props">
              {{ props.row.descr }}
            </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="red"
                icon="delete"
                size="sm"
                @click="removePreSub(props.row.sub_pre_id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onAddSubject"
      >
        <div class="row q-col-gutter-none">
          <!-- <q-select
            filled
            :options="getSubjects"
            v-model="formData.preSub"
            label="Subjects"
            :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select> -->
          <q-input
            filled
            v-model="searchSubject"
            label="Search Subject"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchSubjectFunc"
          >
            <template v-slot:prepend>
              <q-icon name="numbers" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width q-mb-sm absolute bg-grey-10 text-white z-max"
            style="margin-top: 70px"
            v-if="searchVisible"
          >
            <q-item
              clickable
              v-ripple
              v-for="item in filterSub"
              @click="selectSubject(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{ item.descr }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
    name: "code",
    label: "Subject code",
    field: "code",
    align: "left",
    sortable: true,
  },
  {
    name: "descr",
    label: "Description",
    field: "descr",
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
      formData: {
        preSub: "",
      },
      passwordSent: true,
      getSubjects: [],
      getUserRoless: [],
      searchVisible: false,
      searchSubject: null,
      allSubjects: [],
      getSubjectss: [],
    };
  },
  methods: {
    selectSubject(subject) {
      // console.log(subject);
      // this.searchSubject = null;
      this.selectedSubject = null;
      this.searchSubject = subject.code + "(" + subject.descr + ")";
      this.selectedSubject = subject.id;
      this.formData.preSub = subject.id;
      this.searchVisible = false;

      // console.log(this.formData.subject_id);
    },
    async getSubj() {
      await api
        .get("/api/subjects/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allSubjects = response.data.subjects;
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getSubjectss.push({
              label: val.code + " (" + val.descr + ")",
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchSubjectFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        this.filterSub = this.allSubjects;
      } else {
        this.filterSub = this.allSubjects.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterSub);
    },
    async removePreSub(pre_id) {
      await api
        .delete("/api/subjects/prerequisite/sub/" + pre_id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          this.passwordSent = false;
          const errors = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errors != null) {
            setTimeout(() => {
              Object.entries(response.data.data.errors).forEach((msg) => {
                this.$q.notify({
                  type: "negative",
                  message: msg[1],
                  icon: "error",
                });
              });
              this.passwordSent = true;
              this.formData.password = "";
              this.formData.password_confirmation = "";
            }, 1000);
          } else {
            setTimeout(() => {
              this.passwordSent = true;
              this.showChangePasswordeDialog = false;
              Object.entries(response.data.message).forEach((msg) => {
                this.$q.notify({
                  type: "positive",
                  message: msg[1],
                  icon: "save",
                });
              });
              this.$emit("hideRoleDialog");
              // this.getAllParent();
              // this.getAllTeacher();
              // this.getAllEmployee();
              // this.getAllStudent();
              this.formData.preSub = null;
              this.getSubjectPreq();
              this.getUserRoless = [];
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onAddSubject() {
      if (this.formData.preSub.length === 0) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Subject",
          icon: "error",
        });
      } else {
        await api
          .post(
            "/api/subjects/prerequisite/store",
            {
              sub_pre_id: this.formData.preSub,
              sub_id: this.subId,
            },
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            // console.log(response);
            this.passwordSent = false;
            const errors = response.data.data.errors.message
              ? response.data.data.errors.message
              : null;
            if (errors != null) {
              setTimeout(() => {
                Object.entries(response.data.data.errors).forEach((msg) => {
                  this.$q.notify({
                    type: "negative",
                    message: msg[1],
                    icon: "error",
                  });
                });
                this.passwordSent = true;
                this.formData.password = "";
                this.formData.password_confirmation = "";
              }, 1000);
            } else {
              setTimeout(() => {
                this.passwordSent = true;
                this.showChangePasswordeDialog = false;
                Object.entries(response.data.message).forEach((msg) => {
                  this.$q.notify({
                    type: "positive",
                    message: msg[1],
                    icon: "save",
                  });
                });
                this.$emit("hideRoleDialog");
                this.searchSubject = null;
                // this.getAllParent();
                // this.getAllTeacher();
                // this.getAllEmployee();
                // this.getAllStudent();
                this.formData.preSub = null;
                this.getSubjectPreq();
                this.getUserRoless = [];
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async getAllSubjects() {
      await api
        .get("/api/subjects/prerequisite/" + this.subId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getSubjects.push({
              label: val.code + " (" + val.descr + ")",
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSubjectPreq() {
      await api
        .get("/api/subjects/prerequisite/sub/" + this.subId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.subjects).map(([key, val]) => {
            this.getUserRoless.push({
              code: val.code,
              descr: val.descr,
              sub_pre_id: val.id,
            });
          });
          //   console.log(this.getUserRoless);
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
    this.getSubj();
    this.getAllSubjects();
    this.getSubjectPreq();
  },
};
</script>
