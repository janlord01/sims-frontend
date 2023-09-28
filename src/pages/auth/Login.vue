<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md text-bold justify-center">Login</h5>
      </div>
      <!-- <q-spinner-gears
        class="absolute-center z-top"
        color="secondary"
        size="100px"
        v-if="loginLoading"
        :class="loginLoading ? 'z-top' : ''"
      /> -->
      <div class="row" :class="loginLoading ? 'light-dimmed' : ''">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section class="relative">
            <q-form class="relative" @submit="loginSubmit">
              <q-input
                square
                filled
                v-model="formData.email"
                type="email"
                label="Email"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please Enter your Email']"
              />

              <q-input
                square
                filled
                v-model="formData.password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please Enter your password',
                ]"
                class="q-mt-sm"
              />
              <q-btn
                unelevated
                size="lg"
                class="full-width bg-cyan-8 text-white q-mt-sm"
                label="Login"
                type="submit"
              />
            </q-form>
          </q-card-section>
          <!-- <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Not reigistered?
              <a href="/dashboard">Create student account</a>
            </p>
            <p>
              <a href="#" class="text-center" style="text-decoration: none"
                >Forgot Password</a
              >
            </p>
          </q-card-section> -->
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapActions } from "vuex";
import axios from "axios";
import { LocalStorage } from "quasar";
export default {
  name: "Login",
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      loginLoading: false,
    };
  },
  methods: {
    ...mapActions("Userstore", ["loginUser"]),
    loginSubmit() {
      // this.loginLoading = true;
      this.loginUser(this.formData);
    },
  },
};
</script>
<style>
.q-card {
  width: 360px;
}
</style>
