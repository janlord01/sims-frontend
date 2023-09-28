<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Prospectus List</q-toolbar-title>
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Add Prospectus' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <prospectusList />

      <q-dialog v-model="showCreateDialog">
        <createDialog
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
import prospectusList from "src/components/subjects/prospectus/prospectusList.vue";
import createDialog from "src/components/subjects/prospectus/createProspectus.vue";

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
    ...mapActions("ProspectusStore", ["getAllProspectus"]),
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
  },
  components: {
    prospectusList,
    createDialog,
  },
});
</script>
<style>
.search_input {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
