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
        ? ['id', 'name', 'category', 'amount', 'action']
        : ['id', 'name', 'category']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>

        <q-td key="category" :props="props">
          {{ props.row.category[0].title }}
        </q-td>
        <q-td key="amount" :props="props"> P{{ props.row.amount }} </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Billing -->
  <q-dialog v-model="showEditDialog">
    <editBilling
      :billing-id="billing_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/finances/billings/store";
import editBilling from "src/components/finances/billings/editBilling.vue";
import { LocalStorage } from "quasar";
const pagination = {
  sortBy: "id",
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "category",
    label: "Category",
    field: "category",
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
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
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
      showEditDialog: false,
      billing_id: null,
    };
  },
  methods: {
    editDialog(billing_id) {
      this.billing_id = billing_id;
      this.showEditDialog = true;
    },
  },
  mounted() {},
  components: {
    editBilling,
  },
};
</script>

<style></style>
