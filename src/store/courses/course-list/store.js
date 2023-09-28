import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  tempData: [],
};
const mutations = {
  getAllCourses(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.courses).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        name: val.courseName,
        code: val.code,
        college: val.collegeName,
        status: val.status,
        description: val.descr,
      });
    });
    state.rowDatas = state.tempData;
  },
  onSearch(state, payload) {
    if (payload == "") {
      state.rowDatas = state.tempData;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowDatas = state.tempData.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
  },
};

// const $q = useQuasar();
const actions = {
  async getAllCourses({ commit }, payload) {
    await api
      .get("/api/courses", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllCourses", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async onSearch({ commit, dispatch }, payload) {
    if (payload == "" || payload == null) {
      dispatch("getAllCourses");
    } else {
      commit("onSearch", payload);
    }
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
