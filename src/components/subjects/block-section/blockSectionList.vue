<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'user', 'course', 'semester', 'year', 'action']
        : ['id', 'name', 'user', 'course', 'semester', 'year', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="user" :props="props">
          {{ props.row.user }}
        </q-td>
        <q-td key="course" :props="props">
          {{ props.row.course }}
        </q-td>
        <q-td key="semester" :props="props">
          {{ props.row.semester }}
        </q-td>
        <q-td key="year" :props="props">
          {{ props.row.year }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="green"
            icon="add"
            size="sm"
            @click="
              addDialog(
                props.row.id,
                props.row.name,
                props.row.course,
                props.row.courseId,
                props.row.semester_id
              )
            "
          />

          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Dialog -->
  <q-dialog v-model="showEditDialog">
    <editBlockSection
      :section-id="section_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Prerequisite Subject Dialog -->
  <q-dialog v-model="showAddDialog">
    <addSubjectSection
      :section-id="section_id"
      :section-name="section"
      :course-id="course_id"
      :course-name="course"
      :semester-id="semester_id"
      @hide-add-dialog="showAddDialog = !showAddDialog"
    />
  </q-dialog>
</template>

<script>
import editBlockSection from "src/components/subjects/block-section/editBlockSection.vue";
import addSubjectSection from "src/components/subjects/block-section/addSubjectSection.vue";

import { api } from "src/boot/axios";
import store from "src/store/subjects/block-section/store";
import { LocalStorage } from "quasar";
const pagination = {
  sortBy: "id",
  rowsPerPage: 10,
};
const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "user",
    label: "Teacher",
    field: "user",
    align: "left",
    sortable: true,
  },
  {
    name: "course",
    label: "Course",
    field: "course",
    align: "left",
    sortable: true,
  },
  {
    name: "semester",
    label: "Semester",
    field: "semester",
    align: "left",
    sortable: true,
  },
  {
    name: "year",
    label: "Year/Grade Level",
    field: "year",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  setup() {
    return {
      pagination,
      columns,
    };
    const $q = useQuasar();
  },
  data() {
    return {
      store,
      sub_id: null,
      showEditDialog: false,
      showAddDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      section_id: null,
      course_id: null,
      course: null,
      section: null,
      semester_id: null,
    };
  },
  methods: {
    editDialog(section_id) {
      this.showEditDialog = true;
      this.section_id = null;
      this.section_id = section_id;
    },
    addDialog(section_id, section_name, course_name, course_id, semester_id) {
      this.showAddDialog = true;
      this.section_id = null;
      this.section_id = section_id;

      this.section = null;
      this.section = section_name;

      this.course_id = null;
      this.course_id = course_id;

      this.course = null;
      this.course = course_name;

      this.semester_id = null;
      this.semester_id = semester_id;
    },
  },
  mounted() {},
  components: {
    editBlockSection,
    addSubjectSection,
  },
};
</script>

<style></style>
