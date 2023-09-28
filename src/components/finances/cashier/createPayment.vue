<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Payment </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form class="q-pa-md shawdow full-width block" ref="formName" @submit="onSubmit">
        <div class="">
          <q-input
            filled
            v-model="searchStudent"
            label="Search Student"
            name="code"
            class="col-3 full-width"
            type="text"
            @click="searchVisible = true"
            @keyup="searchStudentFunc"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list
            bordered
            separator
            class="full-width absolute bg-grey-10 text-white z-max"
            v-if="searchVisible"
            style="overflow: hidden"
          >
            <q-item
              clickable
              v-ripple
              v-for="item in filterStudent"
              @click="selectStudent(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <!-- <q-item-label caption class="text-white">{{ item.descr }}</q-item-label> -->
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="selectedStudent !== null">
            <q-select
              filled
              :options="['Enrollment Fee', 'Tuition/Monthly Fee']"
              v-model="formData.transaction"
              label="Type of Transaction"
              :class="$q.screen.gt.sm ? 'full-width' : 'full-width q-mb-md'"
              @update:model-value="selectTransaction"
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-select>
            <q-select
              filled
              :options="semesters"
              v-model="formData.semester_id"
              label="Select Semester"
              :class="$q.screen.gt.sm ? 'full-width q-mt-md' : 'full-width q-mb-md'"
              v-if="formData.transaction == 'Enrollment Fee'"
            >
              <template v-slot:prepend>
                <q-icon name="school" />
              </template>
            </q-select>
            <div v-if="formData.transaction == 'Enrollment Fee'">
              <q-select
                filled
                :options="registration"
                v-model="formData.registration"
                label="Select Billing Enrollment/Registration"
                :class="
                  $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-md' : 'full-width q-mb-md'
                "
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
            </div>
            <div
              class="column full-width"
              v-if="formData.transaction == 'Tuition/Monthly Fee'"
            >
              <div class="row">
                <q-input
                  filled
                  label="Tuition Fee"
                  v-model="formData.tuition"
                  readonly
                  name="code"
                  :class="
                    $q.screen.gt.sm ? 'q-mr-md col-6 q-mt-md ' : 'full-width q-mb-md'
                  "
                  type="text"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
                <q-input
                  filled
                  v-model="formData.total_dues"
                  readonly
                  label="Total Dues"
                  :class="$q.screen.gt.sm ? 'col-5 q-mt-md ' : 'full-width q-mb-md'"
                  type="text"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
            </div>

            <div v-if="formData.transaction != null">
              <q-select
                filled
                :options="['Cash', 'Gcash', 'Bank', 'Check', 'Wallet']"
                v-model="formData.mop"
                label="Select Mode of Payment"
                :class="
                  $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-md' : 'full-width q-mb-md'
                "
                @update:model-value="checkWallet"
              >
                <template v-slot:prepend>
                  <q-icon name="payment" />
                </template>
              </q-select>
              <div
                class="column full-width"
                v-if="
                  formData.mop !== 'Cash' &&
                  formData.mop !== 'Wallet' &&
                  formData.mop !== null
                "
              >
                <div class="row">
                  <q-input
                    filled
                    v-model="formData.reference"
                    label="Reference #"
                    name="code"
                    :class="
                      $q.screen.gt.sm ? 'q-mr-md col-6 q-mt-md ' : 'full-width q-mb-md'
                    "
                    type="text"
                  >
                    <template v-slot:prepend>
                      <q-icon name="text_snippet" />
                    </template>
                  </q-input>
                  <q-input
                    filled
                    v-model="formData.proof"
                    label=""
                    :class="$q.screen.gt.sm ? 'col-5 q-mt-md ' : 'full-width q-mb-md'"
                    type="file"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div
                class="column full-width"
                v-if="formData.mop === 'Wallet' && formData.mop !== null"
              >
                <div class="row">
                  <q-input
                    filled
                    v-model="formData.wallet"
                    label="Student Wallet"
                    name="code"
                    readonly
                    :class="
                      $q.screen.gt.sm ? 'q-mr-md col-6 q-mt-md ' : 'full-width q-mb-md'
                    "
                    type="text"
                  >
                    <template v-slot:prepend>
                      <q-icon name="wallet" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row" v-if="formData.transaction == 'Tuition/Monthly Fee'">
                <q-select
                  filled
                  :options="payables"
                  v-if="payables.balance !== 0"
                  v-model="formData.payable"
                  label="Select Payables"
                  :class="
                    $q.screen.gt.sm ? 'q-mr-sm col-7 q-mt-md' : 'full-width q-mb-md'
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="category" />
                  </template>
                </q-select>
                <q-btn
                  unelevated
                  label="Add"
                  v-if="formData.continue == false"
                  :class="$q.screen.gt.sm ? 'text-center q-mt-md' : 'q-mb-md'"
                  color="secondary"
                  size="md"
                  type="button"
                  icon="add"
                  @click="addPayableFunc"
                />
                <q-table
                  :pagination="pagination"
                  class="q-pa-sm full-width"
                  :rows="temp_payables"
                  :columns="columns"
                  row-key="id"
                  separator="cell"
                  :visible-columns="
                    $q.screen.gt.xs
                      ? ['payable', 'balance', 'amount', 'action']
                      : ['payable', 'balance', 'amount', 'action']
                  "
                >
                  <template #body="props">
                    <q-tr :props="props">
                      <q-td key="payable" :props="props">
                        {{ props.row.payable }}
                      </q-td>
                      <q-td key="balance" :props="props">
                        {{ props.row.balance }}
                      </q-td>
                      <q-td key="amount" :props="props">
                        {{ props.row.amount }}
                        <q-popup-edit
                          v-if="formData.continue == false"
                          v-model="props.row.amount"
                          title="Update amount"
                          buttons
                          label-set="Save"
                          label-cancel="Close"
                          v-slot="scope"
                          :validate="
                            InputValidation(
                              props.row.balance,
                              props.row.amount,
                              props.row.id
                            )
                          "
                        >
                          <q-input
                            type="number"
                            v-model="scope.value"
                            dense
                            hint="Amount should not be greater than the balance"
                            :error="errorInput"
                            :error-message="errorInputMessage"
                            autofocus
                            @keyup.enter="scope.set"
                          />
                        </q-popup-edit>
                      </q-td>

                      <q-td key="action" :props="props">
                        <q-btn
                          v-if="formData.continue == false"
                          color="red"
                          icon="delete"
                          size="sm"
                          @click="removePayable(props.row.id)"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <div
                class="column full-width"
                v-if="
                  formData.mop !== null &&
                  (formData.transaction == 'Enrollment Fee' ||
                    formData.transaction == 'Tuition/Monthly Fee')
                "
              >
                <div class="row q-mt-lg align-center" v-if="formData.continue == false">
                  <q-btn
                    unelevated
                    label="Continue"
                    class="text-center"
                    @click="continueFunc"
                    color="secondary"
                    size="md"
                    type="button"
                    icon-right="east"
                  />
                </div>
                <div class="row" v-if="formData.continue == true">
                  <q-input
                    filled
                    v-model="formData.description"
                    label="Description(OR#)"
                    name="code"
                    :class="
                      $q.screen.gt.sm ? 'q-mr-md col-6 q-mt-md ' : 'full-width q-mb-md'
                    "
                    type="text"
                  >
                    <template v-slot:prepend>
                      <q-icon name="description" />
                    </template>
                  </q-input>

                  <q-input
                    filled
                    :readonly="
                      formData.transaction == 'Tuition/Monthly Fee' ? true : false
                    "
                    label="Amount"
                    v-model="formData.amount"
                    :class="$q.screen.gt.sm ? 'col-5 q-mt-md' : 'full-width q-mb-md'"
                    type="number"
                    lazy-rules
                    step="any"
                    mask="#.#"
                    :rules="[
                      (val) => (val !== null && val !== '') || 'Please type amount',
                    ]"
                    @update:model-value="amountFunction"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div
                class="column full-width"
                :style="
                  $q.screen.gt.sm
                    ? 'margin-top: -5px; margin-bottom: 3px'
                    : 'margin-top: -17px; margin-bottom: 7px'
                "
                v-if="
                  formData.mop !== null &&
                  (formData.transaction == 'Enrollment Fee' ||
                    formData.transaction == 'Tuition/Monthly Fee')
                "
              >
                <div class="row" v-if="formData.continue == true">
                  <q-select
                    filled
                    :options="discounts"
                    v-model="formData.discount"
                    label="Choose Discount"
                    :class="$q.screen.gt.sm ? 'q-mr-md col-6' : 'full-width q-mb-md'"
                    @update:model-value="selectDiscount"
                  >
                    <template v-slot:prepend>
                      <q-icon name="discount" />
                    </template>
                  </q-select>

                  <q-input
                    filled
                    v-model="formData.subTotal"
                    label="Sub Total"
                    name="code"
                    :class="$q.screen.gt.sm ? 'col-5 ' : 'full-width q-mb-sm'"
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div
                class="column full-width"
                v-if="formData.mop !== null && formData.continue == true"
              >
                <div class="row">
                  <q-input
                    filled
                    v-model="formData.cash"
                    :readonly="formData.mop === 'Wallet'"
                    label="Cash Entered"
                    :class="$q.screen.gt.sm ? 'q-mr-md col-6' : 'full-width'"
                    type="number"
                    lazy-rules
                    step="any"
                    :rules="[(val) => (val !== null && val !== '') || 'Please type Cash']"
                    @update:model-value="cashEnterFunction"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>

                  <q-input
                    filled
                    v-model="formData.total"
                    label="Total"
                    name="code"
                    :class="$q.screen.gt.sm ? 'q-mr-sm col-5' : 'full-width q-mb-md'"
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                  <q-input
                    filled
                    v-model="formData.change"
                    label="Change"
                    name="code"
                    style="margin-top: -5px; margin-bottom: 3px"
                    :class="$q.screen.gt.sm ? 'q-mr-sm col-6' : 'full-width q-mb-md'"
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="clean_hands" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div class="row q-mt-lg align-center">
              <q-btn
                v-if="formData.continue && formData.transaction == 'Tuition/Monthly Fee'"
                unelevated
                label="Back"
                class="text-center q-mr-sm"
                color="grey"
                size="md"
                type="button"
                @click="backFunc"
                icon="keyboard_backspace"
              />
              <q-btn
                v-if="formData.continue"
                unelevated
                label="Pay"
                class="text-center"
                color="secondary"
                size="md"
                type="submit"
                icon="paid"
              />
            </div>
          </div>
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
import store from "src/store/finances/cashier/store";
import DiscountList from "../discounts/discountList.vue";
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
    name: "payable",
    label: "Payable",
    field: "payable",
    align: "left",
    sortable: true,
  },
  {
    name: "balance",
    label: "Balance",
    field: "balance",
    align: "left",
    sortable: true,
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
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
  emits: ["hideCreateDialog"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      newToken: LocalStorage.getItem("jwt"),
      category: null,
      transaction: [],
      continue: false,
      formData: {
        student_id: null,
        mop: null,
        amount: null,
        transaction: null,
        discount: null,
        discount_id: null,
        total_discount: null,
        subTotal: null,
        total: null,
        cash: null,
        change: null,
        reference: null,
        proof: null,
        description: null,
        semester_id: null,
        registration: null,
        payable: [],
        continue: false,
        total_dues: null,
        tuition: null,
        wallet: null,
      },
      payables: [],
      temp_payables: [],
      allStudents: [],
      searchVisible: false,
      searchStudent: null,
      filterStudent: [],
      selectedStudent: null,
      a: 0,
      discounts: [
        // {
        //   value: 0,
        //   label: "No Discount",
        // },
      ],
      registration: [],
      semesters: [],
      errorInputMessage: null,
      errorInput: false,
    };
  },
  methods: {
    ...mapActions("PaymentStore", ["getAllPayments"]),
    ...mapActions("PaymentStore", ["addPayable"]),
    async checkWallet() {
      // this.formData.continue = false;
      this.formData.description = null;
      this.formData.cash = 0;
      this.formData.change = 0;
      // this.formData.mop = 0;
      // this.formData.semester_id = 0;
      // this.formData.registration = 0;
      this.formData.amount = 0;
      this.formData.subTotal = 0;
      this.formData.total = 0;
      if (this.formData.transaction == "Tuition/Monthly Fee") {
        this.formData.continue = false;
      }
      if (this.formData.mop === "Wallet") {
        await api
          .get("/api/get/wallet/" + this.formData.student_id, {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          })
          .then((response) => {
            // console.log(response);
            this.formData.wallet = response.data.data.amount
              ? response.data.data.amount
              : 0;

            // if (this.formData.mop === "Wallet") {
            this.formData.cash = this.formData.wallet;
            // this.formData.change = this.formData.wallet - this.formData.total;
            // }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.formData.wallet = null;
      }
    },
    removePayable(id) {
      const i = this.temp_payables.findIndex((element) => element.id === id);
      if (i > -1) {
        this.temp_payables.splice(i, 1);
        this.$q.notify({
          type: "positive",
          color: "positive",
          icon: "delete",
          timeout: 3000,
          position: "top",
          message: "Item removed",
        });
      }
    },
    backFunc() {
      this.formData.continue = false;
      this.formData.amount = 0;
      this.formData.subTotal = 0;
      this.formData.total = 0;
    },
    continueFunc() {
      // console.log(this.temp_payables);
      this.formData.cash = null;
      this.formData.discount = null;
      if (this.temp_payables.length > 0) {
        this.formData.continue = true;
        this.temp_payables.forEach((element) => {
          this.formData.amount =
            parseFloat(this.formData.amount) + parseFloat(element.amount);
          this.formData.subTotal =
            parseFloat(this.formData.subTotal) + parseFloat(element.amount);
          this.formData.total =
            parseFloat(this.formData.total) + parseFloat(element.amount);
        });
        if (this.formData.mop === "Wallet") {
          this.formData.cash = this.formData.wallet;
          this.formData.change = this.formData.wallet - this.formData.total;
        }
      } else {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Please add payables to continue",
        });
        this.formData.continue = false;
      }
    },
    InputValidation(balance, val, id) {
      // console.log("Amount: " + val);
      const i = this.temp_payables.filter((element) => element.id === id);

      if (parseFloat(val) > parseFloat(balance)) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Amount should not be greater than balance!",
        });

        i[0].amount = balance;
      }

      // this.formData.amount = this.formData.amount + i[0].amount;
    },
    addPayableFunc() {
      if (this.formData.payable.value != null) {
        const i = this.temp_payables.findIndex(
          (element) => element.id === this.formData.payable.value
        );
        if (i > -1) {
          this.$q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: "Already Added on the list!",
          });
        } else {
          // this.addPayable(this.formData.payable);
          this.temp_payables.push({
            id: this.formData.payable.value,
            payable: this.formData.payable.name,
            balance: this.formData.payable.balance,
            amount: this.formData.payable.balance,
          });
          this.formData.payable = null;
        }
      } else {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Please select payables",
        });
      }
    },
    async selectTransaction() {
      this.formData.continue = false;
      this.formData.description = null;
      this.formData.cash = 0;
      this.formData.change = 0;
      this.formData.mop = null;
      this.formData.semester_id = null;
      this.formData.registration = null;
      this.formData.amount = 0;
      this.formData.subTotal = 0;
      this.formData.total = 0;
      if (this.formData.transaction == "Tuition/Monthly Fee") {
        this.formData.continue = false;
        await api
          .get("/api/get/admission/" + this.formData.student_id, {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          })
          .then((response) => {
            // console.log(response);
            if (response.data.admission == null) {
              this.$q.notify({
                type: "negative",
                message: "Not yet enrolled!",
                icon: "error",
                position: "top",
              });
              this.formData.transaction = null;
            } else {
              Object.entries(response.data.payables).map(([key, val]) => {
                this.payables.push({
                  label:
                    val.code != null
                      ? val.code + "(P" + val.balance + ")"
                      : val.name + "(P" + val.balance + ")",
                  value: val.id,
                  balance: val.balance,
                  total: val.total,
                  name: val.code != null ? val.code : val.name,
                });
              });
              this.formData.tuition = parseFloat(response.data.due.tuition).toFixed(2);
              this.formData.total_dues = parseFloat(
                response.data.due.total_payable
              ).toFixed(2);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.formData.continue = true;
      }
    },
    amountFunction() {
      if (this.formData.mop === "Wallet") {
        this.formData.subTotal = this.formData.amount;
        this.formData.total = this.formData.amount;
        this.formData.discount = null;
        // this.formData.cash =  this.formData.total;
        this.formData.change = this.formData.cash - this.formData.total;
      } else {
        this.formData.subTotal = this.formData.amount;
        this.formData.total = this.formData.amount;
        this.formData.discount = null;
        this.formData.cash = null;
        this.formData.change = null;
      }
    },
    cashEnterFunction() {
      this.formData.change = this.formData.cash - this.formData.total;
    },
    selectDiscount() {
      if (this.formData.amount == null || this.formData.mop == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Amount or Select Mode of Payment",
          icon: "error",
        });
        this.formData.discount = null;
      } else if (this.formData.mop == "Wallet") {
        if (this.formData.discount.type == "Percentage") {
          this.formData.total =
            this.formData.amount -
            (this.formData.discount.number / 100) * this.formData.amount;
          this.formData.discount_id = this.formData.discount.value;
          this.formData.total_discount =
            (this.formData.discount.number / 100) * this.formData.amount;
          // this.formData.cash = null;
          this.formData.change = this.formData.cash - this.formData.total;
        } else if (this.formData.discount.type == "Amount") {
          this.formData.total = this.formData.amount - this.formData.discount.number;
          this.formData.total_discount = this.formData.discount.number;
          this.formData.discount_id = this.formData.discount.value;

          // this.formData.cash = null;
          this.formData.change = this.formData.cash - this.formData.total;
        } else {
          this.formData.total = this.formData.amount;
          this.formData.discount_id = this.formData.discount.value;
        }
      } else {
        if (this.formData.discount.type == "Percentage") {
          this.formData.total =
            this.formData.amount -
            (this.formData.discount.number / 100) * this.formData.amount;
          this.formData.discount_id = this.formData.discount.value;
          this.formData.total_discount =
            (this.formData.discount.number / 100) * this.formData.amount;
          this.formData.cash = null;
          this.formData.change = null;
        } else if (this.formData.discount.type == "Amount") {
          this.formData.total = this.formData.amount - this.formData.discount.number;
          this.formData.total_discount = this.formData.discount.number;
          this.formData.discount_id = this.formData.discount.value;

          this.formData.cash = null;
          this.formData.change = null;
        } else {
          this.formData.total = this.formData.amount;
          this.formData.discount_id = this.formData.discount.value;
        }
      }

      //   console.log(this.formData.discount.type);
    },
    async getBillingRegistration() {
      await api
        .get("/api/billing/registration", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            if (val.acad_id != null) {
              this.registration.push({
                label: val.name + "(" + val.amount + ")",
                value: val.id,
              });
            }
            // console.log(this.discounts);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getDiscounts() {
      await api
        .get("/api/discounts", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.discounts.push({
              label:
                val.type == "Percentage"
                  ? val.description + " " + val.number + "%"
                  : val.description + " P" + val.number,
              value: val.id,
              type: val.type,
              number: val.number,
            });
            // console.log(this.discounts);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSemesters() {
      await api
        .get("/api/settings/semesters/active", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.semesters).map(([key, val]) => {
            this.semesters.push({
              label: val.title,
              value: val.id,
            });
            // console.log(this.discounts);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectStudent(student) {
      // console.log(subject);
      // this.searchSubject = null;
      this.selectedStudent = null;
      this.searchStudent = student.name;
      this.selectedStudent = student.id;
      this.formData.student_id = student.id;
      this.searchVisible = false;
      this.formData.transaction = null;

      // console.log(this.formData.subject_id);
    },
    async getStudents() {
      await api
        .get("/api/student/", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response.data.subjects);
          this.allStudents = response.data.users;

          // console.log(this.allStudents);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      console.log(this.formData.cash);
      console.log(this.formData.total);
      if (parseFloat(this.formData.cash) < parseFloat(this.formData.total)) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Insuficient Amount, Please try again",
        });
      } else if (
        parseFloat(this.formData.total) > parseFloat(this.formData.wallet) &&
        this.formData.mop == "Wallet"
      ) {
        this.$q.notify({
          type: "negative",
          color: "negative",
          timeout: 3000,
          position: "top",
          message: "Insuficient Amount, Please use other payment method!",
        });
      } else {
        this.$q.loading.show();
        let formData = new FormData();
        let bills = [];
        let bills_array = [];
        Object.entries(this.temp_payables).map(([key, val]) => {
          bills[key] = val;
          // bills[key] = Object.values(val);
        });

        // console.log(formData.semester_id.value)

        // for (let i = 0; i < bills.length; i++) {
        //   bills_array[bills[i]["id"]] = bills[i];
        // }

        // console.log(bills_array);

        formData.append("billings", JSON.stringify(bills));
        formData.append("user_id", this.formData.student_id);
        formData.append(
          "discount_id",
          this.formData.discount_id != null ? this.formData.discount.value : []
        );
        formData.append("sub_total", this.formData.subTotal);
        formData.append(
          "discount_total",
          this.formData.discount_id != null ? this.formData.total_discount : 0
        );
        formData.append("total", this.formData.total);
        formData.append("amount", this.formData.amount);
        formData.append("entered_amount", this.formData.cash);
        formData.append("change", this.formData.change);
        formData.append("type_of_payment", this.formData.mop);
        formData.append("type_of_transaction", this.formData.transaction);
        formData.append("ref_id", this.formData.reference);
        formData.append(
          "semester_id",
          this.formData.semester_id != null &&
            this.formData.transaction == "Enrollment Fee"
            ? this.formData.semester_id.value
            : null
        );
        formData.append(
          "proof",
          this.formData.proof != null ? this.formData.proof[0] : null
        );
        formData.append("remark", this.formData.description);
        formData.append(
          "billing_id",
          this.formData.registration != null &&
            this.formData.transaction == "Enrollment Fee"
            ? this.formData.registration.value
            : null
        );
        // for (var pair of formData.entries()) {
        //   console.log(pair[0] + " - " + pair[1]);
        // }
        await api
          .post("/api/cashier", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + this.newToken,
            },
          })
          .then((response) => {
            console.log(response);
            // console.log(JSON.stringify(response.data).split(","));
            //     let a = [];
            //     for (let i = 0; i < response.data.split(','); i++) {
            //   a[i] = bills[i];
            // }
            // console.log(Array.from(response.data.proof_image));
            if (response.data.status === 200) {
              setTimeout(() => {
                this.$q.loading.hide();
                this.$q.notify({
                  type: "positive",
                  color: "positive",
                  timeout: 1000,
                  position: "bottom",
                  message: response.data.message,
                });
                this.getAllPayments();
                this.$emit("hideCreateDialog");
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
                });
                this.getAllPayments();
                this.$emit("hideCreateDialog");
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    searchStudentFunc() {
      // console.log("work!!");
      this.searchVisible = true;
      const query = this.searchStudent != null ? this.searchStudent.toLowerCase() : "";
      if (this.searchStudent == "" || this.searchStudent == null) {
        this.filterStudent = this.allStudents;
      } else {
        this.filterStudent = this.allStudents.filter((student) => {
          return Object.values(student).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
      // console.log(this.filterStudent);
    },
  },
  computed: {
    filteredSearch() {
      // console.log("work!!!");

      const query = this.searchStudent != null ? this.searchStudent.toLowerCase() : "";
      if (this.searchStudent == "" || this.searchStudent == null) {
        return this.allStudents;
      } else {
        // console.log("test");
        // this.searchVisible = true;
        return this.allStudents.filter((student) => {
          return Object.values(student).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
  },
  mounted() {
    this.getStudents();
    this.getDiscounts();
    this.getSemesters();
    this.getBillingRegistration();
  },
};
</script>
