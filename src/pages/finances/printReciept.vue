<template>
  <q-page style="margin-right: 10px">
    <table cellpadding="0" style="font-size: 8px">
      <tbody>
        <tr class="">
          <td class="width: 100px" colspan="4">
            <!-- <img class="object-cover w-28 h-28 rounded-full object-center inline-block align-middle mb-2" width="130"src="{{ public_path("images/".$school->image_path) }}" alt="" loading="lazy" /> -->
            <q-avatar size="100px">
              <img :src="school.logo" />
            </q-avatar>
          </td>

          <td style="text-align: center; width: 350px">
            {{ school.name }} <br />
            {{ school.address }} <br />
            {{ school.barangay }} {{ school.city }} {{ school.province }},
            <br />
            {{ school.country }} {{ school.zipcode }} {{ school.phone }} /<br />
            {{ school.mobile }}
          </td>
          <td class="text-center; width: 250px">
            <table class="" style="border-collapse: collapse">
              <tbody class="block md:table-row-group">
                <tr class="border-2 border-black-900 block table-row">
                  <td
                    style="border: solid 1px #000"
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
                      {{ trans_id }}
                    </span>
                  </td>
                  <td
                    class="p-2 border-2 border-black-900 text-left block table-cell text-center"
                    style="border: solid 1px black"
                  >
                    <span>Date</span><br />
                    <span class="text-center text-sm block mt-4">
                      {{ moment(created_at).format("MMMM Do YYYY, h:mm:ss a") }}
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
      style="margin-bottom: 20px; border-collapse: collapse; font-size: 6px"
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
        width: 40%;
        border-collapse: collapse;
        font-size: 8px;
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
            <span style="display: block; margin-top: 5px">
              {{ trans_id }}
            </span>
            <span style="display: block; margin-bottom: 100px"></span>
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Sub-Total</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Discount</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Total</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Cash Entered</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Change</span
            >
          </td>
          <td style="border: 1px solid #000; text-align: left">
            <span style="display: block; margin-top: 5px; text-align: center">
              {{ description }}
            </span>
            <span style="display: block; margin-bottom: 100px"></span>
            <span style="display: block; visibility: visible; font-weight: bold"
              >Sub-Total</span
            >
            <span style="display: block; visibility: visible; font-weight: bold"
              >Discount</span
            >
            <span style="display: block; visibility: visible; font-weight: bold"
              >Total</span
            >
            <span style="display: block; visibility: visible; font-weight: bold"
              >Cash Entered</span
            >
            <span style="display: block; visibility: visible; font-weight: bold"
              >Change</span
            >
          </td>
          <td style="border: 1px solid #000; text-align: right">
            <span style="display: block; margin-top: 5px; text-align: center">
              {{ parseFloat(amount).toFixed(2) }}
            </span>
            <span style="display: block; margin-bottom: 100px"></span>
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Sub-Total</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Discount</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Total</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Cash Entered</span
            >
            <span style="display: block; visibility: hidden; font-weight: bold"
              >Change</span
            >
          </td>
          <td style="border: 1px solid #000; text-align: right">
            <span style="display: block; margin-top: 5px; text-align: center">
              {{ parseFloat(sub_total).toFixed(2) }}
            </span>
            <span style="display: block; margin-bottom: 100px"></span>
            <span
              style="display: block; visibility: visible; font-weight: bold"
            >
              <!-- {{ number_format($student->sub_total, 2, '.', ',') }} -->
              {{ parseFloat(sub_total).toFixed(2) }}
            </span>
            <span
              style="display: block; visibility: visible; font-weight: bold"
            >
              {{ discount }}
            </span>
            <span
              style="display: block; visibility: visible; font-weight: bold"
            >
              {{ total }}
            </span>
            <span
              style="display: block; visibility: visible; font-weight: bold"
            >
              <!-- {{ number_format($student->cash, 2, '.', ',') }} -->
              {{ cash }}
            </span>
            <span
              style="display: block; visibility: visible; font-weight: bold"
            >
              <!-- {{ number_format($student->change, 2, '.', ',') }} -->
              {{ change }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <table style="width: 40%; margin-top: 20px; font-size: 8px">
      <tr>
        <th></th>
        <th>
          <span>_________________________</span><br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;Cashier</span>
        </th>
      </tr>
      <tr>
        <td style="color: red; font-weight: bold">
          "This is not an official receipt-for your official receipt please
          visit the authorize person from finance."
        </td>
      </tr>
    </table>

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
        .get("/api/view-reciept/" + this.$route.params.id, {
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
          this.print();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    print() {
      window.html2canvas = html2canvas;
      var doc = new jsPDF("l", "pt", "a5");
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
          pdf.save(Date.now() + "-" + "reciept.pdf");
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
    // this.getUserDetails();
    // this.getAllPayments();
    this.paymentDetails();
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
