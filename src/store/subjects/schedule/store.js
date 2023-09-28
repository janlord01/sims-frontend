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
  getAllSchedules(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.subjects).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        // time_start: val.time_start,
        // time_end: val.time_end,
        // day: val.day,
        available: val.available,
        limit: val.limit,
        price: val.overide_unit_price,
        schedules: val.schedules,
        course: val.course_code,
      });
    });
    state.rowDatas = state.tempData;
    // console.log(state.rowDatas);
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
  async getAllSchedules({ commit }, payload) {
    await api
      .get("/api/subjects", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllSchedules", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async onSearch({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] === "" || payload[0] === null || payload.length === 0) {
        // state.unenrolled = state.unenrolled;
        dispatch("onSemSelect", payload[1]);
      } else {
        commit("onSearch", name);
      }
    }
  },

  // async onSearch({ commit }, payload) {
  //   // console.log(payload);
  //   if (payload[0].length > 0) {
  //     await api
  //       .get(
  //         "/api/subjects/schedule/search/" + payload[1],
  //         {
  //           params: {
  //             name: payload[0],
  //           },
  //         },
  //         {
  //           headers: {
  //             Authorization: "Bearer " + LocalStorage.getItem("jwt"),
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         // console.log(response);
  //         // if()
  //         commit("getAllSchedules", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     await api
  //       .get(
  //         "/api/subjects/semester/select",
  //         {
  //           params: {
  //             sem_id: payload[1],
  //           },
  //         },
  //         {
  //           headers: {
  //             Authorization: "Bearer " + LocalStorage.getItem("jwt"),
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         commit("getAllSchedules", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // },

  async onSemSelect({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/subjects/semester/select",
        {
          params: {
            sem_id: payload.value ? payload.value : payload,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllSchedules", response);
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
