import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllRolesWithPermissions(state, payload) {
    state.rowDatas = [];
    // // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        name: val.name,
        permissions: val.permissions,
        status: val.status,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllRolesWithPermissions({ commit }, payload) {
    await api
      .get("/api/settings/roles-permissions", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllRolesWithPermissions", response);
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
