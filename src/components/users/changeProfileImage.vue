<template>
  <!-- change Profile Image -->
  <q-card style="max-width: 800px; width: 800px">
    <q-linear-progress :value="onProgressBar" color="green" size="md" />
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Change Profile Image </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div class="row">
        <div class="col q-mr-sm">
          <q-img :src="userImage" :ratio="1" spinner-color="white"></q-img>
        </div>
        <div class="col q-mr-sm">
          <q-uploader
            accept=".jpg, image/*"
            label="Upload Profile Image"
            field-name="profile_image"
            :style="
              $q.screen.gt.sm
                ? 'max-width: 100%; width: 500px'
                : 'max-width: 100%; width: 500px; min-width:180px'
            "
            @rejected="onRejected"
            :factory="uploadImage"
            uploadProgressLabel
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";

export default {
  emits: ["hideImage"],

  props: ["userImage", "userId", "showImage"],
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      showChangeImageDialog: false,
      onProgressBar: 0,
      file_path: null,
      newToken: LocalStorage.getItem("jwt"),
    };
  },
  methods: {
    uploadImage(file) {
      // console.log(file[0]);
      this.$q.loading.show();
      this.file_path = file[0];
      var fileData = new FormData();
      fileData.append("file_path", file[0]);
      // console.log(fileData.entries());
      // fileData.forEach((value, key) => {
      //   console.log("key %s: value %s", key, value);
      // });

      fileData.append("_method", "PATCH");
      const uploadImage = new Promise((resolve, reject) => {
        api
          .post("/api/user/change-profile-image/" + this.userId, fileData, {
            onUploadProgress: (progressEvent) => {
              this.onProgressBar =
                Math.round((progressEvent.loaded / progressEvent.total) * 100) / 100;
            },
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          })
          .then((res) => {
            resolve(res);
            // console.log(res.data);
          })
          .catch((err) => {
            reject(err);
            // console.log(err);
          });
      });
      uploadImage
        .then((response) => {
          // console.log(response);
          if (this.onProgressBar == 1) {
            setTimeout(() => {
              this.showChangeImageDialog = false;
              // if (this.showChangeImageDialog == false) {
              this.$q.notify({
                type: "positive",
                message: `Uploaded Successfully`,
              });
              this.rowDatas = [];
              this.onProgressBar = 0;
              this.getAllParent();
              this.getAllTeacher();
              this.getAllEmployee();
              this.getAllStudent();
              this.$emit("hideImage");

              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // });
    },
    onRejected(rejectedEntries) {
      this.$q.notify({
        type: "negative",
        message: `Error validation constraints. Max file size 2048!`,
        icon: "error",
      });
      this.$q.loading.hide();
    },
    ...mapActions("ParentStore", ["getAllParent"]),
    ...mapActions("TeacherStore", ["getAllTeacher"]),
    ...mapActions("EmployeeStore", ["getAllEmployee"]),
    ...mapActions("StudentStore", ["getAllStudent"]),
  },
  mounted() {
    // console.log(this.userId);
  },
  created() {},
};
</script>

<style></style>
