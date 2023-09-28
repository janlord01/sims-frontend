import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  rowReceivableDatas: [],
  rowRegustrarStudentDatas: [],
  payables: [],
  tempData: [],
  total: 0,
  sub_total: 0,
  discount: 0,
  balance: 0,
};
const mutations = {
  getAllCollectedPayments(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    state.total = parseFloat(payload.data.total).toFixed(2);
    state.sub_total = parseFloat(payload.data.sub_total).toFixed(2);
    state.discount = parseFloat(payload.data.discount).toFixed(2);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowDatas.push({
        id: val.transaction_id,
        created_at: val.created_at,
        name: val.name,
        type_of_transaction: val.type_of_transaction,
        amount: val.amount,
        discount_total: val.discount_total,
        total: val.total,
        entered_amount: val.entered_amount,
        change: val.change,
        online: val.online,
      });
    });
    // console.log(state.rowDatas);
  },
  getAllReceivablePayments(state, payload) {
    state.rowReceivableDatas = [];
    state.balance = parseFloat(payload.data.balance).toFixed(2);

    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowReceivableDatas.push({
        id: val.id,
        name: val.name,
        course: val.code,
        tuition: val.tuition,
        balance: val.total_payable,
        total: val.sub_total,
        created_at: val.created_at,
      });
    });
  },
  getAllRegistrarStudent(state, payload) {
    state.rowRegustrarStudentDatas = [];

    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowRegustrarStudentDatas.push({
        id: val.id,
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
        email: val.email,
        number: val.number,
        course: val.code,
        profile_image: val.profile_image,
        status: val.status,
        year: val.yearLevel,
      });
    });
  },
  onSearch(state, payload) {
    state.tempData = state.rowRegustrarStudentDatas;
    state.rowRegustrarStudentDatas = [];
    state.rowRegustrarStudentDatas = state.tempData.filter((subject) => {
      return Object.values(subject).some((word) =>
        String(word).toLowerCase().includes(payload)
      );
    });
  },
};

// const $q = useQuasar();
const actions = {
  async getCollectedCourse({ commit }, payload) {
    await api
      .get("/api/reports/collects-course/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllCollectedPayments", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllCollectedPayments({ commit }) {
    await api
      .get("/api/reports/collects", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllCollectedPayments", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllRegistrarStudent({ commit }) {
    await api
      .get("/api/reports/registrar", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllRegistrarStudent", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllRegistrarStudentByCourse({ commit }, payload) {
    await api
      .get("/api/reports/registrar/course/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllRegistrarStudent", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async onSearch({ commit, dispatch }, payload) {
    // console.log(payload);
    if (payload[0] == "" || payload[0] == null) {
      if (payload[1] == "" || payload[1] == null || payload[1].length == 0) {
        dispatch("getAllRegistrarStudent");
      } else {
        dispatch("getAllRegistrarStudentByCourse", payload[1]);
      }
    } else {
      commit("onSearch", payload[0]);
      console.log("proceed");
    }
  },
  async getAllReceivablePayments({ commit }) {
    await api
      .get("/api/reports/receivable", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllReceivablePayments", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllReceivablePaymentsCourse({ commit }, payload) {
    await api
      .get("/api/reports/receivable/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        // console.log(response);
        commit("getAllReceivablePayments", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  addPayable({ commit }, payload) {
    commit("addPayable", payload);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
