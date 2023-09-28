<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? [
            'date',
            'id',
            'name',
            'online',
            'type',
            'amount',
            'discount',
            'total',
            'cash',
            'change',
            'action',
          ]
        : ['name', 'action']
    "
  >
    <template #body="props">
      <q-tr
        :props="props"
        :class="
          props.row.type_of_transaction == 'Enrollment Fee'
            ? 'bg-green-3 text-black'
            : props.row.type_of_transaction == 'Tuition/Monthly Fee'
            ? 'bg-orange-3 text-black'
            : 'bg-grey-5 text-black'
        "
      >
        <q-td key="date" :props="props">
          {{ moment(props.row.created_at).format("MMMM Do YYYY, h:mm:ss a") }}
        </q-td>
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="online" :props="props">
          <q-chip
            class="text-white"
            :color="props.row.online == 'yes' ? 'green' : 'grey'"
            >{{ props.row.online == "yes" ? "online" : "onsite" }}</q-chip
          >
        </q-td>
        <q-td key="type" :props="props">
          {{ props.row.type_of_transaction }}
        </q-td>
        <q-td key="amount" :props="props">
          {{ props.row.amount }}
        </q-td>
        <q-td key="discount" :props="props">
          {{ props.row.discount_total != null ? props.row.discount_total : 0 }}
        </q-td>
        <q-td key="total" :props="props">
          {{ props.row.total }}
        </q-td>
        <q-td key="cash" :props="props">
          {{ props.row.entered_amount }}
        </q-td>
        <q-td key="change" :props="props">
          {{ props.row.change }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="visibility"
            size="sm"
            @click="viewPayment(props.row.id)"
          />
          <q-btn
            color="purple"
            icon="print"
            size="sm"
            target="_blank"
            :to="'/print/receipt/' + props.row.id"
          />
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            v-if="
              userDetails.permissions.some(
                (permis) => ['delete-cashier'].indexOf(permis) !== -1
              )
            "
            @click="voidFunc(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div>
    <span class="q-mr-sm"
      ><q-chip color="green-3" class="text-white"></q-chip> Enrollment Fee</span
    >
    <span class="q-mr-sm"
      ><q-chip color="orange-3" class="text-white"></q-chip> Tuition/Monthly
      Fee</span
    >
    <!-- <span class="q-mr-sm"
      ><q-chip color="grey-5" class="text-white"></q-chip> Others</span
    > -->
  </div>
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
import store from "src/store/finances/cashier/store";

import { mapActions, mapState } from "vuex";
// import editDiscount from "src/components/finances/discounts/editDiscount.vue";
import { LocalStorage, useQuasar } from "quasar";
import printReceipt from "components/finances/cashier/printReceipt.vue";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { api } from "src/boot/axios";

const pagination = {
  sortBy: "created_at",
  rowsPerPage: 10,
  descending: true,
};
const columns = [
  {
    name: "date",
    label: "Date",
    field: "date",
    align: "left",
    sortable: true,
    // classes: "bg-grey-4",
  },
  {
    name: "id",
    label: "Transaction ID",
    field: "id",
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
    name: "online",
    label: "Online/Onsite",
    field: "online",
    align: "left",
    sortable: false,
  },
  {
    name: "type",
    label: "Transaction",
    field: "type",
    align: "left",
    sortable: false,
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
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
  {
    name: "total",
    label: "Total",
    field: "total",
    align: "left",
    sortable: false,
  },
  {
    name: "cash",
    label: "Cash Entered",
    field: "cash",
    align: "left",
    sortable: false,
  },
  {
    name: "change",
    label: "Change",
    field: "change",
    align: "left",
    sortable: false,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
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
  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
});
</script>

<style></style>
