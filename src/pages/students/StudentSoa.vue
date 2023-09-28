<template>
  <q-page style="margin-right: 10px">
    <table style="font-size: 8px; width: 40%; margin-left: 10%">
      <tbody>
        <tr class="">
          <td class="text-align:left;width: 100px;">
            <img :src="school.logo" width="100" />
          </td>

          <td style="text-align: center; width: 300px">
            {{ school.name }} <br />
            {{ school.address }} <br />
            {{ school.barangay }} {{ school.city }} {{ school.province }},
            <br />
            {{ school.country }} {{ school.zipcode }} {{ school.phone }} /<br />
            {{ school.mobile }}
          </td>
          <td class="text-center; width: 30%">
            <table class="" style="border-collapse: collapse">
              <tbody class="block md:table-row-group">
                <tr class="">
                  <td style="border: solid 1px #000">
                    <span>LRN</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{
                        student.student_id != null ? student.student_id : "####"
                      }}
                    </span>
                  </td>
                  <td style="border: solid 1px black">
                    <span>Student Name</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ student.name ? student.name : "GUEST" }}
                    </span>
                  </td>
                </tr>
                <tr class="" style="background: #fff">
                  <td style="border: solid 1px black">
                    <span>Academic Year #</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ student.acadYear }}
                    </span>
                  </td>
                  <td style="border: solid 1px black">
                    <span>Semester</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ student.semester }}
                    </span>
                  </td>
                </tr>
                <tr class="" style="background: #fff">
                  <td style="border: solid 1px black">
                    <span>Year Level</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ student.level }}
                    </span>
                  </td>
                  <td style="border: solid 1px black">
                    <span>Course</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ student.course }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table style="margin-bottom: 20px; font-size: 6px">
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
        width: 50%;
        border-collapse: collapse;
        font-size: 8px;
        margin-left: 4%;
      "
    >
      <thead>
        <tr>
          <th style="border: 1px solid #000">Date</th>
          <th style="border: 1px solid #000">Ref #</th>
          <th style="border: 1px solid #000">Description of Transaction</th>
          <th style="border: 1px solid #000">Charges</th>
          <th style="border: 1px solid #000">Credit</th>
          <th style="border: 1px solid #000">Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in payables">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              {{ item.ref }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ parseFloat(item.charges).toFixed(2) }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }}
            </span>
          </td>
        </tr>
        <div style="margin-top: 20px"></div>
        <tr v-for="item in balance">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              <!-- {{ item.ref }} -->
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              <!-- {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }} -->
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              <!-- {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }} -->
            </span>
          </td>
        </tr>
        <div style="margin-top: 20px"></div>

        <!-- <tr v-for="item in enrollment">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              {{ item.ref }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }}
            </span>
          </td>
        </tr> -->

        <tr v-for="item in paymentTransactions">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              {{ item.ref }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }}
            </span>
          </td>
        </tr>

        <div style="margin-top: 20px"></div>
        <tr v-for="item in due" style="">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              {{ item.ref }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; font-weight: bolder; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }}
            </span>
          </td>
        </tr>
        <div style="margin-top: 20px"></div>
        <tr v-if="discounts.length > 1">
          <td style="text-align: center">
            <span style="display: block">
              <!-- {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }} -->
              <hr />
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              <!-- {{ item.ref }} -->
              <hr />
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              <!-- {{ item.description }} -->
              ***********************SCHOOLARSHIP /
              SUBSIDY***********************
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              <!-- {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }} -->
              <hr />
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              <!-- {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }} -->
              <hr />
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              <hr />
              <!-- {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }} -->
            </span>
          </td>
        </tr>

        <div style="margin-top: 20px"></div>
        <tr v-for="item in discounts" v-if="discounts.length > 1">
          <td style="text-align: center">
            <span style="display: block">
              {{
                item.date != null
                  ? moment(item.date).format("MMMM D, YYYY")
                  : ""
              }}
            </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              {{ item.ref }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: left">
              {{ item.description }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }}
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }}
            </span>
          </td>
        </tr>
        <tr v-if="discounts.length > 1">
          <td style="text-align: center">
            <span style="display: block"> </span>
          </td>
          <td style="text-align: left">
            <span style="display: block; text-align: center">
              <!-- {{ item.ref }} -->
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; color: red; text-align: left">
              <!-- {{ item.description }} -->
              Please Note: Schoolarship/Subsidy will be added to student
              credits/wallet, he/she can use it for payment transactions
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              <!-- {{ item.charges ? parseFloat(item.charges).toFixed(2) : "" }} -->
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: right">
              <!-- {{ item.credit ? parseFloat(item.credit).toFixed(2) : "" }} -->
            </span>
          </td>
          <td style="text-align: right">
            <span style="display: block; text-align: center">
              <!-- {{ item.balance ? parseFloat(item.balance).toFixed(2) : "" }} -->
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <table style="width: 50%; margin-top: 20px; font-size: 8px; margin-left: 4%">
      <tr>
        <th></th>
        <th>
          <span>_________________________</span><br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;Cashier</span>
        </th>
      </tr>
      <tr>
        <td style="color: red; font-weight: bold">
          "This is not an official receipt-for your official receipt please visit the
          authorize person from finance."
        </td>
      </tr>
    </table> -->

    <!-- @endforeach
@endforeach -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";

// import store from "src/store/subjects/schedule/store";
import paymentList from "src/components/finances/cashier/payList.vue";
import createDialog from "src/components/finances/cashier/createPayment.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";

export default defineComponent({
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
      student: {
        name: null,
        student_id: null,
        semester: null,
        acadYear: null,
        level: null,
        course: null,
      },
      payables: [],
      enrollment: [],
      due: [],
      discounts: [],
      balance: [],
      paymentTransactions: [],
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("PaymentStore", ["getAllPayments"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    async printSoa() {
      //   console.log(this.transactionsId);
      await api
        .get("/api/student/soa", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          Object.entries(response.data.paymentTransactions).map(
            ([key, val]) => {
              this.paymentTransactions.push({
                date: val.created_at != null ? val.created_at : "",
                ref: val.transaction_id,
                description: val.name,
                credit: val.sub_total,
              });
            }
          );
          Object.entries(response.data.balance).map(([key, val]) => {
            this.balance.push({
              date: val.created_at,
              description: "Balance",
              charges: val.pre_balance,
            });
          });
          Object.entries(response.data.admission).map(([key, val]) => {
            this.payables.push({
              date: val.created_at,
              description: val.descr != null ? val.code : val.name,
              charges: val.total,
            });
          });
          Object.entries(response.data.enrollment).map(([key, val]) => {
            this.enrollment.push({
              date: val.created_at != null ? val.created_at : "",
              ref: val.transaction_id,
              description: val.name,
              credit: val.sub_total,
            });
          });
          Object.entries(response.data.due).map(([key, val]) => {
            this.due.push({
              // date: val.created_at != null ? val.created_at : "",
              description: "Balance",
              balance: val.total_payable,
            });
          });
          Object.entries(response.data.discounts).map(([key, val]) => {
            this.discounts.push({
              date: val.created_at != null ? val.created_at : "",
              description: val.description,
              credit: val.discount_total,
            });
          });
          this.student.name = response.data.student_info.name;
          this.student.student_id = response.data.student_info.student_id;
          this.student.acadYear = response.data.student_info.year;
          this.student.semester = response.data.student_info.title;
          this.student.level = response.data.student_info.level;
          this.student.course = response.data.student_info.code;

          // console.log(this.payables);
          this.school.name = response.data.school_info.name;
          this.school.address = response.data.school_info.address;
          this.school.barangay = response.data.school_info.barangay;
          this.school.city = response.data.school_info.city;
          this.school.province = response.data.school_info.province;
          this.school.country = response.data.school_info.country;
          this.school.phone = response.data.school_info.phone_number;
          this.school.mobile = response.data.school_info.cp_number;
          this.school.city = response.data.school_info.city;
          this.school.logo = response.data.school_info.logo;

          // this.student_name = response.data.data.name;
          // this.student_id =
          //   response.data.data.user_id != null
          //     ? response.data.data.user_id
          //     : "";
          // this.created_at = response.data.data.created_at;
          // this.description =
          //   response.data.data.remark +
          //   "(" +
          //   response.data.data.type_of_transaction +
          //   ")";
          // this.sub_total = response.data.data.sub_total;
          // this.amount = response.data.data.amount;
          // this.total = response.data.data.total;
          // this.cash = response.data.data.entered_amount;
          // this.discount = response.data.data.discount_total;
          // this.change = response.data.data.change;
          // this.trans_id = response.data.data.transaction_id;

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
          //   this.print();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    print() {
      window.html2canvas = html2canvas;
      var doc = new jsPDF("l", "pt", "a4");
      doc.html(document.querySelector("#q-app"), {
        rendered: function (canvas) {
          var imgData = canvas.toDataURL("image/jpeg");

          doc.addImage(imgData, "JPEG", 15, 0, 34, 37);
          console.log(imgData);
          document.querySelector("#q-app").append(canvas);
        },
        callback: function (pdf) {
          // pdf.setDrawColor("black");
          //   pdf.setLineWidth(1);
          //   pdf.line();
          // var imgData = pdf.toDataURL("image/jpeg");
          // doc.addImage(imgData, "JPEG", 15, 0, 34, 37);
          // console.log(imgData);
          // $("#q-app").append(pdf);
          // var imgData = pdf.toDataURL("image/jpeg");
          // doc.addImage(imgData, "JPEG", 15, 0, 34, 37);
          // console.log(imgData);
          // document.querySelector("#q-app").append(canvas);
          //   window.open(URL.createObjectURL(pdf.output("mypdf.pdf")));
          // html2canvas(document.querySelector("#q-app"), {
          //   // useCORS: true,
          //   onrendered: function (canvas) {
          //     var imgData = canvas.toDataURL("image/jpeg");

          //     doc.addImage(imgData, "JPEG", 15, 0, 34, 37);
          //     console.log(imgData);
          //     document.querySelector("#q-app").append(canvas);
          //   },
          // });
          pdf.save(Date.now() + "-" + "soa.pdf");
        },
      });
      // var doc = new jsPDF("p", "pt", "a4", true);
      // // doc.setFontSize(16);
      // // doc.setTextColor(80, 77, 78);
      // // doc.text(15, 2, "should be an image under here");
      // html2canvas(document.querySelector("#q-app"), {
      //   useCORS: true,
      //   onrendered: function (canvas) {
      //     var imgData = canvas.toDataURL("image/jpeg");

      //     doc.addImage(imgData, "JPEG", 15, 0, 34, 37);
      //     console.log(imgData);
      //     document.querySelector("#q-app").append(canvas);
      //   },
      // });
      // doc.save("receipt.pdf");
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    // this.getAllPayments();
    // this.paymentDetails();
    this.printSoa();
    // this.print();
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
