<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Print SOA </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-input
            filled
            v-model="formData.name"
            label="Name"
            name="name"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type name of the college',
            ]"
            lazy-rules
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.descr"
            label="Description"
            class="q-mr-sm col-3 q-mt-md full-width"
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Required, Please type description of the college',
            ]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="description"> </q-icon>
            </template>
          </q-input>
          <q-select
            filled
            :options="getDean"
            v-model="formData.dean_id"
            label="Select Dean"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
            </template>
          </q-select>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
      <VueHtml2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="myPDF"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <!-- PDF Content Here -->
          <p>Test SOA</p>
        </section>
      </VueHtml2pdf>
    </q-card-section>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
// import VueHtml2pdf from "vue-html2pdf";
const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

export default {
  emits: ["hideCreateDialog"],
  components: {
    // VueHtml2pdf,
  },
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      formData: {
        dean_id: "",
        descr: "",
        name: "",
      },
      loadingSpinner: true,
      requiredRule,
      getDean: [],
    };
  },
  methods: {
    // file_selected: function (file) {
    //   console.log(file);
    //   this.formData.file = file[0];
    // },
    async getDeanUser() {
      await api
        .get("/api/colleges/users/dean", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          Object.entries(response.data.deans).map(([key, val]) => {
            this.getDean.push({
              label: val.name,
              value: val.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      await api
        .post(
          "/api/colleges",
          {
            name: this.formData.name,
            dean_id: this.formData.dean_id.value
              ? this.formData.dean_id.value
              : null,
            descr: this.formData.descr,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
              //   "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(response);
          // console.log(this.formData.dean_id.value);
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
              this.$emit("hideCreateDialog");
              this.getAllColleges();
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
    ...mapActions("CollegeStore", ["getAllColleges"]),
  },
  mounted() {
    this.getDeanUser();
  },
};
</script>
