<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Subject Load</q-toolbar-title>
        <!-- <q-form class="row" ref="formName" @submit="changeSem"> -->
      </q-toolbar>
      <subjectList :sem-id="sem" />

      <q-dialog v-model="showCreateDialog">
        <createScheduleSubject
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
          :sem-id="sem"
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
import subjectList from "src/components/teachers/subjectloads/subjectLoadList.vue";
import createScheduleSubject from "src/components/subjects/schedules/createSchedule.vue";

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
      getSemesters: [],
      sem: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("SubjectScheduleStore", ["onSemSelect"]),
    ...mapActions("SubjectScheduleStore", ["onSearch"]),
    async ChangeSemester() {
      var sem = this.sem;
      this.onSemSelect(sem);
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
      if (this.sem == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Semester",
          icon: "error",
        });
      } else {
        this.showCreateDialog = true;
      }
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
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.showSemesters();
  },
  components: {
    subjectList,
    createScheduleSubject,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
