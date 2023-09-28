<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Discount </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-select
            filled
            :options="['Percentage', 'Amount']"
            v-model="formData.type"
            label="Discount Type"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-md ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="emoji_symbols" />
            </template>
          </q-select>
          <q-input
            filled
            v-model="formData.description"
            label="Name"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.number"
            :label="formData.type == 'Amount' ? 'Amount' : 'Number'"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon :name="formData.type == 'Amount' ? 'attach_money' : 'percent'" />
            </template>
          </q-input>
          <!-- <q-select
            filled
            :options="['Regular', 'Admission']"
            v-model="formData.placement"
            label="Placement"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-md ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select> -->
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
export default {
  emits: ["hideEditDialog"],
  props: ["discountId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      category: null,
      categories: [],
      formData: {
        type: null,
        description: null,
        number: null,
        placement: null,
      },
    };
  },
  methods: {
    ...mapActions("DiscountStore", ["getAllDiscount"]),
    async getDiscountData() {
      await api
        .get("/api/discounts/" + this.discountId, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          this.formData.type = response.data.data.type;
          this.formData.description = response.data.data.description;
          this.formData.number = response.data.data.number;
          this.formData.placement = response.data.data.placement;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();
      if (this.formData.type == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Select Type",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      if (this.formData.description == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Description",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      if (this.formData.number == null) {
        this.$q.notify({
          type: "negative",
          message: "Please Enter Amount/Percentage",
          icon: "error",
        });
        this.$q.loading.hide();
      }
      //   if (this.formData.placement == null) {
      //     this.$q.notify({
      //       type: "negative",
      //       message: "Please Select Placement",
      //       icon: "error",
      //     });
      //     this.$q.loading.hide();
      //   }
      if (this.formData.type == "Percentage" && this.formData.number > 100) {
        this.$q.notify({
          type: "negative",
          message: "Percentage not more than 100%",
          icon: "error",
        });
        this.$q.loading.hide();
      } else {
        await api
          .patch(
            "/api/discounts/" + this.discountId,
            {
              type: this.formData.type,
              description: this.formData.description,
              number: this.formData.number,
              placement: "Regular",
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
                this.getAllDiscount();
                this.$emit("hideEditDialog");
              }, 2000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    this.getDiscountData();
  },
};
</script>
