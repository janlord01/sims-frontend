<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Colleges</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 20px"
          :label="$q.screen.gt.xs ? 'Create College' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <collegeList />

      <q-dialog v-model="showCreateDialog">
        <createCollege
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
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
import collegeList from "src/components/academe/colleges/collegeList.vue";
import createCollege from "src/components/academe/colleges/createCollege.vue";

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
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("CollegeStore", ["getAllColleges"]),
    ...mapActions("ParentStore", ["onSearch"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
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
    this.getAllColleges();
  },
  components: {
    collegeList,
    createCollege,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
