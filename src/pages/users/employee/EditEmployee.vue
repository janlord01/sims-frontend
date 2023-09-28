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
        <q-toolbar-title class="text-h6">Edit Employee Details</q-toolbar-title>
      </q-toolbar>
      <q-toolbar class="" v-if="displayForm">
        <q-separator></q-separator>
        <q-form
          @submit="onSubmit"
          class="column q-pa-md shawdow full-width block"
          ref="formName"
        >
          <p>Name</p>
          <div class="row q-col-gutter-none q-mb-md">
            <q-input
              filled
              v-model="formData.firstname"
              name="firstname"
              label="Firstname"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              type="text "
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.middlename"
              name="middlename"
              label="Middle Name"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              type="text"
            >
              <!-- <template v-slot:append>
                <q-icon name="event" />
              </template> -->
            </q-input>
            <q-input
              filled
              v-model="formData.lastname"
              name="lastname"
              label="Last Name"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3' : 'full-width'"
              type="text"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="event" />
              </template> -->
            </q-input>
          </div>
          <div class="row q-col-gutter-none">
            <q-input
              filled
              v-model="formData.birthday"
              mask="date"
              name="birthday"
              label="Birthday"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="event">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    color="secondary"
                  >
                    <q-date v-model="formData.birthday" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="secondary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              filled
              v-model="formData.gender"
              :options="genderData"
              label="Gender"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
            <q-input
              filled
              v-model="formData.nationality"
              name="nationality"
              label="Nationality"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
              type="text"
            >
              <template v-slot:prepend>
                <q-icon name="flag" />
              </template>
            </q-input>
          </div>
          <q-separator inset class="q-mt-md q-mb-md"></q-separator>
          <p>Address</p>
          <div class="row q-col-gutter-none">
            <q-input
              filled
              v-model="formData.address"
              name="address"
              label="Full Address"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-9 ' : 'full-width q-mb-done'"
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
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'"
              @update:model-value="getBarangays"
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
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'"
              type="text"
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
              v-model="formData.number"
              type="text"
              name="number"
              label="Contact number"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="call"> </q-icon>
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.religion"
              label="Religion"
              name="religion"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'"
            >
              <template v-slot:prepend>
                <q-icon name="church" />
              </template>
            </q-input>
            <!-- <q-select
              filled
              :options="getRoles"
              v-model="formData.role"
              label="Roles"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="reduce_capacity" />
              </template>
            </q-select> -->
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
      </q-toolbar>
    </div>
    <!-- <pre>{{ formData.barangay }}</pre> -->
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState, mapGetters } from "vuex";
import { useQuasar, date } from "quasar";
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
  name: "Dashboard",
  data() {
    return {
      formData: {
        firstname: "",
        middlename: "",
        lastname: "",
        birthday: "",
        gender: "",
        nationality: "",
        address: "",
        country: "",
        province: "",
        city: "",
        barangay: "",
        zipcode: "",
        facebook: "",
        number: "",
        religion: "",
        role: "",
      },
      displayForm: false,
      getProvince: [],
      getCity: [],
      getBarangay: [],
      getRoles: [],
      province_name: "",
      leave: false,
      newToken: LocalStorage.getItem("jwt"),
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("studentStore", ["registerStudent"]),
    // onSubmit() {
    //   //   this.registerStudent(this.formData);
    // },
    async getProfile() {
      await api
        .get("/api/employee/" + this.$route.params.id + "/edit", {
          headers: {
            Authorization: "Bearer " + this.newToken,
          },
        })
        .then((response) => {
          this.formData.firstname = response.data.users.firstname;
          this.formData.middlename = response.data.users.middlename;
          this.formData.lastname = response.data.users.lastname;
          this.formData.birthday = response.data.users.dob;
          this.formData.gender = response.data.users.gender;
          this.formData.nationality = response.data.users.nationality;
          this.formData.address = response.data.users.address;
          this.formData.country = response.data.users.country;
          this.formData.province = response.data.users.province;
          this.formData.city = response.data.users.city;
          this.formData.barangay = response.data.users.barangay;
          this.formData.zipcode = response.data.users.zipcode;
          this.formData.facebook = response.data.users.fb;
          this.formData.number = response.data.users.number;
          this.formData.religion = response.data.users.religion;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async onSubmit() {
      this.$q.loading.show();

      await api
        .patch(
          "/api/employee/" + this.$route.params.id,
          {
            firstname: this.formData.firstname,
            middlename: this.formData.middlename,
            lastname: this.formData.lastname,
            birthday: this.formData.birthday,
            gender: this.formData.gender,
            nationality: this.formData.nationality,
            address: this.formData.address,
            country: this.formData.country,
            role: this.formData.role,
            province:
              this.formData.province.label != null
                ? this.formData.province.label
                : this.formData.province,
            city:
              this.formData.city.label != null
                ? this.formData.city.label
                : this.formData.city,
            barangay: this.formData.barangay,
            zipcode: this.formData.zipcode,
            facebook: this.formData.facebook,
            number: this.formData.number,
            religion: this.formData.religion,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          this.leave = true;
          //   console.log(response.data);
          // this.displayForm = false;
          if (response.data.status === 200) {
            setTimeout(() => {
              this.leave = true;
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
                timeout: 3000,
              });
              this.$q.loading.hide();
              this.formData.firstname = "";
              this.formData.middlename = "";
              this.formData.lastname = "";
              this.formData.birthday = "";
              this.formData.gender = "";
              this.formData.nationality = "";
              this.formData.address = "";
              this.formData.country = "";
              this.formData.province = "";
              this.formData.role = "";
              this.formData.city = "";
              this.formData.barangay = "";
              this.formData.zipcode = "";
              this.formData.facebook = "";
              this.formData.number = "";
              this.formData.religion = "";
              this.$router.push("/user/employee");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
                timeout: 3000,
              });
              this.$q.loading.hide();
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              message: error.response.data.message,
            });
            this.$q.loading.hide();
          }, 3000);
        });
    },
    async getAllRoles() {
      await api
        .get("/api/employee/roles/all", {})
        .then((response) => {
          console.log(response.data.data.roles);
          Object.entries(response.data.data.roles).map(([key, val]) => {
            this.getRoles.push({
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
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

          //   console.log(this.getProvince.province);
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
          //   this.getBarangay.length = 0;
          //   this.formData.barangay = "";
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
      console.log(this.formData);
    },
  },

  computed: {
    ...mapState("studentStore", ["userDetails"]),
    ...mapGetters("studentStore", ["clearForm"]),
  },
  mounted() {
    this.getProvinces();
    this.getProfile();
    setTimeout(() => {
      this.displayForm = true;
    }, 500);

    // if (LocalStorage.getItem("jwt")) {
    this.getUserDetails();
    // }
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
