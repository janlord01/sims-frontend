import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllSubjects(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.subjects).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        code: val.code,
        description: val.descr,
        unit_lecture: val.unit_lecture,
        unit_lab: val.unit_lab,
        unit_practicum: val.unit_practicum,
        has_pre: val.has_pre,
        flag: val.flag,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllSubjects({ commit }, payload) {
    await api
      .get("/api/subjects", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllSubjects", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async onSearch({ commit }, payload) {
    // console.log(payload);
    if (payload.length > 0) {
      await api
        .get(
          "/api/subjects/on/search",
          {
            params: {
              name: payload,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + LocalStorage.getItem("jwt"),
            },
          }
        )
        .then((response) => {
          // console.log(response);
          // if()
          commit("getAllSubjects", response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await api
        .get("/api/subjects", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          commit("getAllSubjects", response);
        })
        .catch((error) => {
          console.log(error);
        });
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
