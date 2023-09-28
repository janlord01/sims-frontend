<template>
  <q-page>
    <q-list bordered separator>
      <q-item-label header>Todo List</q-item-label>

      <q-item
        v-ripple
        v-for="task in tasks"
        :key="task.id"
        @click="task.completed = !task.completed"
        clickable
        :class="!task.completed ? 'bg-orange-1' : 'bg-green-1'"
      >
        <q-item-section side top>
          <q-checkbox v-model="task.completed" />
        </q-item-section>

        <q-item-section>
          <q-item-label :class="{ 'text-strikethrough': task.completed }">{{
            task.name
          }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row">
            <div>
              <q-icon name="event" size="18px" class="q-mr-xs" />
            </div>

            <div class="column">
              <q-item-label caption class="row justify-end">
                {{ task.dueDate }}
              </q-item-label>
              <q-item-label caption class="row justify-end">
                <small>{{ task.dueTime }}</small>
              </q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      tasks: [
        {
          id: 1,
          name: "Go to shop",
          completed: true,
          dueDate: "2019/05/12",
          dueTime: "18:30",
        },
        {
          id: 2,
          name: "Get bananas",
          completed: false,
          dueDate: "2019/05/13",
          dueTime: "14:30",
        },
        {
          id: 3,
          name: "Get apples",
          completed: false,
          dueDate: "2019/05/14",
          dueTime: "16:30",
        },
      ],
    };
  },
});
</script>
<style></style>
