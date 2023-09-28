<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Change Password </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!passwordSent"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onChangePassword"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.password"
            label="New password"
            name="Password"
            class="q-mr-sm col-3 q-mt-md full-width"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.password_confirmation"
            label="Confirm new password"
            name="password_confirmation"
            class="q-mr-sm col-3 q-mt-md full-width"
            :type="isPwdCom ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwdCom ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdCom = !isPwdCom"
              />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Change"
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
  emits: ["hidePasswordDialog"],
  props: ["userId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        password: "",
        password_confirmation: "",
      },
      passwordSent: true,
      isPwd: true,
      isPwdCom: true,
    };
  },
  methods: {
    async onChangePassword() {
      this.$q.loading.show();

      await api
        .patch(
          "/api/user/change-password",
          {
            user_id: this.userId,
            password: this.formData.password,
            password_confirmation: this.formData.password_confirmation,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);
          // this.passwordSent = false;
          const errors = response.data.data.errors ? response.data.data.errors : null;
          if (response.data.data.errors) {
            setTimeout(() => {
              Object.entries(errors).forEach((msg) => {
                this.$q.notify({
                  type: "negative",
                  message: msg[1],
                  icon: "error",
                });
              });
              // this.passwordSent = true;
              this.$q.loading.hide();

              this.formData.password = "";
              this.formData.password_confirmation = "";
            }, 1000);
          } else {
            setTimeout(() => {
              // this.passwordSent = true;
              this.showChangePasswordeDialog = false;
              Object.entries(response.data.data.data).forEach((msg) => {
                this.$q.notify({
                  type: "positive",
                  message: msg[1],
                  icon: "save",
                });
              });
              this.$q.loading.hide();

              this.$emit("hidePasswordDialog");
              this.getAllParent();
              this.getAllTeacher();
              this.getAllEmployee();
              this.getAllStudent();
            }, 2000);
          }
          this.user_id = null;
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
