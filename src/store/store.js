import axios from "axios";
import { Loading, LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify, QSpinnerGears } from "quasar";

const state = {
  userDetails: {
    permissions: [],
    roles: [],
  },
  semContainer: [],
  school_info: [],
  school_logo: "",
  authenticated: false,
  userId: null,
  passwordSent: true,
  password: "",
  password_confirmation: "",
};

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  setUserAuthenticated(state, payload) {
    state.authenticated = payload;
  },
  changePasswordMutation(state, payload) {
    state.userDetails = payload;
  },
  passwordSpinnerMutation(state, payload) {
    state.passwordSent = payload;
  },

  getSemester(state, payload) {
    state.semContainer = [];
    // console.log(payload);
    Object.entries(payload.data.semesters).map(([key, val]) => {
      state.semContainer.push({
        // id: val.id,
        label: val.title,
        icon: "class",
        to: "/admission/semester-" + val.id,
      });
    });
  },
  getSchoolInfo(state, payload) {
    state.school_info = payload.school_info;
    state.school_logo = payload.logo;
  },
  getSchoolInfoPublic(state, payload) {
    state.school_info = payload.school_info;
    state.school_logo = payload.logo;
  },
  checkPermission(state, payload) {
    if (payload == null) {
      payload = ["none"];
    }
    if (payload != "logout") {
      var a = 0;

      state.userDetails.permissions.filter(
        (permis) => (payload.includes(permis) ? true : false)
        // if (payload.includes(permis)) {
        //   console.log("true");
        //   return true;
        // } else {
        //   console.log("false");

        //   return false;
        // }
      );

      // payload.some((permis) => {
      //   state.userDetails.permissions.map((f) => {
      //     // LocalStorage.getItem("permission").map((f) => {
      //     if (permis == f) {
      //       a++;
      //       return true;
      //     }
      //   });
      // });

      // if (a > 0) {
      //   return true;
      // } else {
      //   return false;
      // }
    }
  },
};

const actions = {
  async getSchoolInfoPublic({ commit }) {
    await api
      .get("/api/school-infos")
      .then((res) => {
        // console.log(res);
        // this.$router.push("/login");
        commit("getSchoolInfoPublic", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  async getSchoolInfo({ commit }) {
    await api
      .get("/api/school-info")
      .then((res) => {
        // console.log(res);
        // this.$router.push("/login");
        commit("getSchoolInfo", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  async registerUser({}, payload) {
    await api
      .post("/api/register", {
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      })
      .then((res) => {
        this.$router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  async loginUser({ commit, dispatch }, payload) {
    Loading.show({
      spinner: QSpinnerGears,
      message: "Processing!, Please wait....",
      spinnerColor: "secondary",
    });
    await api
      .post("/api/login", {
        email: payload.email,
        password: payload.password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          setTimeout(() => {
            Notify.create({
              type: "positive",
              color: "positive",
              message: response.data.message,
              timeout: 3000,
              position: "top",
            });
            LocalStorage.set("jwt", response.data.token);
            if (LocalStorage.getItem("jwt")) {
              // this.router.push({ name: "dashboard-index" });
              // dispatch("getUserDetails");
              commit("setUserAuthenticated", true);

              // if (response.data.roles == "student") {
              //   window.location = "/dashboard/student";
              // } else if (response.data.roles == "parent") {
              //   window.location = "/dashboard/parent";
              // } else {
              window.location = "/dashboard";
              // }
            }
            // if (LocalStorage.getItem("jwt")) {
            //   setTimeout(() => {
            // this.$router.push("dashboard");
            // }, 2000);
            // } else {
            //   this.$router.push("dashboard");
            // }
            Loading.hide();
          }, 1000);
        } else {
          setTimeout(() => {
            Notify.create({
              type: "negative",
              color: "negative",
              icon: "error",
              message: response.data.message,
              timeout: 3000,
              position: "top",
            });
            Loading.hide();
          }, 3000);
        }

        // this.$router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        commit("setUserDetails", {});
        this.$router.replace("/login");
      });
  },
  async getUserDetails({ commit, state }) {
    var newToken = LocalStorage.getItem("jwt");
    try {
      if (newToken !== null) {
        await api
          .get("/api/user", {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          })
          .then((response) => {
            // console.log(response);
            // commit("setUserDetails", {});

            if (response.data.user) {
              LocalStorage.set("permission", response.data.permissions);
              commit("setUserDetails", {
                user: response.data.user,
                permissions: response.data.permissions,
                roles: response.data.roles,
                course: response.data.course,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  },
  checkPermission({ commit }, payload) {
    commit("checkPermission", payload);
  },
  async logoutUser({ commit }) {
    // setTimeout(() => {
    Loading.show({
      spinner: QSpinnerGears,
      message: "Logging Out!, Please wait....",
      spinnerColor: "secondary",
      timeout: 3000,
    });
    // }, 3000);

    const newToken = LocalStorage.getItem("jwt");
    await api
      .post("/api/logout", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        if (response.data.status === 200) {
          setTimeout(() => {
            Notify.create({
              type: "positive",
              color: "positive",
              timeout: 3000,
              message: response.data.message,
            });
            Loading.hide();
            commit("setUserDetails", {});
            localStorage.removeItem("jwt");
            // this.$router.replace("/login");
            window.location = "/login";
          }, 3000);
        } else {
          setTimeout(() => {
            Notify.create({
              type: "negative",
              color: "negative",
              timeout: 3000,
              message: response.data.message,
            });
            Loading.hide();
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async getSemester({ commit }) {
    await api
      .get("/api/settings/semesters/active", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getSemester", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {
  isAuthenticated: (state) => {
    // console.log("state: ", state);
    return state.authenticated;
  },

  activeSem(state) {
    return state.semContainer;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
