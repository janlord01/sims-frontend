<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Billing </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.title"
            label="Billing Name"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
          <q-select
            filled
            :options="categories"
            v-model="formData.category"
            label="Select Category"
            :class="
              $q.screen.gt.sm
                ? 'q-mr-sm full-width q-mt-md '
                : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
          <q-input
            filled
            v-model="formData.amount"
            label="Amount"
            name="code"
            class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
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
  emits: ["hideEditDialog"],
  props: ["billingId"],
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
      categories: [],
      formData: {
        category: null,
        title: null,
        amount: null,
        category_id: null,
      },
    };
  },
  methods: {
    ...mapActions("BillingStore", ["getAllBilling"]),
    async getBillingData() {
      await api
        .get("/api/billings/" + this.billingId + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.formData.title = response.data.data[0].name;
          this.formData.amount = response.data.data[0].amount;
          this.formData.category = response.data.data[0].category[0].title;
          this.formData.category_id = response.data.data[0].billing_cat_id;
          //   console.log(this.formData.category_id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getBillCats() {
      await api
        .get("/api/prospectus/billings/categories/active", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.categories.push({
              label: val.title,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();
      if (this.formData.category == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Category",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      if (this.formData.title == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Title",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      if (this.formData.amount == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Amount",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      await api
        .patch(
          "/api/billings/" + this.billingId,
          {
            category:
              this.formData.category.value != null
                ? this.formData.category.value
                : this.formData.category_id,
            name: this.formData.title,
            amount: this.formData.amount,
          },
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
              this.getAllBilling();
              this.$emit("hideEditDialog");
            }, 2000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
              //   this.getAllBilling();
              //   this.$emit("hideEditDialog");
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
    this.getBillingData();
  },
};
</script>
