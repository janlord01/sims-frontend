<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Employee List</q-toolbar-title>
        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Employee"
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
          :label="$q.screen.gt.xs ? 'Employee_template.xlsx' : ''"
          class="q-mr-sm"
          href="/files/template-file-employee.xlsx"
        >
          &nbsp;
        </q-btn>
        <q-btn
          icon="cloud_upload"
          color="grey"
          class="q-mr-sm"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Import Employee' : ''"
          @click="ImportDialog"
        />
        <q-btn
          icon="add_circle"
          color="grey"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Employee' : ''"
          to="/user/employee/create"
        />
        <q-input
          bottom-slots
          v-model="searchUser"
          label="Search Teacher"
          outlined
          @keyup="onSearchSubmit"
          @keyup.enter="onSearchSubmit"
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
        <!-- <q-btn
          icon="search"
          color="grey"
          style="height: 50px; margin-top: -10px; margin-left: -7px"
          size="sm"
          label="Search"
          @click="onSearchSubmit"
        /> -->
      </q-toolbar>
      <employeeList :search-data="searchUser" />

      <q-dialog v-model="showImportDialog">
        <importEmployee
          @hide-import-dialog="showImportDialog = !showImportDialog"
        />
      </q-dialog>
    </div>
  </q-page>

  <!-- <p>{{ searchUser }}</p> -->
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import store from "src/store/users/employee/store";
import employeeList from "src/components/users/employee/employeeList.vue";

import importEmployee from "src/components/users/employee/importEmployeeDialog.vue";

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
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("EmployeeStore", ["onSearch"]),
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
    // onLoadAllData() {
    //   this.searchUser = "";
    //   // this.getAllEmployee();
    // },

    // async onSearch() {
    //   var name = this.searchUser;
    //   await api
    //     .get(
    //       "/api/employee/user/search",
    //       // { name: this.searchUser },
    //       {
    //         params: {
    //           name: name,
    //         },
    //       },
    //       {
    //         headers: {
    //           Authorization: "Bearer " + LocalStorage.getItem("jwt"),
    //           Accept: "application/vnd.api+json",
    //           "Content-Type": "application/vnd.api+json",
    //           "X-Requested-With": "XMLHttpRequest",
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
    // ...mapState("Employeestore", ["getAllEmployee"]),
  },
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllEmployee();
  },
  components: {
    employeeList,
    importEmployee,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
