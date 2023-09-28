import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  studentList: [],
  rowOnlineStudentDatas: [],
  tempData: [],
};
const mutations = {
  saveStudentDetails(state, payload) {
    state.studentDetails = payload;
  },
  setPassForm(state, payload) {
    state.passForm = payload;
  },
  getAllOnlineRegStudent(state, payload) {
    state.rowOnlineStudentDatas = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.rowOnlineStudentDatas.push({
        id: val.id,
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
        email: val.email,
        number: val.number,
        role: val.role,
        course: val.course,
        year: val.year,
        transferee: val.transfery,
        // profile_image: val.profile_image,
        status: val.status,
      });
    });
  },
  getAllStudent(state, payload) {
    state.studentList = [];
    // console.log(payload);
    Object.entries(payload.data.users).map(([key, val]) => {
      state.studentList.push({
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
    state.rowDatas = state.studentList;
  },
  onSearch(state, payload) {
    if (payload == "") {
      state.rowDatas = state.studentList;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowDatas = state.studentList.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
  },
};

// const $q = useQuasar();
const actions = {
  async registerStudent({ commit }, payload) {
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
  async getAllOnlineRegStudent({ commit }, payload) {
    await api
      .get("api/student/online-registration", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        if (response.data.status === 200) {
          commit("getAllOnlineRegStudent", response);
        } else {
          Notify.create({
            type: "negative",
            color: "negative",
            timeout: 3000,
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        // Notify.create({
        //   type: "negative",
        //   color: "negative",
        //   timeout: 3000,
        //   message: error.response.data.message,
        // });
      });
  },
  async getAllStudent({ commit }, payload) {
    await api
      .get("api/student", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        if (response.data.status === 200) {
          commit("getAllStudent", response);
        } else {
          Notify.create({
            type: "negative",
            color: "negative",
            timeout: 3000,
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Notify.create({
          type: "negative",
          color: "negative",
          timeout: 3000,
          message: error.response.data.message,
        });
      });
  },
  async onSearch({ commit, dispatch }, payload) {
    // console.log(payload);
    // if (payload.length > 0) {
    // await api
    //   .get(
    //     "/api/student/user/search",
    //     {
    //       params: {
    //         name: payload,
    //       },
    //     },
    //     {
    //       headers: {
    //         Authorization: "Bearer " + LocalStorage.getItem("jwt"),
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     // console.log(response);
    //     // if()
    //     commit("getAllStudent", response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    if (payload == "" || payload == null) {
      // state.unenrolled = state.unenrolled;
      dispatch("getAllStudent");
    } else {
      // state.unenrolled = state.unenrolled.filter((subject) => {
      //   return Object.values(subject).some((word) =>
      //     String(word).toLowerCase().includes(query)
      //   );
      // });
      // console.log(name);
      commit("onSearch", payload);
    }
    // }
    // } else {
    // await api
    //   .get("/api/student", {
    //     headers: {
    //       Authorization: "Bearer " + LocalStorage.getItem("jwt"),
    //     },
    //   })
    //   .then((response) => {
    //     commit("getAllStudent", response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // }
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
