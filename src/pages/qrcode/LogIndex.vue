<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Student Log</q-toolbar-title>

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
        <q-btn-group rounded>
          <q-btn
            color="primary"
            rounded
            icon="login"
            to="/qrcode/time-in"
            label="Time-In"
          />
          <q-btn
            color="negative"
            rounded
            to="/qrcode/time-out"
            icon-right="logout"
            label="Time-Out"
          />
        </q-btn-group>
      </q-toolbar>
      <logList />
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
import logList from "src/components/qrcode/logList.vue";

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
    ...mapActions("RfidStore", ["getAllLogs"]),
    ...mapActions("StudentStore", ["onSearch"]),

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
    this.getAllLogs();
  },
  components: {
    logList,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
