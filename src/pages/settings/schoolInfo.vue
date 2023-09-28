<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-spinner-ios
        color="primary"
        size="2em"
        v-if="!displayForm"
        class="absolute-center"
      />
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">School Information</q-toolbar-title>
        <q-btn
          icon="add_photo_alternate"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Change School Logo' : ''"
          @click="showUpdateImageDialog"
        />
      </q-toolbar>
      <q-toolbar class="" v-if="displayForm">
        <q-separator></q-separator>
        <q-form
          @submit="onSubmit"
          class="column q-pa-md shawdow full-width block"
          ref="formName"
        >
          <p>School Name</p>
          <div class="row q-col-gutter-none q-mb-md">
            <q-input
              filled
              v-model="formData.name"
              name="name"
              label="School Name"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              type="text"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.chedno"
              name="chedno"
              label="Ched No."
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              type="text"
              :disable="disable"
            >
              <!-- <template v-slot:append>
                <q-icon name="event" />
              </template> -->
            </q-input>
            <q-input
              filled
              v-model="formData.classStart"
              mask="date"
              name="classStart"
              label="Class Start at"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="event">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    color="secondary"
                  >
                    <q-date v-model="formData.classStart" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="secondary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <p>Address</p>
          <div class="row q-col-gutter-none">
            <q-input
              filled
              v-model="formData.address"
              name="address"
              label="Full Address"
              :class="
                $q.screen.gt.sm ? 'q-mr-sm col-9 ' : 'full-width q-mb-done'
              "
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="house"> </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row q-col-gutter-none q-mt-md">
            <q-input
              filled
              v-model="formData.country"
              type="text"
              name="country"
              label="Country"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="language"> </q-icon>
              </template>
            </q-input>
            <q-select
              filled
              :options="getProvince"
              v-model="formData.province"
              label="Province"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              @update:model-value="getCities"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="emoji_transportation" />
              </template>
            </q-select>
            <q-select
              filled
              :options="getCity"
              v-model="formData.city"
              label="City"
              :class="
                $q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'
              "
              @update:model-value="getBarangays"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="location_city" />
              </template>
            </q-select>
          </div>
          <div class="row q-col-gutter-none q-mt-md">
            <q-select
              filled
              :options="getBarangay"
              v-model="formData.barangay"
              label="Barangay"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              @update:model-value="getUserDels"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="camera_outdoor"> </q-icon>
              </template>
            </q-select>
            <q-input
              filled
              v-model="formData.zipcode"
              label="Zipcode"
              name="zipcode"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.facebook"
              name="facebook"
              label="Facebook Link"
              :class="
                $q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'
              "
              type="text"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="facebook" />
              </template>
            </q-input>
          </div>
          <div class="row q-col-gutter-none q-mt-md">
            <q-input
              filled
              :rule="[requiredRule]"
              v-model="formData.cpnumber"
              type="text"
              name="cpnumber"
              label="Cell number"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="phone_android"> </q-icon>
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.phone"
              label="Phone"
              name="Phone Number"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="call" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="formData.email"
              label="Email"
              name="Email"
              :class="
                $q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'
              "
              :disable="disable"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>

          <div class="row q-mt-lg align-center">
            <q-btn
              v-if="isSave"
              unelevated
              label="Save"
              class="text-center q-mr-sm"
              color="secondary"
              size="md"
              type="submit"
            />
            <q-btn
              v-if="isEdit"
              unelevated
              label="Edit"
              class="text-center"
              color="secondary"
              @click="isEditSubmit"
              size="md"
              type="button"
            />
          </div>
        </q-form>
      </q-toolbar>
    </div>
    <q-dialog v-model="updateImageDialog">
      <updateImage
        @hide-update-dialog="updateImageDialog = !updateImageDialog"
      />
    </q-dialog>
    <!-- <pre>{{ formData.barangay }}</pre> -->
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { useQuasar, date } from "quasar";
import updateImage from "src/components/settings/schoolInfo/updateImage.vue";

import { api } from "src/boot/axios";
// import testOption from "./js/province";

const requiredRule = (val) =>
  (val && val.length > 0) || "Required, Please type something";

const validDate = (val) =>
  date.isValid(date.extractDate(val, "locale")) || "Invalid Date!";
const optionsData = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
const options = ["no", "yes"];
const genderData = ["Male", "Female"];
export default defineComponent({
  setup() {
    return {
      requiredRule,
      optionsData,
      options,
      genderData,
      //   getProvince,
      //   displayForm,
    };

    const $q = useQuasar();
  },

  components: {
    updateImage,
  },
  data() {
    return {
      formData: {
        name: "",
        chedno: "",
        classStart: "",
        address: "",
        country: "",
        province: "",
        city: "",
        barangay: "",
        zipcode: "",
        facebook: "",
        cpnumber: "",
        phone: "",
        email: "",
      },
      displayForm: false,
      getProvince: [],
      getCity: [],
      getBarangay: [],
      province_name: "",
      leave: false,
      isPwd: true,
      isPwdCom: true,
      isSave: false,
      isEdit: true,
      disable: true,
      newToken: LocalStorage.getItem("jwt"),
      updateImageDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("studentStore", ["registerStudent"]),
    ...mapActions("Userstore", ["getSchoolInfo"]),

    showUpdateImageDialog() {
      this.updateImageDialog = true;
    },
    // onSubmit() {
    //   //   this.registerStudent(this.formData);
    // },
    async getSchoolInfos() {
      await api
        .get("/api/school-info", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          //   console.log(response.data.data.school_info);
          this.formData.name = response.data.school_info.name;
          this.formData.chedno = response.data.school_info.Ched_no;
          this.formData.classStart = response.data.school_info.class_start;
          this.formData.address = response.data.school_info.address;
          this.formData.country = response.data.school_info.country;
          this.formData.province = response.data.school_info.province;
          this.formData.city = response.data.school_info.city;
          this.formData.barangay = response.data.school_info.barangay;
          this.formData.zipcode = response.data.school_info.zipcode;
          this.formData.facebook = response.data.school_info.fb;
          this.formData.cpnumber = response.data.school_info.cp_number;
          this.formData.phone = response.data.school_info.phone_number;
          this.formData.email = response.data.school_info.email;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    isEditSubmit() {
      this.isEdit = false;
      this.isSave = true;
      this.disable = false;
    },
    async onSubmit() {
      await api
        .post("/api/school-info", {
          name: this.formData.name,
          chedno: this.formData.chedno,
          classStart: this.formData.classStart,
          address: this.formData.address,
          country: this.formData.country,
          province: this.formData.province.label,
          city: this.formData.city.label,
          barangay: this.formData.barangay,
          zipcode: this.formData.zipcode,
          facebook: this.formData.facebook,
          cpnumber: this.formData.cpnumber,
          phone: this.formData.phone,
          email: this.formData.email,
        })
        .then((response) => {
          //   console.log(response.data.data);
          this.leave = true;
          this.displayForm = false;

          setTimeout(() => {
            // this.$router.push("/user/student");
            this.$q.notify({
              type: "positive",
              message: "School Information Saved!",
              icon: "save",
            });
            // this.formData.name = "";
            // this.formData.middlename = "";
            // this.formData.chedno = "";
            // this.formData.classStart = "";
            // this.formData.address = "";
            // this.formData.country = "";
            // this.formData.province = "";
            // this.formData.city = "";
            // this.formData.barangay = "";
            // this.formData.zipcode = "";
            // this.formData.facebook = "";
            // this.formData.cpnumber = "";
            // this.formData.phone = "";
            // this.formData.email = "";
            this.displayForm = true;
            this.isEdit = true;
            this.isSave = false;
            this.disable = true;
            this.displayForm = true;
            this.getSchoolInfo();
          }, 2000);
        })
        .catch((error) => {
          this.displayForm = false;
          //   console.log(error.response.data.errors);
          setTimeout(() => {
            Object.entries(error.response.data.errors).forEach((msg) => {
              this.$q.notify({
                type: "negative",
                message: msg[1],
                icon: "error",
              });
            });

            this.displayForm = true;
          }, 2000);
        });
    },

    async getProvinces() {
      await api
        .get("api/address/provinces", {})
        .then((response) => {
          Object.entries(response.data).map(([key, val]) => {
            this.getProvince.push({
              label: val.name,
              value: val.province_id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCities() {
      await api
        .get("/api/address/cities/" + this.formData.province.value)
        .then((response) => {
          this.getCity.length = 0;
          this.formData.city = "";
          Object.entries(response.data).map(([key, val]) => {
            this.getCity.push({
              label: val.name,
              value: val.city_id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getBarangays() {
      await api
        .get("/api/address/barangays/" + this.formData.city.value)
        .then((response) => {
          console.log(response);
          Object.entries(response.data).map(([key, val]) => {
            this.getBarangay.push(val.name);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUserDels() {
      //   console.log(this.formData);
    },
  },

  computed: {
    ...mapState("studentStore", ["userDetails"]),
    ...mapGetters("studentStore", ["clearForm"]),
  },
  mounted() {
    this.getProvinces();
    setTimeout(() => {
      this.displayForm = true;
    }, 500);

    this.getUserDetails();
    this.getSchoolInfos();
  },
  watch: {
    getProvince(old) {
      console.log(old);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.leave == false) {
      this.$q
        .dialog({
          title: "Unsaved",
          message: "Do you really want to leave? you have unsaved changes!",
          cancel: true,
          persistent: false,
          ok: "Leave",
        })
        .onOk(() => {
          this.leave == false;
          next();
        })
        .onDismiss(() => {});
    } else {
      this.leave == false;
      next();
    }
  },
});
</script>
<style></style>
