<template>
  <div>
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-avatar size="56px" class="q-mb-sm q-mt-sm">
            <img
              :src="
                store.state.school_logo ? store.state.school_logo : '/images/logo.jpg'
              "
            />
          </q-avatar>
          <!-- <q-toolbar-title>North Davao Colleges of Panabo</q-toolbar-title> -->
          <q-toolbar-title>{{ store.state.school_info.name }}</q-toolbar-title>

          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-footer elevated class="bg-cyan-8">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle2"
            >School Information Management System. All Right Reserved. Created By:
            Nehemiah Solutions</q-toolbar-title
          >
        </q-toolbar>
      </q-footer>

      <q-drawer v-model="drawer" :width="200" :breakpoint="767" class="q-mt-sm">
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
            margin-bottom: 20px;
          "
        >
          <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-expansion-item
              expand-separator
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-if="menuItem.subMenu"
            >
              <q-card>
                <q-list v-for="(sub, index) in menuItem.subMenu" :key="index">
                  <q-item clickable v-ripple :to="sub.to" exacat class="q-ml-sm">
                    <q-item-section avatar>
                      <q-icon :name="sub.icon" />
                    </q-item-section>
                    <q-item-section>{{ sub.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>
            <q-item v-else clickable v-ripple :to="menuItem.to" exact>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>

              <q-item-section> {{ menuItem.label }} </q-item-section>
            </q-item>

            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            <!-- <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section> Star </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section> Send </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section> Drafts </q-item-section>
            </q-item> -->
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">Guest</div>
            <div class="invisible">Guest</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { LocalStorage } from "quasar";
import store from "src/store/store";
import { mapState, mapActions, mapGetters } from "vuex";
const menuList = [
  {
    icon: "key",
    label: "Login",
    to: "/login",
    separator: false,
  },
  {
    icon: "description",
    label: "Online Registration",
    to: "/online-registration",
    separator: false,
  },
  // {
  //   icon: "save_as",
  //   label: "Register",
  //   to: "/register",
  //   separator: false,
  // },
];

export default {
  setup() {
    return {
      drawer: ref(false),
      menuList,
    };
  },
  data() {
    return {
      store,
    };
  },
  methods: {
    ...mapActions("Userstore", ["getSchoolInfoPublic"]),
  },
  mounted() {
    this.getSchoolInfoPublic();
  },
};
</script>
