import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  rowDatasScholar: [],
};
const mutations = {
  getAllDiscount(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        name: val.description,
        number: val.number,
        type: val.type,
        placement: val.placement,
      });
    });
    // console.log(state.rowDatas);
  },
  getAllDiscountScholar(state, payload) {
    state.rowDatasScholar = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatasScholar.push({
        id: val.id,
        name: val.description,
        number: val.number,
        type: val.type,
        placement: val.placement,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllDiscount({ commit }, payload) {
    await api
      .get("/api/discounts", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        commit("getAllDiscount", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllDiscountScholar({ commit }, payload) {
    await api
      .get("/api/scholarship", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        commit("getAllDiscountScholar", response);
        // }
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
          "/api/courses/course/search",
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
          commit("getAllCourses", response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
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
