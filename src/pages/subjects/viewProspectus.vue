<template>
  <q-page class="">
    <q-page-sticky position="bottom-right" class="z-max" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="green "
        @click="addFunc(this.$route.params.id, course_id)"
      >
      </q-btn>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" class="z-max" :offset="[18, 80]">
      <q-btn
        fab
        icon="add"
        color="blue"
        @click="addElectiveFunc(this.$route.params.id, course_id)"
      >
      </q-btn>
    </q-page-sticky>
    <q-btn
      icon="arrow_back"
      color="grey"
      size="sm"
      style="margin-bottom: 10px"
      :label="$q.screen.gt.xs ? 'Back' : ''"
      @click="backButton"
    />

    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Prospectus of {{ course_code }}</q-toolbar-title
        >
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Add Subject' : ''"
          @click="addFunc(this.$route.params.id, course_id)"
        />
      </q-toolbar>
      <!-- <YearSemesterList /> -->

      <!-- Kinder 1 -->
      <kinderOneComponent :code="course_code" v-if="kinderOne" />
      <!-- Kinder 2 -->
      <kinderTwoComponent :code="course_code" v-if="kinderTwo" />

      <!-- Grade 1 -->
      <firstGradeComponent :code="course_code" v-if="firstGrade" />
      <!-- Grade 2 -->
      <secondGradeComponent :code="course_code" v-if="secondGrade" />
      <!-- Grade 3 -->
      <thirdGradeComponent :code="course_code" v-if="thirdGrade" />
      <!-- Grade 4 -->
      <fourthGradeComponent :code="course_code" v-if="fourthGrade" />
      <!-- Grade 5 -->
      <fifthGradeComponent :code="course_code" v-if="fifthGrade" />
      <!-- Grade 6 -->
      <sixthGradeComponent :code="course_code" v-if="sixthGrade" />
      <!-- Grade 7 -->
      <seventhGradeComponent :code="course_code" v-if="seventhGrade" />
      <!-- Grade 8 -->
      <eighthGradeComponent :code="course_code" v-if="eighthGrade" />
      <!-- Grade 9 -->
      <ninethGradeComponent :code="course_code" v-if="ninethGrade" />
      <!-- Grade 10 -->
      <tenthGradeComponent :code="course_code" v-if="tenthGrade" />
      <!-- Junior 1st Sem -->
      <junior_first_semComponent :code="course_code" v-if="junior_first_sem" />
      <!-- Junior 2nd Sem -->
      <junior_second_semComponent
        :code="course_code"
        v-if="junior_second_sem"
      />
      <!-- Senior 1st Sem -->
      <senior_first_semComponent :code="course_code" v-if="senior_first_sem" />
      <!-- Senior 2nd Sem -->
      <senior_second_semComponent
        :code="course_code"
        v-if="senior_second_sem"
      />

      <!-- 1st Year -->
      <firstYearFirstSem :code="course_code" v-if="first_year_first_sem" />
      <firstYearSecondSemester
        :code="course_code"
        v-if="first_year_second_sem"
      />
      <firstYearThirdSemester :code="course_code" v-if="first_year_third_sem" />
      <firstYearSummerSemester
        :code="course_code"
        v-if="first_year_summer_sem"
        @first-year-summer-sem="first_year_summer_sem = !first_year_summer_sem"
      />

      <!-- 2nd Year -->
      <secondYearFirstSem :code="course_code" v-if="second_year_first_sem" />
      <secondYearSecondSem :code="course_code" v-if="second_year_second_sem" />
      <secondYearThirdSem :code="course_code" v-if="second_year_third_sem" />
      <secondYearSummerSem :code="course_code" v-if="second_year_summer_sem" />

      <!-- 3rd Year -->
      <thirdYearFirstSem :code="course_code" v-if="third_year_first_sem" />
      <thirdYearSecondSem :code="course_code" v-if="third_year_second_sem" />
      <thirdYearThirdSem :code="course_code" v-if="third_year_third_sem" />
      <thirdYearSummerSem :code="course_code" v-if="third_year_summer_sem" />

      <!-- 4th Year -->
      <fourthYearFirstSem :code="course_code" v-if="fourth_year_first_sem" />
      <fourthYearSecondSem :code="course_code" v-if="fourth_year_second_sem" />
      <fourthYearThirdSem :code="course_code" v-if="fourth_year_third_sem" />
      <fourthYearSummerSem :code="course_code" v-if="fourth_year_summer_sem" />

      <!-- 5th Year -->
      <fifthYearFirstSem :code="course_code" v-if="fifth_year_first_sem" />
      <fifthYearSecondSem :code="course_code" v-if="fifth_year_second_sem" />
      <fifthYearThirdSem :code="course_code" v-if="fifth_year_third_sem" />
      <fifthYearSummerSem :code="course_code" v-if="fifth_year_summer_sem" />

      <!-- 6th Year -->
      <sixthYearFirstSem :code="course_code" v-if="sixth_year_first_sem" />
      <sixthYearSecondSem :code="course_code" v-if="sixth_year_second_sem" />
      <sixthYearThirdSem :code="course_code" v-if="sixth_year_third_sem" />
      <sixthYearSummerSem :code="course_code" v-if="sixth_year_summer_sem" />

      <!-- select/elective subject -->
      <electives :code="course_code" v-if="electives_data" />

      <!-- Add Subject Dialog -->
      <q-dialog v-model="showAddDialog">
        <addDialog
          :pros-id="pros_id"
          :course-id="course_id"
          @hide-add-dialog="showAddDialog = !showAddDialog"
        />
      </q-dialog>

      <!-- Add Elective Dialog -->
      <q-dialog v-model="showAddElectiveDialog">
        <addElectiveDialog
          :pros-id="pros_id"
          :course-id="course_id"
          @hide-add-dialog="showAddElectiveDialog = !showAddElectiveDialog"
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
import store from "src/store/subjects/schedule/store";

import YearSemesterList from "src/components/subjects/prospectus/YearSemesterList.vue";
// 1st Year
import firstYearFirstSem from "src/components/subjects/prospectus/firstYearFirtSemester.vue";
import firstYearSecondSemester from "src/components/subjects/prospectus/firstYearSecondSemester.vue";
import firstYearThirdSemester from "src/components/subjects/prospectus/firstYearThirdSem.vue";
import firstYearSummerSemester from "src/components/subjects/prospectus/firstYearSummerSemester.vue";

// 2nd Year
import secondYearFirstSem from "src/components/subjects/prospectus/secondYear/firstSemester.vue";
import secondYearSecondSem from "src/components/subjects/prospectus/secondYear/secondSemester.vue";
import secondYearThirdSem from "src/components/subjects/prospectus/secondYear/thirdSemester.vue";
import secondYearSummerSem from "src/components/subjects/prospectus/secondYear/summerSemester.vue";
import prospectusList from "src/components/subjects/prospectus/prospectusList.vue";
import addDialog from "src/components/subjects/prospectus/addSubject.vue";

// 3rd Year
import thirdYearFirstSem from "src/components/subjects/prospectus/thirdYear/firstSemester.vue";
import thirdYearSecondSem from "src/components/subjects/prospectus/thirdYear/secondSemester.vue";
import thirdYearThirdSem from "src/components/subjects/prospectus/thirdYear/thirdSemester.vue";
import thirdYearSummerSem from "src/components/subjects/prospectus/thirdYear/summerSemester.vue";

// 4th Year
import fourthYearFirstSem from "src/components/subjects/prospectus/fourthYear/firstSemester.vue";
import fourthYearSecondSem from "src/components/subjects/prospectus/fourthYear/secondSemester.vue";
import fourthYearThirdSem from "src/components/subjects/prospectus/fourthYear/thirdSemester.vue";
import fourthYearSummerSem from "src/components/subjects/prospectus/fourthYear/summerSemester.vue";

// 5th Year
import fifthYearFirstSem from "src/components/subjects/prospectus/fifthYear/firstSemester.vue";
import fifthYearSecondSem from "src/components/subjects/prospectus/fifthYear/secondSemester.vue";
import fifthYearThirdSem from "src/components/subjects/prospectus/fifthYear/thirdSemester.vue";
import fifthYearSummerSem from "src/components/subjects/prospectus/fifthYear/summerSemester.vue";

// 6th Year
import sixthYearFirstSem from "src/components/subjects/prospectus/sixthYear/firstSemester.vue";
import sixthYearSecondSem from "src/components/subjects/prospectus/sixthYear/secondSemester.vue";
import sixthYearThirdSem from "src/components/subjects/prospectus/sixthYear/thirdSemester.vue";
import sixthYearSummerSem from "src/components/subjects/prospectus/sixthYear/summerSemester.vue";

// Kinder
import kinderOneComponent from "src/components/subjects/prospectus/kinderOne.vue";
import kinderTwoComponent from "src/components/subjects/prospectus/kinderTwo.vue";

// Basic Ed
import firstGradeComponent from "src/components/subjects/prospectus/firstGrade.vue";
import secondGradeComponent from "src/components/subjects/prospectus/secondGrade.vue";
import thirdGradeComponent from "src/components/subjects/prospectus/thirdGrade.vue";
import fourthGradeComponent from "src/components/subjects/prospectus/fourthGrade.vue";
import fifthGradeComponent from "src/components/subjects/prospectus/fifthGrade.vue";
import sixthGradeComponent from "src/components/subjects/prospectus/sixthGrade.vue";
import seventhGradeComponent from "src/components/subjects/prospectus/seventhGrade.vue";
import eighthGradeComponent from "src/components/subjects/prospectus/eighthGrade.vue";
import ninethGradeComponent from "src/components/subjects/prospectus/ninethGrade.vue";
import tenthGradeComponent from "src/components/subjects/prospectus/tenthGrade.vue";
// Junior & Senior
import junior_first_semComponent from "src/components/subjects/prospectus/junior_first_sem.vue";
import junior_second_semComponent from "src/components/subjects/prospectus/junior_second_sem.vue";
import senior_first_semComponent from "src/components/subjects/prospectus/senior_first_sem.vue";
import senior_second_semComponent from "src/components/subjects/prospectus/senior_second_sem.vue";

import electives from "src/components/subjects/prospectus/selectSubject.vue";

import addElectiveDialog from "src/components/subjects/prospectus/addSelectSubject.vue";

// import prospectusList from "src/components/subjects/prospectus/prospectusList.vue";
// import addDialog from "src/components/subjects/prospectus/addSubject.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      file_path: null,
      user_id: null,
      user_image: null,
      onProgressBar: 0,
      formData: {
        password: "",
        password_confirmation: "",
      },
      files: null,
      passwordSent: true,
      statusSent: true,
      newToken: LocalStorage.getItem("jwt"),
      store,
      searchUser: "",
      showAddDialog: false,
      showAddElectiveDialog: false,
      getSemesters: [],
      sem: null,
      course_code: this.$route.params.code.toUpperCase(),
      pros_id: null,
      course_id: null,

      // Kinder
      kinderOne: false,
      kinderTwo: false,

      // Basic Ed
      firstGrade: false,
      secondGrade: false,
      thirdGrade: false,
      fourthGrade: false,
      fifthGrade: false,
      sixthGrade: false,
      seventhGrade: false,
      eighthGrade: false,
      ninethGrade: false,
      tenthGrade: false,

      // Junior & Senior
      junior_first_sem: [],
      junior_second_sem: [],
      senior_first_sem: [],
      senior_second_sem: [],

      // 1st Year
      first_year_first_sem: false,
      first_year_second_sem: false,
      first_year_third_sem: false,
      first_year_summer_sem: false,

      // 2nd Year
      second_year_first_sem: false,
      second_year_second_sem: false,
      second_year_third_sem: false,
      second_year_summer_sem: false,

      // 3rd Year
      third_year_first_sem: false,
      third_year_second_sem: false,
      third_year_third_sem: false,
      third_year_summer_sem: false,

      // 4th Year
      fourth_year_first_sem: false,
      fourth_year_second_sem: false,
      fourth_year_third_sem: false,
      fourth_year_summer_sem: false,

      // 5th Year
      fifth_year_first_sem: false,
      fifth_year_second_sem: false,
      fifth_year_third_sem: false,
      fifth_year_summer_sem: false,

      // 5th Year
      sixth_year_first_sem: false,
      sixth_year_second_sem: false,
      sixth_year_third_sem: false,
      sixth_year_summer_sem: false,

      electives_data: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("ProspectusStore", ["getAllProspectus"]),
    ...mapActions("SubjectScheduleStore", ["onSearch"]),
    ...mapActions("ProspectusStore", ["getSubjects"]),
    async getSubjects() {
      // console.log(payload)
      await api
        .get("/api/prospectus/courses/" + this.$route.params.code, {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          console.log(response);
          // 1st Year
          this.first_year_first_sem =
            response.data.prospectus_first.length > 0 ? true : false;
          this.first_year_second_sem =
            response.data.prospectus_second.length > 0 ? true : false;
          this.first_year_third_sem =
            response.data.prospectus_third.length > 0 ? true : false;
          this.first_year_summer_sem =
            response.data.prospectus_sem.length > 0 ? true : false;

          // 2nd Year
          this.second_year_first_sem =
            response.data.prospectus_first_second_year.length > 0
              ? true
              : false;
          this.second_year_second_sem =
            response.data.prospectus_second_second_year.length > 0
              ? true
              : false;
          this.second_year_third_sem =
            response.data.prospectus_third_second_year.length > 0
              ? true
              : false;
          this.second_year_summer_sem =
            response.data.prospectus_sem_second_year.length > 0 ? true : false;

          // 3rd Year
          this.third_year_first_sem =
            response.data.prospectus_first_third_year.length > 0 ? true : false;
          this.third_year_second_sem =
            response.data.prospectus_second_third_year.length > 0
              ? true
              : false;
          this.third_year_third_sem =
            response.data.prospectus_third_third_year.length > 0 ? true : false;
          this.third_year_summer_sem =
            response.data.prospectus_sem_third_year.length > 0 ? true : false;

          // 4th Year
          this.fourth_year_first_sem =
            response.data.prospectus_first_fourth_year.length > 0
              ? true
              : false;
          this.fourth_year_second_sem =
            response.data.prospectus_second_fourth_year.length > 0
              ? true
              : false;
          this.fourth_year_third_sem =
            response.data.prospectus_third_fourth_year.length > 0
              ? true
              : false;
          this.fourth_year_summer_sem =
            response.data.prospectus_sem_fourth_year.length > 0 ? true : false;

          // 5th Year
          this.fifth_year_first_sem =
            response.data.prospectus_first_fifth_year.length > 0 ? true : false;
          this.fifth_year_second_sem =
            response.data.prospectus_second_fifth_year.length > 0
              ? true
              : false;
          this.fifth_year_third_sem =
            response.data.prospectus_third_fifth_year.length > 0 ? true : false;
          this.fifth_year_summer_sem =
            response.data.prospectus_sem_fifth_year.length > 0 ? true : false;

          // 6th Year
          this.sixth_year_first_sem =
            response.data.prospectus_first_sixth_year.length > 0 ? true : false;
          this.sixth_year_second_sem =
            response.data.prospectus_second_sixth_year.length > 0
              ? true
              : false;
          this.sixth_year_third_sem =
            response.data.prospectus_third_sixth_year.length > 0 ? true : false;
          this.sixth_year_summer_sem =
            response.data.prospectus_sem_sixth_year.length > 0 ? true : false;

          // electives
          this.electives_data =
            response.data.electives.length > 0 ? true : false;

          // Kinder 1
          this.kinderOne = response.data.kinderOne.length > 0 ? true : false;
          // Kinder 2
          this.kinderTwo = response.data.kinderTwo.length > 0 ? true : false;

          // Grade 1
          this.firstGrade = response.data.firstGrade.length > 0 ? true : false;
          // Grade 2
          this.secondGrade =
            response.data.secondGrade.length > 0 ? true : false;
          // Grade 3
          this.thirdGrade = response.data.thirdGrade.length > 0 ? true : false;
          // Grade 4
          this.fourthGrade =
            response.data.fourthGrade.length > 0 ? true : false;
          // Grade 5
          this.fifthGrade = response.data.fifthGrade.length > 0 ? true : false;
          // Grade 6
          this.sixthGrade = response.data.sixthGrade.length > 0 ? true : false;
          // Grade 7
          this.seventhGrade =
            response.data.seventhGrade.length > 0 ? true : false;
          // Grade 8
          this.eighthGrade =
            response.data.eighthGrade.length > 0 ? true : false;
          // Grade 9
          this.ninethGrade =
            response.data.ninethGrade.length > 0 ? true : false;
          // Grade 10
          this.tenthGrade = response.data.tenthGrade.length > 0 ? true : false;

          // Junior 1st Sem
          this.junior_first_sem =
            response.data.junior_first_sem.length > 0 ? true : false;
          // Junior 2nd Sem
          this.junior_second_sem =
            response.data.junior_second_sem.length > 0 ? true : false;
          // Senior 1st Sem
          this.senior_first_sem =
            response.data.senior_first_sem.length > 0 ? true : false;
          // Senior 2nd Sem
          this.senior_second_sem =
            response.data.senior_second_sem.length > 0 ? true : false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addFunc(pros_id, course_id) {
      this.pros_id = null;
      this.pros_id = pros_id;
      this.course_id = null;
      this.course_id = course_id;
      this.showAddDialog = true;
      // console.log("course  id:" + course_id);
      // console.log("pros  id:" + pros_id);
    },
    addElectiveFunc(pros_id, course_id) {
      this.pros_id = null;
      this.pros_id = pros_id;
      this.course_id = null;
      this.course_id = course_id;
      this.showAddElectiveDialog = true;
    },
    async ChangeSemester() {
      var sem = this.sem;
      this.onSemSelect(sem);
    },
    async getCourse() {
      await api
        .get("/api/prospectus/courses/" + this.$route.params.code, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          this.course_id = response.data.course_id;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async showSemesters() {
      await api
        .get("/api/subjects/show/semesters", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.semesters).map(([key, val]) => {
            this.getSemesters.push({
              label: val.title,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    onSearchSubmit() {
      if (this.sem == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Semester",
          icon: "error",
        });
      } else {
        var name = this.searchUser;
        var sem = this.sem;
        // console.log(sem);
        this.onSearch([name, sem.value]);
      }
    },
    onLoadAllData() {
      this.searchUser = "";
    },
    backButton() {
      this.$router.go(-1);
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.showSemesters();
    this.getAllProspectus();
    this.getCourse();
    this.getSubjects(this.$route.params.code);
  },
  components: {
    YearSemesterList,

    // 1st Year
    firstYearFirstSem,
    firstYearSecondSemester,
    firstYearSummerSemester,
    firstYearThirdSemester,

    // 2nd Year
    secondYearFirstSem,
    secondYearSecondSem,
    secondYearThirdSem,
    secondYearSummerSem,

    // 3rd Year
    thirdYearFirstSem,
    thirdYearSecondSem,
    thirdYearThirdSem,
    thirdYearSummerSem,

    // 4th Year
    fourthYearFirstSem,
    fourthYearSecondSem,
    fourthYearThirdSem,
    fourthYearSummerSem,

    // 5th Year
    fifthYearFirstSem,
    fifthYearSecondSem,
    fifthYearThirdSem,
    fifthYearSummerSem,

    // 6th Year
    sixthYearFirstSem,
    sixthYearSecondSem,
    sixthYearThirdSem,
    sixthYearSummerSem,

    // electives
    electives,
    addElectiveDialog,

    // Kinder
    kinderOneComponent,
    kinderTwoComponent,

    // BasicEd
    firstGradeComponent,
    secondGradeComponent,
    thirdGradeComponent,
    fourthGradeComponent,
    fifthGradeComponent,
    sixthGradeComponent,
    seventhGradeComponent,
    eighthGradeComponent,
    ninethGradeComponent,
    tenthGradeComponent,

    // Junior & Senior
    junior_first_semComponent,
    junior_second_semComponent,

    senior_first_semComponent,
    senior_second_semComponent,

    addDialog,
  },
});
</script>
<style>
.search_input {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
