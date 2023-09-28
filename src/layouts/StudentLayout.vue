<template>
  <div>
    <q-layout view="lHh Lpr lFf" style="height: 300px" class="shadow-2">
      <q-header elevated class="bg-secondary">
        <q-toolbar>
          <q-avatar size="56px" class="q-mb-sm q-mt-sm">
            <img :src="store.state.school_logo" />
          </q-avatar>
          <q-toolbar-title>{{ store.state.school_info.name }}</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-footer elevated class="bg-secondary">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle2"
            >School Information Management System. All Right Reserved. Created
            By: Nehemiah Solutions</q-toolbar-title
          >
        </q-toolbar>
      </q-footer>

      <q-drawer
        v-model="drawer"
        show-if-above
        :breakpoint="767"
        class="q-mt-sm bg-grey-2"
      >
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-expansion-item
              expand-separator
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-if="menuItem.label == 'Admission'"
            >
              <q-card>
                <q-list v-for="(sub, index) in semContainer" :key="index">
                  <q-item clickable v-ripple :to="sub.to" class="q-ml-sm" exact>
                    <q-item-section avatar>
                      <q-icon :name="sub.icon" />
                    </q-item-section>
                    <q-item-section>{{ sub.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-else-if="menuItem.subMenu"
            >
              <q-card>
                <q-list v-for="(sub, index) in menuItem.subMenu" :key="index" class="bg-grey-5">
                  <q-item clickable v-ripple :to="sub.to" class="q-ml-sm" 
                 exact>
                    <q-item-section avatar >
                      <q-icon :name="sub.icon" />
                    </q-item-section>
                    <q-item-section>{{ sub.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>

            <q-item
              v-else-if="menuItem.label == 'Logout'"
              class="logout"
              clickable
              @click="logoutUser"
              v-ripple
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>

            <q-item v-else clickable v-ripple :to="menuItem.to" exact>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>

            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm float-left">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              <!-- <img
                :src="
                  userDetails.user.profile_image
                    ? userDetails.user.profile_image
                    : 'https://cdn.quasar.dev/img/boy-avatar.png'
                "
              /> -->
            </q-avatar>

            <div class="text-weight-bold float-left" v-if="userDetails.user">
              <p class="q-mt-sm q-ml-sm" size="12px" v-if="userDetails.user">
                <p>{{ userDetails.user.name }}</p>
                <q-chip
                  class="glossy"
                  style="margin-top: -15px;margin-left:-10px;"
                  icon="school"
                  size="12px"
                  v-for="(role, index) in userDetails.roles"
                  :key="index"
                >
                  {{ role }}
                </q-chip>
              </p>
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view class="q-pa-md" />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
// import { response } from "express";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { LocalStorage } from "quasar";
import store from "src/store/store";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  setup() {
    return {
      drawer: ref(false),
    };
  },
  data() {
    return {
      store,
      // semContainer: null,
      admisionSub: "",
      menuList: [
        {
          icon: "home",
          label: "Dashboard",
          to: "/dashboard/student",
          separator: false,
          permission: ["view-profile","edit-profile","update-profile","delete-profile"],
        },
        {
          icon: "menu_book",
          label: "Subjects",
          to: "/subjects",
          separator: false,
          subMenu: [
            {
              icon: "auto_stories",
              label: "Gain Units & Subject",
              to: "/student/all/subject",
            },
            {
              icon: "Current Enrolled Subject",
              label: "Schedule Subject",
              to: "/subjects/schedule",
            },
          ],
        },
        
        {
          icon: "bar_chart",
          label: "Payments",
          to: "/courses",
          separator: false,
          subMenu: [
            {
              icon: "trending_up",
              label: "Payment History",
              to: "/course-list",
            },
            {
              icon: "contact_page",
              label: "Current SOA",
              to: "/dashboard",
            },
          ],
        },
        {
          icon: "bar_chart",
          label: "Profile",
          to: "/courses",
          separator: false,
          
        },
        

        {
          icon: "power_settings_new",
          label: "Logout",
          to: "/logout",
          separator: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("Userstore", ["userDetails"]),
    ...mapState("Userstore", ["semContainer"]),
    activeSem() {
      return this.store.state.semContainer;
    },
  },
  methods: {
    ...mapActions("Userstore", ["logoutUser"]),
    ...mapActions("Userstore", ["getSemester"]),
    ...mapActions("Userstore", ["getSchoolInfo"]),
    ...mapActions("Userstore", ["checkPermission"]),

    activeListSem() {
      return (this.admisionSub = store.state.semContainer);
    },
  },
  beforeMount() {
    this.getSemester();
  },
  mounted() {
    this.getSemester();
    this.getSchoolInfo();
    // console.log(store.state.semContainer);
    // console.log(this.activeSem());
    this.activeListSem();
    // this.semContainer();
  },
  watch: {
    semContainer(newSem, activeSem) {
      // Our fancy notification (2).
      return newSem;
      // console.log(newSem);
    },
  },
};
</script>
<style scoped>
.q-drawer .q-router-link--exact-active {
  color: #0097a6;
}
</style>
