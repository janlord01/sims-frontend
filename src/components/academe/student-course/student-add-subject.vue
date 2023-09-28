<template>
  <q-card style="max-width: 400px; width: 400px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add Subject </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form class="q-pa-md shawdow full-width block" ref="formName" @submit="onSubmit">
        <div class="">
          <q-input
            filled
            v-model="searchSubject"
            label="Search Subject"
            name="code"
            class="col-3 full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchSubjectFunc"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width absolute bg-grey-10 text-white z-max"
            v-if="searchVisible"
            style="overflow: hidden"
          >
            <q-item
              clickable
              v-ripple
              v-for="item in filterSubject"
              @click="selectSubject(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.code }}</q-item-label>
                <q-item-label caption class="text-white">{{ item.descr }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div>
            <div class="column full-width">
              <div class="row">
                <q-select
                  filled
                  :options="['passed', 'failed', 'inc', 'ng']"
                  v-model="formData.status"
                  label="Status"
                  :class="$q.screen.gt.sm ? 'full-width q-mb-md' : 'full-width q-mb-md'"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" />
                  </template>
                </q-select>
                <q-input
                  filled
                  v-if="formData.status == 'passed' || formData.status == 'failed'"
                  v-model="formData.grade"
                  label="Final Grade"
                  :class="$q.screen.gt.sm ? 'full-width q-mb-md' : 'full-width q-mb-md'"
                  type="text"
                >
                  <template v-slot:prepend>
                    <q-icon name="star" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <div class="row q-mt-lg align-center">
            <q-btn
              unelevated
              label="Add"
              class="text-center"
              color="secondary"
              size="md"
              type="submit"
              icon="save"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
// import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
const pagination = {
  sortBy: "id",
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
    name: "category",
    label: "Category",
    field: "category",
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
  emits: ["hideCreateDialog"],
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
      transaction: [],
      formData: {
        subject_id: null,
        grade: null,
        status: null,
      },
      allSubjects: [],
      searchVisible: false,
      searchSubject: null,
      filterSubject: [],
      selectedSubject: null,
      discounts: [],
    };
  },
  methods: {
    ...mapActions("CollegeStore", ["getAllStudentSubject"]),

    async getDiscounts() {
      await api
        .get("/api/discounts", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.discounts.push({
              label:
                val.type == "Percentage"
                  ? val.description + " " + val.number + "%"
                  : val.description + " P" + val.number,
              value: val.id,
              type: val.type,
              number: val.number,
            });
            // console.log(this.discounts);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectSubject(subject) {
      this.selectedSubject = null;
      this.searchSubject = subject.code + " (" + subject.descr + ")";
      this.selectedSubject = subject.id;
      this.formData.subject_id = subject.id;
      this.searchVisible = false;
    },
    async getSubjects() {
      await api
        .get("/api/subjects/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allSubjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      if (this.formData.subject_id == null || this.formData.status == null) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 1000,
          position: "bottom",
          message: "Please select subject or select status",
        });
      } else {
        this.$q.loading.show();

        await api
          .post(
            "/api/student/subject/add",
            {
              user_id: this.$route.params.id,
              subject_id: this.formData.subject_id,
              grade: this.formData.grade,
              status: this.formData.status,
            },
            //   formData,
            {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            }
          )
          .then((response) => {
            // console.log(response);
            // console.log(Array.from(response.data.proof_image));
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

                this.getAllStudentSubject(this.$route.params.id);
                this.$emit("hideCreateDialog");
              }, 2000);
            } else {
              setTimeout(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "negative",
                  color: "negative",
                  timeout: 1000,
                  position: "bottom",
                  message: response.data.message,
                });

                this.getAllStudentSubject(this.$route.params.id);
                this.$emit("hideCreateDialog");
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 2000,
                position: "bottom",
                message: error.message,
              });

              this.getAllStudentSubject(this.$route.params.id);
              //   this.$emit("hideCreateDialog");
            }, 2000);
          });
      }
    },

    searchSubjectFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        this.filterSubject = this.allSubjects;
      } else {
        this.filterSubject = this.allSubjects.filter((Subject) => {
          return Object.values(Subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterSubject);
    },
  },
  computed: {
    filteredSearch() {
      //   console.log("work!!!");

      const query = this.searchSubject != null ? this.searchSubject.toLowerCase() : "";
      if (this.searchSubject == "" || this.searchSubject == null) {
        return this.allSubjects;
      } else {
        // console.log("test");
        // this.searchVisible = true;
        return this.allSubjects.filter((Subject) => {
          return Object.values(Subject).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
  },
  mounted() {
    this.getSubjects();
    this.getDiscounts();
  },
};
</script>
