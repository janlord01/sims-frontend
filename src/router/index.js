import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { api } from "src/boot/axios";
import routes from "./routes";
import Userstore from "src/store/store";
import studentRoutes from "./studentRoutes";
import { LocalStorage, Notify } from "quasar";
// import userStore from "s";

import { mapState, mapActions, mapGetters } from "vuex";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// inside your helper method

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    api,
    studentRoutes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const requiredAuth = to.matched.some((record) => record.meta.requiredAuth);
    const access = to.meta.access;

    var newToken = LocalStorage.getItem("jwt");
    if (LocalStorage.getItem("jwt")) {
      if (requiredAuth) {
        api
          .get("api/check-token", {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          })
          .then((response) => {
            // console.log(response);
            if (response.data.status === 200) {
              // console.log("working");
              // next();
              var a = 0;
              access.forEach((e) => {
                // console.log(e + " e");
                response.data.permissions.forEach((f) => {
                  // console.log(f + " f");
                  if (e == f) {
                    // console.log(Userstore.mutations.setUserDetails);
                    // Userstore.actions.getUserDetails;
                    // Userstore.commit("setUserDetails");
                    // mapActions("userStore", ["getUserDetails"]);
                    // console.log("yes match");
                    a++;
                    next();
                  }
                });
              });
              if (a == 0) {
                Notify.create({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message:
                    "Access Denied! You don't have permission to access this section!",
                });
                return next("/dashboard");
              }
            } else {
              return next({
                name: "login",
                // params: { redirect: to.fullPath },
                replace: true,
              });
            }
            // if (requiredAuth) {
            //   // console.log(store.state.semContainer);
            //   // store.dispatch("getSemester");
            //   store.actions.getSemester;
            //   // console.log(store.actions.getSemester);
            //   // console.log("Route required authentication" + to.path);
            //   // ...mapActions();
            //   next();
            // } else if (to.path == "/login" || to.path == "/register") {
            //   return next("/dashboard");
            // } else {
            //   return next({
            //     name: "login",
            //     params: { redirect: to.fullPath },
            //     replace: true,
            //   });
            // }
          })
          .catch((error) => {
            // localStorage.removeItem("jwt");
            console.log(error);
          });
      } else if (to.path == "/login" || to.path == "/register") {
        return next("/dashboard");
      } else {
        return next({
          name: "login",
          params: { redirect: to.fullPath },
          replace: true,
        });
      }
    } else if (to.path == "/login" || to.path == "/online-registration") {
      next();
    } else {
      // this.$router.go(1);
      next("/login");
    }
  });

  return Router;
});
