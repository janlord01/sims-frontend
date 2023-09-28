<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Student Requirements List</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Student Requirement' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <requireList />

      <q-dialog v-model="showCreateDialog">
        <createRequire @hide-create-dialog="showCreateDialog = !showCreateDialog" />
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
import requireList from "src/components/settings/requirement/requireList.vue";
import createRequire from "src/components/settings/requirement/createRequirement.vue";

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
    ...mapActions("RequirementStore", ["getAllRequirement"]),

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
    this.getAllRequirement();
  },
  components: {
    requireList,
    createRequire,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
