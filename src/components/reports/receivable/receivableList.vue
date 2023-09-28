<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowReceivableDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['date', 'name', 'course', 'tuition', 'total_payable', 'total', 'balance']
        : ['name', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="date" :props="props">
          {{ moment(props.row.created_at).format("MMMM Do YYYY, h:mm:ss a") }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="course" :props="props">
          {{ props.row.course }}
        </q-td>
        <q-td key="tuition" :props="props">
          {{ props.row.tuition }}
        </q-td>
        <q-td key="total_payable" :props="props">
          {{ props.row.total }}
        </q-td>
        <q-td key="balance" :props="props">
          {{ props.row.balance }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div class="float-left">
    <!-- <span class="q-mr-sm"
      ><q-chip color="green-3" class="text-white"></q-chip> Enrollment Fee</span
    >
    <span class="q-mr-sm"
      ><q-chip color="orange-3" class="text-white"></q-chip> Tuition/Monthly Fee</span
    > -->
    <!-- <span class="q-mr-sm"
      ><q-chip color="grey-5" class="text-white"></q-chip> Others</span
    > -->
  </div>

  <div class="float-right">
    <span class="q-mr-sm"
      ><q-chip color="grey" size="lg" class="text-white">
        <span class="text-bold">Total Receivables: </span> &nbsp;P{{
          store.state.balance
        }}&nbsp;

        <!-- <span class="text-bold">Total: </span> &nbsp;P{{ store.state.total }} &nbsp;
        <span class="text-bold">Discount: </span> &nbsp;P{{ store.state.discount }} -->
      </q-chip>
    </span>
    <!-- <span class="q-mr-sm"
      ><q-chip color="grey-5" class="text-white"></q-chip> Others</span
    > -->
  </div>
  <!-- <div class="full-width">
    <span class="q-mr-sm">
      <q-chip color="grey" size="lg" class="text-white">
        <span class="text-bold">Total Receivables: </span> &nbsp;P{{
          store.state.balance
        }}&nbsp;

      </q-chip>
    </span>
  </div> -->
  <!-- Edit Billing -->
  <q-dialog v-model="printDialog">
    <printReceipt
      :transactions-id="transactions_id"
      @hide-view-dialog="printDialog = !printDialog"
    />
  </q-dialog>
</template>

<script>
// import { api } from "src/boot/axios";

import { defineComponent } from "vue";
import store from "src/store/reports/collected/store";

import { mapActions, mapState } from "vuex";
// import editDiscount from "src/components/finances/discounts/editDiscount.vue";
import { LocalStorage, useQuasar } from "quasar";
import printReceipt from "components/finances/cashier/printReceipt.vue";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { api } from "src/boot/axios";

const pagination = {
  sortBy: "id",
  rowsPerPage: 100,
};
const columns = [
  {
    name: "date",
    label: "Date Enrolled",
    field: "date",
    align: "left",
    sortable: true,
    // classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "course",
    label: "Course",
    field: "course",
    align: "left",
    sortable: false,
  },
  {
    name: "tuition",
    label: "Tuition",
    field: "tuition",
    align: "left",
    sortable: false,
  },
  {
    name: "total_payable",
    label: "Total Payable",
    field: "total_payable",
    align: "left",
    sortable: false,
  },

  {
    name: "balance",
    label: "Balance",
    field: "balance",
    align: "left",
    sortable: false,
  },

  {
    name: "discount",
    label: "Discount",
    field: "discount",
    align: "left",
    sortable: false,
  },
];
export default defineComponent({
  setup() {
    return {
      pagination,
      columns,
      moment,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      showEditDialog: false,
      store,
      printDialog: false,
      transactions_id: null,
    };
  },
  methods: {
    ...mapActions("PaymentStore", ["getAllPayments"]),

    voidFunc(id) {
      this.$q
        .dialog({
          title: "Void Transaction",
          message: "Are you sure you want to void this transaction?",
          ok: {
            push: true,
            color: "negative",
            label: "Void",
          },
          cancel: {
            push: true,
            color: "grey",
          },
          persistent: true,
        })
        .onOk(() => {
          // console.log(">>>> Void" + id);
          this.$q.loading.show();
          api
            .delete("/api/cashier/" + id, {
              headers: {
                Authorization: "Bearer " + this.newToken,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.data.status === 200) {
                setTimeout(() => {
                  this.$q.notify({
                    type: "positive",
                    color: "positive",
                    icon: "delete",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                  });

                  this.getAllPayments();
                  this.$q.loading.hide();
                }, 2000);
              } else {
                setTimeout(() => {
                  this.$q.notify({
                    type: "negative",
                    color: "negative",
                    icon: "error",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                  });
                  this.$q.loading.hide();
                }, 2000);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    editDialog(discount_id) {
      //   this.discount_id = discount_id;
      //   this.showEditDialog = true;
    },
    viewPayment(transactions_id) {
      this.transactions_id = transactions_id;
      this.printDialog = true;
      // console.log(transactions_id);
    },
    print() {
      // this.printDialog = true;
      // window.html2canvas = html2canvas;
      // var doc = new jsPDF("p", "pt", "a4");
      // doc.html(document.querySelector("#q-app"), {
      //   callback: function (pdf) {
      //     pdf.save("mypdf.pdf");
      //   },
      // });
    },
  },
  components: {
    printReceipt,
  },
});
</script>

<style></style>
