<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">{{ user_name }} Subjects</q-toolbar-title>
        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Student"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append size="sm">
            <q-icon
              v-if="searchUser !== ''"
              name="close"
              @click="onLoadAllData"
              class="cursor-pointer"
            />
            <q-icon name="search" size="sm" />
          </template>
        </q-input> -->
        <!-- <q-btn
          icon="download"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'student_template.xlsx' : ''"
          class="q-mr-sm"
          href="/files/template-file-student.xlsx"
        >
          &nbsp;
        </q-btn>
        <q-btn
          icon="cloud_upload"
          color="grey"
          size="sm"
          class="q-mr-sm"
          :label="$q.screen.gt.xs ? 'Import Students' : ''"
          @click="ImportDialog"
        />
         -->
        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Subject' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <studentSubjectList />

      <q-dialog v-model="showCreateDialog">
        <createSubject @hide-create-dialog="showCreateDialog = !showCreateDialog" />
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
import store from "src/store/users/student/store";
import studentSubjectList from "src/components/academe/student-course/student-subject-list.vue";
import createSubject from "src/components/academe/student-course/student-add-subject.vue";

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
      user_name: null,
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
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    // ...mapActions("StudentStore", ["getAllStudent"]),
    ...mapActions("StudentStore", ["onSearch"]),
    ...mapActions("CollegeStore", ["getAllStudentSubject"]),
    async studentData() {
      await api
        .get("/api/courses/course/students/" + this.$route.params.id + "/data", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.user_name = response.data.data.name;
          if (response.data.data.course_id == null) {
            setTimeout(() => {
              // this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message: "Please Assign course first before adding subjects",
              });
              this.$router.back();
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearch(name);
    },
    onLoadAllData() {
      this.searchUser = "";
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllStudentSubject(this.$route.params.id);
    this.studentData();
  },
  components: {
    studentSubjectList,
    createSubject,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
