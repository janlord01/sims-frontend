<template>
  <q-card style="max-width: 700px; width: 700px" class="z-top">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Total Payables </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-table
      :pagination="pagination"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="[0]"
      row-key="name"
      class="caltable"
    />
    <q-card-section style="margin-top: -50px">
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <!-- <q-input
            filled
            v-model="formData.pre_balance"
            label="Previous Balance"
            name="Password"
            class="q-mr-sm col-5 q-mt-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
           -->
          <q-input
            filled
            v-model="formData.totalUnits"
            label="Total Units"
            name="Password"
            class="q-mr-sm col-5"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="tag" />
            </template>
          </q-input>
          <!-- <q-input
            filled
            v-model="formData.subjectTotal"
            label="Total Subject Payables"
            name="Password"
            class="q-mr-sm col-5 q-mt-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.billingTotal"
            label="Total Billings"
            name="Password"
            class="q-mr-sm col-5 q-mt-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.totalPay"
            label="Sub-Total"
            name="Password"
            class="q-mr-sm col-5 q-mt-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.billingTotal"
            label="Total Discount"
            name="Password"
            class="q-mr-sm col-5 q-mt-md"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input> -->

          <q-input
            filled
            v-model="formData.remarks"
            label="Remarks/Notes"
            name="Password"
            class="q-mr-sm col-10 q-mt-md"
            type="textarea"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Proceed to admission"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
          <q-btn
            unelevated
            label="Add more item"
            class="text-center q-ml-sm"
            color="primary"
            size="md"
            type="button"
            @click="closeFunc"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
const columns = [
  {
    name: "description",
    required: true,
    label: "Description",
    align: "left",
    field: "description",
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "charges", align: "center", label: "Charges", field: "charges" },
  { name: "credit", label: "Credit", field: "credit" },
  { name: "balance", label: "Balance", field: "balance" },
];

const pagination = {
  sortBy: "code",
  rowsPerPage: 10,
};

const cal = {
  name: "calculate",
  emits: ["hideCalculateDialog"],
  props: ["userId", "callFunc"],
  setup() {
    return {
      columns,
      pagination,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        billingTotal: 0,
        subjectTotal: 0,
        pre_balance: 0,
        totalPay: 0,
        totalUnits: 0,
        remarks: null,
        initialPayment: 0,
        oldDiscount: 0,
        receipt: 0,
      },
      rows: [
        {
          description: "Initial Payment",
          charges: "",
          credit: "",
          balance: "",
        },
        {
          description: "Previous Balance",
          charges: "",
          credit: "",
          balance: "",
        },

        {
          description: "Total Subjects Payable",
          charges: "",
          credit: "",
          balance: "",
        },
        {
          description: "Total Billings Payable",
          charges: "",
          credit: "",
          balance: "",
        },
        {
          description: "Sub-Total",
          charges: "",
          credit: "",
          balance: "",
        },
        {
          description: "Total Discount",
          charges: "",
          credit: "",
          balance: "",
        },
        {
          description: "Total",
          charges: "",
          credit: "",
          balance: "",
        },
      ],
      //   passwordSent: true,
      isPwd: true,
      isPwdCom: true,
    };
  },
  methods: {
    closeFunc() {
      this.$emit("hideCalculateDialog");
    },
    checkBillingReceipt() {
      var fileData = new FormData();
      let bills = [];

      Object.entries(this.tempDataBilling).map(([key, val]) => {
        bills[key] = val.id;
      });
      fileData.append("billings", bills);
      // console.log(bills);
      api
        .get(
          "/api/admission/student/check/billing/" + this.receipt,
          {
            params: {
              billings: bills,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          if (response.data.status !== 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "top",
                message: response.data.message,
                class: "z-max",
              });
              this.$emit("hideCalculateDialog");
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onLoadAllData() {
      this.totalAllWithDiscounts(this.callFunc);
      this.formData.totalUnits = this.totalUnits;
      this.formData.totalPay = this.totalPayables;
      this.formData.billingTotal = this.totalBills;
      this.formData.pre_balance = this.balance;
      this.formData.subjectTotal = this.total;

      this.rows[0].credit = "P" + this.initialPayment;
      this.rows[1].charges = "P" + this.balance;
      this.rows[2].charges = "P" + this.total;
      this.rows[3].charges = "P" + this.totalBills;
      this.rows[4].balance = "P" + this.totalPayables;
      this.rows[5].credit = "P" + this.totalDiscount;
      this.rows[6].balance = "P" + this.TotalAllSubBillDisc;

      // console.log(this.oldDiscount);
    },
    async onSubmit() {
      this.$q.loading.show();

      var fileData = new FormData();
      let subs = [];
      let bills = [];
      let dis = [];
      let disTotal = [];
      let disNum = [];
      Object.entries(this.tempDataSubject).map(([key, val]) => {
        subs[key] = val.id;
      });

      Object.entries(this.tempDataBilling).map(([key, val]) => {
        bills[key] = val.id;
      });

      Object.entries(this.tempDataDiscount).map(([key, val]) => {
        dis[key] = val.id;
        // disTotal[key] = val.total;
        // disNum[key] = val.number;
      });

      // console.log(this.tempDataSubject);
      //   console.log(subs);
      fileData.append("subjects", subs);
      fileData.append("billings", bills);
      fileData.append("discounts", dis);
      //   fileData.append("discountTotals", disTotal);
      //   fileData.append("discountNumbers", disNum);
      fileData.append("user_id", this.$route.params.student_id);
      fileData.append("semester_id", this.$route.params.id);
      fileData.append("notes", this.formData.remarks);
      fileData.append("receipt", this.receipt);
      fileData.append("sub_total", this.TotalAllSubBillDisc);
      fileData.append("totalPayables", this.totalPayables);
      fileData.append("balance", this.balance);
      fileData.append("initial_payment", this.initialPayment);
      fileData.append("totalDiscount", this.totalDiscount);
      fileData.append("callFunc", this.callFunc);
      fileData.append("admission_id", this.$route.params.admission_id);
      fileData.append("oldDiscount", this.oldDiscount);

      await api
        .post("/api/admission", fileData, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
                class: "z-max",
              });
              this.emptyAll();
              this.$emit("hideCalculateDialog");
              this.$router.back();
            }, 2000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
                class: "z-max",
              });
              this.$emit("hideCalculateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
    ...mapActions("AdmissionStore", ["totalAllWithDiscounts"]),
    ...mapActions("AdmissionStore", ["emptyAll"]),
    containsDuplicate(nums) {
      let a = 0;
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          console.log(nums[i] + " " + nums[j]);
          if (nums[i] == nums[j]) {
            return true;
            a++;
          }
        }
      }
      return false;
      // if (a == 0) {
      //   return false;
      // }
    },
    duplicate(str) {
      let string = str.toUpperCase();
      let obj = {};
      let final = "";

      for (let i = 0; i < string.length; i++) {
        if (obj[string[i]]) {
          obj[string[i]] += 1;
        } else {
          obj[string[i]] = 1;
        }
      }

      Object.entries(obj).map(([item, val]) => {
        // console.log(item);
        if (val == 1) {
          final += item;
        } else {
          final += val + item;
        }
      });

      console.log(final);
      // return final;
    },
    isAnagram(s, t) {
      let a = s.split("").sort().join("").toLowerCase();
      let b = t.split("").sort().join("").toLowerCase();
      if (a === b) {
        console.log("true");

        return true;
      } else {
        console.log("false");

        return false;
      }
    },
    twoSum(nums, target) {
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          if (nums[i] + nums[j] === target) {
            console.log([i, j]);
            console.log(target);
          }
        }
      }
    },
    groupAnagrams(strs) {
      const obj = {};
      // for (let i = 0; i < strs.length; i++) {
      //   obj[strs[i]] = strs[i].split("").sort().join("");
      // }
      strs.forEach((item, val) => {
        // for (let i = 0; i < strs.length; i++) {
        let s = item.split("").sort().join("");

        if (obj[s]) {
          obj[s].push(item);
        } else {
          obj[s] = [item];
        }
      });
      console.log(Object.values(obj));

      // });
    },
  },
  computed: {
    ...mapState("AdmissionStore", ["totalBills"]),
    ...mapState("AdmissionStore", ["total"]),
    ...mapState("AdmissionStore", ["balance"]),
    ...mapState("AdmissionStore", ["totalPayables"]),
    ...mapState("AdmissionStore", ["totalUnits"]),
    ...mapState("AdmissionStore", ["tempDataSubject"]),
    ...mapState("AdmissionStore", ["tempDataBilling"]),
    ...mapState("AdmissionStore", ["tempDataDiscount"]),
    ...mapState("AdmissionStore", ["receipt"]),
    ...mapState("AdmissionStore", ["initialPayment"]),
    ...mapState("AdmissionStore", ["totalDiscount"]),
    ...mapState("AdmissionStore", ["TotalAllSubBillDisc", "oldDiscount"]),
    // ...mapState("AdmissionStore", [""]),
  },
  watch: {
    receipt(oldVal, newVal) {
      // console.log(`Updating from ${oldVal} to ${newVal}`);
      this.formData.receipt = newVal;
    },

    tempDataSubject: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal[0].id} to ${newVal[0].id}`);
        this.formData.totalUnits = newVal;
      },
      deep: true,
    },
    initialPayment: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal[0].id} to ${newVal[0].id}`);
        this.formData.initialPayment = newVal;
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
    oldDiscount: {
      handler: function (newVal, oldVal) {
        // console.log(`Updating from ${oldVal} to ${newVal}`);
        this.formData.oldDiscount = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    this.onLoadAllData();
    this.checkBillingReceipt();
    // this.containsDuplicate([2, 14, 18, 22, 22]);
    // this.twoSum([1, 2, 4, 9], 6);
    // this.duplicate("AABCCC");
    // this.isAnagram("rat", "car");
    // this.groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
  },
};

export default cal;
</script>
<style scoped>
table.q-table tbody tr:nth-child(4) {
  background: rgb(93, 58, 58) !important;
}
</style>
