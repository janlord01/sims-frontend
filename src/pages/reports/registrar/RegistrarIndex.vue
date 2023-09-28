<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Students</q-toolbar-title>

        <div class="row" style="width: 250px; margin-right: 10px">
          <q-select
            filled
            :options="courses"
            v-model="formData.course"
            label="Search Course"
            :class="$q.screen.gt.sm ? 'full-width ' : 'full-width'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div>
        <q-btn
          icon="search"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px; margin-right: 10px"
          :label="$q.screen.gt.xs ? 'Search Student' : ''"
          @click="getReceivableCourseFunc"
        />
        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Student"
          outlined
          style="height: 50px; margin-top: 10px; margin-bottom: 20px; margin-right: 10px"
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
        </q-input>
      </q-toolbar>
      <studentListRegistrar />
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";
import store from "src/store/users/student/store";
import studentListRegistrar from "src/components/reports/registrar/registrarStudentList.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      file_path: null,
      user_id: null,
      user_image: null,
      onProgressBar: 0,
      formData: {
        course: [],
      },
      files: null,
      passwordSent: true,
      statusSent: true,
      newToken: LocalStorage.getItem("jwt"),
      store,
      searchUser: "",
      showImportDialog: false,
      courses: [],
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
    ...mapActions("ReportCollectedStore", ["getAllRegistrarStudentByCourse", "onSearch"]),
    getReceivableCourseFunc() {
      if (this.formData.course == null) {
        this.$q.notify({
          position: "top",
          type: "negative",
          timeout: 3000,
          message: "Please Select Course",
        });
      } else {
        // console.log(this.formData.course);
        this.getAllRegistrarStudentByCourse(this.formData.course.value);
      }
    },
    async getAllCourse() {
      await api
        .get("api/courses", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.courses).map(([key, val]) => {
            this.courses.push({
              label: val.code,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    ImportDialog() {
      this.showImportDialog = true;
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearch([
        name,
        this.formData.course.value ? this.formData.course.value : this.formData.course,
      ]);
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
    this.getUserDetails();
    this.getAllStudent();
    this.getAllCourse();
  },
  components: {
    studentListRegistrar,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
