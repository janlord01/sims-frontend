import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  rowDataStudents: [],
  tempData: [],
  rowDataStudentSubject: [],
};
const mutations = {
  getAllColleges(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.colleges).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        college: val.collageName,
        dean: val.userName,
        description: val.descr,
      });
    });
    // console.log(state.rowDatas);
  },

  getAllStudent(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        profile_image: val.profile_image,
        year: val.level,
        status: val.scStatus != null ? val.scStatus : null,
        reasons: val.reasons !== null ? val.reasons : "",
        course:
          val.name !== null
            ? val.name + " (" + val.code + ")"
            : "Please assign course",
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
      });
    });
    state.rowDataStudents = state.tempData;
  },

  getAllStudentSubject(state, payload) {
    state.rowDataStudentSubject = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDataStudentSubject.push({
        id: val.id,
        code: val.code,
        descr: val.descr,
        unit: val.units,
        grade: val.grade,
      });
    });
  },
  onSearch(state, payload) {
    if (payload == "") {
      state.rowDataStudents = state.tempData;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowDataStudents = state.tempData.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
  },
};

// const $q = useQuasar();
const actions = {
  async getAllColleges({ commit }, payload) {
    await api
      .get("/api/colleges", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllColleges", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async getAllStudent({ commit }, payload) {
    await api
      .get("/api/courses/course/students", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllStudent", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async onSearch({ commit, dispatch }, payload) {
    if (payload == "" || payload == null) {
      dispatch("getAllStudent");
    } else {
      commit("onSearch", payload);
    }
  },
  async getAllStudentSubject({ commit }, payload) {
    // console.log(payload);
    await api
      .get("/api/courses/course/students/" + payload + "/subject", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllStudentSubject", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
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
