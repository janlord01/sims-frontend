<template>
  <q-page class="row justify-center items-center q-mt-lg">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-black q-my-md text-bold text-center">Register</h5>
      </div>
      <div class="row q-mb-lg">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="" method="post" @submit.prevent="handleSubmit">
              <q-input
                square
                filled
                clearable
                v-model="formData.firstname"
                type="text"
                label="Firstname"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please Enter your firstname',
                ]"
              />
              <q-input
                square
                filled
                clearable
                v-model="formData.lastname"
                type="text"
                label="Lastname"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please Enter your lastname',
                ]"
                class="q-mt-sm"
              />
              <q-input
                square
                filled
                clearable
                v-model="formData.email"
                type="email"
                label="Email"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please Enter your email']"
                class="q-mt-sm"
              />
              <q-input
                square
                filled
                clearable
                v-model="formData.password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please Enter your password',
                ]"
                class="q-mt-sm"
              />
              <q-input
                square
                filled
                clearable
                v-model="formData.password_confirmation"
                type="password"
                label="Confirm Password"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please confirm your firstname',
                ]"
                class="q-mt-sm"
              />
              <q-btn
                unelevated
                size="lg"
                class="full-width bg-cyan-8 text-white q-mt-sm"
                label="Register"
                type="submit"
              />
            </q-form>
          </q-card-section>

          <!-- <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Already have an account? <a href="/login">Login</a>
            </p>
          </q-card-section> -->
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// import axios from "src/boot/axios";
import { ref } from "vue";
// import axios from "axios";
import { mapActions } from "vuex";
// import api from "/src/boot/axios";
export default {
  name: "Register",
  data() {
    return {
      formData: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  },
  methods: {
    // async handleSubmit() {
    //   await axios.post("http://127.0.0.1:8001/api/register", {
    //     firstname: this.firstname,
    //     lastname: this.lastname,
    //     email: this.email,
    //     password: this.password,
    //     password_confirmation: this.password_confirmation,
    //   });
    //   // console.log(response.data);
    //   this.$router.push("/login");
    // },
    ...mapActions("Userstore", ["registerUser"]),
    handleSubmit() {
      this.registerUser(this.formData);
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
