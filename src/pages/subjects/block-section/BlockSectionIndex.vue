<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Block Sections</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="
            height: 50px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-right: 5px;
          "
          :label="$q.screen.gt.xs ? 'Create Block Section' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <blockSectionList />

      <q-dialog v-model="showCreateDialog">
        <createBlockSection
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
import store from "src/store/subjects/subjectManage/store";
import blockSectionList from "src/components/subjects/block-section/blockSectionList.vue";
import createBlockSection from "src/components/subjects/block-section/createBlockSection.vue";

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
    ...mapActions("SectionStore", ["getAllSections"]),
    ...mapActions("SubjectStore", ["onSearch"]),

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
    this.getAllSections();
  },
  components: {
    blockSectionList,
    createBlockSection,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
