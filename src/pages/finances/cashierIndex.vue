<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Cashier </q-toolbar-title>

        <q-btn
          icon="add"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Payment' : ''"
          @click="onShowCreateDialog"
          v-if="
            userDetails.permissions.some(
              (permis) => ['create-cashier'].indexOf(permis) !== -1
            )
          "
        />
        <q-input
          bottom-slots
          v-model="searchUser"
          label="Search Transaction"
          outlined
          @keyup="onSearchSubmit"
          @keyup.enter="onSearchSubmit"
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : 'margin-left:10px;'"
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
      </q-toolbar>
      <paymentList />

      <q-dialog v-model="showCreateDialog" persistent>
        <createDialog
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
          :sem-id="sem"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
// import store from "src/store/subjects/schedule/store";
import paymentList from "src/components/finances/cashier/payList.vue";
import createDialog from "src/components/finances/cashier/createPayment.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default defineComponent({
  setup() {
    return {};
    // const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      searchUser: "",
      showCreateDialog: false,
      showCreateDialogBilling: false,
      getSemesters: [],
      sem: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("PaymentStore", ["getAllPayments", "onSearch"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    onLoadAllData() {
      this.searchUser = "";
      this.onSearch(this.searchUser);
    },
    onSearchSubmit() {
      var name = this.searchUser;
      this.onSearch(name);
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllPayments();
  },
  components: {
    paymentList,
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
