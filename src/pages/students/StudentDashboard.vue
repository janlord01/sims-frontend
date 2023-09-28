<template>
  <q-page>
    <p v-if="userDetails.user">Student Dashboard</p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";

export default defineComponent({
  name: "Dashboard",
  data() {
    return { name: "", email: "" };
  },

  methods: { ...mapActions("Userstore", ["getUserDetails"]) },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {
    // this.$router.go(1);
  },
  mounted() {
    // if (LocalStorage.getItem("jwt")) {
    // location.reload();

    // this.$router.go(2);

    this.getUserDetails();
    // }
    // this.$router.go();
  },
  // watch: {
  //   'LocalStorage.getItem("jwt")': {
  //     handler() {
  //       this.getUserDetails();
  //     },
  //     immediate: true,
  //   },
  // },
});
</script>
<style></style>
