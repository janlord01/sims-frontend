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
  getAllTeacher(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.users).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        name: val.name,
        email: val.email,
        number: val.number,
        profile_image: val.profile_image,
        status: val.status,
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
  async registerTeacher({ commit }, payload) {
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
  async getAllTeacher({ commit }, payload) {
    await api
      .get("api/teacher", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllTeacher", response);
        // console.log(response);

        // console.log(this.rowDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async onSearch({ commit, dispatch }, payload) {
    if (payload == "" || payload == null) {
      dispatch("getAllTeacher");
    } else {
      commit("onSearch", payload);
    }
  },
  // async onSearch({ commit }, payload) {
  //   // console.log(payload);
  //   if (payload.length > 0) {
  //     await api
  //       .get(
  //         "/api/teacher/user/search",
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
  //         commit("getAllTeacher", response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     await api
  //       .get("/api/teacher", {
  //         headers: {
  //           Authorization: "Bearer " + LocalStorage.getItem("jwt"),
  //         },
  //       })
  //       .then((response) => {
  //         commit("getAllTeacher", response);
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
