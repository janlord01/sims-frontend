<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Edit Subject </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!loadingSpinner"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.code"
            label="Subject Code (ex. Acc)"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Required, Please type code of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="numbers" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.descr"
            label="Description (ex. Fundamental of Accounting)"
            name="name"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the subject',
            ]"
            lazy-rules
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
          <p class="text-h5 unit">Units</p>
          <div class="row q-mb-lg">
            <div class="col q-mr-sm">
              <q-input
                filled
                v-model="formData.lecture"
                type="number"
                label="Lecture"
                class="q-mr-sm col-3 q-mt-md full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="format_list_numbered"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col q-mr-sm">
              <q-input
                filled
                v-model="formData.lab"
                type="number"
                label="Lab"
                class="q-mr-sm col-3 q-mt-md full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="format_list_numbered"> </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col">
              <q-input
                filled
                v-model="formData.practicum"
                type="number"
                label="Practicum"
                class="q-mr-sm col-3 q-mt-md full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="format_list_numbered"> </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <q-toggle
            v-model="formData.prerequisite"
            color="blue"
            label="Has Prerequisite"
          />
          <q-toggle v-model="formData.payable" color="blue" label="Payable Unit" />
          <!-- <q-input
            filled
            v-model="formData.year"
            label="Number of Year(ex. 4)"
            type="number"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the course',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="loop"> </q-icon>
            </template>
          </q-input> -->
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideEditDialog"],
  props: ["subId"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        code: "",
        descr: "",
        lecture: "",
        lab: "",
        practicum: "",
        prerequisite: false,
        payable: true,
        // year: "",
      },
      loadingSpinner: true,
      requiredRule,
      getCollege: [],
    };
  },
  methods: {
    async getSubject() {
      await api
        .get("/api/subjects/" + this.subId + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          //   console.log(response.data.subject);
          this.formData.code = response.data.subject.code;
          this.formData.descr = response.data.subject.descr;
          this.formData.lecture = response.data.subject.unit_lecture;
          this.formData.lab = response.data.subject.unit_lab;
          this.formData.practicum = response.data.subject.unit_practicum;
          this.formData.prerequisite = response.data.subject.has_pre == 1 ? true : false;
          this.formData.payable = response.data.subject.flag == 1 ? true : false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      //   const fileData = new FormData();
      //   fileData.append("name", this.formData.name);
      //   fileData.append("descr", this.formData.descr);
      //   fileData.append("file", this.formData.file);
      //   fileData.append("_method", "POST");
      await api
        .patch(
          "/api/subjects/" + this.subId,
          {
            code: this.formData.code,
            descr: this.formData.descr,
            lecture: this.formData.lecture,
            lab: this.formData.lab,
            practicum: this.formData.practicum,
            practicum: this.formData.practicum,
            prerequisite: this.formData.prerequisite,
            payable: this.formData.payable,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          // console.log(response);
          this.loadingSpinner = false;
          let errs = null;
          errs = response.data.data.errors.message
            ? response.data.data.errors.message
            : null;
          if (errs !== null) {
            setTimeout(() => {
              //   Object.entries(errors).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: errs,
                icon: "error",
              });
              //   });
              this.loadingSpinner = true;
            }, 2000);
          } else {
            setTimeout(() => {
              this.loadingSpinner = true;
              //   Object.entries(response.data.message).forEach((msg) => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
              });
              //   });
              this.$emit("hideEditDialog");
              this.getAllSubjects();
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          //   this.$q.notify({
          //     type: "positive",
          //     message: error.data.errors.message,
          //     icon: "save",
          //   });
        });
    },
    ...mapActions("SubjectStore", ["getAllSubjects"]),
  },
  mounted() {
    this.getSubject();
  },
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
