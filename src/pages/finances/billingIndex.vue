<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Billing List</q-toolbar-title>
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="
            height: 50px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-right: 5px;
          "
          :label="$q.screen.gt.xs ? 'Create Billing Category' : ''"
          @click="onShowCreateDialog"
        />
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="
            height: 50px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-right: 5px;
          "
          :label="$q.screen.gt.xs ? 'Create Billing' : ''"
          @click="onShowCreateDialogBilling"
        />
        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Group Billing' : ''"
          @click="onShowCreateGroupDialogBilling"
        />
      </q-toolbar>
      <billingList />

      <q-dialog v-model="showCreateDialog">
        <createDialog
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
          :sem-id="sem"
        />
      </q-dialog>
      <q-dialog v-model="showCreateDialogBilling">
        <createBillingDialog
          @hide-create-dialog="
            showCreateDialogBilling = !showCreateDialogBilling
          "
          :sem-id="sem"
        />
      </q-dialog>
      <q-dialog v-model="showCreateGroupDialogBilling">
        <createBillingGroupDialog
          @hide-create-group-dialog="
            showCreateGroupDialogBilling = !showCreateGroupDialogBilling
          "
          :sem-id="sem"
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
import store from "src/store/subjects/schedule/store";
import billingList from "src/components/finances/billings/billingList.vue";
import createDialog from "src/components/finances/billings/createCategory.vue";
import createBillingDialog from "src/components/finances/billings/createBilling.vue";
import createBillingGroupDialog from "src/components/finances/billings/createGroupBillings.vue";

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
      showCreateDialogBilling: false,
      showCreateGroupDialogBilling: false,
      getSemesters: [],
      sem: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("BillingStore", ["getAllBilling"]),
    ...mapActions("SubjectScheduleStore", ["onSearch"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    onShowCreateDialogBilling() {
      this.showCreateDialogBilling = true;
    },
    onShowCreateGroupDialogBilling() {
      this.showCreateGroupDialogBilling = true;
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllBilling();
  },
  components: {
    billingList,
    createDialog,
    createBillingDialog,
    createBillingGroupDialog,
  },
});
</script>
<style>
.search_input {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
