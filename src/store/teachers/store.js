import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  rowStudentDatas: [],
  tempRowDatas: [],
};
const mutations = {
  getAllSections(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        course: val.code,
        courseId: val.courseId,
        name: val.name,
        user: val.userName,
        semester: val.title,
        semester_id: val.semesterId,
        year: val.yearName,
      });
    });
    // console.log(state.rowDatas);
  },
  getAllStudent(state, payload) {
    state.rowStudentDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowStudentDatas.push({
        id: val.id,
        name: val.lastname + ", " + val.firstname + " " + val.middlename,
        prelim: val.prelim,
        midterm: val.midterm,
        semifinal: val.semi_final,
        final: val.final,
        average: val.average_grade,
        remarks: val.remarks,
        profile_image: val.profile_image,
      });
    });
    // console.log(state.rowDatas);
  },
};

const actions = {
  async getAllStudent({ commit }, payload) {
    await api
      .get("/api/teachers/subject/all/student/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        console.log(response);

        commit("getAllStudent", response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            type: "negative",
            message: error.response.data.message,
            position: "top",
          });
        }, 3000);
      });
  },
  async getAllSections({ commit }, payload) {
    await api
      .get("/api/teachers/section", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        console.log(response);

        commit("getAllSections", response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            type: "negative",
            message: error.response.data.message,
            position: "top",
          });
        }, 3000);
      });
  },
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
