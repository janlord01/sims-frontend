<template>
  <li>
    <div>{{ task.name }} {{ index }}</div>
    <small>{{ task.dueDate }} @ {{ task.dueTime }}</small>
    <button @click="deleteTask(index)">X</button>
  </li>
</template>
<script>
export default {
  props: ["task", "index"],
  methods: {
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
  },
};
</script>
<style scoped></style>
