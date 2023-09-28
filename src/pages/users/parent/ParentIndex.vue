<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Parent List</q-toolbar-title>
        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Parent"
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
          size="sm"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          :label="$q.screen.gt.xs ? 'Parent_template.xlsx' : ''"
          class="q-mr-sm"
          href="/files/template-file-parent.xlsx"
        >
          &nbsp;
        </q-btn>
        <q-btn
          icon="cloud_upload"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          class="q-mr-sm"
          :label="$q.screen.gt.xs ? 'Import Parents' : ''"
          @click="ImportDialog"
        />
        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Add Parent' : ''"
          to="/user/parent/create"
        />
        <q-input
          bottom-slots
          v-model="searchUser"
          label="Search Parent"
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
      <parentList />

      <q-dialog v-model="showImportDialog">
        <importParents
          @hide-import-dialog="showImportDialog = !showImportDialog"
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
import store from "src/store/users/parent/store";
import parentList from "src/components/users/parent/parentList.vue";

import importParents from "src/components/users/parent/importParentDialog.vue";

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
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("ParentStore", ["onSearch"]),

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
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllParent();
  },
  components: {
    parentList,
    importParents,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
