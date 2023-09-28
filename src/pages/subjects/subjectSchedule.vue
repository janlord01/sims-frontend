<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Schedule Subject</q-toolbar-title>
        <!-- <q-form class="row" ref="formName" @submit="changeSem"> -->
        <div
          class="row"
          style="width: 250px; margin-top: -10px; margin-right: 10px"
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
        </div>
        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Schedule Subject"
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
        </q-input>
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Schedule Subject' : ''"
          @click="onShowCreateDialog"
        />
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
import subjectList from "src/components/subjects/schedules/subjectScheduleList.vue";
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
