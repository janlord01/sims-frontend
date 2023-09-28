<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Discounts </q-toolbar-title>

        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Discount' : ''"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <discountList />

      <q-dialog v-model="showCreateDialog">
        <createDialog
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
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
import discountList from "src/components/finances/discounts/discountList.vue";
import createDialog from "src/components/finances/discounts/createDiscount.vue";

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
      getSemesters: [],
      sem: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("DiscountStore", ["getAllDiscount"]),

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
    this.getAllDiscount();
  },
  components: {
    discountList,
    createDialog,
  },
});
</script>
<style>
.search_input {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
