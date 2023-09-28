<template>
  <q-page>
    <!-- <button style="position: absolute; right: 10px" @click="counter++">
      {{ counter }}
    </button>
    <input
      v-model="message"
      @keyup.esc="clearMessage"
      @keyup.enter="alertMessage"
      v-autofocus
      :class="{ error: message.length > 22 }"
      ref="messageInput"
    />
    <div>{{ message.length }}</div>
    <button @click="clearMessage">Clear</button>
    <h5 class="border-grey" v-if="message.length">{{ message }}</h5>
    <h6 v-else>No message entered</h6>

    <hr />

    <p>Uppercase message: {{ messageUppercase }}</p> -->
    <!-- <ul>
      <Task
        v-for="(task, index) in tasks"
        :task="task"
        :index="index"
        :key="task.id"
      ></Task>
    </ul> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Task from "../components/Task.vue";

export default defineComponent({
  // data() {
  //   return {
  //     tasks: [
  //       {
  //         id: 1,
  //         name: "Go to shop",
  //         dueDate: "2019/05/12",
  //         dueTime: "18:30",
  //       },
  //       {
  //         id: 2,
  //         name: "Get bananas",
  //         dueDate: "2019/05/13",
  //         dueTime: "18:30",
  //       },
  //       {
  //         id: 3,
  //         name: "Go apples",
  //         dueDate: "2019/05/14",
  //         dueTime: "18:30",
  //       },
  //     ],
  //   };
  // },
  // components: {
  //   Task,
  // },
  // name: "IndexPage",
  // data() {
  //   return {
  //     message: "I love you dawn!",
  //     counter: 0,
  //   };
  // },
  // computed: {
  //   messageUppercase() {
  //     // console.log("messageUpperCase was fired");
  //     return this.message.toUpperCase();
  //   },
  //   errorStyle() {
  //     if (this.message.length > 22) {
  //       return "background:pink; color:red";
  //     }
  //   },
  // },
  // methods: {
  //   clearMessage() {
  //     this.message = "";
  //   },
  //   // handleKeyup(e) {
  //   //   if (e.keyCode == 27) {
  //   //     this.clearMessage();
  //   //   } else if (e.keyCode == 13) {
  //   //     this.alertMessage();
  //   //   }
  //   // },
  //   alertMessage() {
  //     alert(this.message);
  //   },
  // },
  // // filters: {
  // //   addchara(value) {
  // //     return "#" + value;
  // //   }
  // // },
  // directives: {
  //   autofocus: {
  //     mounted(el) {
  //       el.focus();
  //       // console.log("test");
  //     },
  //   },
  // },
  // // beforeCreate() {
  // //   console.log("beforeCreate");
  // // },
  // // created() {
  // //   console.log("created");
  // // },
  // // beforeMount() {
  // //   console.log("beforeMount");
  // // },
  // mounted() {
  //   console.log(this.$refs);
  //   this.$refs.messageInput.className = "bg-green";
  // },
  // // beforeUpdate() {
  // //   console.log("beforeUpdate");
  // // },
  // // updated() {
  // //   console.log("updated");
  // // },
  // // beforeDestroy() {
  // //   console.log("beforeDestroy");
  // // },
  // // destroyed() {
  // //   console.log("destroyed");
  // // },
});
</script>
<style>
.border-grey {
  border: 1px solid grey;
}
input,
button {
  font-size: 23px;
}
.error {
  color: red;
  background: pink;
}
</style>
