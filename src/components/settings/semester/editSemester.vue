<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Semester </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!loadingSpinner"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.title"
            label="Semester (ex. 1st Semester)"
            name="year"
            class="q-mr-sm col-3 full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please enter right academic year',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="school" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.no_of_months"
            label="Payable No. of months"
            class="q-mr-sm col-3 full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please enter the right number',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="numbers"> </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.unit"
            label="Price Per Unit"
            class="q-mr-sm col-3 full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please enter the right number',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="attach_money"> </q-icon>
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
export default {
  props: ["semId"],
  emits: ["hideEditDialog"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        title: "",
        no_of_months: "",
        unit: null,
      },
      loadingSpinner: true,
    };
  },
  methods: {
    async editSem() {
      await api
        .get("/api/settings/semester/" + this.semId + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.formData.title = response.data.semester.title
            ? response.data.semester.title
            : "";
          this.formData.no_of_months = response.data.semester.no_of_months
            ? response.data.semester.no_of_months
            : "";
          this.formData.unit = response.data.semester.unit
            ? response.data.semester.unit
            : "";
          //   console.log(this.formData.title);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      await api
        .patch(
          "/api/settings/semester/" + this.semId,
          {
            title: this.formData.title,
            no_of_months: this.formData.no_of_months,
            unit: this.formData.unit,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          this.loadingSpinner = false;
          const errors = response.data.error ? response.data.error : null;
          if (response.data.error) {
            setTimeout(() => {
              //   Object.entries(errors).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: response.data.error,
                icon: "error",
              });
              //   });
              this.loadingSpinner = true;
              this.formData.title = "";
              this.formData.no_of_months = "";
            }, 2000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              //   Object.entries(response.data.message).forEach((msg) => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
              });
              //   });
              this.$emit("hideEditDialog");
              this.getAllSemester();
              this.getSemester();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("SemesterStore", ["getAllSemester"]),
    ...mapActions("Userstore", ["getSemester"]),
  },
  mounted() {
    this.editSem();
  },
};
</script>
