<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Payment </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <table cellpadding="0" style="font-size: 16px">
        <tbody>
          <tr class="">
            <td class="">
              <img
                src="http://localhost:9000/images/logo.png"
                spinner-color="white"
                style="width: 200px"
              />
              <!-- </q-img> -->
            </td>
            <td style="text-align: center">
              <p>
                {{ school.name }}
                {{ school.address }}
                {{ school.barangay }} {{ school.city }} {{ school.province }},
                {{ school.country }} {{ school.zipcode }} {{ school.phone }} /
                {{ school.mobile }}
              </p>
            </td>
            <td class="text-center">
              <table class="" style="border-collapse: collapse">
                <tbody class="block md:table-row-group">
                  <tr class="border-2 border-black-900 block table-row">
                    <td
                      style="border: solid 1px #000"
                      v
                      class="border-2 border-black-900p-2 text-left block table-cell text-center"
                    >
                      <span>Student ID</span><br />
                      <span class="text-center text-sm block mt-4">
                        {{ student_id != null ? student_id : "####" }}
                      </span>
                    </td>
                    <td
                      class="p-2 border-2 border-grey-900 text-left block table-cell text-center"
                      style="border: solid 1px black"
                    >
                      <span>Student Name</span><br />
                      <span class="text-center text-sm block mt-4">
                        {{ student_name ? student_name : "GUEST" }}
                      </span>
                    </td>
                  </tr>
                  <tr
                    class="border-2 border-black-900 block table-row"
                    style="background: #fff"
                  >
                    <td
                      class="p-2 border-2 border-black-900 text-left block table-cell text-center"
                      style="border: solid 1px black"
                    >
                      <span>Reference #</span><br />
                      <span class="text-center text-sm block mt-4">
                        {{ transactionsId }}
                      </span>
                    </td>
                    <td
                      class="p-2 border-2 border-black-900 text-left block table-cell text-center"
                      style="border: solid 1px black"
                    >
                      <span>Date</span><br />
                      <span class="text-center text-sm block mt-4">
                        {{
                          moment(created_at).format("MMMM Do YYYY, h:mm:ss a")
                        }}
                        {{}}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        style="margin-bottom: 20px; border-collapse: collapse; font-size: 16px"
      >
        <tr>
          <td>&nbsp;</td>
        </tr>
        <tr style="background: #fff">
          <td></td>
          <td colspan="2">
            <!-- <p>{{ $student->name }} <br>
                {{ $student->address }}
                {{ $student->city }} {{ $student->province }}, {{ $student->country }} {{ $student->zipcode }} <br>
                {{ $student->number }}</p> -->
          </td>
        </tr>
        <tr></tr>
      </table>
      <table
        style="
          border: 1px solid #000;
          width: 100%;
          border-collapse: collapse;
          font-size: 16px;
        "
        cellpadding="0"
      >
        <thead>
          <tr>
            <th style="border: 1px solid #000">Ref #</th>
            <th style="border: 1px solid #000">Description of Transaction</th>
            <th style="border: 1px solid #000">Amount</th>
            <th style="border: 1px solid #000">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; text-align: center">
              <span
                style="display: block; visibility: visible; margin-top: 5px"
              >
                {{ trans_id }} test
              </span>
              <span style="display: block; margin-bottom: 100px"></span>
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Sub-Total</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Discount</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Total</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Cash Entered</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Change</span
              >
            </td>
            <td style="border: 1px solid #000; text-align: left">
              <span style="display: block; margin-top: 5px">
                {{ description }}
              </span>
              <span style="display: block; margin-bottom: 100px"></span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
                >Sub-Total</span
              >
              <span
                style="display: block; visibility: visible; font-weight: bold"
                >Discount</span
              >
              <span
                style="display: block; visibility: visible; font-weight: bold"
                >Total</span
              >
              <span
                style="display: block; visibility: visible; font-weight: bold"
                >Cash Entered</span
              >
              <span
                style="display: block; visibility: visible; font-weight: bold"
                >Change</span
              >
            </td>
            <td style="border: 1px solid #000; text-align: right">
              <span style="display: block; margin-top: 5px">
                {{ parseFloat(amount).toFixed(2) }}
              </span>
              <span style="display: block; margin-bottom: 100px"></span>
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Sub-Total</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Discount</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Total</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Cash Entered</span
              >
              <span
                style="display: block; visibility: hidden; font-weight: bold"
                >Change</span
              >
            </td>
            <td style="border: 1px solid #000; text-align: right">
              <span style="display: block; margin-top: 5px">
                {{ parseFloat(sub_total).toFixed(2) }}
              </span>
              <span style="display: block; margin-bottom: 100px"></span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
              >
                {{ parseFloat(sub_total).toFixed(2) }}
              </span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
              >
                {{ discount != null ? parseFloat(discount).toFixed(2) : 0 }}
              </span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
              >
                {{ parseFloat(total).toFixed(2) }}
              </span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
              >
                {{ parseFloat(cash).toFixed(2) }}
              </span>
              <span
                style="display: block; visibility: visible; font-weight: bold"
              >
                {{ parseFloat(change).toFixed(2) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <q-btn
        color="blue"
        style="margin-top: 5px"
        icon="print"
        size="sm"
        :to="'/print/receipt/' + transactionsId"
      />
      <table style="width: 100%; margin-top: 50px; font-size: 16px">
        <tr>
          <th>
            <!-- <q-btn
              color="purple"
              icon="print"
              size="sm"
              :to="'/print/receipt/' + transactionsId"
            /> -->
            <!-- <span>_________________________</span><br />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;Cashier</span> -->
          </th>
        </tr>
        <tr>
          <td>
            "This is not an official receipt-for your official receipt please
            visit the authorize person from finance."
          </td>
        </tr>
      </table>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";
import moment from "moment";

// import store from "src/store/subjects/schedule/store";
import createDialog from "src/components/finances/cashier/createPayment.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default defineComponent({
  props: ["transactionsId"],
  setup() {
    return {
      moment,
    };
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
      school: {
        name: null,
        address: null,
        barangay: null,
        city: null,
        province: null,
        country: null,
        zipcode: null,
        phone: null,
        mobile: null,
        logo: null,
      },
      student_name: null,
      student_id: null,
      created_at: null,
      description: null,
      sub_total: null,
      amount: null,
      discount: null,
      total: null,
      cash: null,
      change: null,
      trans_id: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("PaymentStore", ["getAllPayments"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    async paymentDetails() {
      //   console.log(this.transactionsId);
      await api
        .get("/api/view-reciept/" + this.transactionsId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          this.school.name = response.data.school_info.name;
          this.school.address = response.data.school_info.address;
          this.school.barangay = response.data.school_info.barangay;
          this.school.city = response.data.school_info.city;
          this.school.province = response.data.school_info.province;
          this.school.country = response.data.school_info.country;
          this.school.phone = response.data.school_info.phone_number;
          this.school.mobile = response.data.school_info.cp_number;
          this.school.city = response.data.school_info.city;
          this.school.logo = response.data.logo;

          this.student_name = response.data.data.name;
          this.student_id =
            response.data.data.user_id != null
              ? response.data.data.user_id
              : "";
          this.created_at = response.data.data.created_at;
          this.description =
            response.data.data.remark +
            "(" +
            response.data.data.type_of_transaction +
            ")";
          this.sub_total = response.data.data.sub_total;
          this.amount = response.data.data.amount;
          this.total = response.data.data.total;
          this.cash = response.data.data.entered_amount;
          this.discount = response.data.data.discount_total;
          this.change = response.data.data.change;
          this.trans_id = response.data.data.transaction_id;

          //   if (response.data.status === 200) {
          //     setTimeout(() => {
          //       this.$q.loading.hide();
          //       this.$q.notify({
          //         type: "positive",
          //         color: "positive",
          //         timeout: 1000,
          //         position: "bottom",
          //         message: response.data.message,
          //       });
          //       this.getAllBilling();
          //       this.$emit("hideCreateDialog");
          //     }, 2000);
          //   }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    print() {
      window.html2canvas = html2canvas;
      var doc = new jsPDF("l", "pt", "a5");
      doc.html(document.querySelector("#q-app"), {
        callback: function (pdf) {
          pdf.setDrawColor("black");
          //   pdf.setLineWidth(1);
          //   pdf.line();
          pdf.save("mypdf.pdf");
        },
      });
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    // this.getUserDetails();
    // this.getAllPayments();
    // this.print();
    this.paymentDetails();
  },
  components: {
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
