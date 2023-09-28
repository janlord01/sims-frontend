<template>
  <q-card style="max-width: 400px; width: 400px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Add/Update Balance </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form class="q-pa-md shawdow full-width block" ref="formName" @submit="onSubmit">
        <div class="">
          <q-input
            v-model="pre_balance"
            filled
            label="Change"
            name="code"
            style="margin-top: -5px; margin-bottom: 3px"
            :class="$q.screen.gt.sm ? 'q-mr-sm col-6' : 'full-width q-mb-md'"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>

        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Add/Update"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
            icon="paid"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
// import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";
import { mapActions, mapState } from "vuex";
import store from "src/store/courses/course-list/store";
const pagination = {
  sortBy: "role",
  rowsPerPage: 10,
};
const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "category",
    label: "Category",
    field: "category",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  emits: ["hideUpdateDialog", "getTotal"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      pre_balance: 0,
    };
  },
  methods: {
    ...mapActions("AdmissionStore", ["addBalance"]),

    getPrevBalance() {
      this.pre_balance = this.balance;
    },
    onSubmit() {
      if (this.pre_balance != null || this.pre_balance != "") {
        // console.log(this.pre_balance);
        this.addBalance(this.pre_balance);
        this.$q.notify({
          type: "positive",
          color: "positive",
          timeout: 3000,
          position: "top",
          message: "Balance Added/Updated!",
        });
        this.$emit("hideUpdateDialog");
        // this.$emit("getTotal");
      }
    },
  },
  computed: {
    ...mapState("AdmissionStore", ["balance"]),
  },
  watch: {
    // balance: {
    //   handler: function (newVal, oldVal) {
    //     // console.log(`Updating from ${oldVal} to ${newVal}`);
    //     this.formData.pre_balance = newVal;
    //   },
    //   deep: true,
    // },
  },
  mounted() {
    this.getPrevBalance();
  },
};
</script>
