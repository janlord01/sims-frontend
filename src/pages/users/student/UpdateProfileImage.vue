<template></template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { useQuasar, date } from "quasar";
import { api } from "src/boot/axios";

export default {
  data() {},
  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("studentStore", ["registerStudent"]),
  },
  computed: {},
  mounted() {
    this.getUserDetails();
  },
};
</script>
