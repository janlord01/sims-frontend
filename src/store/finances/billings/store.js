import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
};
const mutations = {
  getAllBilling(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        name: val.name,
        amount: val.amount,
        category: val.category,
      });
    });
    // console.log(state.rowDatas);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllBilling({ commit }, payload) {
    await api
      .get("/api/billings", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllBilling", response);
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
