<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Update School Logo </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="q-pa-md row q-col-gutter-none full-width"
        ref="formName"
        @submit="onSubmit"
      >
        <!-- <div class="col-5 border border-gray-300" style="border: solid 1px red"> -->
        <!-- </div> -->
        <div class="full-width row q-mb-lg">
          <q-input
            type="file"
            flat
            class="col-5"
            accept=".jpg, .png, image/*"
            v-model="logo"
          />

          <!-- @update:model-value="changeImage" -->
          <q-btn
            unelevated
            label="Change Logo"
            class="text-center col-3"
            color="secondary"
            size="md"
            type="submit"
            icon="save"
          />
          <!-- <q-uploader
          color="teal"
          flat
          bordered
          class="col-6 q-mr-md"
          accept=".jpg, .png, image/*"
          @rejected="onRejected"
          v-model="logo"
        /> -->
        </div>
        <q-img :src="image" spinner-color="white" class="col-5" />

        <div class="row q-mt-lg align-center full-width">
          <!-- <q-btn
            unelevated
            label="Change Logo"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
            icon="save"
          /> -->
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { mapState, mapActions, mapGetters } from "vuex";

export default defineComponent({
  props: ["transactionsId"],
  setup() {
    const $q = useQuasar();

    return {};
    // const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      searchUser: "",
      image: null,
      logo: null,
    };
  },
  methods: {
    ...mapActions("Userstore", ["getSchoolInfo"]),

    onSubmit() {
      this.$q.loading.show();

      // this.file_path = file[0];
      var fileData = new FormData();
      fileData.append("file_path", this.logo[0]);

      // console.log(this.logo);
      fileData.append("_method", "PATCH");
      api
        .post("/api/school-info/upload/logo", fileData, {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
              this.getSchoolInfo();
              this.image = response.data.logo;
              this.logo = null;
            }, 2000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
              this.logo = null;
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // changeImage() {
    //   console.log(this.logo);
    // },
    async getImage() {
      await api
        .get("/api/school-info", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.image = response.data.logo;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  // watch: {

  // },
  mounted() {
    this.getImage();
  },
});
</script>
