<template>
  <q-toolbar>
    <q-toolbar-title class="text-h6">Billings</q-toolbar-title>
  </q-toolbar>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.tempDataBilling"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs ? ['name', 'price', 'action'] : ['name', 'price']
    "
  >
    <template #body="props">
      <!-- <p v-for="item in studentSubjects"> -->
      <q-tr
        :props="props"
        :class="props.row.total !== props.row.balance ? 'bg-red-5' : ''"
      >
        <!-- {{ item.code }}
        {{ props.row.name }} -->

        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="price" :props="props">
          {{ props.row.price }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            v-if="props.row.total === props.row.balance"
            color="red"
            icon="delete"
            size="sm"
            @click="removeBillingFunc(props.row.id)"
          />
          <q-btn
            v-else
            color="grey"
            icon="delete"
            size="sm"
            @click="removeWarningFunc"
          />
        </q-td>
      </q-tr>
      <!-- </p> -->
    </template>
  </q-table>
  <q-toolbar>
    <q-toolbar-title class="text-h6">Schoolarship</q-toolbar-title>
  </q-toolbar>
  <q-table
    :pagination="pagination2"
    class="q-pa-sm"
    :rows="store.state.tempDataDiscount"
    :columns="columns2"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'price', 'action']
        : ['name', 'price', 'action']
    "
  >
    <template #body="props">
      <!-- <p v-for="item in studentSubjects"> -->
      <q-tr
        :props="props"
        :class="walletAmount < totalDiscount ? 'bg-red-5' : ''"
      >
        <!-- {{ item.code }}
        {{ props.row.name }} -->
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.description }}
          <!-- {{ walletAmount }} -->
        </q-td>

        <q-td key="price" :props="props">
          {{ props.row.number }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            v-if="walletAmount < totalDiscount"
            color="grey"
            icon="delete"
            size="sm"
            @click="removeWarningFunc"
          />
          <q-btn
            v-else
            color="red"
            icon="delete"
            size="sm"
            @click="removeDiscountFunc(props.row.id)"
          />
        </q-td>
      </q-tr>
      <!-- </p> -->
    </template>
  </q-table>
  <div class="column full-width" style="min-width: 300px">
    <q-form
      class="q-pa-md shawdow full-width block"
      ref="formName"
      @submit="onSubmit"
    >
      <div class="row q-mr-sm">
        <!-- <q-input
          filled
          v-model="formData.pre_balance"
          type="text"
          label="Previous Balance"
          class="q-mr-sm col- q-mt-md"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="attach_money"> </q-icon>
          </template>
        </q-input> -->
        <!-- <q-input
          filled
          v-model="formData.manual_balance"
          type="text"
          label="Manually Add Balance"
          class="q-mr-sm col- q-mt-md"
                @update:model-value="addManualBalance"

        >
          <template v-slot:prepend>
            <q-icon name="attach_money"> </q-icon>
          </template>
        </q-input> -->
        <!-- <q-btn
          unelevated
          label="Add/Update Balance"
          class="text-center"
          color="secondary"
          size="md"
          type="button"
          icon="iso"
          style="height: 50px; margin-top: 20px; margin-right: 5px"
          @click="addManualBalance"
        /> -->
        <!-- <q-input
          filled
          v-model="formData.subjectTotal"
          type="text"
          label="Sub-total Subject Payable"
          class="q-mr-sm col-2 q-mt-md"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="attach_money"> </q-icon>
          </template>
        </q-input>
        <q-input
          filled
          v-model="formData.billingTotal"
          type="text"
          label="Sub-total Billing Payable"
          class="q-mr-sm col-2 q-mt-md"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="attach_money"> </q-icon>
          </template>
        </q-input>
        <q-input
          filled
          v-model="formData.totalUnits"
          type="text"
          label="Total Units"
          class="q-mr-sm col-2 q-mt-md"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="numbers"> </q-icon>
          </template>
        </q-input> -->
        <!-- <q-input
          filled
          v-model="formData.totalPay"
          type="text"
          label="Total Payables"
          class="q-mr-sm col-2 q-mt-md"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="attach_money"> </q-icon>
          </template>
        </q-input> -->
        <!-- <q-input
          filled
          v-model="formData.remarks"
          type="text"
          label="Remarks/Notes"
          class="q-mr-sm col-2 q-mt-md"
        >
          <template v-slot:prepend>
            <q-icon name="description"> </q-icon>
          </template>
        </q-input> -->
      </div>
      <div class="row q-mt-lg align-center">
        <q-btn
          unelevated
          label="View Total"
          class="text-center"
          color="secondary"
          size="md"
          type="button"
          icon="calculate"
          @click="calculateTotalFunc"
        />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="BalanceDialog">
    <addUpdateBalance
      @hide-update-dialog="BalanceDialog = !BalanceDialog"
      @get-total="totalPayables"
    />
  </q-dialog>
  <!-- Calculate Payables -->
  <q-dialog v-model="showCalculate" class="z-max">
    <calculateTotal
      :call-func="callFunc"
      @hide-calculate-dialog="showCalculate = !showCalculate"
    />
  </q-dialog>
</template>

<script>
import addUpdateBalance from "src/components/admission/addUpdateBalance.vue";
import calculateTotal from "src/components/admission/calculateTotal.vue";
import { mapActions, mapState } from "vuex";

import { api } from "src/boot/axios";
import store from "src/store/admission/store";
import { LocalStorage, date } from "quasar";
import moment from "moment";

const pagination = {
  sortBy: "name",
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
    name: "code",
    label: "Code",
    field: "code",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "Billing Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "price",
    label: "Amount",
    field: "price",
    align: "left",
  },

  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
const pagination2 = {
  sortBy: "name",
  rowsPerPage: 10,
};
const columns2 = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Schoolarship/Discount",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
  },

  {
    name: "price",
    label: "Amount/Percentage",
    field: "price",
    align: "left",
  },

  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  props: ["semId", "walletAmount"],
  setup() {
    return {
      pagination,
      pagination2,
      columns,
      columns2,
      moment,
      date,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      formData: {
        billingTotal: 0,
        subjectTotal: 0,
        pre_balance: 0,
        totalPay: 0,
        totalUnits: 0,
        remarks: null,
        totalDiscount: 0,
      },
      // walletAmount: 0,
      subject_sched_id: null,
      showEditDialog: false,
      showPreDialog: false,
      showAddTeacherDialog: false,
      showAddScheduleDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      sem: this.semId,
      studentSubjects: [],
      searchSubject: null,
      BalanceDialog: false,
      showCalculate: false,
      callFunc: null,
    };
  },
  methods: {
    ...mapActions("AdmissionStore", ["onSearch"]),
    ...mapActions("AdmissionStore", ["removeBilling"]),
    ...mapActions("AdmissionStore", ["removeDiscount"]),
    ...mapActions("AdmissionStore", ["addBalance"]),
    ...mapActions("AdmissionStore", ["getBalance"]),
    ...mapActions("AdmissionStore", ["totalAllWithDiscounts"]),
    ...mapActions("AdmissionStore", ["getReceiptNumber"]),

    // removeWarningFunc() {
    //   this.$q.notify({
    //     type: "negative",
    //     color: "negative",
    //     timeout: 3000,
    //     position: "top",
    //     message:
    //       "Please void first any transaction related this billing on the cashier",
    //   });
    //   },
    removeWarningFunc() {
      this.$q.notify({
        type: "negative",
        color: "negative",
        timeout: 3000,
        position: "top",
        message:
          "Please void first any transaction related to this on the cashier",
      });
    },
    calculateTotalFunc() {
      this.showCalculate = true;
      this.callFunc = "update";
    },
    async onSubmit() {
      var fileData = new FormData();
      let subs = [];
      // this.tempDataSubject.map((element, i) => {
      //   subs[i] = element;
      // });
      Object.entries(this.tempDataSubject).map(([key, val]) => {
        // subs.push({
        //   id: val.id,
        //   code: val.code,
        // });
        subs[key] = val.id;
      });
      // console.log(this.tempDataSubject);
      // console.log(subs);
      fileData.append("subjects", subs);
      fileData.append("user_id", this.$route.params.student_id);
      fileData.append("semester_id", this.$route.params.id);
      fileData.append("notes", this.formData.remarks);
      fileData.append("receipt", this.receipt);
      fileData.append("sub_total", this.totalPayables);
      fileData.append("balance", this.balance);

      await api
        .post("/api/admission/", fileData, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addManualBalance() {
      this.BalanceDialog = true;
    },
    removeBillingFunc(billing_id) {
      this.removeBilling(billing_id);
      //   console.log(billing_id);
    },
    removeDiscountFunc(discount_id) {
      this.removeDiscount(discount_id);
    },
    async getStudentDatas() {
      await api
        .get(
          "/api/admission/student/" + this.$route.params.student_id,
          {
            params: {
              semester_id: this.$route.params.id,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          this.walletAmount = parseFloat(response.data.data.amount);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getStudentSubjects() {
      await api(
        "/api/admission/student/" + this.$route.params.student_id + "/subject",
        {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        }
      )
        .then((response) => {
          // console.log(response);
          this.studentSubjects = response.data.data;
          // console.log(this.studentSubjects);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addSchedule(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showAddScheduleDialog = true;
      //   console.log("subject schedule id:" + this.subject_sched_id);
    },
    addTeacher(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showAddTeacherDialog = true;

      //   console.log("subject schedule id:" + this.subject_sched_id);
    },
    editDialog(sub_sched_id) {
      this.subject_sched_id = null;
      this.subject_sched_id = sub_sched_id;
      this.showEditDialog = true;
    },
    preDialog(sub_id) {
      this.showPreDialog = true;
      this.sub_id = null;
      this.sub_id = sub_id;
    },
    onSearchSubmit() {
      var name = this.searchSubject;
      this.onSearch([
        name,
        this.$route.params.student_id,
        this.$route.params.id,
      ]);
    },
    getBillingTotal() {
      this.formData.billingTotal = this.totalBills;
    },
    getSubTotalSubject() {
      this.formData.subjectTotal = this.total;
    },

    getPrevBalance() {
      this.formData.pre_balance = this.balance;
    },

    getTotalPayables() {
      this.formData.totalPay = this.totalPayables;
    },
  },
  computed: {
    ...mapState("AdmissionStore", ["totalBills"]),
    ...mapState("AdmissionStore", ["total"]),
    ...mapState("AdmissionStore", ["balance"]),
    ...mapState("AdmissionStore", ["totalPayables"]),
    ...mapState("AdmissionStore", ["totalUnits"]),
    ...mapState("AdmissionStore", ["tempDataSubject"]),
    ...mapState("AdmissionStore", ["receipt"]),
    ...mapState("AdmissionStore", ["totalDiscount"]),
  },
  watch: {
    // totalBills(oldVal, newVal) {
    //   console.log(`Updating from ${oldVal} to ${newVal}`);
    //   this.formData.billingTotal = newVal;
    // },

    tempDataSubject: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal[0].id} to ${newVal[0].id}`);
        this.formData.totalUnits = newVal;
      },
      deep: true,
    },

    totalUnits: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.totalUnits = newVal;
      },
      deep: true,
    },
    totalPayables: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.totalPay = newVal;
      },
      deep: true,
    },

    balance: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.pre_balance = newVal;
      },
      deep: true,
    },

    totalBills: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.billingTotal = newVal;
      },
      deep: true,
    },

    total: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.subjectTotal = newVal;
      },
      deep: true,
    },
    totalDiscount: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.totalDiscount = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    // this.getStudentDatas();
    // this.getStudentSubjects();
    this.getPrevBalance();
    this.getTotalPayables();
    this.getBalance([this.$route.params.student_id, "edit"]);
    this.totalAllWithDiscounts();

    // this.getAllSchedulesSubject([this.$route.params.student_id, this.$route.params.id]);
  },
  components: {
    addUpdateBalance,
    calculateTotal,
  },
};
</script>

<style></style>
