import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  tempRowDatas: [],
};
const mutations = {
  getSectionSubjectData(state, payload) {
    state.tempRowDatas = [];
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempRowDatas.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
        total_price: parseFloat(
          val.overide_unit_price != null
            ? val.total_units * val.overide_unit_price
            : val.flag == 1
            ? val.total_units * val.unit
            : 0
        ),
        total: val.total,
        balance: val.balance,
      });
    });
  },
  emptyAll(state) {
    state.tempRowDatas = [];
  },
  getAllSchedulesSubject(state, payload) {
    state.rowSubjectDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowSubjectDatas.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
      });
    });
  },
  getAllSections(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        course: val.code,
        courseId: val.courseId,
        name: val.name,
        user: val.userName,
        semester: val.title,
        semester_id: val.semesterId,
        year: val.yearName,
      });
    });
    // console.log(state.rowDatas);
  },
  removeSubject(state, payload) {
    // console.log(state.tempDataBilling);
    const objWithIdIndex = state.tempRowDatas.findIndex(
      (obj) => obj.id === payload
    );
    const objWithIdFilter = state.tempRowDatas.filter(
      (obj) => obj.id === payload
    );

    if (objWithIdIndex > -1) {
      state.tempRowDatas.splice(objWithIdIndex, 1);
      Notify.create({
        type: "positive",
        message: "Item Removed!",
        position: "top",
      });
    }
    return state.tempRowDatas;
  },
  addTempData(state, payload) {
    Object.entries(payload).map(([key, val]) => {
      state.tempRowDatas.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
        total_price: parseFloat(
          val.overide_unit_price != null
            ? val.total_units * val.overide_unit_price
            : val.flag == 1
            ? val.total_units * val.unit
            : 0
        ),
        total: val.total,
        balance: val.balance,
      });
    });
  },
};

// const $q = useQuasar();
const actions = {
  async getSectionSubjectData({ commit }, payload) {
    await api
      .get("/api/section/schedule-subject/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        commit("getSectionSubjectData", response);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            type: "positive",
            message: error.response.data.message,
            position: "top",
          });
        }, 3000);
      });
  },
  emptyAll({ commit }) {
    commit("emptyAll");
  },
  async getAllSchedulesSubject({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/admission/student/" + payload[0] + "/schedule/",
        {
          params: {
            sem_id: payload[1],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllSchedulesSubject", response);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            type: "positive",
            message: error.response.data.message,
            position: "top",
          });
        }, 3000);
      });
  },
  async getAllSections({ commit }, payload) {
    await api
      .get("/api/section", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllSections", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          Notify.create({
            type: "positive",
            message: error.response.data.message,
            position: "top",
          });
        }, 3000);
      });
  },
  removeSubject({ commit }, payload) {
    commit("removeSubject", payload);
  },

  addTempData({ commit }, payload) {
    commit("addTempData", payload);
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
