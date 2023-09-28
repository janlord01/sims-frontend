<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Online Registration for Student</q-toolbar-title>
        <!-- <q-btn
          color="grey"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Student Registration Mgt' : ''"
          to="/user/student/create"
        />
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
        </q-btn> -->
        <!-- <q-btn
          icon="cloud_upload"
          color="grey"
          size="sm"
          class="q-mr-sm"
          :label="$q.screen.gt.xs ? 'Import Students' : ''"
          @click="ImportDialog"
        /> -->
        <!-- <q-btn
          icon="add_circle"
          color="grey"
          style="height: 50px; margin-top: -10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Student' : ''"
          to="/user/student/create"
        /> -->
      </q-toolbar>
      <studentOnlineList />

      <q-dialog v-model="showImportDialog">
        <importStudent @hide-import-dialog="showImportDialog = !showImportDialog" />
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
import studentOnlineList from "src/components/users/student/onlineStudentList.vue";

import importStudent from "src/components/users/student/importStudentDialog.vue";

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
      showImportDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
    ...mapActions("StudentStore", ["onSearch", "getAllOnlineRegStudent"]),

    ImportDialog() {
      this.showImportDialog = true;
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
    // this.getAllStudent();
    this.getAllOnlineRegStudent();
  },
  components: {
    studentOnlineList,
    importStudent,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
