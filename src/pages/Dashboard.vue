<template>
  <q-page>
    <div class="bg-white text-black shadow-2 q-mb-lg">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Announcement</q-toolbar-title>
      </q-toolbar>

      <Announcement />
      <!-- <Bar /> -->
      <div
        class="q-pa-md row items-start q-gutter-lg"
        v-if="
          userDetails.roles.some(
            (permis) => ['super-admin'].indexOf(permis) !== -1
          )
        "
      >
        <q-card class="my-card col-2">
          <q-card-section>
            <q-item>
              <q-item-section side>
                <q-avatar
                  circle
                  color="secondary"
                  text-color="white"
                  size="48px"
                  icon="people"
                >
                  <!-- <img src="https://cdn.quasar.dev/img/avatar.png" />
                  <q-badge floating color="teal">new</q-badge> -->
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ student }} Student</q-item-label>
                <!-- <q-item-label caption>1000 student</q-item-label> -->
              </q-item-section>
              <!-- <q-item-section side> 3 min ago </q-item-section> -->
            </q-item>
          </q-card-section>
        </q-card>
        <q-card class="my-card col-2">
          <q-card-section>
            <q-item>
              <q-item-section side>
                <q-avatar
                  circle
                  color="primary"
                  text-color="white"
                  size="48px"
                  icon="escalator_warning"
                >
                  <!-- <img src="https://cdn.quasar.dev/img/avatar.png" />
                  <q-badge floating color="teal">new</q-badge> -->
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ parent }} Parent</q-item-label>
                <!-- <q-item-label caption>1000 student</q-item-label> -->
              </q-item-section>
              <!-- <q-item-section side> 3 min ago </q-item-section> -->
            </q-item>
          </q-card-section>
        </q-card>
        <q-card class="my-card col-2">
          <q-card-section>
            <q-item>
              <q-item-section side>
                <q-avatar
                  circle
                  color="orange"
                  text-color="white"
                  size="48px"
                  icon="groups"
                >
                  <!-- <img src="https://cdn.quasar.dev/img/avatar.png" />
                  <q-badge floating color="teal">new</q-badge> -->
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ teacher }} Teacher</q-item-label>
                <!-- <q-item-label caption>1000 student</q-item-label> -->
              </q-item-section>
              <!-- <q-item-section side> 3 min ago </q-item-section> -->
            </q-item>
          </q-card-section>
        </q-card>
        <q-card class="my-card col-2">
          <q-card-section>
            <q-item>
              <q-item-section side>
                <q-avatar
                  circle
                  color="purple"
                  text-color="white"
                  size="48px"
                  icon="engineering"
                >
                  <!-- <img src="https://cdn.quasar.dev/img/avatar.png" />
                  <q-badge floating color="teal">new</q-badge> -->
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ employee }} Employee</q-item-label>
                <!-- <q-item-label caption>1000 student</q-item-label> -->
              </q-item-section>
              <!-- <q-item-section side> 3 min ago </q-item-section> -->
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div
        class="q-pa-md row items-start q-gutter-md"
        v-if="
          userDetails.roles.some(
            (permis) => ['super-admin'].indexOf(permis) !== -1
          )
        "
      >
        <q-card class="my-card col-5">
          <!-- <q-card class="my-card col-5 q-mr-md">
            <q-card-section>
              <canvas :id="studentPollution"></canvas>
            </q-card-section>
          </q-card> -->

          <q-card-section>
            <canvas :id="gender"></canvas>
          </q-card-section>
        </q-card>
        <q-card class="my-card col-5">
          <q-card-section>
            <canvas :id="courses"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <!-- <div class="q-pa-md row items-start q-gutter-md">
        <q-card class="my-card">
          <q-card-section>
            <canvas :id="finances"></canvas>
          </q-card-section>
        </q-card>
      </div> -->
    </div>
    <div
      class="bg-white text-black shadow-2"
      v-if="
        userDetails.roles.some(
          (permis) => ['super-admin'].indexOf(permis) === -1
        )
      "
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Entry & Exit Logs</q-toolbar-title>
      </q-toolbar>
      <Logging />
    </div>
    <!-- <div
      class="bg-white text-black shadow-2"
      v-if="userDetails.roles.some((permis) => ['student'].indexOf(permis) !== -1)"
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Schedules</q-toolbar-title>
      </q-toolbar>
      <Logging />
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
// import { Bar } from "vue-chartjs";
// import { Bar } from "vue-chartjs/legacy";
// import VueApexCharts from "vue-apexcharts";
// import {
//   Chart,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
import Chart from "chart.js/auto";
// import { getRelativePosition } from 'chart.js/helpers';

import { LocalStorage } from "quasar";
import Announcement from "components/Announcement.vue";
import Logging from "components/LoggingHistory.vue";
// import Logging from "pages/LogginHistory.vue";
import { mapActions, mapState } from "vuex";
import { api } from "src/boot/axios";

// Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
//
export default defineComponent({
  // extends: Bar,
  name: "Dashboard",
  data() {
    return {
      name: "",
      email: "",
      role: ["student"],
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [{ data: [40, 20, 12] }],
      },
      chartOptions: {
        responsive: true,
      },
      studentPollution: "student_ppl",
      gender: "gender",
      courses: "courses",
      coursesList: [],
      countFirst: null,
      countSecond: null,
      countThird: null,
      countFourth: null,
      countFifth: null,
      countSixth: null,
      countSeventh: null,
      countEightth: null,
      countNineth: null,
      countTenth: null,
      dataArray: [],
      male: null,
      famale: null,
      student: null,
      parent: null,
      employee: null,
      teacher: null,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("StudentUserStore", ["getLogs"]),

    async createCourseChart(course) {
      await api
        .get("/api/reports/registrar", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          // if (response.length > 0) {
          // console.log(response);
          this.countFirst = response.data.courseFirst;
          this.countSecond = response.data.courseSecond;
          this.countThird = response.data.courseThird;
          this.countFourth = response.data.courseFourth;
          this.countFifth = response.data.courseFifth;
          this.countSixth = response.data.courseSixth;
          this.countSeventh = response.data.courseseventh;
          this.countEightth = response.data.courseeighth;
          this.countNineth = response.data.coursenineth;
          this.countTenth = response.data.coursetenth;
          Object.entries(response.data.courses).map(([key, val]) => {
            this.coursesList.push(val.code);
          });

          console.log(this.countFirst != 0 ? this.countFirst : "");
          // }
        })
        .catch((error) => {
          console.log(error);
        });
      const myChart = new Chart(this.courses ? this.courses : course, {
        type: "bar",
        data: {
          labels: this.coursesList,
          datasets: [
            {
              label: "Courses",
              fill: true,
              backgroundColor: [
                "rgb(38, 166, 154)",
                "rgb(24, 118, 209)",
                "orange",
                "purple",
              ],
              borderColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointBackgroundColor: "rgba(179,181,198,1)",
              data: [
                // this.countFirst != 0 ? this.countFirst + "," : ""
                // this.countSecond != 0 ? this.countSecond + ",": ""
                // this.countThird != 0 ? this.countThird + ",": ""
                // this.countFourth != 0 ? this.countFourth + ",": ""
                this.countFifth != 0 ? this.countFifth : "",
                this.countSixth != 0 ? this.countSixth : "",
                this.countSeventh != 0 ? this.countSeventh : "",
                this.countEightth != 0 ? this.countEightth : "",
                this.countNineth != 0 ? this.countNineth : "",
                // this.countTenth != 0 ? this.countTenth + ",": ""
              ],
              borderWidth: 1.5,
            },

            // {
            //   label: "2050",
            //   fill: true,
            //   backgroundColor: "rgba(255,99,132,0.2)",
            //   borderColor: "rgba(255,99,132,1)",
            //   pointBorderColor: "#fff",
            //   pointBackgroundColor: "rgba(255,99,132,1)",
            //   data: [25.48, 54.16, 7.61, 8.06, 4.45],
            //   borderWidth: 1.5,
            // },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Distribution in % of world population",
          },
        },
      });
    },
    createChart(gender) {
      const myChart = new Chart(
        this.studentPollution ? this.studentPollution : gender,
        {
          type: "line",
          data: {
            labels: [
              "Africa",
              "Asia",
              "Europe",
              "Latin America",
              "North America",
            ],
            datasets: [
              {
                label: "1950",
                fill: true,
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(179,181,198,1)",
                data: [8.77, 55.61, 21.69, 6.62, 6.82],
                borderWidth: 1.5,
              },
              {
                label: "2050",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                data: [25.48, 54.16, 7.61, 8.06, 4.45],
                borderWidth: 1.5,
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: "Distribution in % of world population",
            },
          },
        }
      );
      return myChart;
    },
    async createChartGender() {
      // const ctx = document.getElementById(chartId);
      await api
        .get("/api/reports/registrar", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          // if (response.length > 0) {
          // console.log(response);
          this.male = response.data.male;
          this.female = response.data.female;
          this.teacher = response.data.teacher;
          this.student = response.data.student;
          this.employee = response.data.employee;
          this.parent = response.data.parent;

          // }
        })
        .catch((error) => {
          console.log(error);
        });
      const myChart = new Chart(this.gender, {
        type: "pie",
        data: {
          labels: ["Male", "Female"],
          datasets: [
            {
              label: "Male",
              fill: true,
              backgroundColor: ["rgb(38, 166, 154)", "rgb(24, 118, 209)"],
              borderColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointBackgroundColor: "rgba(179,181,198,1)",
              data: [this.male, this.female],
              borderWidth: 1.5,
            },
            // {
            //   label: "2050",
            //   fill: true,
            //   backgroundColor: "rgba(255,99,132,0.2)",
            //   borderColor: "rgba(255,99,132,1)",
            //   pointBorderColor: "#fff",
            //   pointBackgroundColor: "rgba(255,99,132,1)",
            //   data: [25.48, 54.16, 7.61, 8.06, 4.45],
            //   borderWidth: 1.5,
            // },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Distribution in % of world population",
          },
        },
      });
      return myChart;
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    this.getUserDetails();
    this.createChart();
    this.createChartGender(this.gender ? this.gender : "gender");
    this.createCourseChart(this.courses ? this.courses : "courses");
    this.getLogs();
  },
  components: {
    Announcement,
    Logging,
    // Bar,
  },
});
</script>
<style></style>
