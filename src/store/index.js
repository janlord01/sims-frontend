import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import Userstore from "./store";
import StudentStore from "./users/student/store";
import ParentStore from "./users/parent/store";
import TeacherStore from "./users/teacher/store";
import EmployeeStore from "./users/employee/store";
import AcademicStore from "./settings/academic/store";
import SemesterStore from "./settings/semester/store";
import RequirementStore from "./settings/requirement/store";
import RolesPermissionsStore from "./settings/rolespermissions/store";
import FileStore from "./settings/file/store";
import CourseStore from "./courses/course-list/store";
import CollegeStore from "./academe/colleges/store";
import YearLevelStore from "./academe/year-level/store";
import SubjectStore from "./subjects/subjectManage/store";
import SubjectScheduleStore from "./subjects/schedule/store";
import ProspectusStore from "./subjects/prospectus/store";
import BillingStore from "./finances/billings/store";
import DiscountStore from "./finances/discounts/store";
import PaymentStore from "./finances/cashier/store";
import AdmissionStore from "./admission/store";
import SectionStore from "./subjects/block-section/store";
import StudentUserStore from "./students/store";
import ReportCollectedStore from "./reports/collected/store";
import TeacherUserStore from "./teachers/store";
import RfidStore from "./rfid/store";
// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      Userstore,
      StudentStore,
      ParentStore,
      TeacherStore,
      EmployeeStore,
      AcademicStore,
      SemesterStore,
      RequirementStore,
      FileStore,
      CourseStore,
      CollegeStore,
      SubjectStore,
      SubjectScheduleStore,
      ProspectusStore,
      BillingStore,
      DiscountStore,
      PaymentStore,
      AdmissionStore,
      RolesPermissionsStore,
      YearLevelStore,
      SectionStore,
      StudentUserStore,
      ReportCollectedStore,
      TeacherUserStore,
      RfidStore,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
