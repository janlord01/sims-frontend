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
  saveStudentDetails(state, payload) {
    state.studentDetails = payload;
  },
  setPassForm(state, payload) {
    state.passForm = payload;
  },
  getAllParent(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.users).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
        email: val.email,
        number: val.number,
        profile_image: val.profile_image,
        status: val.status,
        rfid: val.rfid,
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
  async registerParent({ commit }, payload) {
    commit("setPassForm", false);
    await api
      .post("/api/student/user", {
        firstname: payload.firstname,
        middlename: payload.middlename,
        lastname: payload.lastname,
        birthday: payload.birthday,
        gender: payload.gender,
        nationality: payload.nationality,
        address: payload.address,
        country: payload.country,
        province: payload.province,
        city: payload.city,
        barangay: payload.barangay,
        zipcode: payload.zipcode,
        facebook: payload.facebook,
        number: payload.number,
        religion: payload.religion,
        studentID: payload.studentID,
        stayWith: payload.stayWith,
        transferee: payload.transferee,
        lastSchool: payload.lastSchool,
        lastYear: payload.lastYear,
        schoolName: payload.schoolName,
        schoolAddress: payload.schoolAddress,
        schoolID: payload.schoolID,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      })
      .then((response) => {
        console.log(response);
        commit("setPassForm", true);
        Notify.create({
          type: "positive",
          message: "Studetent Save!",
          icon: "save",
        });
      })
      .catch((error) => {
        console.log(error);
        Notify.create({
          type: "negative",
          message: "Test onY!",
          icon: "error",
        });
      });
  },
  async getAllParent({ commit }, payload) {
    await api
      .get("api/parent", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllParent", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async onSearch({ commit, dispatch }, payload) {
    if (payload == "" || payload == null) {
      dispatch("getAllParent");
    } else {
      commit("onSearch", payload);
    }
  },

  // async onSearch({ commit }, payload) {
  //   // console.log(payload);
  //   if (payload.length > 0) {
  //     await api
  //       .get(
  //         "/api/parent/user/search",
  //         {
  //           params: {
  //             name: payload,
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
  //         commit("getAllParent", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     await api
  //       .get("/api/parent", {
  //         headers: {
  //           Authorization: "Bearer " + LocalStorage.getItem("jwt"),
  //         },
  //       })
  //       .then((response) => {
  //         commit("getAllParent", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // },
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
