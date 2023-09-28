<template>
  <q-card style="max-width: 1000px; width: 1000px">
    <!-- <div class="bg-white text-black shadow-2"> -->
    <!-- <q-spinner-ios
      color="primary"
      size="2em"
      v-if="!displayForm"
      class="absolute-center"
    /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title class="text-h6">Update Registration</q-toolbar-title>
      <!-- <q-toolbar class="bg-secondary text-white"> -->
      <!-- <q-toolbar-title> Import Student </q-toolbar-title> -->
      <q-btn flat icon="close" round v-close-popup></q-btn>
      <!-- </q-toolbar> -->
    </q-toolbar>
    <!-- <q-card-section> -->

    <q-toolbar>
      <q-separator></q-separator>
      <q-form
        @submit="onSubmit"
        class="column q-pa-md shawdow full-width block"
        ref="formName"
      >
        <!-- <p>Name</p> -->
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
        <!-- <p>Address</p> -->
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
            :disable="stringOptionsCity.length == 0"
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
            :disable="stringOptionsBarangay.length == 0"
            input-debounce="0"
            behavior="menu"
            label="Barangay"
            :class="$q.screen.gt.sm ? 'q-mr-sm col-4 ' : 'full-width q-mb-md'"
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
        </div>
        <div class="row q-col-gutter-none q-mt-md">
          <!-- <q-input
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
            </q-input> -->

          <q-select
            filled
            v-model="formData.role"
            :options="['student', 'parent']"
            label="Role"
            :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
            @update:model-value="checkIfStudent"
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
            </template>
          </q-select>
          <q-select
            filled
            v-model="formData.year"
            :options="yearLevels"
            v-if="formData.role == 'student'"
            label="Year/Grade Level"
            stack-label
            :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
            </template>
          </q-select>
          <q-select
            filled
            v-model="formData.course"
            :options="courses"
            stack-label
            v-if="
              formData.year.label == '1st Year' ||
              formData.year.label == '2nd Year' ||
              formData.year.label == '3rd Year' ||
              formData.year.label == '4th Year' ||
              formData.year.label == '5th Year' ||
              formData.year.label == '6th Year' ||
              formData.year.label == '7th Year'
            "
            @update:model-value="checkTest"
            label="Preferred Course"
            :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
          >
            <template v-slot:prepend>
              <q-icon name="reduce_capacity" />
            </template>
          </q-select>
        </div>
        <div class="row q-col-gutter-none q-mt-md">
          <q-select
            filled
            v-model="formData.transferee"
            v-if="formData.role == 'student'"
            :options="options"
            label="Transferee?"
            :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-sm'"
          >
            <template v-slot:prepend>
              <q-icon name="screen_share" />
            </template>
          </q-select>
        </div>
        <div class="schoolInfo" v-if="formData.transferee == 'yes'">
          <q-separator class="q-mt-md q-mt-md"></q-separator>
          <div class="row q-col-gutter-none q-mt-md">
            <q-input
              filled
              v-model="formData.lastSchool"
              label="Last School Semester Completed"
              :class="$q.screen.gt.sm ? 'q-mr-sm col-3 ' : 'full-width q-mb-md'"
            >
              <template v-slot:prepend>
                <q-icon name="holiday_village" />
              </template>
            </q-input>
            <q-input
              filled
              v-model="formData.lastYear"
              label="Last School Year Completed"
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
        </div>

        <!-- <q-separator class="q-mt-md q-mb-md" />
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
        </div> -->
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
      <!-- </q-toolbar> -->
    </q-toolbar>
    <!-- </div> -->
    <!-- <pre>{{ formData.barangay }}</pre> -->
  </q-card>
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

const options = ["no", "yes"];
const genderData = ["Male", "Female"];
export default defineComponent({
  props: ["userId"],
  emits: ["hideEditDialog"],
  setup() {
    // const $q = useQuasar();

    // calling here; equivalent to when component is created
    return {
      requiredRule,
      //   optionsData,
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
        city: [],
        barangay: [],
        zipcode: "",
        facebook: "",
        number: "",
        religion: "",
        studentID: "",
        stayWith: "",
        transferee: "",
        lastSchool: "",
        lastYear: "",
        schoolName: "",
        schoolAddress: "",
        schoolID: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        year: [],
        course: [],
      },
      displayForm: false,
      getProvince: [],
      getCity: [],
      getBarangay: [],
      stringOptions: [],
      stringOptionsCity: [],
      stringOptionsBarangay: [],
      role: "",
      province_name: "",
      leave: false,
      isPwd: true,
      isPwdCom: true,
      newToken: LocalStorage.getItem("jwt"),
      yearLevels: [],
      courses: [],
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("studentStore", ["registerStudent"]),
    ...mapActions("StudentStore", ["onSearch", "getAllOnlineRegStudent"]),

    checkTest() {
      //   console.log(this.formData.year);
      //   console.log(this.formData.course);
    },
    checkIfStudent() {
      this.formData.year = "";
      this.formData.course = "";
      this.formData.transferee = "";
      this.formData.lastSchool = "";
      this.formData.schoolName = "";
      this.formData.schoolAddress = "";
      this.formData.schoolID = "";
      this.getLevels();
    },
    getCourses() {
      api
        .get("/api/all/courses")
        .then((response) => {
          // console.log(response);
          this.courses = [];
          Object.entries(response.data.courses).map(([key, val]) => {
            this.courses.push({
              // value: val.id,
              label: val.code,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLevels() {
      api
        .get("/api/all/levels")
        .then((response) => {
          // console.log(response);
          this.yearLevels = [];
          Object.entries(response.data.data).map(([key, val]) => {
            this.yearLevels.push({
              // value: val.id,
              label: val.name,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getProfile() {
      await api
        .get("/api/student/online-registration/" + this.userId + "/edit", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          console.log(response);
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
          this.formData.studentID = response.data.users.student_id;
          this.formData.stayWith = response.data.users.stay_with;
          this.formData.transferee = response.data.users.transfery;
          this.formData.lastSchool = response.data.users.last_school_year_completed;
          this.formData.lastYear = response.data.users.last_year_completed;
          this.formData.schoolName = response.data.users.school_name;
          this.formData.schoolAddress = response.data.users.school_address;
          this.formData.schoolID = response.data.users.school_id;
          this.formData.role = response.data.users.role;
          this.formData.year.label = response.data.users.year;
          this.formData.course.label = response.data.users.course;
          //   this.formData.email = response.data.users.email;
          //   this.formData.password = "";
          //   this.formData.password_confirmation = "";
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
            this.leave = true;
            this.$router.push("/user/student");
          }, 500);
        });
    },
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
      await api
        .patch(
          "/api/student/online-registration/update/" + this.userId,
          {
            firstname: this.formData.firstname,
            middlename: this.formData.middlename,
            lastname: this.formData.lastname,
            birthday: this.formData.birthday,
            gender: this.formData.gender,
            nationality: this.formData.nationality,
            address: this.formData.address,
            country: this.formData.country,
            province: this.formData.province.label
              ? this.formData.province.label
              : this.formData.province,
            city: this.formData.city.label
              ? this.formData.city.label
              : this.formData.city,
            barangay: this.formData.barangay.label
              ? this.formData.barangay.label
              : this.formData.barangay,
            zipcode: this.formData.zipcode,
            facebook: this.formData.facebook,
            number: this.formData.number,
            religion: this.formData.religion,
            studentID: this.formData.studentID,
            stayWith: this.formData.stayWith,
            transferee: this.formData.transferee,
            lastSchool: this.formData.lastSchool,
            lastYear: this.formData.lastYear,
            schoolName: this.formData.schoolName,
            schoolAddress: this.formData.schoolAddress,
            schoolID: this.formData.schoolID,
            // email: this.formData.email,
            // password: this.formData.password,
            // password_confirmation: this.formData.password_confirmation,
            role: this.formData.role,
            year: this.formData.year.label ? this.formData.year.label : null,
            course: this.formData.course.label ? this.formData.course.label : null,
          },
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          //   console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              this.leave = true;
              this.$q.notify({
                type: "positive",
                message: response.data.message,
                icon: "save",
                timeout: 5000,
                position: "top",
              });
              this.$q.loading.hide();
              this.getAllOnlineRegStudent();
              this.$emit("hideEditDialog");
            }, 1000);
          } else {
            setTimeout(() => {
              this.$q.notify({
                type: "negative",
                message: response.data.message,
                icon: "error",
                timeout: 3000,
                position: "top",
              });
              this.$q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);

          setTimeout(() => {
            this.$q.loading.hide();
            this.$q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "top",

              message: error.response.data.message,
            });
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
          this.formData.stringOptionsCity = [];
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

    this.getCourses();
    this.getLevels();
    // this$q.dark.set(true);

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
  // beforeRouteLeave(to, from, next) {
  //   if (this.leave == false) {
  //     this.$q
  //       .dialog({
  //         title: "Unsaved",
  //         message: "Do you really want to leave? you have unsaved changes!",
  //         cancel: true,
  //         persistent: false,
  //         ok: "Leave",
  //       })
  //       .onOk(() => {
  //         this.leave == false;
  //         next();
  //       })
  //       .onDismiss(() => {});
  //   } else {
  //     this.leave == false;
  //     next();
  //   }
  // },
});
</script>
<style></style>
