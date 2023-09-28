<template>
  <q-card style="max-width: 300px; width: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Activate User </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!statusSent"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onChangeStatus"
      >
        <div class="text-center">
          <p class="text-h6">Activate User</p>
          <q-btn
            unelevated
            label="Close"
            class="text-center q-mr-sm"
            color="grey"
            size="md"
            v-close-popup
            type="button"
          />
          <q-btn
            unelevated
            label="Confirm"
            class="text-center"
            color="green"
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
  props: ["userId"],
  emits: ["hideStatusDialog"],
  setup() {
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      statusSent: true,
    };
  },
  methods: {
    async onChangeStatus() {
      this.$q.loading.show();
      await api
        .patch(
          "/api/user/change-status",
          {
            user_id: this.userId,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // this.statusSent = false;
          // console.log(response);
          const messages = response.data.data.messages
            ? response.data.data.messages
            : null;
          const errors = response.data.data.errors ? response.data.data.errors : null;
          if (messages) {
            setTimeout(() => {
              // this.statusSent = true;
              this.$q.loading.hide();

              this.$q.notify({
                type: "positive",
                message: messages,
                icon: "check_circle",
              });
              this.$emit("hideStatusDialog");
              this.getAllParent();
              this.getAllTeacher();
              this.getAllEmployee();
              this.getAllStudent();
            }, 2000);
          } else {
            // this.statusSent = true;
            this.$q.loading.hide();

            Object.entries(errors).forEach((err) => {
              this.$q.notify({
                type: "negative",
                message: err[1],
                icon: "error",
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
  },
};
</script>
