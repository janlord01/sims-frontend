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
        ? ['name', 'course', 'semester', 'year', 'action']
        : ['name', 'course', 'semester', 'year', 'action']
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
            color="primary"
            icon="visibility"
            size="sm"
            @click="checkSection(props.row.id, props.row.name)"
          />

          <!-- <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="editDialog(props.row.id)"
          /> -->
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

  <!-- Show Student Block Section Dialog -->
  <q-dialog v-model="showViewDialog">
    <viewSubjectList
      :section-id="section_id"
      :section-name="section"
      @hide-add-dialog="showViewDialog = !showViewDialog"
    />
  </q-dialog>
</template>

<script>
import viewSubjectList from "src/components/teachers/viewSubjectlist.vue";

import { api } from "src/boot/axios";
import store from "src/store/teachers/store";
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
      showViewDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      section_id: null,
      course_id: null,
      course: null,
      section: null,
      semester_id: null,
    };
  },
  methods: {
    // editDialog(section_id) {
    //   this.showEditDialog = true;
    //   this.section_id = null;
    //   this.section_id = section_id;
    // },
    checkSection(id, name) {
      this.showViewDialog = true;
      this.section_id = id;
      this.section = name;
    },
  },
  mounted() {},
  components: {
    viewSubjectList,
  },
};
</script>

<style></style>
