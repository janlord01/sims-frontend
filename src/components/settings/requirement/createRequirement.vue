<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Student Requirement </q-toolbar-title>
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
            label="File (Ex. Form 137)"
            name="year"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please enter right academic year',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="folder" />
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
        title: "",
      },
      loadingSpinner: true,
    };
  },
  methods: {
    async onSubmit() {
      await api
        .post(
          "/api/settings/requirement",
          {
            title: this.formData.title,
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
              this.$emit("hideCreateDialog");
              this.getAllRequirement();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("RequirementStore", ["getAllRequirement"]),
  },
};
</script>
