import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  rowDiscountDatas: [],
  rowBillingDatas: [],
  rowSubjectDatas: [],
  rowAllSubjectDatas: [],
  rowAllBlockSection: [],
  rowAllGroupBilling: [],

  unenrolled: [],
  TempunenrolledStudent: [],

  enrolled: [],
  TempenrolledStudent: [],

  tempData: [],
  tempDataAllSubject: [],
  tempDataAllBilling: [],
  tempDataAllDiscount: [],
  tempAllBlockSection: [],
  tempAllGroupBilling: [],

  tempDataSubject: [],
  tempDataBilling: [],
  tempDataDiscount: [],

  totalSubject: [],
  total: 0,

  totalBilling: [],
  totalBills: 0,

  totalDiscount: 0,
  discounts: [],

  totalPayables: 0,
  totalUnits: 0,
  receipt: 0,
  initialPayment: 0,

  balance: 0,

  TotalAllSubBillDisc: 0,

  oldDiscount: 0,

  // admission_id: null,
};
const mutations = {
  getEnrollmentFee(state, payload) {
    state.tempDataBilling = [];

    Object.entries(payload).map(([key, val]) => {
      // console.log(val);

      state.totalBilling.push({
        id: val.id,
        price: val.amount,
      });
    });
    // console.log("Bills: " + state.totalBilling[0]);
    Object.entries(payload).map(([key, val]) => {
      state.totalBills = parseFloat(state.totalBills) + parseFloat(val.amount);
    });

    Object.entries(payload).map(([key, val]) => {
      state.totalPayables = state.totalPayables + parseFloat(val.amount);
    });

    Object.entries(payload).map(([key, val]) => {
      state.tempDataBilling.push({
        id: val.id,
        price: val.amount,
        name: val.name,
        total: val.total,
        balance: val.balance,
      });
    });
  },
  totalAllWithDiscounts(state, payload) {
    // console.log("calculated!");
    state.totalDiscount = 0;
    state.totalPayables = 0;
    // if (state.totalPayables != 0) {
    if (payload === "save") {
      state.totalPayables =
        state.balance + (state.total + state.totalBills) - state.initialPayment;
    } else {
      state.totalPayables = state.balance + (state.total + state.totalBills);
    }

    // }

    Object.entries(state.tempDataDiscount).map(([key, val]) => {
      state.discounts.push({
        id: val.id,
        type: val.type,
        number:
          val.type == "Percentage"
            ? val.number.replace("%", "")
            : val.number.replace("P", ""),
        total:
          val.type == "Percentage"
            ? parseFloat(
                (val.number.replace("%", "") / 100) * state.totalPayables
              )
            : parseFloat(val.number.replace("P", "")),
      });
      // state.totalDiscount =
      //   state.totalDiscount + val.type == "Percentage"
      //     ? parseInt(val.number.replace("%", "") / 100) * state.totalPayables
      //     : parseInt(val.number.replace("P", ""));

      state.totalDiscount =
        parseFloat(state.totalDiscount) +
        (val.type == "Percentage"
          ? parseFloat(
              (val.number.replace("%", "") / 100) * state.totalPayables
            )
          : parseFloat(val.number.replace("P", "")));
      // console.log(state.totalDiscount);
    });

    state.TotalAllSubBillDisc = state.totalPayables - state.totalDiscount;

    // console.log(state.discounts);
  },
  saveStudentDetails(state, payload) {
    state.studentDetails = payload;
  },
  getReceiptNumber(state, payload) {
    state.receipt = payload.transaction_id;
    state.initialPayment = payload.sub_total;
    // console.log(state.initialPayment);
  },
  removeBilling(state, payload) {
    // console.log(state.tempDataBilling);
    const objWithIdIndex = state.tempDataBilling.findIndex(
      (obj) => obj.id === payload
    );

    const objWithIdFilter = state.tempDataBilling.filter(
      (obj) => obj.id === payload
    );

    state.totalBills = state.totalBills - objWithIdFilter[0].price;
    state.totalPayables = state.totalPayables - objWithIdFilter[0].price;

    if (objWithIdIndex > -1) {
      state.tempDataBilling.splice(objWithIdIndex, 1);
      Notify.create({
        type: "positive",
        message: "Item Removed!",
        position: "top",
      });
    }
    return state.tempDataBilling;
  },
  removeDiscount(state, payload) {
    // console.log(state.tempDataBilling);
    const objWithIdIndex = state.tempDataDiscount.findIndex(
      (obj) => obj.id === payload
    );

    const objWithIdFilter = state.tempDataDiscount.filter(
      (obj) => obj.id === payload
    );

    // state.totalBills = state.totalBills - objWithIdFilter[0].price;
    // state.totalPayables = state.totalPayables - objWithIdFilter[0].price;

    if (objWithIdIndex > -1) {
      state.tempDataDiscount.splice(objWithIdIndex, 1);
      Notify.create({
        type: "positive",
        message: "Item Removed!",
        position: "top",
      });
    }
    return state.tempDataBilling;
  },
  removeSubject(state, payload) {
    // console.log(state.tempDataBilling);
    const objWithIdIndex = state.tempDataSubject.findIndex(
      (obj) => obj.id === payload
    );
    // console.log(objWithIdIndex);
    // const objWithIdFilter = state.tempDataSubject.filter(
    //   (obj) => obj.id === payload
    // );
    const objWithIdFilter = state.tempDataSubject.filter(
      (obj) => obj.id === payload
    );

    state.total = state.total - objWithIdFilter[0].total_price;
    state.totalPayables = state.totalPayables - objWithIdFilter[0].total_price;
    state.totalUnits = state.totalUnits - objWithIdFilter[0].total_units;

    // console.log(state.total);
    if (objWithIdIndex > -1) {
      state.tempDataSubject.splice(objWithIdIndex, 1);
      Notify.create({
        type: "positive",
        message: "Item Removed!",
        position: "top",
      });
    }
    return state.tempDataSubject;
  },
  getAllDiscount(state, payload) {
    // console.log(payload);
    state.tempDataAllDiscount = [];
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempDataAllDiscount.push({
        id: val.id,
        type: val.type,
        description: val.description,
        number: val.type == "Percentage" ? val.number + "%" : "P" + val.number,
      });
    });
    state.rowDiscountDatas = state.tempDataAllDiscount;
  },
  getAllbillings(state, payload) {
    state.tempDataAllBilling = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempDataAllBilling.push({
        id: val.id,
        price: val.amount,
        name: val.name,
      });
    });
    state.rowBillingDatas = state.tempDataAllBilling;
  },
  getAllSchedulesSubject(state, payload) {
    state.tempData = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempData.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
      });
    });
    state.rowSubjectDatas = state.tempData;
  },
  getAllSubjectWithSchedules(state, payload) {
    state.tempDataAllSubject = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempDataAllSubject.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
      });
    });
    state.rowAllSubjectDatas = state.tempDataAllSubject;
  },
  getBalance(state, payload) {
    state.balance = 0;
    // console.log(payload);
    state.balance = parseFloat(payload != null ? payload : 0);

    // state.totalPayables =
    //   state.totalPayables +
    //   parseFloat(payload.data.data != null ? payload.data.data : 0);

    // console.log(state.totalPayables);
  },
  getTemporarySubject(state, payload) {
    // state.tempDataSubject = [];
    // console.log(payload[0]);
    Object.entries(payload).map(([key, val]) => {
      state.totalSubject.push({
        id: val.id,
        totalPrice:
          val.overide_unit_price != null
            ? val.total_units * val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        units: val.unit,
      });
    });

    // console.log("Subject" + state.totalSubject);

    Object.entries(payload).map(([key, val]) => {
      state.total =
        state.total +
        (val.balance
          ? parseFloat(val.balance)
          : parseFloat(
              val.overide_unit_price != null
                ? val.total_units * val.overide_unit_price
                : val.flag == 1
                ? val.total_units * val.unit
                : 0
            ));
    });

    Object.entries(payload).map(([key, val]) => {
      state.totalUnits = state.totalUnits + val.total_units;
    });

    Object.entries(payload).map(([key, val]) => {
      // console.log("starting " + state.totalPayables);
      // console.log(val.balance);
      state.totalPayables =
        state.totalPayables +
        (val.balance
          ? parseFloat(val.balance)
          : parseFloat(
              val.overide_unit_price != null
                ? val.total_units * val.overide_unit_price
                : val.flag == 1
                ? val.total_units * val.unit
                : 0
            ));
    });
    // console.log("total " + state.totalPayables);

    Object.entries(payload).map(([key, val]) => {
      state.tempDataSubject.push({
        id: val.id,
        code: val.code,
        name: val.name,
        description: val.descr,
        teacher: val.teacherName,
        available: val.available,
        limit: val.limit,
        price:
          val.overide_unit_price != null
            ? val.overide_unit_price
            : val.flag == 1
            ? val.unit
            : 0,
        schedules: val.schedules,
        course: val.course_code,
        total_units: val.total_units,
        total_price: parseFloat(
          val.overide_unit_price != null
            ? val.total_units * val.overide_unit_price
            : val.flag == 1
            ? val.total_units * val.unit
            : 0
        ),
        total: val.total,
        balance: val.balance,
      });
    });
  },
  getTemporaryDiscount(state, payload) {
    // state.oldDiscount = 0;
    Object.entries(payload).map(([key, val]) => {
      state.tempDataDiscount.push({
        id: val.id,
        type: val.type,
        description: val.description,
        number: val.type == "Percentage" ? val.number + "%" : "P" + val.number,
      });
    });

    Object.entries(payload).map(([key, val]) => {
      state.oldDiscount =
        val.discount_total != null
          ? parseFloat(state.oldDiscount) + parseFloat(val.discount_total)
          : state.oldDiscount;
    });

    // console.log(state.oldDiscount);
  },
  getTemporaryBilling(state, payload) {
    // state.tempDataSubject = [];
    // console.log(payload);
    Object.entries(payload).map(([key, val]) => {
      // console.log(val);

      state.totalBilling.push({
        id: val.id,
        price: val.amount,
      });
    });
    // console.log("Bills: " + state.totalBilling[0]);
    Object.entries(payload).map(([key, val]) => {
      state.totalBills =
        parseFloat(state.totalBills) +
        parseFloat(val.balance ? val.balance : val.amount);
    });

    Object.entries(payload).map(([key, val]) => {
      console.log("starting " + state.totalPayables);
      console.log(val.balance);
      // if (val.total === val.balance) {
      state.totalPayables =
        state.totalPayables +
        parseFloat(val.balance ? val.balance : val.amount);
      // } else {
      // state.totalPayables = state.totalPayables + parseFloat(val.balance);
      // }
    });
    console.log("total " + state.totalPayables);
    // console.log("Total Bills: " + state.totalBills);

    Object.entries(payload).map(([key, val]) => {
      state.tempDataBilling.push({
        id: val.id,
        price: val.amount,
        name: val.name,
        total: val.total,
        balance: val.balance,
      });
    });
    // console.log(state.tempDataBilling);
  },
  getAllUnenrolledStudent(state, payload) {
    state.TempunenrolledStudent = [];
    // console.log(payload);
    Object.entries(payload.data.unenrolled).map(([key, val]) => {
      state.TempunenrolledStudent.push({
        id: val.id,
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
        profile_image: val.profile_image,
        status: val.status,
      });
    });
    state.unenrolled = state.TempunenrolledStudent;
  },
  getAllEnrolledStudent(state, payload) {
    state.TempenrolledStudent = [];
    // console.log(payload);
    Object.entries(payload.data.enrolled).map(([key, val]) => {
      state.TempenrolledStudent.push({
        id: val.id,
        name:
          val.lastname +
          ", " +
          val.firstname +
          " " +
          (val.middlename !== null ? val.middlename : ""),
        profile_image: val.profile_image,
        status: val.status,
        admission_id: val.admission_id,
      });
    });
    state.enrolled = state.TempenrolledStudent;

    // console.log(state.enrolled);
  },
  onSearchAllDiscount(state, payload) {
    if (payload == "") {
      state.rowDiscountDatas = state.tempDataAllDiscount;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowDiscountDatas = state.tempDataAllDiscount.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.unenrolled);
  },
  onSearch(state, payload) {
    if (payload == "") {
      state.rowSubjectDatas = state.tempData;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowSubjectDatas = state.tempData.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.unenrolled);
  },
  onSearchAllSubject(state, payload) {
    if (payload == "") {
      state.rowAllSubjectDatas = state.tempDataAllSubject;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowAllSubjectDatas = state.tempDataAllSubject.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.unenrolled);
  },
  onSearchAllBilling(state, payload) {
    if (payload == "") {
      state.rowBillingDatas = state.tempDataAllBilling;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowBillingDatas = state.tempDataAllBilling.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.tempDataAllBilling);
  },
  onSearchGroupAllBilling(state, payload) {
    if (payload == "") {
      state.rowAllGroupBilling = state.tempAllGroupBilling;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowAllGroupBilling = state.tempAllGroupBilling.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.tempDataAllBilling);
  },

  onSearchUnenrolledStudent(state, payload) {
    if (payload == "") {
      state.unenrolled = state.TempunenrolledStudent;
      return;
    }
    const needle = payload.toLowerCase();
    state.unenrolled = state.TempunenrolledStudent.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
  },

  onSearchEnrolledStudent(state, payload) {
    if (payload == "") {
      state.enrolled = state.TempenrolledStudent;
      return;
    }
    const needle = payload.toLowerCase();
    state.enrolled = state.TempenrolledStudent.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
    // console.log(state.tempDataAllBilling);
  },
  onSearchBlockSection(state, payload) {
    if (payload == "") {
      state.rowAllBlockSection = state.tempAllBlockSection;
      return;
    }
    const needle = payload.toLowerCase();
    state.rowAllBlockSection = state.tempAllBlockSection.filter((v) => {
      return Object.values(v).some(
        (word) => String(word).toLowerCase().indexOf(needle) > -1
      );
    });
  },

  addBalance(state, payload) {
    // state.totalPayables =
    //   state.totalPayables + (parseFloat(payload) - state.balance);
    // console.log(state.balance - parseFloat(payload));

    state.balance = parseFloat(payload);
  },
  emptyAll(state) {
    state.rowDatas = [];
    state.rowDiscountDatas = [];
    state.rowBillingDatas = [];
    state.rowSubjectDatas = [];
    state.rowAllSubjectDatas = [];

    // unenrolled= []
    // TempunenrolledStudent= []

    // enrolled= []
    // TempenrolledStudent= []

    state.tempData = [];
    state.tempDataAllSubject = [];
    state.tempDataAllBilling = [];
    state.tempDataAllDiscount = [];

    state.tempDataSubject = [];
    state.tempDataBilling = [];
    state.tempDataDiscount = [];

    state.totalSubject = [];
    state.total = 0;

    state.totalBilling = [];
    state.totalBills = 0;

    state.totalDiscount = 0;
    state.discounts = [];

    state.totalPayables = 0;
    state.totalUnits = 0;
    state.receipt = 0;
    state.initialPayment = 0;

    state.balance = 0;

    state.TotalAllSubBillDisc = 0;
    state.oldDiscount = 0;
  },
  getAllBlockSection(state, payload) {
    state.tempAllBlockSection = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempAllBlockSection.push({
        id: val.id,
        name: val.name,
        teacher: val.userName,
        schedules: val.subject_schedule_subs,
        course: val.code,
        semester: val.title,
        year: val.yearName,
      });
    });
    state.rowAllBlockSection = state.tempAllBlockSection;
  },
  getAllGroupbilling(state, payload) {
    state.tempAllGroupBilling = [];
    // console.log(payload);
    Object.entries(payload.data.data).map(([key, val]) => {
      state.tempAllGroupBilling.push({
        id: val.id,
        name: val.name,
        course: val.code,
        year: val.year_level,
        year_id: val.level_id,
      });
    });
    state.rowAllGroupBilling = state.tempAllGroupBilling;
  },
};

// const $q = useQuasar();
const actions = {
  async getBilling({ commit, state }, payload) {
    await api
      .get("/api/admission/billing/group/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        let arr1 = [];
        let arr2 = [];

        response.data.data.filter((element) => {
          arr1.push(element.billing_id);
        });
        state.tempDataBilling.filter((element) => {
          arr2.push(element.id);
        });

        if (arr2.length > 0) {
          let subs = arr1.filter((element) => {
            return arr2.includes(element);
          });

          subs = arr2.filter((element) => {
            return arr2.includes(element);
          });

          const join = arr1.concat(arr2);
          const join2 = join.concat(arr2);

          const remain = join2.filter(
            (e) => join2.indexOf(e) === join2.lastIndexOf(e)
          );
          // if (subs.length > 0) {
          //   // console.log("Some Duplicates");
          // }
          console.log("Array 1: " + arr1);
          console.log("Array 2: " + arr2);
          console.log("Duplicates: " + subs);
          console.log("Joined: " + join2);
          console.log("Remainings: " + remain);
          api
            .get(
              "/api/admission/group/billing/temp/store",
              {
                params: {
                  billings: remain,
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              }
            )
            .then((response) => {
              // console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);

                commit("getTemporaryBilling", response.data.data);
              } else {
                setTimeout(() => {
                  Notify.create({
                    type: "negative",
                    color: "negative",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
              }
              // this.studentSubjects = response.data.data;
              // console.log(this.studentSubjects);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Array 1: " + arr1);
          console.log("Array 2: " + arr2);
          api
            .get(
              "/api/admission/group/billing/temp/store",
              {
                params: {
                  billings: arr1,
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              }
            )
            .then((response) => {
              // console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
                commit("getTemporaryBilling", response.data.data);
              } else {
                setTimeout(() => {
                  Notify.create({
                    type: "negative",
                    color: "negative",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
              }
              // this.studentSubjects = response.data.data;
              // console.log(this.studentSubjects);
            })
            .catch((error) => {
              console.log(error);
            });
          // console.log(arr1);
        }

        // console.log(arr1)
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getSection({ commit, state }, payload) {
    await api
      .get("/api/section/schedules/" + payload[0], {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        let arr1 = [];
        let arr2 = [];

        response.data.data.filter((element) => {
          arr1.push(element.id);
        });
        state.tempDataSubject.filter((element) => {
          arr2.push(element.id);
        });

        if (arr2.length > 0) {
          let subs = arr1.filter((element) => {
            return arr2.includes(element);
          });

          subs = arr2.filter((element) => {
            return arr2.includes(element);
          });

          const join = arr1.concat(arr2);
          const join2 = join.concat(arr2);

          const remain = join2.filter(
            (e) => join2.indexOf(e) === join2.lastIndexOf(e)
          );
          // if (subs.length > 0) {
          //   // console.log("Some Duplicates");
          // }
          // console.log("Array 1: " + arr1);
          // console.log("Array 2: " + arr2);
          // console.log("Duplicates: " + subs);
          // console.log("Joined: " + join2);
          // console.log("Remainings: " + remain);
          api
            .get(
              "/api/admission/section/subject/temp/store/",
              {
                params: {
                  course_id: payload[1],
                  subjects: remain,
                  user_id: payload[2],
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              }
            )
            .then((response) => {
              // console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
                if (response.data.passed != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.passed,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.prerequisite != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.prerequisite,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.avail != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.avail,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.prospectus != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.prospectus,
                      class: "z-max",
                    });
                  }, 100);
                }

                commit("getTemporarySubject", response.data.data);
              } else {
                setTimeout(() => {
                  Notify.create({
                    type: "negative",
                    color: "negative",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
              }
              // this.studentSubjects = response.data.data;
              // console.log(this.studentSubjects);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // console.log("Array 1: " + arr1);
          // console.log("Array 2: " + arr2);
          api
            .get(
              "/api/admission/section/subject/temp/store/",
              {
                params: {
                  course_id: payload[1],
                  subjects: arr1,
                  user_id: payload[2],
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              }
            )
            .then((response) => {
              // console.log(response);
              if (response.data.status == 200) {
                setTimeout(() => {
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
                if (response.data.passed != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.passed,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.prerequisite != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.prerequisite,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.avail != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.avail,
                      class: "z-max",
                    });
                  }, 100);
                }
                if (response.data.prospectus != 0) {
                  setTimeout(() => {
                    Notify.create({
                      type: "negative",
                      color: "negative",
                      timeout: 3000,
                      position: "top",
                      message: response.data.prospectus,
                      class: "z-max",
                    });
                  }, 100);
                }

                commit("getTemporarySubject", response.data.data);
              } else {
                setTimeout(() => {
                  Notify.create({
                    type: "negative",
                    color: "negative",
                    timeout: 3000,
                    position: "top",
                    message: response.data.message,
                    class: "z-max",
                  });
                }, 100);
              }
              // this.studentSubjects = response.data.data;
              // console.log(this.studentSubjects);
            })
            .catch((error) => {
              console.log(error);
            });
          // console.log(arr1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllGroupbilling({ commit }, payload) {
    await api
      .get(
        "/api/billings/group/course/" + payload[0],
        {
          params: {
            year: payload[1],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        // console.log(response);
        commit("getAllGroupbilling", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getEnrolledSubjects({ commit }, payload) {
    await api
      .get("/api/admission/student/subjects/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        commit("getTemporarySubject", response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getEnrolledbillings({ commit }, payload) {
    await api
      .get("/api/admission/student/billings/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        commit("getTemporaryBilling", response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getEnrolledSchoolarship({ commit }, payload) {
    await api
      .get("/api/admission/student/schoolarship/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        commit("getTemporaryDiscount", response.data.data);
        commit("totalAllWithDiscounts");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  emptyAll({ commit }) {
    commit("emptyAll");
  },
  totalAllWithDiscounts({ commit }, payload) {
    commit("totalAllWithDiscounts", payload);
  },
  getReceiptNumber({ commit }, payload) {
    commit("getReceiptNumber", payload);
  },
  addBalance({ commit }, payload) {
    commit("addBalance", payload);
  },
  removeBilling({ commit }, payload) {
    commit("removeBilling", payload);
  },

  removeDiscount({ commit }, payload) {
    commit("removeDiscount", payload);
  },
  removeSubject({ commit }, payload) {
    commit("removeSubject", payload);
  },
  async getTemporarySubject({ commit }, payload) {
    // console.log(payload);
    commit("getTemporarySubject", payload);
  },
  async getTemporaryDiscount({ commit }, payload) {
    // console.log(payload);
    commit("getTemporaryDiscount", payload);
  },

  async getTemporaryBilling({ commit }, payload) {
    // console.log(payload);
    commit("getTemporaryBilling", payload);
  },

  async getEnrollmentFee({ commit }, payload) {
    // console.log(payload);
    commit("getEnrollmentFee", payload);
  },

  async getAllDiscount({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/scholarship/",
        // {
        //   params: {
        //     sem_id: payload[1],
        //   },
        // },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllDiscount", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async getAllbillings({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/billings",
        // {
        //   params: {
        //     sem_id: payload[1],
        //   },
        // },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllbillings", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllSchedulesSubject({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/admission/student/" + payload[0] + "/schedule/",
        {
          params: {
            sem_id: payload[1],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllSchedulesSubject", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getBalance({ commit }, payload) {
    // console.log(payload);
    // if(payload[1] == 'edit')
    await api
      .get("/api/admission/check-balance/" + payload[0], {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        // console.log(response);
        // console.log(response.data.data.pre_balance);
        if (payload[1] === "save") {
          commit(
            "getBalance",
            response.data.data.total_payable
              ? response.data.data.total_payable
              : 0
          );
        } else {
          commit("getBalance", response.data.data.pre_balance);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllSubjectWithSchedules({ commit }, payload) {
    // console.log(payload);

    await api
      .get(
        "/api/admission/student/subject/schedules/",
        {
          params: {
            sem_id: payload[1],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        commit("getAllSubjectWithSchedules", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async getAllUnenrolledStudent({ commit }, payload) {
    // console.log(payload);
    await api
      .get(
        "api/admission",
        {
          params: {
            semester_id: payload[0],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        // console.log(response);
        commit("getAllUnenrolledStudent", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getAllEnrolledStudent({ commit }, payload) {
    // console.log(payload[0]);
    await api
      .get(
        "api/admission",
        {
          params: {
            semester_id: payload[0],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        // console.log(response);
        commit("getAllEnrolledStudent", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async onSearchAllDiscount({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllDiscount", [payload[1], payload[2]]);
      } else {
        commit("onSearchAllDiscount", name);
      }
    }
  },
  async onSearch({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllSchedulesSubject", [payload[1], payload[2]]);
      } else {
        commit("onSearch", name);
      }
    }
  },
  async onSearchAllSubject({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllSubjectWithSchedules", [payload[1], payload[2]]);
      } else {
        commit("onSearchAllSubject", name);
      }
    }
  },
  async onSearchAllBilling({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllbillings", [payload[1], payload[2]]);
      } else {
        commit("onSearchAllBilling", name);
      }
    }
  },
  async onSearchGroupAllBilling({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllGroupbilling", [payload[1], payload[2]]);
      } else {
        commit("onSearchGroupAllBilling", name);
      }
    } else {
      commit("onSearchGroupAllBilling", name);
    }
  },

  async onSearchUnenrolledStudent({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllUnenrolledStudent", [payload[1], payload[2]]);
      } else {
        commit("onSearchUnenrolledStudent", name);
      }
    }
  },
  async onSearchEnrolledStudent({ commit, state, dispatch }, payload) {
    // console.log(payload);
    const name = payload[0];
    if (payload.length > 0) {
      // this.searchVisible = true;
      const query = payload[0] != null ? payload[0].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllEnrolledStudent", [payload[1], payload[2]]);
      } else {
        commit("onSearchEnrolledStudent", name);
      }
    }
  },

  async getAllBlockSection({ commit }, payload) {
    await api
      .get(
        "/api/section/course/" + payload[0],
        {
          params: {
            semester: payload[1],
          },
        },
        {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        }
      )
      .then((response) => {
        // console.log(response);
        commit("getAllBlockSection", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  onSearchBlockSection({ commit, state, dispatch }, payload) {
    const name = payload[2];
    if (payload[2].length > 0) {
      // this.searchVisible = true;
      const query = payload[2] != null ? payload[2].toLowerCase() : "";
      if (payload[0] == "" || payload[0] == null) {
        // state.unenrolled = state.unenrolled;
        dispatch("getAllBlockSection", [payload[0], payload[1]]);
      } else {
        commit("onSearchBlockSection", name);
      }
    } else {
      commit("onSearchBlockSection", name);
    }
  },
};

const getters = {
  clearForm: (state) => {
    return state.passForm;
  },
  getSubjectTotalState: (state) => state.total,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
