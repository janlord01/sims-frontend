<template>
  <!-- Unenrolled Student -->
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Admission ({{ semester_name }})</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Student"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append size="sm">
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
      </q-toolbar>
      <studentList />
    </div>

    <!-- Enrolled Student -->

    <!-- <q-page class=""> -->
    <div class="bg-white text-black q-mt-xl">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Enrolled Student ({{ semester_name }})</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmitEnrolled"
          label="Search Student"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append size="sm">
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
      </q-toolbar>
      <studentListEnrolled />
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import store from "src/store/users/parent/store";
import studentList from "src/components/admission/student-list.vue";
import createCourse from "src/components/courses/createCourse.vue";
import studentListEnrolled from "src/components/admission/student-list-enrolled.vue";
// import printSoaVue from "src/components/admission/print-soa.vue";

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
      showCreateDialog: false,
      showPrintDialog: false,
      semester_name: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("AdmissionStore", ["getAllUnenrolledStudent"]),
    ...mapActions("AdmissionStore", ["getAllEnrolledStudent"]),
    ...mapActions("AdmissionStore", ["onSearch"]),
    ...mapActions("AdmissionStore", ["onSearchUnenrolledStudent"]),
    ...mapActions("AdmissionStore", ["onSearchEnrolledStudent"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    async getSemesterData() {
      await api("/api/admission/semester/" + this.$route.params.id, {
        headers: {
          Authorization: "Bearer " + this.newToken,
        },
      })
        .then((response) => {
          // console.log(response);
          this.semester_name = null;
          this.semester_name = response.data.data.title;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearchUnenrolledStudent([
        name,
        this.$route.params.id,
        this.$route.params.student_id,
      ]);
    },
    onSearchSubmitEnrolled() {
      var name = this.searchUser;
      this.onSearchEnrolledStudent([
        name,
        this.$route.params.id,
        this.$route.params.student_id,
      ]);
    },

    onLoadAllData() {
      this.searchUser = "";
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  //   beforeRouteUpdate(to, from, next) {
  //     next();

  //     this.getSemesterData();
  //   },
  watch: {
    $route(to, from) {
      this.getSemesterData();

      this.getAllUnenrolledStudent([
        this.$route.params.id,
        this.$route.params.student_id,
      ]);
      this.getAllEnrolledStudent([
        this.$route.params.id,
        this.$route.params.student_id,
      ]);
    },
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getSemesterData();
    this.getUserDetails();

    this.getAllUnenrolledStudent([
      this.$route.params.id,
      this.$route.params.student_id,
    ]);
    this.getAllEnrolledStudent([
      this.$route.params.id,
      this.$route.params.student_id,
    ]);
  },
  components: {
    studentList,
    createCourse,
    studentListEnrolled,
    // printSoaVue,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
