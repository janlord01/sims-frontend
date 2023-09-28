import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  tempData: [],
  rowDataLogs: [],
};
const mutations = {
  getLogs(state, payload) {
    state.rowDataLogs = [];
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDataLogs.push({
        id: val.id,
        name: val.name,
        profile_image: val.profile_image,
        time_in_location: val.time_in_location,
        time_in: val.time_in,
        time_out_location: val.time_out_location,
        time_out: val.time_out,
      });
    });
  },
  getAllStudentSchedules(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price: val.overide_unit_price,
        schedules: val.schedules,
        course: val.course_code,
        first_grading: val.prelim,
        second_grading: val.midterm,
        third_grading: val.semi_final,
        fourth_grading: val.final,
        final_grade: val.average_grade,
        remark: val.remarks,
      });
    });
    // console.log(state.rowDatas);
  },
  onSearch(state, payload) {
    state.tempData = state.rowDatas;
    state.rowDatas = [];
    state.rowDatas = state.tempData.filter((subject) => {
      return Object.values(subject).some((word) =>
        String(word).toLowerCase().includes(payload)
      );
    });

    // const needle = val.toLowerCase();
    // this.yearOptions = this.years.filter(
    //   (word) => word.label.toLowerCase().indexOf(needle) > -1
    // );
    // console.log(state.unenrolled);
  },
};

// const $q = useQuasar();
const actions = {
  async getLogs({ commit }) {
    // console.log("semester " + payload);
    await api
      .get("/api/student/logs", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        console.log(response);

        if (response.data.status === 404) {
          setTimeout(() => {
            Notify.create({
              position: "top",
              type: "negative",
              message: response.data.message,
              timeout: 3000,
            });
          }, 1000);
        } else {
          commit("getLogs", response);
        }

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            position: "top",
            type: "negative",
            message: error.data.error.message,
            timeout: 3000,
          });
        }, 1000);
      });
  },
  async getAllStudentSchedules({ commit }, payload) {
    // console.log("semester " + payload);
    await api
      .get(
        "/api/student/schedules",
        {
          params: {
            semester: payload,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        console.log(response);

        commit("getAllStudentSchedules", response);
        if (response.data.status === 404) {
          setTimeout(() => {
            Notify.create({
              position: "top",
              type: "negative",
              message: response.data.message,
              timeout: 3000,
            });
          }, 1000);
        }

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            position: "top",
            type: "negative",
            message: "Student has no schedule yet!",
            timeout: 3000,
          });
        }, 1000);
      });
  },

  //   async onSemSelect({ commit }, payload) {
  //     // console.log(payload);

  //     await api
  //       .get(
  //         "/api/subjects/semester/select",
  //         {
  //           params: {
  //             sem_id: payload.value ? payload.value : payload,
  //           },
  //         },
  //         {
  //           headers: {
  //             Authorization: "Bearer " + LocalStorage.getItem("jwt"),
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         commit("getAllSchedules", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   },
};

const getters = {
  clearForm: (state) => {
    return state.passForm;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
