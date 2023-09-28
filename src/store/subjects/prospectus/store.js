import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { Notify } from "quasar";

const state = {
  studentDetails: {},
  passForm: false,
  rowDatas: [],
  // 1st Year
  firstSemFirstYr: [],
  secondSemFirstYr: [],
  thirdSemFirstYr: [],
  summerSemFirstYr: [],

  // 2nd Year
  firstSemSecondYr: [],
  secondSemSecondYr: [],
  thirdSemSecondYr: [],
  summerSemSecondYr: [],

  // 3rd Year
  firstSemThirdYr: [],
  secondSemThirdYr: [],
  thirdSemThirdYr: [],
  summerSemThirdYr: [],

  // 4th Year
  firstSemFourthYr: [],
  secondSemFourthYr: [],
  thirdSemFourthYr: [],
  summerSemFourthYr: [],

  // 5th Year
  firstSemFifthYr: [],
  secondSemFifthYr: [],
  thirdSemFifthYr: [],
  summerSemFifthYr: [],

  // 6th Year
  firstSemSixthYr: [],
  secondSemSixthYr: [],
  thirdSemSixthYr: [],
  summerSemSixthYr: [],

  // electives
  electivesData: [],

  // Kinder
  kinderOne: [],
  kinderTwo: [],

  // Basic Ed
  firstGrade: [],
  secondGrade: [],
  thirdGrade: [],
  fourthGrade: [],
  fifthGrade: [],
  sixthGrade: [],
  seventhGrade: [],
  eighthGrade: [],
  ninethGrade: [],
  tenthGrade: [],

  // Junior & Senior
  junior_first_sem: [],
  junior_second_sem: [],
  senior_first_sem: [],
  senior_second_sem: [],
};
const mutations = {
  getAllProspectus(state, payload) {
    state.rowDatas = [];
    // console.log(payload);
    Object.entries(payload.data.prospectus).map(([key, val]) => {
      state.rowDatas.push({
        id: val.id,
        code: val.code,
        descr: val.descr,
        course_id: val.course_id,
      });
    });
    // console.log(state.rowDatas);
  },
  getSubjects(state, payload) {
    // 1st Year
    state.firstSemFirstYr = [];
    state.secondSemFirstYr = [];
    state.thirdSemFirstYr = [];
    state.summerSemFirstYr = [];
    // 2nd Year
    state.firstSemSecondYr = [];
    state.secondSemSecondYr = [];
    state.thirdSemSecondYr = [];
    state.summerSemSecondYr = [];

    // 3rd Year
    state.firstSemThirdYr = [];
    state.secondSemThirdYr = [];
    state.thirdSemThirdYr = [];
    state.summerSemThirdYr = [];

    // 4th Year
    state.firstSemFourthYr = [];
    state.secondSemFourthYr = [];
    state.thirdSemFourthYr = [];
    state.summerSemFourthYr = [];

    // 5th Year
    state.firstSemFifthYr = [];
    state.secondSemFifthYr = [];
    state.thirdSemFifthYr = [];
    state.summerSemFifthYr = [];

    // 6th Year
    state.firstSemSixthYr = [];
    state.secondSemSixthYr = [];
    state.thirdSemSixthYr = [];
    state.summerSemSixthYr = [];

    // electives
    state.electivesData = [];

    // Kinder

    state.kinderOne = [];
    state.kinderTwo = [];

    // Basic Ed
    state.firstGrade = [];
    state.secondGrade = [];
    state.thirdGrade = [];
    state.fourthGrade = [];
    state.fifthGrade = [];
    state.sixthGrade = [];
    state.seventhGrade = [];
    state.eighthGrade = [];
    state.ninethGrade = [];
    state.tenthGrade = [];

    // Junior & Senior
    state.junior_first_sem = [];
    state.junior_second_sem = [];
    state.senior_first_sem = [];
    state.senior_second_sem = [];

    // console.log(payload);

    // 1st Year
    Object.entries(payload.data.prospectus_first).map(([key, val]) => {
      state.firstSemFirstYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
        title: val.title,
      });
    });

    Object.entries(payload.data.prospectus_second).map(([key, val]) => {
      state.secondSemFirstYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    Object.entries(payload.data.prospectus_third).map(([key, val]) => {
      state.thirdSemFirstYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });
    Object.entries(payload.data.prospectus_sem).map(([key, val]) => {
      state.summerSemFirstYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // 2nd Year
    Object.entries(payload.data.prospectus_first_second_year).map(
      ([key, val]) => {
        state.firstSemSecondYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_second_second_year).map(
      ([key, val]) => {
        state.secondSemSecondYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_third_second_year).map(
      ([key, val]) => {
        state.thirdSemSecondYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );
    Object.entries(payload.data.prospectus_sem_second_year).map(
      ([key, val]) => {
        state.summerSemSecondYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    // 3rd Year
    Object.entries(payload.data.prospectus_first_third_year).map(
      ([key, val]) => {
        state.firstSemThirdYr.push({
          // id: val.id,
          // code:
          //   (typeof val.subject === "undefined")
          //     ? "blank"
          //     : null,
          // descr:
          //   (typeof val.subject === "undefined")
          //     ? "pick by student"
          //     : null,
          // lec:
          //   (typeof val.subject=== "undefined")
          //     ? val.subject[0].unit_lecture
          //     : null,
          // lab:
          //   (typeof val.subject === "undefined")
          //     ? val.subject[0].unit_lab
          //     : null,
          // practicum:
          //   (typeof val.subject === "undefined")
          //     ? val.subject[0].unit_practicum
          //     : null,
          // prerequisites:
          //   (typeof val.subject === "undefined")
          //     ? val.subject[0].prerequisite
          //     : null,
          // course_id: val.course_id,
          // sem_id: val.sem_id,
          // subject_id: val.id,
          // course_prospect_id: val.course_prospect_id,
          // flag: val.flag,

          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_second_third_year).map(
      ([key, val]) => {
        state.secondSemThirdYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_third_third_year).map(
      ([key, val]) => {
        state.thirdSemThirdYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );
    Object.entries(payload.data.prospectus_sem_third_year).map(([key, val]) => {
      state.summerSemThirdYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // 4th Year
    Object.entries(payload.data.prospectus_first_fourth_year).map(
      ([key, val]) => {
        state.firstSemFourthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_second_fourth_year).map(
      ([key, val]) => {
        state.secondSemFourthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_third_fourth_year).map(
      ([key, val]) => {
        state.thirdSemFourthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );
    Object.entries(payload.data.prospectus_sem_fourth_year).map(
      ([key, val]) => {
        state.summerSemFourthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    // 5th Year
    Object.entries(payload.data.prospectus_first_fifth_year).map(
      ([key, val]) => {
        state.firstSemFifthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_second_fifth_year).map(
      ([key, val]) => {
        state.secondSemFifthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_third_fifth_year).map(
      ([key, val]) => {
        state.thirdSemFifthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );
    Object.entries(payload.data.prospectus_sem_fifth_year).map(([key, val]) => {
      state.summerSemFifthYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // 6th Year
    Object.entries(payload.data.prospectus_first_sixth_year).map(
      ([key, val]) => {
        state.firstSemSixthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_second_sixth_year).map(
      ([key, val]) => {
        state.secondSemSixthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );

    Object.entries(payload.data.prospectus_third_sixth_year).map(
      ([key, val]) => {
        state.thirdSemSixthYr.push({
          id: val.id,
          code: val.subject.length > 0 ? val.subject[0].code : "---",
          descr:
            val.subject.length > 0
              ? val.subject[0].descr
              : "to be selected by student",
          lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
          lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
          practicum:
            val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
          prerequisites:
            val.subject.length > 0 ? val.subject[0].prerequisite : "------",
          course_id: val.course_id,
          sem_id: val.sem_id,
          subject_id: val.id,
          course_prospect_id: val.course_prospect_id,
          flag: val.flag,
        });
      }
    );
    Object.entries(payload.data.prospectus_sem_sixth_year).map(([key, val]) => {
      state.summerSemSixthYr.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    Object.entries(payload.data.electives).map(([key, val]) => {
      state.electivesData.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    /**
     *
     * Kinder
     *
     */
    Object.entries(payload.data.kinderOne).map(([key, val]) => {
      state.kinderOne.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    Object.entries(payload.data.kinderTwo).map(([key, val]) => {
      state.kinderTwo.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    /**
     *
     * Basic Ed
     *
     */

    // Grade 1
    Object.entries(payload.data.firstGrade).map(([key, val]) => {
      state.firstGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 2
    Object.entries(payload.data.secondGrade).map(([key, val]) => {
      state.secondGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 3
    Object.entries(payload.data.thirdGrade).map(([key, val]) => {
      state.thirdGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 4
    Object.entries(payload.data.fourthGrade).map(([key, val]) => {
      state.fourthGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 5
    Object.entries(payload.data.fifthGrade).map(([key, val]) => {
      state.fifthGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 6
    Object.entries(payload.data.sixthGrade).map(([key, val]) => {
      state.sixthGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 7
    Object.entries(payload.data.seventhGrade).map(([key, val]) => {
      state.seventhGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 8
    Object.entries(payload.data.eighthGrade).map(([key, val]) => {
      state.eighthGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 9
    Object.entries(payload.data.ninethGrade).map(([key, val]) => {
      state.ninethGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Grade 10
    Object.entries(payload.data.tenthGrade).map(([key, val]) => {
      state.tenthGrade.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    /**
     *
     * Junior & Senior
     *
     *
     */
    // Junior 1st Sem
    Object.entries(payload.data.junior_first_sem).map(([key, val]) => {
      state.junior_first_sem.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Junior 2nd Sem
    Object.entries(payload.data.junior_second_sem).map(([key, val]) => {
      state.junior_second_sem.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Senior 1st Sem
    Object.entries(payload.data.senior_first_sem).map(([key, val]) => {
      state.senior_first_sem.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // Senior 2nd Sem
    Object.entries(payload.data.senior_second_sem).map(([key, val]) => {
      state.senior_second_sem.push({
        id: val.id,
        code: val.subject.length > 0 ? val.subject[0].code : "---",
        descr:
          val.subject.length > 0
            ? val.subject[0].descr
            : "to be selected by student",
        lec: val.subject.length > 0 ? val.subject[0].unit_lecture : "--",
        lab: val.subject.length > 0 ? val.subject[0].unit_lab : "--",
        practicum:
          val.subject.length > 0 ? val.subject[0].unit_practicum : "--",
        prerequisites:
          val.subject.length > 0 ? val.subject[0].prerequisite : "------",
        course_id: val.course_id,
        sem_id: val.sem_id,
        subject_id: val.id,
        course_prospect_id: val.course_prospect_id,
        flag: val.flag,
      });
    });

    // console.log(state.summerSemFifthYr);
  },
};

// const $q = useQuasar();
const actions = {
  async getAllProspectus({ commit }, payload) {
    await api
      .get("/api/prospectus/list/index", {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getAllProspectus", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getSubjects({ commit }, payload) {
    // console.log(payload)
    await api
      .get("/api/prospectus/courses/" + payload, {
        headers: {
          Authorization: "Bearer " + LocalStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        commit("getSubjects", response);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async onSearch({ commit }, payload) {
    // console.log(payload);
    if (payload.length > 0) {
      await api
        .get(
          "/api/subjects/on/search",
          {
            params: {
              name: payload,
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
          // if()
          commit("getAllSubjects", response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await api
        .get("/api/subjects", {
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          commit("getAllSubjects", response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
