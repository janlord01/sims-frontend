<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">RFID's</q-toolbar-title>

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
        </q-input>
        <q-btn
          icon="add_circle"
          color="grey"
          style="height: 50px; margin-top: -10px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add RFID Code' : ''"
          @click="addFunc"
        />
      </q-toolbar>
      <rfidList />

      <q-dialog v-model="showAddDialog" persistent>
        <addRfid @hide-create-dialog="showAddDialog = !showAddDialog" />
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
import rfidList from "src/components/rfid/RfidList.vue";
import addRfid from "src/components/rfid/addRfid.vue";

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
      showAddDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("RfidStore", ["getAllRfids"]),
    addFunc() {
      this.showAddDialog = true;
    },

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
    this.getAllRfids();
    // this.getAllStudent();
  },
  components: {
    rfidList,
    addRfid,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
