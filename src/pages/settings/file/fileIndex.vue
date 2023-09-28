<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">File Management</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add file' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <fileList />

      <q-dialog v-model="showCreateDialog">
        <createFile @hide-create-dialog="showCreateDialog = !showCreateDialog" />
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
import fileList from "src/components/settings/file/fileList.vue";
import createFile from "src/components/settings/file/createFile.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      showCreateDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("FileStore", ["getAllFiles"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllFiles();
  },
  components: {
    fileList,
    createFile,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
