<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

import { createApp } from "vue";
// import VueApexCharts from "vue-apexcharts";
// Vue.use(VueApexCharts);

const app = createApp({});
// app.use(print);
// app.directive("print", {
//   /* ... */
// });

// Vue.component("apexchart", VueApexCharts);
export default defineComponent({
  name: "App",
});
</script>
<style>
.text-strikethrough {
  text-decoration: line-through;
}
</style>
