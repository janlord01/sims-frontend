<template>
  <div>
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref } from "vue";
const menuList = [
  {
    icon: "key",
    label: "Login",
    to: "/login",
    separator: false,
  },
  // {
  //   icon: "save_as",
  //   label: "Register",
  //   to: "/register",
  //   separator: false,
  // },
];

export default {
  setup() {
    return {
      drawer: ref(false),
      menuList,
    };
  },
};
</script>
