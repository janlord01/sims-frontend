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
        <q-toolbar-title class="text-h6">Create Teacher Account</q-toolbar-title>
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
              @filter="filterProvince"
              :options="getProvince"
              use-input
              input-debounce="0"
              behavior="menu"
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
              @filter="filterCity"
              use-input
              input-debounce="0"
              behavior="menu"
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
              @filter="filterBarangay"
              v-model="formData.barangay"
              use-input
              input-debounce="0"
              behavior="menu"
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
          </div>
          <!-- <div class="row q-col-gutter-none q-mt-md">
            <q-input
              filled
              :rule="[requiredRule]"
              v-model="formData.studentID"
              type="text"
              name="studentID"
              label="Student ID"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="fingerprint"> </q-icon>
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.stayWith"
              label="Stay With"
              name="stayWith"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="family_restroom" />
              </template>
            </q-input>
          </div> -->
          <!-- <div class="row q-col-gutter-none q-mt-md">
            <q-select
              filled
              v-model="formData.transferee"
              :options="options"
              label="Transferee?"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="screen_share" />
              </template>
            </q-select>
          </div> -->
          <!-- <div class="schoolInfo" v-if="formData.transferee == 'yes'">
            <q-separator class="q-mt-md q-mt-md"></q-separator>
            <div class="row q-col-gutter-none q-mt-md">
              <q-input
                filled
                v-model="formData.lastSchool"
                label="Last School Completed"
                :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              >
                <template v-slot:prepend>
                  <q-icon name="holiday_village" />
                </template>
              </q-input>
              <q-input
                filled
                v-model="formData.lastYear"
                label="Last Year Completed"
                name="lastYear"
                :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              >
                <template v-slot:prepend>
                  <q-icon name="holiday_village" />
                </template>
              </q-input>
              <q-input
                filled
                v-model="formData.schoolName"
                label="School Name"
                name="schoolName"
                :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-none'"
              >
                <template v-slot:prepend>
                  <q-icon name="holiday_village" />
                </template>
              </q-input>
            </div>
            <div class="row q-col-gutter-none q-mt-md">
              <q-input
                filled
                v-model="formData.schoolAddress"
                label="School Address"
                :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
              >
                <template v-slot:prepend>
                  <q-icon name="holiday_village" />
                </template>
              </q-input>
              <q-input
                filled
                v-model="formData.schoolID"
                label="School ID"
                name="schoolID"
                :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
              >
                <template v-slot:prepend>
                  <q-icon name="holiday_village" />
                </template>
              </q-input>
            </div>
          </div> -->

          <q-separator class="q-mt-md q-mb-md" />
          <div class="row q-col-gutter-none q-mt-md">
            <q-input
              filled
              v-model="formData.email"
              label="Email"
              class="q-mr-sm col-3 full-width"
              type="email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.password"
              label="password"
              name="Password"
              class="q-mr-sm col-3 q-mt-md full-width"
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.password_confirmation"
              label="Confirm Password"
              name="password_confirmation"
              class="q-mr-sm col-3 q-mt-md full-width"
              :type="isPwdCom ? 'password' : 'text'"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdCom ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdCom = !isPwdCom"
                />
              </template>
            </q-input>
          </div>
          <div class="row q-mt-lg align-center">
            <q-btn
              unelevated
              label="Register"
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
        // studentID: "",
        // stayWith: "",
        // transferee: "",
        // lastSchool: "",
        // lastYear: "",
        // schoolName: "",
        // schoolAddress: "",
        // schoolID: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      displayForm: false,
      getProvince: [],
      getCity: [],
      getBarangay: [],
      stringOptions: [],
      stringOptionsCity: [],
      stringOptionsBarangay: [],
      province_name: "",
      leave: false,
      isPwd: true,
      isPwdCom: true,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("studentStore", ["registerStudent"]),
    // onSubmit() {
    //   //   this.registerStudent(this.formData);
    // },
    filterCity(val, update) {
      // console.log(val);
      if (val === "") {
        update(() => {
          this.getCity = this.stringOptionsCity;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.getCity = this.stringOptionsCity.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterBarangay(val, update) {
      // console.log(val);
      if (val === "") {
        update(() => {
          this.getBarangay = this.stringOptionsBarangay;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.getBarangay = this.stringOptionsBarangay.filter(
          (word) => word.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterProvince(val, update) {
      // console.log(val);
      if (val === "") {
        update(() => {
          this.getProvince = this.stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.getProvince = this.stringOptions.filter(
          (word) => word.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async onSubmit() {
      this.$q.loading.show();

      // let currentDate = new Date();
      // let birthDate = new Date("1980/12/31");
      // let difference = currentDate - this.formData.birthday;
      // let age = Math.floor(difference / 31557600000);

      await api
        .post(
          "/api/teacher",
          {
            firstname: this.formData.firstname,
            middlename: this.formData.middlename,
            lastname: this.formData.lastname,
            birthday: this.formData.birthday,
            // age: age,
            gender: this.formData.gender,
            nationality: this.formData.nationality,
            address: this.formData.address,
            country: this.formData.country,
            province: this.formData.province.label,
            city: this.formData.city.label,
            barangay: this.formData.barangay,
            zipcode: this.formData.zipcode,
            facebook: this.formData.facebook,
            number: this.formData.number,
            religion: this.formData.religion,
            email: this.formData.email,
            password: this.formData.password,
            password_confirmation: this.formData.password_confirmation,
          },
          {
            headers: {
              Authorization: "Bearer " + LocalStorage.getItem("jwt"),
            },
          }
        )
        .then((response) => {
          //   console.log(response.data.data);
          if (response.data.status == 200) {
            setTimeout(() => {
              this.leave = true;
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
                timeout: 3000,
              });
              this.formData.firstname = "";
              this.formData.middlename = "";
              this.formData.lastname = "";
              this.formData.birthday = "";
              this.formData.gender = "";
              this.formData.nationality = "";
              this.formData.address = "";
              this.formData.country = "";
              this.formData.province = "";
              this.formData.city = "";
              this.formData.barangay = "";
              this.formData.zipcode = "";
              this.formData.facebook = "";
              this.formData.number = "";
              this.formData.religion = "";
              this.formData.email = "";
              this.formData.password = "";
              this.formData.password_confirmation = "";
              this.$q.loading.hide();

              this.$router.push("/user/teacher");
            }, 3000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
                icon: "error",
                timeout: 3000,
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            this.$q.notify({
              type: "negative",
              message: error.response.data.message,
              icon: "error",
              timeout: 3000,
            });
            this.$q.loading.hide();
          }, 3000);
        });
    },

    async getProvinces() {
      await api
        .get("api/address/provinces", {})
        .then((response) => {
          Object.entries(response.data).map(([key, val]) => {
            this.stringOptions.push({
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
            this.stringOptionsCity.push({
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
          // console.log(response);
          Object.entries(response.data).map(([key, val]) => {
            this.stringOptionsBarangay.push(val.name);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUserDels() {
      // console.log(this.formData);
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
  },
  watch: {
    getProvince(old) {
      // console.log(old);
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
