<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Academic Year List</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Academic Year' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <academicList />

      <q-dialog v-model="showCreateDialog">
        <createAcademic @hide-create-dialog="showCreateDialog = !showCreateDialog" />
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
import academicList from "src/components/settings/academic/academicList.vue";
import createAcademic from "src/components/settings/academic/createAcademic.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      store,
      showCreateDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("AcademicStore", ["getAllAcademic"]),

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
    this.getAllAcademic();
  },
  components: {
    academicList,
    createAcademic,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
