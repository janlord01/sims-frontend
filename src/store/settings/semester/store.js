import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllSemester(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.semesters).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        title: val.title,
        no_of_months: val.no_of_months,
        status: val.status,
        unit: val.unit,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllSemester({ commit }, payload) {
    await api
      .get("/api/settings/semester", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllSemester", response);
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
