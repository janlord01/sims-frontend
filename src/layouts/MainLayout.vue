<template>
  <div>
    <q-layout view="lHh Lpr lFf" style="height: 300px" class="">
      <q-header elevated class="bg-secondary">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />

          <!-- <q-avatar size="56px" class="q-mb-sm q-mt-sm">
            <img :src="store.state.school_logo" />
          </q-avatar> -->
          <q-toolbar-title>{{ store.state.school_info.name }}</q-toolbar-title>
          <q-btn-dropdown color="transparen no-ripple" flat>
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <!-- <q-icon left name="map" /> -->
                <!-- <div class="text-center"> -->
                <span class="text-body2 text-capitalize">
                  <q-avatar v-if="userDetails.user" size="32px">
                    <img :src="userDetails.user.profile_image" />
                  </q-avatar>
                  <q-icon v-else left name="account_circle" />

                  <span class="text-caption text-bold text-capitalize q-ml-sm">
                    <!-- Account Settings -->
                    {{ userDetails.user ? userDetails.user.name : "User" }}
                  </span>
                  <!-- {{
                    userDetails.user.name ? userDetails.user.name : "User"
                  }} -->
                </span>
                <!-- <span class="text-caption text-lowercase">super-admin</span> -->
                <!-- </div> -->
              </div>
            </template>
            <div class="no-wrap q-pa-md">
              <!-- <div class="column">
                <div class="text-h6 q-mb-md">Settings</div> -->
              <!-- <q-list>
                  <q-item clickable v-close-popup @click="onItemClick"> -->
              <!-- <q-item-section>
                      <q-item-label> -->
              <!-- <q-btn
                  color="primary"
                  label="Profile"
                  push
                  size="sm"
                  v-close-popup
                /> -->
              <!-- </q-item-label>
                    </q-item-section> -->
              <!-- </q-item>
                </q-list> -->
              <!-- </div> -->

              <!-- <q-separator vertical inset class="q-mx-lg" /> -->

              <div class="column items-center">
                <q-avatar size="72px">
                  <img :src="userDetails.user.profile_image" />
                </q-avatar>

                <!-- <div
                  class="text-caption q-mt-sm"
                  v-for="(role, index) in userDetails.roles"
                  :key="index"
                >
                  {{ role }}
                </div> -->
                <q-chip
                  class="glossy"
                  icon="lock_person"
                  size="12px"
                  v-for="(role, index) in userDetails.roles"
                  :key="index"
                >
                  {{ role }}
                </q-chip>
                <div class="q-gutter-sm">
                  <q-btn
                    round
                    color="primary"
                    icon="account_circle"
                    size="sm"
                    v-close-popup
                  />
                  <q-btn
                    round
                    color="red"
                    icon="power_settings_new"
                    @click="logoutUser"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </q-btn-dropdown>
          <!-- <q-item clickable v-ripple>
            <q-item-section side>
              <q-avatar rounded size="48px">
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ userDetails.user.name }}</q-item-label>
              <q-item-label
                caption
                v-for="(role, index) in userDetails.roles"
                :key="index"
              >
                {{ role }}</q-item-label
              >
            </q-item-section>
          </q-item> -->
          <!-- <div class="bg-transparent">
            <q-avatar size="56px" class="q-mb-sm float-left">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />

            </q-avatar>

            <div class="text-weight-bold float-left" v-if="userDetails.user">
              <p class="q-mt-sm q-ml-sm" size="12px" v-if="userDetails.user">
                <p>{{ userDetails.user.name }}</p>
                <q-chip
                  class="glossy"
                  style="margin-top: -15px;margin-left:-10px;"
                  icon="lock_person"
                  size="12px"
                  v-for="(role, index) in userDetails.roles"
                  :key="index"
                >
                  {{ role }}
                </q-chip>
              </p>
            </div>
          </div> -->
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
        :width="200"
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
              clickable
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-if="
                menuItem.label == 'Admission' &&
                userDetails.permissions.some(
                  (permis) => menuItem.permission.indexOf(permis) !== -1
                )
              "
            >
              <q-separator />

              <q-card>
                <q-list
                  v-for="(sub, index) in semContainer"
                  :key="index"
                  class=""
                >
                  <q-item
                    style="font-size: 13px"
                    clickable
                    v-ripple
                    :to="sub.to"
                    exact
                  >
                    <!-- <q-item-section avatar> -->
                    <!-- <q-icon :name="sub.icon" /> -->
                    <!-- </q-item-section> -->
                    <q-item-section>{{ sub.label }}</q-item-section>
                    <!-- <q-separator inset /> -->
                  </q-item>
                  <q-separator inset="" />
                </q-list>
              </q-card>
              <!-- <q-separator  /> -->
            </q-expansion-item>

            <q-expansion-item
              expand-separator
              clickable
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-else-if="
                menuItem.subMenu &&
                userDetails.permissions.some(
                  (permis) => menuItem.permission.indexOf(permis) !== -1
                )
              "
            >
              <q-separator />

              <q-card>
                <q-list
                  v-for="(sub, index) in menuItem.subMenu"
                  :key="index"
                  class=""
                >
                  <q-item
                    separator
                    clickable
                    v-ripple
                    :to="sub.to"
                    v-if="
                      userDetails.permissions.some(
                        (permis) => sub.permission.indexOf(permis) !== -1
                      )
                    "
                    exact
                    style="font-size: 13px"
                  >
                    <!-- <q-item-section avatar > -->
                    <!-- <q-icon :name="sub.icon" /> -->
                    <!-- </q-item-section> -->
                    <q-item-section>{{ sub.label }}</q-item-section>
                  </q-item>
                  <q-separator inset="" />
                </q-list>
              </q-card>
              <!-- <q-separator  /> -->
            </q-expansion-item>

            <q-item
              v-else-if="
                menuItem.role.length == 0 &&
                userDetails.permissions.some(
                  (permis) => menuItem.permission.indexOf(permis) !== -1
                )
              "
              clickable
              v-ripple
              :to="menuItem.to"
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-item
              v-else-if="
                menuItem.role.length == 0 &&
                userDetails.permissions.some(
                  (permis) => menuItem.permission.indexOf(permis) !== -1
                ) &&
                menuItem.label === 'Load RFID' &&
                userDetails.user.email === 'janlord.luga@gmail.com'
              "
              clickable
              v-ripple
              :to="menuItem.to"
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>

            <q-item
              v-else-if="
                menuItem.role.length > 0 &&
                userDetails.roles.some(
                  (permis) => menuItem.role.indexOf(permis) !== -1
                ) &&
                userDetails.permissions.some(
                  (permis) => menuItem.permission.indexOf(permis) !== -1
                ) &&
                typeof menuItem.admin === 'undefined'
              "
              clickable
              v-ripple
              :to="menuItem.to"
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section> {{ menuItem.label }} </q-item-section>
            </q-item>

            <q-item
              v-else-if="
                menuItem.role.length > 0 &&
                userDetails.roles.some(
                  (permis) => menuItem.role.indexOf(permis) !== -1
                ) &&
                menuItem.admin === true
              "
            >
              <!-- <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section> -->
              <q-item-section class="text-bold">
                **{{ menuItem.label }}**
              </q-item-section>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="/images/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="120px" class="q-ml-md">
              <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
              <img
                :src="
                  store.state.school_logo
                    ? store.state.school_logo
                    : '/images/boy-avatar.png'
                "
              />
            </q-avatar>

            <!-- <div class="text-weight-bold float-left" v-if="userDetails.user">
              <p class="q-mt-sm q-ml-sm" size="12px" v-if="userDetails.user">
                <p>{{ userDetails.user.name }}</p>
                <q-chip
                  class="glossy"
                  style="margin-top: -15px;margin-left:-10px;"
                  icon="lock_person"
                  size="12px"
                  v-for="(role, index) in userDetails.roles"
                  :key="index"
                >
                  {{ role }}
                </q-chip>
              </p>
            </div> -->
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view class="q-pa-md no-shadow" />
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
          to: "/dashboard",
          separator: true,
          permission: ["view-profile"],
          role: [],
        },
        {
          icon: "groups",
          label: "Users",
          to: "/dashboard",
          separator: false,
          permission: [
            // "view-profile",
            "view-student",
            "view-parent",
            "view-teacher",
            "view-employee",
          ],
          role: [],
          subMenu: [
            {
              icon: "boy",
              label: "Student",
              to: "/user/student",
              permission: [
                // "view-profile",
                "view-student",
                "create-student",
                "edit-student",
                "update-student",
                "delete-student",
              ],
            },
            {
              icon: "wc",
              label: "Parent",
              to: "/user/parent",
              permission: [
                // "view-profile",
                "view-parent",
                "create-parent",
                "edit-parent",
                "update-parent",
                "delete-parent",
              ],
            },
            {
              icon: "hail",
              label: "Teacher",
              to: "/user/teacher",
              permission: [
                // "view-profile",
                "view-teacher",
                "create-teacher",
                "edit-teacher",
                "update-teacher",
                "delete-teacher",
              ],
            },
            {
              icon: "rowing",
              label: "Employee",
              to: "/user/employee",
              permission: [
                // "view-profile",
                "view-employee",
                "create-employee",
                "edit-employee",
                "update-employee",
                "delete-employee",
              ],
            },
          ],
        },
        {
          icon: "widgets",
          label: "Academe",
          to: "/colleges",
          separator: false,
          permission: [
            // "view-profile",
            "view-college",
            "view-student-subjects",
            "view-subject",
            "view-schedule-subject",
            "view-prospectus",
          ],
          role: [],
          subMenu: [
            {
              icon: "ballot",
              label: "Year Level",
              to: "/year-level",
              permission: [
                "view-year-level",
                "create-year-level",
                "edit-year-level",
                "update-year-level",
                "delete-create-year-level",
              ],
            },
            {
              icon: "ballot",
              label: "Colleges",
              to: "/colleges",
              permission: [
                // "view-profile",
                "view-college",
                "create-college",
                "edit-college",
                "update-college",
                "delete-college",
              ],
            },
            {
              icon: "psychology",
              label: "Courses",
              to: "/courses",
              permission: [
                // "view-profile",
                "view-course",
                "create-course",
                "edit-course",
                "update-course",
                "delete-course",
              ],
            },
            {
              icon: "school",
              label: "Student Courses & Subjects",
              to: "/courses/student",
              permission: [
                // "view-profile",
                "view-student-subjects",
                "create-student-subjects",
                "edit-student-subjects",
                "update-student-subjects",
                "delete-student-subjects",
              ],
            },
            {
              icon: "auto_stories",
              label: "Manage Subject",
              to: "/subjects",
              permission: [
                // "view-profile",
                "view-subject",
                "create-subject",
                "edit-subject",
                "update-subject",
                "delete-subject",
              ],
            },
            {
              icon: "schedule",
              label: "Schedule Subject",
              to: "/subjects/schedule",
              permission: [
                // "view-profile",
                "view-schedule-subject",
                "create-schedule-subject",
                "edit-schedule-subject",
                "update-schedule-subject",
                "delete-schedule-subject",
              ],
            },
            {
              icon: "apps",
              label: "Block Section",
              to: "/subjects/section-block",
              permission: [
                // "view-profile",
                "view-section",
                "create-section",
                "edit-section",
                "update-section",
                "delete-section",
              ],
            },
            {
              icon: "apps",
              label: "Prospectus",
              to: "/subjects/prospectus",
              permission: [
                // "view-profile",
                "view-prospectus",
                "create-prospectus",
                "edit-prospectus",
                "update-prospectus",
                "delete-prospectus",
              ],
            },
          ],
        },
        // {
        //   icon: "menu_book",
        //   label: "Subject",
        //   to: "/subjects",
        //   separator: false,
        //   permission: ['view-profile',"view-subject",'view-schedule-subject','view-prospectus'],
        //   subMenu: [
        //     {
        //       icon: "auto_stories",
        //       label: "Manage Subject",
        //       to: "/subjects",
        //       permission: ['view-profile',"view-subject","create-subject",'edit-subject','update-subject','delete-subject'],
        //     },
        //     {
        //       icon: "schedule",
        //       label: "Schedule Subject",
        //       to: "/subjects/schedule",
        //       permission: ['view-profile',"view-schedule-subject","create-schedule-subject",'edit-schedule-subject','update-schedule-subject','delete-schedule-subject'],
        //     },
        //     {
        //       icon: "apps",
        //       label: "Prospectus",
        //       to: "/subjects/prospectus",
        //       permission: ['view-profile',"view-prospectus","create-prospectus",'edit-prospectus','update-prospectus','delete-prospectus'],
        //     },
        //   ],
        // },
        {
          icon: "login",
          label: "Admission",
          to: "/admission",
          separator: false,
          permission: [
            // "view-profile",
            "view-admission",
            "edit-admission",
            "update-admission",
            "delete-admission",
          ],
          role: [],
          // subMenu: store.state.semContainer,
        },
        {
          icon: "paid",
          label: "Finance",
          to: "/courses",
          separator: false,
          permission: [
            // "view-profile",
            "view-billing",
            "view-cashier",
            "view-discount",
            "view-scholarship",
          ],
          role: [],
          subMenu: [
            {
              icon: "payment",
              label: "Billings",
              to: "/finances/billing",
              permission: [
                // "view-profile",
                "view-billing",
                "create-billing",
                "edit-billing",
                "update-billing",
                "delete-billing",
              ],
            },
            {
              icon: "store",
              label: "Cashier",
              to: "/finances/cashier",
              permission: [
                // "view-profile",
                "view-cashier",
                "create-cashier",
                "edit-cashier",
                "update-cashier",
                "delete-cashier",
              ],
            },
            {
              icon: "sell",
              label: "Discount",
              to: "/finances/discount",
              permission: [
                // "view-profile",
                "view-discount",
                "create-discount",
                "edit-discount",
                "update-discount",
                "delete-discount",
              ],
            },
            {
              icon: "school",
              label: "Scholarship",
              to: "/finances/scholarship",
              permission: [
                // "view-profile",
                "view-scholarship",
                "create-scholarship",
                "edit-scholarship",
                "update-scholarship",
                "delete-scholarship",
              ],
            },
          ],
        },
        {
          icon: "bar_chart",
          label: "Reports",
          to: "/courses",
          separator: false,
          permission: ["view-financial-report"],
          role: [],
          subMenu: [
            {
              icon: "trending_up",
              label: "Registrar Reports",
              to: "/reports/registrar",
              permission: [
                "view-registrar-reports",
                "create-registrar-reports",
                "edit-registrar-reports",
                "update-registrar-reports",
                "delete-registrar-reports",
              ],
            },
            {
              icon: "trending_up",
              label: "Account Receivable",
              to: "/reports/receivable",
              permission: [
                "view-account-receivable",
                "create-account-receivable",
                "edit-account-receivable",
                "update-account-receivable",
                "delete-account-receivable",
              ],
            },
            {
              icon: "trending_up",
              label: "Account Collected",
              to: "/reports/collected",
              permission: [
                "view-account-collected",
                "create-account-collected",
                "edit-account-collected",
                "update-account-collected",
                "delete-account-collected",
              ],
            },
            // {
            //   icon: "trending_up",
            //   label: "Finance Reports",
            //   to: "/course-list",
            //   permission: [
            //     // "view-profile",
            //     "view-financial-report",
            //     "create-financial-report",
            //     "edit-financial-report",
            //     "update-financial-report",
            //     "delete-financial-report",
            //   ],
            // },
            // {
            //   icon: "contact_page",
            //   label: "Student Records",
            //   to: "/dashboard",
            // },
          ],
        },
        {
          icon: "campaign",
          label: "Announcement",
          to: "/announcement",
          separator: true,
          permission: [
            // "view-profile",
            "view-announcement",
            "create-announcement",
            "edit-announcement",
            "update-announcement",
            "delete-announcement",
          ],
          role: [],
        },

        {
          icon: "settings",
          label: "Settings",
          to: "/settings/school-info",
          separator: true,
          permission: [
            // "view-profile",
            "view-school-info",
            "view-academic",
            "view-semester",
            "view-student-requirement",
            "view-roles-permissions",
          ],
          role: [],
          subMenu: [
            {
              icon: "description",
              label: "School Information",
              to: "/settings/school-info",
              permission: [
                // "view-profile",
                "view-school-info",
                "create-school-info",
                "edit-school-info",
                "update-school-info",
                "delete-school-info",
              ],
            },
            {
              icon: "school",
              label: "Academic Year",
              to: "/settings/academic-year",
              permission: [
                // "view-profile",
                "view-academic",
                "create-academic",
                "edit-academic",
                "update-academic",
                "delete-academic",
              ],
            },
            {
              icon: "class",
              label: "Semester Management",
              to: "/settings/semester",
              permission: [
                // "view-profile",
                "view-semester",
                "create-semester",
                "edit-semester",
                "update-semester",
                "delete-semester",
              ],
            },
            {
              icon: "source",
              label: "Student Requirements",
              to: "/settings/student-requirement",
              permission: [
                // "view-profile",
                "view-student-requirement",
                "create-student-requirement",
                "edit-student-requirement",
                "update-student-requirement",
                "delete-student-requirement",
              ],
            },
            {
              icon: "qr_code",
              label: "QrCode/RFID Location",
              to: "/settings/rfid",
              permission: [
                // "view-profile",
                "view-file",
                "create-file",
                "edit-file",
                "update-file",
                "delete-file",
              ],
            },
            {
              icon: "folder_copy",
              label: "File Management",
              to: "/settings/file-management",
              permission: [
                // "view-profile",
                "view-file",
                "create-file",
                "edit-file",
                "update-file",
                "delete-file",
              ],
            },
            {
              icon: "lock_person",
              label: "Roles & Permission",
              to: "/settings/roles-permissions",
              permission: [
                // "view-profile",
                "view-roles-permissions",
                "create-roles-permissions",
                "edit-roles-permissions",
                "update-roles-permissions",
                "delete-roles-permissions",
              ],
            },
          ],
        },

        {
          icon: "developer_mode",
          label: "Load RFID",
          to: "/rfid",
          separator: true,
          permission: [
            // "view-profile",
            "view-profile",
          ],
          role: ["super-admin"],
        },
        {
          icon: "qr_code",
          label: "Student Logs",
          to: "/qrcode/log",
          separator: true,
          permission: ["view-profile"],
          role: ["scanner", "super-admin"],
        },

        {
          icon: "",
          label: "STUDENT AREA",
          admin: true,
          to: "/soa",
          separator: true,
          permission: ["view-profiles"],
          role: [],
        },
        {
          icon: "calendar_month",
          label: "Schedules",
          to: "/student/schedules",
          separator: false,
          permission: ["student-view-schedules"],
          role: ["student"],
        },

        {
          icon: "receipt",
          label: "SOA",
          to: "/student/soa",
          separator: false,
          permission: ["student-view-soa"],
          role: ["student"],
        },
        {
          icon: "grade",
          label: "Grades",
          to: "/student/grades",
          separator: false,
          permission: ["student-view-grades"],
          role: ["student"],
        },
        {
          icon: "",
          label: "PARENT AREA",
          admin: true,
          to: "/soa",
          separator: true,
          permission: ["view-profiles"],
          role: [],
        },
        {
          icon: "receipt",
          label: "SOA",
          to: "/soa",
          separator: false,
          permission: ["view-profile"],
          role: ["parent"],
        },
        {
          icon: "grade",
          label: "Grades",
          to: "/soa",
          separator: false,
          permission: ["view-profile"],
          role: ["parent"],
        },
        {
          icon: "",
          label: "TEACHER AREA",
          admin: true,
          to: "/soa",
          separator: true,
          permission: [],
          role: [],
        },
        {
          icon: "baby_changing_station",
          label: "Advisor",
          to: "/teacher/advisory",
          separator: false,
          permission: ["teacher-view-advisory"],
          role: ["teacher"],
        },
        {
          icon: "auto_stories",
          label: "Subject Load",
          to: "/teacher/subject-load",
          separator: false,
          permission: ["teacher-view-subject-load"],
          role: ["teacher"],
        },

        // {
        //   icon: "power_settings_new",
        //   label: "Logout",
        //   to: "/logout",
        //   separator: false,
        //   permission: ["view-profile"],
        // },
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
