<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Account Receivables</q-toolbar-title>
        <div class="row" style="width: 250px; margin-top: -10px; margin-right: 10px">
          <q-select
            filled
            :options="courses"
            v-model="formData.course"
            label="Search Course"
            style="margin-top: 20px"
            :class="$q.screen.gt.sm ? 'full-width ' : 'full-width'"
          >
            <template v-slot:prepend>
              <q-icon name="book" />
            </template>
          </q-select>
        </div>
        <q-btn
          icon="search"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: 10px; margin-right: 10px"
          :label="$q.screen.gt.xs ? 'Search' : ''"
          @click="getReceivableCourseFunc"
        />
        <!-- <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          style="height: 50px; margin-top: -10px; margin-right: 10px"
          :label="$q.screen.gt.xs ? 'Add file' : ''"
          @click="onShowCreateDialog"
        /> -->
      </q-toolbar>
      <receivableList />

      <q-dialog v-model="showCreateDialog">
        <createFile @hide-create-dialog="showCreateDialog = !showCreateDialog" />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import receivableList from "src/components/reports/receivable/receivableList.vue";
import createFile from "src/components/settings/file/createFile.vue";

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  name: "Dashboard",
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      showCreateDialog: false,
      courses: [],
      formData: {
        course: null,
      },
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("FileStore", ["getAllFiles"]),
    ...mapActions("ReportCollectedStore", [
      "getAllReceivablePayments",
      "getAllReceivablePaymentsCourse",
    ]),
    getReceivableCourseFunc() {
      if (this.formData.course == null) {
        this.$q.notify({
          position: "top",
          type: "negative",
          timeout: 3000,
          message: "Please Select Course",
        });
      } else {
        // console.log(this.formData.course);
        this.getAllReceivablePaymentsCourse(this.formData.course.value);
      }
    },
    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
    async getAllCourse() {
      await api
        .get("api/courses", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          Object.entries(response.data.courses).map(([key, val]) => {
            this.courses.push({
              label: val.code,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    // console.log(store.state.rowDatas)
    this.getUserDetails();
    this.getAllFiles();
    this.getAllCourse();
    this.getAllReceivablePayments();
  },
  components: {
    receivableList,
    createFile,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
