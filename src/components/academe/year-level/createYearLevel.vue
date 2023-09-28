<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Year Level </q-toolbar-title>
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
            v-model="formData.name"
            label="Name"
            name="name"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type name of the college',
            ]"
            lazy-rules
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
            label="Create"
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
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideCreateDialog"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        dean_id: "",
        descr: "",
        name: "",
      },
      loadingSpinner: true,
      requiredRule,
      getDean: [],
    };
  },
  methods: {
    // file_selected: function (file) {
    //   console.log(file);
    //   this.formData.file = file[0];
    // },

    async onSubmit() {
      this.$q.loading.show();

      await api
        .post(
          "/api/year-level",
          {
            name: this.formData.name,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          //   console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 3000,
                message: response.data.message,
              });
              this.$emit("hideCreateDialog");

              this.getAllYearLevel();
              this.$q.loading.hide();
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 3000,
                message: response.data.message,
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              message: error.response.data.message,
            });
            this.$q.loading.hide();
          }, 3000);
        });
    },
    ...mapActions("CollegeStore", ["getAllColleges"]),
    ...mapActions("YearLevelStore", ["getAllYearLevel"]),
  },
  mounted() {
    // this.getDeanUser();
  },
};
</script>
