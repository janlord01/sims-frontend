import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllAcademic(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.academics).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        year: val.year,
        due: val.payment_due,
        status: val.status,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  
  async getAllAcademic({ commit }, payload) {
    await api
      .get("/api/settings/academic-year", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllAcademic", response);
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
