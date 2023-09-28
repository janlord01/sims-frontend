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
        ? ['id', 'name', 'type', 'number', 'placement', 'action']
        : ['id', 'name', 'type', 'number', 'placement']
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

        <q-td key="type" :props="props">
          {{ props.row.type }}
        </q-td>
        <q-td key="number" :props="props">
          {{ props.row.type == "Amount" ? "P" : "" }}
          {{ props.row.number }}
          {{ props.row.type == "Amount" ? "" : "%" }}
        </q-td>
        <q-td key="placement" :props="props">
          {{ props.row.placement }}
        </q-td>

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
    <editDiscount
      :discount-id="discount_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script>
import { api } from "src/boot/axios";
import store from "src/store/finances/discounts/store";
import editDiscount from "src/components/finances/discounts/editDiscount.vue";
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
    name: "type",
    label: "Type",
    field: "type",
    align: "left",
    sortable: false,
  },
  {
    name: "number",
    label: "Amount/Percentage",
    field: "number",
    align: "left",
    sortable: false,
  },

  {
    name: "placement",
    label: "Placement",
    field: "placement",
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
      discount_id: null,
    };
  },
  methods: {
    editDialog(discount_id) {
      this.discount_id = discount_id;
      this.showEditDialog = true;
    },
  },
  mounted() {},
  components: {
    editDiscount,
  },
};
</script>

<style></style>
