<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Year Level</q-toolbar-title>

        <!-- <q-btn
          icon="add_circle"
          color="grey"
          style="height: 50px; margin-top: 5px; margin-bottom: 5px"
          size="sm"
          :label="$q.screen.gt.xs ? 'Create Year Level' : ''"
          @click="onShowCreateDialog"
        /> -->
      </q-toolbar>
      <yearLevelList />

      <q-dialog v-model="showCreateDialog">
        <createYearLevel
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
import yearLevelList from "src/components/academe/year-level/yearLevelList.vue";
import createYearLevel from "src/components/academe/year-level/createYearLevel.vue";

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
    ...mapActions("YearLevelStore", ["getAllYearLevel"]),
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
    this.getAllYearLevel();
  },
  components: {
    yearLevelList,
    createYearLevel,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
