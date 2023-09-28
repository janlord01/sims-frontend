<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create/View Billing Category </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <!-- <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center z-max"
        v-if="!passwordSent"
      /> -->
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="getAllBillingCats"
        :columns="columns"
        row-key="role"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs ? ['id', 'category', 'action'] : ['id', 'category', 'action']
        "
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>

            <q-td key="category" :props="props">
              {{ props.row.title }}
            </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="red"
                icon="do_disturb_on"
                size="sm"
                v-if="props.row.status == 1"
                @click="changeStatus(props.row.id)"
              />
              <q-btn
                color="green"
                icon="check_circle"
                size="sm"
                v-if="props.row.status == 0"
                @click="changeStatus(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="category"
            label="Create Billing Category"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Add"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
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
import store from "src/store/courses/course-list/store";
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
    name: "category",
    label: "Category",
    field: "category",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  emits: ["hideRoleDialog"],
  props: ["subId"],
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      category: null,
      getAllBillingCats: [],
    };
  },
  methods: {
    async getBillCats() {
      await api
        .get("/api/prospectus/billings/categories", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.getAllBillingCats.push({
              id: val.id,
              title: val.title,
              status: val.status,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();
      if (this.category == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Category",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      await api
        .post(
          "/api/prospectus/billings/categories",
          { category: this.category },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          //   console.log(response);
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
              this.getAllBillingCats = [];
              this.category = null;
              this.getBillCats();
              //   emit("hideCreateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async changeStatus(id) {
      this.$q.loading.show();
      await api
        .patch(
          "/api/prospectus/billings/categories/change",
          { id: id },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
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
              this.getAllBillingCats = [];
              this.getBillCats();
              //   emit("hideCreateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getBillCats();
  },
};
</script>
