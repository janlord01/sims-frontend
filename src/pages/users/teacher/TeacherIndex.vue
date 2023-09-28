<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Teacher List</q-toolbar-title>
        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Teacher"
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
        <q-btn
          icon="cloud_download"
          color="grey"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Teacher_template.xlsx' : ''"
          class="q-mr-sm"
          href="/files/template-file-teacher.xlsx"
        >
          &nbsp;
        </q-btn>
        <q-btn
          icon="cloud_upload"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          color="grey"
          size="sm"
          class="q-mr-sm"
          :label="$q.screen.gt.xs ? 'Import Teacher' : ''"
          @click="ImportDialog"
        />
        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Add Teacher' : ''"
          to="/user/teacher/create"
        />
        <q-input
          bottom-slots
          v-model="searchUser"
          label="Search Teacher"
          outlined
          @keyup="onSearchSubmit"
          @keyup.enter="onSearchSubmit"
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : 'margin-left:10px;'"
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
        <!-- <q-btn
          icon="search"
          color="grey"
          style="height: 50px; margin-top: -10px; margin-left: -7px"
          size="sm"
          label="Search"
          @click="onSearchSubmit"
        /> -->
      </q-toolbar>
      <teacherList />

      <q-dialog v-model="showImportDialog">
        <importTeacher
          @hide-import-dialog="showImportDialog = !showImportDialog"
        />
      </q-dialog>
    </div>

    <!-- <p>{{ searchUser }}</p> -->
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import store from "src/store/users/teacher/store";
import teacherList from "src/components/users/teacher/teacherList.vue";

import importTeacher from "src/components/users/teacher/importTeacherDialog.vue";

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
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("TeacherStore", ["onSearch"]),
    ImportDialog() {
      this.showImportDialog = true;
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearch(name);
    },

    onLoadAllData() {
      this.searchUser = "";
      this.onSearch(this.searchUser);
    },
    searchEmpty() {
      if (this.searchUser == "") {
        this.onSearch(this.searchUser);
      }
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllTeacher();
  },
  components: {
    teacherList,
    importTeacher,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
