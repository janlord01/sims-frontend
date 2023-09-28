<template>
  <q-page>
    <div
      class="bg-white text-black shadow-2"
      v-if="userDetails.roles.some((permis) => ['student'].indexOf(permis) !== -1)"
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Schedules</q-toolbar-title>
        <!-- <q-form class="row" ref="formName" @submit="changeSem"> -->
        <!-- <div
          class="row"
          style="width: 250px; margin-top: 10px; margin-bottom: 10px; margin-right: 10px"
        >
          <q-select
            filled
            :options="getSemesters"
            v-model="sem"
            label="Select Semester"
            :class="$q.screen.gt.sm ? 'full-width ' : 'full-width'"
            @update:model-value="ChangeSemester"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div> -->
      </q-toolbar>
      <scheduleList />
    </div>
    <!-- <p v-if="userDetails.user">{{ userDetails.user.name }}</p> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import Announcement from "pages/Announcement.vue";
import scheduleList from "components/students/ScheduleList.vue";
import Logging from "pages/LogginHistory.vue";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      name: "",
      email: "",
      role: ["student"],

      getSemesters: [],
      sem: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("StudentUserStore", ["getAllStudentSchedules"]),
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
    async ChangeSemester() {
      var sem = this.sem.value;
      this.getAllStudentSchedules(sem);
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    this.getUserDetails();
    this.getAllStudentSchedules(this.sem);
    this.showSemesters();
  },
  components: {
    scheduleList,
  },
});
</script>
<style></style>
