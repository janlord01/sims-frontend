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
                  <div class="float-right col-5 q-ml-xl">
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
        <div>
          <EnrolledSubject />
          <EnrolledBilling :wallet-amount="studentWallet" />
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
import subjectList from "src/components/admission/subject-list.vue";
import addSubject from "src/components/admission/addSubject.vue";
import addBilling from "src/components/admission/addBilling.vue";
import addScholarship from "src/components/admission/addScholarship.vue";
import createCourse from "src/components/courses/createCourse.vue";
import TemporaryEnrolSubject from "src/components/admission/temporary-enrol-subject.vue";
import TemporaryEnrolBilling from "src/components/admission/temporary-enrol-billing.vue";

import EnrolledSubject from "src/components/admission/enrolled-subjects.vue";
import EnrolledBilling from "src/components/admission/enrolled-billings.vue";

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
      studentWallet: null,
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

    ...mapActions("AdmissionStore", ["getEnrolledSubjects"]),
    ...mapActions("AdmissionStore", ["getEnrolledbillings"]),
    ...mapActions("AdmissionStore", ["getEnrolledSchoolarship"]),
    ...mapActions("AdmissionStore", ["totalAllWithDiscounts"]),
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
      // this.$q.loading.show();
      await api
        .get("api/admission/student/check-receipt/edit", {
          params: {
            semester_id: this.$route.params.id,
            user_id: this.$route.params.student_id,
          },
        })
        .then((response) => {
          if (response.data.status === 200) {
            this.getReceiptNumber(response.data.data);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
          this.studentWallet = parseFloat(response.data.data.amount);
          // this.getEnrollmentFee(response.data.billings);
          if (
            response.data.data.code == null ||
            response.data.data.level == null ||
            typeof response.data.data == "nothing"
          ) {
            setTimeout(() => {
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSemesterData() {
      await api
        .get("/api/admission/semester/" + this.$route.params.id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
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
  },
  watch: {
    $route(to, from) {
      this.getSemesterData();
    },
  },
  mounted() {
    this.checkReciept();
    this.getSemesterData();
    this.getUserDetails();
    this.getStudentData();
    this.getAllbillings();
    this.getAllDiscount();
    this.emptyAll();
    this.getEnrolledSubjects(this.$route.params.admission_id);
    this.getEnrolledbillings(this.$route.params.admission_id);
    this.getEnrolledSchoolarship(this.$route.params.admission_id);
    this.getSubjectsSched();
  },
  components: {
    subjectList,
    createCourse,
    TemporaryEnrolSubject,
    TemporaryEnrolBilling,
    EnrolledSubject,
    EnrolledBilling,
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

<!-- <template>
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
                        ? 'col-3 q-mb-md q-mr-sm'
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
                        ? 'col-3 q-mb-md q-mr-sm'
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
                      $q.screen.gt.sm ? 'col-3 q-mb-md' : 'full-width q-mb-md'
                    "
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="density_small" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-form>
          </q-toolbar>
        </q-page-sticky>
      </q-card-section>
      <q-card-section>
        <q-toolbar class="q-mt-lg">
          <q-toolbar-title class="text-h6"
            >Update Enrolment ({{ semester_name }})</q-toolbar-title
          >
        </q-toolbar>
        <div>
          <EnrolledSubject />
          <EnrolledBilling />
          <subjectList :course-id="formData.course_id" />
        </div>
      </q-card-section>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import subjectList from "src/components/admission/subject-list.vue";
import createCourse from "src/components/courses/createCourse.vue";
import EnrolledSubject from "src/components/admission/enrolled-subjects.vue";
import EnrolledBilling from "src/components/admission/enrolled-billings.vue";

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
        amount: null,
      },
      files: null,
      passwordSent: true,
      statusSent: true,
      newToken: LocalStorage.getItem("jwt"),
      searchUser: "",
      showCreateDialog: false,
      studentSubjects: [],
      semester_name: null,
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
    ...mapActions("AdmissionStore", ["getEnrolledSubjects"]),
    ...mapActions("AdmissionStore", ["getEnrolledbillings"]),
    ...mapActions("AdmissionStore", ["getEnrolledSchoolarship"]),
    ...mapActions("AdmissionStore", ["totalAllWithDiscounts"]),

    async checkReciept() {
      // this.$q.loading.show();
      await api
        .get("api/admission/student/check-receipt/edit", {
          params: {
            semester_id: this.$route.params.id,
            user_id: this.$route.params.student_id,
          },
        })
        .then((response) => {
          if (response.data.status === 200) {
            this.getReceiptNumber(response.data.data);
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    getSubjectsSched() {
      const student_id = this.$route.params.student_id;
      const sem_id = this.$route.params.id;
      this.getAllSchedulesSubject([student_id, sem_id]);
      this.getAllSubjectWithSchedules([student_id, sem_id]);
    },

    async getStudentDatas() {
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
          this.formData.amount = parseFloat(response.data.data.amount);
          this.formData.year = response.data.data.level;
          if (
            response.data.data.code == null ||
            response.data.data.level == null ||
            typeof response.data.data == "nothing"
          ) {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message:
                  "Please Assign course or year level first before admitting student",
              });
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSemesterData() {
      await api
        .get("/api/admission/semester/" + this.$route.params.id, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
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
  },
  watch: {
    $route(to, from) {
      this.getSemesterData();
    },
  },
  mounted() {
    this.checkReciept();
    this.getSemesterData();
    this.getUserDetails();
    this.getStudentDatas();
    this.getAllbillings();
    this.getAllDiscount();
    this.emptyAll();
    this.getSubjectsSched();
    this.getEnrolledSubjects(this.$route.params.admission_id);
    this.getEnrolledbillings(this.$route.params.admission_id);
    this.getEnrolledSchoolarship(this.$route.params.admission_id);
  },
  components: {
    subjectList,
    createCourse,
    EnrolledSubject,
    EnrolledBilling,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style> -->
