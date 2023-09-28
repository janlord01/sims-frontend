import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllFiles(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.files).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        title: val.title,
        description: val.descr,
        type: val.type,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllFiles({ commit }, payload) {
    await api
      .get("/api/settings/file", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllFiles", response);
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
