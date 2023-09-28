<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-card-section class="z-top">
        <q-page-sticky expand position="top">
          <q-toolbar class="bg-white text-white">
            <q-form class="q-pa-md shawdow full-width block" ref="formName">
              <div class="column full-width">
                <div class="row">
                  <q-input
                    v-model="formData.name"
                    filled
                    label="Fullname"
                    :class="
                      $q.screen.gt.sm
                        ? 'col-2 q-mb-md q-mr-sm'
                        : 'full-width q-mb-md'
                    "
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="formData.course"
                    filled
                    label="Course"
                    :class="
                      $q.screen.gt.sm
                        ? 'col-2 q-mb-md q-mr-sm'
                        : 'full-width q-mb-md'
                    "
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="school" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="formData.year"
                    filled
                    label="Year Level"
                    :class="
                      $q.screen.gt.sm ? 'col-2 q-mb-md' : 'full-width q-mb-md'
                    "
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="density_small" />
                    </template>
                  </q-input>
                  <div class="float-right col-5 q-ml-xl" v-if="receiptAccepted">
                    <q-btn
                      icon="add_circle"
                      color="grey"
                      size="sm"
                      style="
                        height: 50px;
                        margin-top: 3px;
                        margin-bottom: 10px;
                        margin-left: 5px;
                        float: right;
                      "
                      :label="$q.screen.gt.xs ? 'Add Scholarship' : ''"
                      @click="onShowScholarshipDialog"
                    />
                    <q-btn
                      icon="add_circle"
                      color="grey"
                      size="sm"
                      style="
                        height: 50px;
                        margin-top: 3px;
                        margin-bottom: 10px;
                        margin-left: 5px;
                        float: right;
                      "
                      :label="$q.screen.gt.xs ? 'Add Billings' : ''"
                      @click="onShowBillingDialog"
                    />

                    <q-btn
                      icon="add_circle"
                      color="grey"
                      size="sm"
                      style="
                        height: 50px;
                        margin-top: 3px;
                        margin-bottom: 10px;
                        margin-left: 10px;
                        float: right;
                      "
                      :label="$q.screen.gt.xs ? 'Add Subjects' : ''"
                      @click="onShowSubjectDialog"
                    />
                  </div>
                </div>
              </div>
            </q-form>
          </q-toolbar>
        </q-page-sticky>
      </q-card-section>
      <q-card-section>
        <q-toolbar class="q-mt-lg">
          <q-toolbar-title class="text-h6"
            >Enrolment ({{ semester_name }})</q-toolbar-title
          >
        </q-toolbar>
        <q-form @submit="checkReciept">
          <div class="column full-width">
            <div class="row">
              <q-input
                filled
                v-model="formData.receipt"
                label="Please enter enrollment Receipt"
                :class="$q.screen.gt.sm ? 'q-mr-md col-3' : 'full-width'"
                type="text"
              >
                <template v-slot:prepend>
                  <q-icon name="receipt" />
                </template>
              </q-input>
              <q-btn
                label="Check"
                class="text-center"
                color="secondary"
                size="md"
                type="submit"
                icon="check"
              />
            </div>
          </div>
        </q-form>
        <div v-if="receiptAccepted">
          <TemporaryEnrolSubject />
          <TemporaryEnrolBilling />
          <!-- <subjectList :course-id="formData.course_id" /> -->
        </div>
      </q-card-section>

      <q-dialog v-model="subjectDialog" class="z-top">
        <addSubject
          :student-course="formData.course"
          :course-id="formData.course_id"
          @hide-create-dialog="subjectDialog = !subjectDialog"
        />
      </q-dialog>
      <q-dialog v-model="billingDialog" class="z-top">
        <addBilling
          :course-id="formData.course_id"
          @hide-create-dialog="billingDialog = !billingDialog"
          :year-id="formData.year_id"
        />
      </q-dialog>

      <q-dialog v-model="scholarshipDialog" class="z-top">
        <addScholarship
          :course-id="formData.course_id"
          @hide-create-dialog="scholarshipDialog = !scholarshipDialog"
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
// import store from "src/store/users/parent/store";
import subjectList from "src/components/admission/subject-list.vue";
import addSubject from "src/components/admission/addSubject.vue";
import addBilling from "src/components/admission/addBilling.vue";
import addScholarship from "src/components/admission/addScholarship.vue";
import createCourse from "src/components/courses/createCourse.vue";
import TemporaryEnrolSubject from "src/components/admission/temporary-enrol-subject.vue";
import TemporaryEnrolBilling from "src/components/admission/temporary-enrol-billing.vue";
// import SubjectAll from "src/components/admission/billing-list.vue";

export default defineComponent({
  setup() {
    return {};

    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      receiptAccepted: false,
      file_path: null,
      user_id: null,
      user_image: null,
      onProgressBar: 0,
      formData: {
        name: null,
        course: null,
        year: null,
        course_id: null,
        receipt: null,
        year_id: null,
      },
      files: null,
      passwordSent: true,
      statusSent: true,
      newToken: LocalStorage.getItem("jwt"),
      searchUser: "",
      showCreateDialog: false,
      studentSubjects: [],
      semester_name: null,
      subjectDialog: false,
      billingDialog: false,
      scholarshipDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("AdmissionStore", ["getAllUnenrolledStudent"]),
    ...mapActions("AdmissionStore", ["onSearch"]),
    ...mapActions("AdmissionStore", ["getAllSchedulesSubject"]),
    ...mapActions("AdmissionStore", ["getReceiptNumber"]),
    ...mapActions("AdmissionStore", ["getAllSubjectWithSchedules"]),
    ...mapActions("AdmissionStore", ["getAllbillings"]),
    ...mapActions("AdmissionStore", ["getAllDiscount"]),
    ...mapActions("AdmissionStore", ["emptyAll"]),
    ...mapActions("AdmissionStore", [
      "getBalance",
      "getEnrollmentFee",
      "getAllGroupbilling",
    ]),
    onShowScholarshipDialog() {
      this.scholarshipDialog = true;
    },
    onShowBillingDialog() {
      this.billingDialog = true;
    },
    onShowSubjectDialog() {
      this.subjectDialog = true;
    },
    async checkReciept() {
      if (this.formData.receipt == null || this.formData.receipt == "") {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Please Enter Receipt number",
        });
      } else {
        this.$q.loading.show();
        await api
          .get("api/admission/check-receipt/" + this.formData.receipt, {
            params: {
              semester_id: this.$route.params.id,
              user_id: this.$route.params.student_id,
            },
          })
          .then((response) => {
            // console.log(response);
            if (response.data.status === 200) {
              this.getReceiptNumber(response.data.data);
              setTimeout(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 1000,
                  position: "top",
                  message: response.data.message,
                });
                this.receiptAccepted = true;
              }, 2000);
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
                this.receiptAccepted = false;
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    getSubjectsSched() {
      const student_id = this.$route.params.student_id;
      const sem_id = this.$route.params.id;
      // if (this.formData.name != null) {
      this.getAllSchedulesSubject([student_id, sem_id]);
      this.getAllSubjectWithSchedules([student_id, sem_id]);
      // }
      // console.log(student_id);
    },

    async getStudentData() {
      await api
        .get(
          "/api/admission/student/" + this.$route.params.student_id,
          {
            params: {
              semester: this.$route.params.id,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          this.formData.name = response.data.data.name;
          this.formData.course = response.data.data.code;
          this.formData.course_id = response.data.data.course_id;
          this.formData.year = response.data.data.level;
          this.formData.year_id = response.data.data.level_id;
          this.getEnrollmentFee(response.data.billings);
          if (
            response.data.data.code == null ||
            response.data.data.level == null ||
            typeof response.data.data == "nothing"
          ) {
            setTimeout(() => {
              // this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message:
                  "Please Assign course or year level first before admitting student",
              });
              this.$router.back();
            }, 100);
          }
          // this.getAllGroupbilling([this.formData.course_id, this.formData.year_id]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSemesterData() {
      await api
        .get(
          "/api/admission/semester/" + this.$route.params.id,
          {
            params: {
              user_id: this.$route.params.student_id,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          if (response.data.enrolled === "yes") {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 5000,
                position: "top",
                message: "Student already enrolled in this semester!!",
              });
              this.$router.back();
            }, 1000);
          }
          this.semester_name = null;
          this.semester_name = response.data.data.title;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearch([name, this.$route.params.id]);
    },
    onLoadAllData() {
      this.searchUser = "";
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
    // getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  },
  //   beforeRouteUpdate(to, from, next) {
  //     next();

  //     this.getSemesterData();
  //   },
  watch: {
    $route(to, from) {
      this.getSemesterData();
    },
  },
  // beforeMount() {
  //   this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  // },
  // created() {
  //   this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  // },
  mounted() {
    // console.log(store.state.rowDatas)
    this.getSemesterData();
    this.getUserDetails();
    this.getStudentData();
    this.getAllbillings();
    this.getAllDiscount();
    this.emptyAll();
    // this.getAllUnenrolledStudent(this.$route.params.id);
    // this.getBalance(this.$route.params.student_id);
    this.getSubjectsSched();
    // this.getStudentSubjects();
    // this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  },
  components: {
    subjectList,
    createCourse,
    TemporaryEnrolSubject,
    TemporaryEnrolBilling,
    addSubject,
    addBilling,
    addScholarship,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
