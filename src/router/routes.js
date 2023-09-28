import store from "src/store/store";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";

import editEnroll from "src/pages/admission/AdmissionEditEnrol.vue";

const routes = [
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    name: "dashboard",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/todo",
        component: () => import("pages/TodoPage.vue"),
      },
      {
        path: "/settings",
        component: () => import("pages/PageSettings.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("pages/Dashboard.vue"),
      },
    ],
  },
  {
    path: "/user/student",
    component: () => import("layouts/MainLayout.vue"),
    name: "student",
    meta: {
      requiredAuth: true,
      access: [
        "view-profile",
        "edit-profile",
        "update-profile",
        "delete-profile",
      ],
    },
    children: [
      {
        path: "/user/student",
        component: () => import("pages/users/student/StudentIndex.vue"),
        name: "student-index",
        meta: {
          requiredAuth: true,
          access: ["view-student"],
        },
      },
      {
        path: "/user/student/create",
        component: () => import("pages/users/student/CreateStudent.vue"),
        name: "student-create",
      },
      {
        path: "/user/student/:id/edit",
        component: () => import("pages/users/student/EditStudent.vue"),
        name: "student-edit",
      },
      {
        path: "/user/student/online-registration",
        component: () =>
          import("pages/users/student/OnlineRegistrationStudentIndex.vue"),
        name: "student-online-edit",
      },
    ],
  },

  {
    path: "/user/parent",
    component: () => import("layouts/MainLayout.vue"),
    name: "parent",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/user/parent",
        component: () => import("pages/users/parent/ParentIndex.vue"),
        name: "parent-index",
      },
      {
        path: "/user/parent/create",
        component: () => import("pages/users/parent/CreateParent.vue"),
        name: "parent-create",
      },
      {
        path: "/user/parent/:id/edit",
        component: () => import("pages/users/parent/EditParent.vue"),
        name: "parent-edit",
      },
    ],
  },

  {
    path: "/user/teacher",
    component: () => import("layouts/MainLayout.vue"),
    name: "teacher",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/user/teacher",
        component: () => import("pages/users/teacher/TeacherIndex.vue"),
        name: "teacher-index",
      },
      {
        path: "/user/teacher/create",
        component: () => import("pages/users/teacher/CreateTeacher.vue"),
        name: "teacher-create",
      },
      {
        path: "/user/teacher/:id/edit",
        component: () => import("pages/users/teacher/EditTeacher.vue"),
        name: "teacher-edit",
      },
    ],
  },

  {
    path: "/user/employee",
    component: () => import("layouts/MainLayout.vue"),
    name: "employee",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/user/employee",
        component: () => import("pages/users/employee/EmployeeIndex.vue"),
        name: "employee-index",
      },
      {
        path: "/user/employee/create",
        component: () => import("pages/users/employee/CreateEmployee.vue"),
        name: "employee-create",
      },
      {
        path: "/user/employee/:id/edit",
        component: () => import("pages/users/employee/EditEmployee.vue"),
        name: "employee-edit",
      },
    ],
  },

  {
    path: "/colleges",
    component: () => import("layouts/MainLayout.vue"),
    name: "colleges",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/colleges",
        component: () => import("pages/academe/colleges/collegeIndex.vue"),
        name: "college-index",
      },
      {
        path: "/courses",
        component: () => import("pages/courses/courseIndex.vue"),
        name: "courses-index",
      },

      {
        path: "/courses/student",
        component: () =>
          import("pages/academe/student-courses/studentCourseIndex.vue"),
        name: "student-course-index",
      },
      {
        path: "/courses/student/:id/subject/add",
        component: () =>
          import("pages/academe/student-courses/studentSubjects.vue"),
        name: "student-course-subject-add",
      },
    ],
  },

  {
    path: "/year-level",
    component: () => import("layouts/MainLayout.vue"),
    name: "year-level",
    meta: {
      requiredAuth: true,
      access: [
        "view-year-level",
        "create-year-level",
        "edit-year-level",
        "update-year-level",
        "delete-create-year-level",
      ],
    },
    children: [
      {
        path: "/year-level",
        component: () => import("pages/academe/year-level/YearLevelIndex.vue"),
        name: "year-level-index",
      },
    ],
  },

  {
    path: "/subjects",
    component: () => import("layouts/MainLayout.vue"),
    name: "subjects",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/subjects",
        component: () => import("pages/subjects/subjectIndex.vue"),
        name: "subject-index",
      },
      {
        path: "/subjects/schedule",
        component: () => import("pages/subjects/subjectSchedule.vue"),
        name: "subject-schedule",
      },

      {
        path: "/subjects/prospectus",
        component: () => import("pages/subjects/prospectusIndex.vue"),
        name: "prospectus-index",
      },
      {
        path: "/subjects/section-block",
        component: () =>
          import("pages/subjects/block-section/BlockSectionIndex.vue"),
        name: "section-block-index",
      },

      {
        path: "/subjects/prospectus/course/:code/:id",
        component: () => import("pages/subjects/viewProspectus.vue"),
        name: "prospectus-view",
      },
    ],
  },

  {
    path: "/admission",
    component: () => import("layouts/MainLayout.vue"),
    name: "admission",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/admission/semester-:id",
        component: () => import("pages/admission/admissionIndex.vue"),
        name: "admission-semester",
      },
      {
        path: "/admission/semester-:id/student-:student_id",
        component: () => import("pages/admission/admissionEnrol.vue"),
        name: "admission-semester-enrol",
      },
      {
        path: "/admission/semester-:id/student-:student_id/:admission_id/edit",
        // component: () => editEnroll,
        component: () => import("pages/admission/AdmissionEditEnrol.vue"),

        name: "admission-semester-enrol-edit",
      },
    ],
  },

  {
    path: "/finances",
    component: () => import("layouts/MainLayout.vue"),
    name: "finances",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/finances/billing",
        component: () => import("pages/finances/billingIndex.vue"),
        name: "finance-billing",
      },
      {
        path: "/finances/discount",
        component: () => import("pages/finances/discountIndex.vue"),
        name: "finance-discount",
      },
      {
        path: "/finances/cashier",
        component: () => import("pages/finances/cashierIndex.vue"),
        name: "finance-cashier",
      },
      {
        path: "/finances/scholarship",
        component: () => import("pages/finances/scholarshipIndex.vue"),
        name: "finance-scholarship",
      },
    ],
  },
  {
    path: "/reports",
    component: () => import("layouts/MainLayout.vue"),
    name: "reports",
    meta: {
      requiredAuth: true,
      access: ["view-account-receivable", "view-account-collected"],
    },
    children: [
      {
        path: "/reports/registrar",
        component: () => import("pages/reports/registrar/RegistrarIndex.vue"),
        name: "report-registrar",
      },
      {
        path: "/reports/receivable",
        component: () => import("pages/reports/receivable/ReceivableIndex.vue"),
        name: "report-receivable",
      },
      {
        path: "/reports/collected",
        component: () => import("pages/reports/collected/CollectedIndex.vue"),
        name: "report-collected",
      },
    ],
  },

  {
    path: "/print",
    component: () => import("layouts/PrintLayout.vue"),
    name: "print",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/print/receipt/:id",
        component: () => import("pages/finances/printReciept.vue"),
        name: "print-or-receipt",
      },

      {
        path: "/admission/:admission_id/print-soa",
        // component: () => editEnroll,
        component: () => import("pages/admission/PrintSoa.vue"),
        name: "admission-print-soa",
      },
      {
        path: "/admission/:admission_id/print-schedule",
        // component: () => editEnroll,
        component: () => import("pages/admission/PrintStudentSchedule.vue"),
        name: "admission-print-schedule",
      },

      {
        path: "/user/student/print-all",
        component: () => import("pages/users/student/PrintAllStudent.vue"),
        name: "student-print-all",
      },
    ],
  },

  {
    path: "/",
    redirect: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    name: "login",
    meta: {
      requiredAuth: false,
    },
    children: [
      {
        path: "/login",
        component: () => import("pages/auth/Login.vue"),
        name: "login",
      },
      {
        path: "/online-registration",
        component: () =>
          import("pages/users/student/OnlineRegisterStudent.vue"),
        name: "student-online-registration",
      },
      // {
      //   path: "/register",
      //   component: () => import("pages/auth/Register.vue"),
      //   name: "register",
      // },
    ],
  },

  {
    path: "/settings",
    component: () => import("layouts/MainLayout.vue"),
    name: "settings",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/settings/school-info",
        component: () => import("pages/settings/schoolInfo.vue"),
        name: "school-info",
      },
      {
        path: "/settings/academic-year",
        component: () => import("pages/settings/academic/academicIndex.vue"),
        name: "academic-year",
      },
      {
        path: "/settings/semester",
        component: () => import("pages/settings/semester/semesterIndex.vue"),
        name: "semester",
      },
      {
        path: "/settings/student-requirement",
        component: () =>
          import("pages/settings/requirement/requirementIndex.vue"),
        name: "requirement-student",
      },

      {
        path: "/settings/rfid",
        component: () => import("pages/settings/rfid/LocationIndex.vue"),
        name: "rfid-location",
      },
      {
        path: "/settings/file-management",
        component: () => import("pages/settings/file/fileIndex.vue"),
        name: "file-management",
      },
      {
        path: "/settings/roles-permissions",
        component: () =>
          import("pages/settings/rolespermissions/RolesPermissionsIndex.vue"),
        name: "roles-permissions",
      },
    ],
  },

  {
    path: "/rfid",
    component: () => import("layouts/MainLayout.vue"),
    name: "rfid",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/rfid",
        component: () => import("pages/rfid/RfidCodeIndex.vue"),
        name: "rfid-index-",
      },
    ],
  },

  /**
   *
   * Student Routes
   *
   *
   **/

  {
    path: "/student/schedules",
    component: () => import("layouts/MainLayout.vue"),
    name: "student-route",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/student/schedules",
        component: () => import("pages/students/StudentSchedules.vue"),
        name: "student-schedule",
      },
      {
        path: "/student/soa",
        component: () => import("pages/students/StudentSoa.vue"),
        name: "student-soa",
      },
      {
        path: "/student/grades",
        component: () => import("pages/students/StudentGrades.vue"),
        name: "student-grades",
      },
    ],
  },

  /**
   *
   * Teacher Routes
   *
   *
   **/

  {
    path: "/teacher/",
    component: () => import("layouts/MainLayout.vue"),
    name: "teacher-route",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/teacher/advisory",
        component: () => import("pages/teachers/AdvisoryIndex.vue"),
        name: "teacher-advisory",
      },
      {
        path: "/teacher/subject-load",
        component: () => import("pages/teachers/SubjectLoadIndex.vue"),
        name: "teacher-subject-load",
      },
    ],
  },

  /**
   *
   * Scanner Routes
   *
   *
   **/

  {
    path: "/qrcode/",
    component: () => import("layouts/MainLayout.vue"),
    name: "log-index",
    meta: {
      requiredAuth: true,
      access: ["view-profile"],
    },
    children: [
      {
        path: "/qrcode/log",
        component: () => import("pages/qrcode/LogIndex.vue"),
        name: "qrcode-log-index",
      },
      {
        path: "/qrcode/time-in",
        component: () => import("pages/qrcode/CheckInScan.vue"),
        name: "qrcode-log-checkin",
      },
      {
        path: "/qrcode/time-out",
        component: () => import("pages/qrcode/CheckOutScan.vue"),
        name: "qrcode-log-checkout",
      },
      // {
      //   path: "/qrcode/log/checkin",
      //   component: () => import("pages/teachers/AdvisoryIndex.vue"),
      //   name: "qrcode-log-checkin",
      // },
    ],
  },

  // {
  //   path: "/student",
  //   component: () => import("layouts/MainLayout.vue"),
  //   name: "student-college",
  //   meta: {
  //     requiredAuth: true,
  //     access: ["view-profile"],
  //   },
  //   children: [
  //     // {
  //     //   path: "/student/colleges",
  //     //   component: () => import("pages/academe/colleges/collegeIndex.vue"),
  //     //   name: "college-student-index",
  //     // },
  //   ],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
