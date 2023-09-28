<template>
  <q-card style="max-width: 400px; width: 400px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Subject </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form class="q-pa-md shawdow full-width block" ref="formName" @submit="onSubmit">
        <div class="">
          <q-input
            filled
            v-model="formData.subject_name"
            label="Subject"
            name="code"
            class="col-3 full-width q-mb-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>
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
              label="Update"
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
  emits: ["hideEditDialog"],
  props: ["subjectId"],
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
        subject_name: null,
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

    async getSubjectDetails() {
      // console.log(this.subjectId);
      await api
        .get("api/student/subject/" + this.subjectId + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.formData.subject_name =
            response.data.data.code + " (" + response.data.data.descr + ")";
          this.formData.grade = response.data.data.grade;
          this.formData.status = response.data.data.status;
          // console.log(response);
          //   this.allSubjects = response.data.subjects;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      if (this.formData.status == null) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 2000,
          position: "bottom",
          message: "Please select status",
        });
      } else {
        this.$q.loading.show();

        await api
          .patch(
            "/api/student/subject/" + this.subjectId + "/update",
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
                this.$emit("hideEditDialog");
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
                this.$emit("hideEditDialog");
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
    this.getSubjectDetails();
  },
};
</script>
