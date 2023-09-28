import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  payables: [],
  tempData: [],
};
const mutations = {
  getAllPayments(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempData.push({
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
    state.rowDatas = state.tempData;
    // console.log(state.rowDatas);
  },
  addPayable(state, payload) {
    // Object.entries(payload.data.payables).map(([key, val]) => {
    state.payables.push({
      id: payload.value,
      payable: payload.name,
      balance: payload.balance,
      amount: 0,
    });
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
  async getAllPayments({ commit }) {
    await api
      .get("/api/cashier", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // if (response.length > 0) {
        commit("getAllPayments", response);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  addPayable({ commit }, payload) {
    commit("addPayable", payload);
  },
  async onSearch({ commit, dispatch }, payload) {
    if (payload == "" || payload == null) {
      dispatch("getAllPayments");
    } else {
      commit("onSearch", payload);
    }
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
