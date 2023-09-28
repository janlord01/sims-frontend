<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Create Role </q-toolbar-title>
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
            v-model="formData.role"
            label="Enter role name"
            name="role"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please enter right name',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock_person" />
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
        role: "",
      },
      loadingSpinner: true,
    };
  },
  methods: {
    async onSubmit() {
      this.$q.loading.show();
      await api
        .post(
          "/api/settings/roles-permissions",
          {
            role: this.formData.role,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);

          if (response.data.status === 200) {
            setTimeout(() => {
              //   Object.entries(errors).forEach((msg) => {
              this.$q.notify({
                type: "positive",
                color: "green",
                message: response.data.message,
                icon: "save",
                timeout: 3000,
                position: "top",
              });
              //   });
              this.$q.loading.hide();

              this.$emit("hideCreateDialog");

              this.getAllRolesWithPermissions();
              this.formData.role = "";
            }, 1000);
          } else {
            setTimeout(() => {
              //   Object.entries(response.data.message).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
                icon: "error",
                timeout: 3000,
                position: "top",
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    ...mapActions("RolesPermissionsStore", ["getAllRolesWithPermissions"]),
  },
};
</script>
