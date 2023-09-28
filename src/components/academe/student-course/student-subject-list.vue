<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="store.state.rowDataStudentSubject"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'code', 'description', 'grade', 'unit', 'action']
        : ['id', 'code']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="code" :props="props">
          {{ props.row.code }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.descr }}
        </q-td>

        <q-td key="grade" :props="props">
          {{ props.row.grade }}
        </q-td>

        <q-td key="unit" :props="props">
          {{ props.row.unit }}
        </q-td>

        <q-td key="action" :props="props">
          <!-- <q-toggle
            v-model="check"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
          /> -->
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="onShowEditSubjectDialog(props.row.id)"
          />
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            @click="deleteDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Edit Subject Dialog -->
  <q-dialog v-model="showEditSubjectDialog">
    <editSubjectDialog
      :subject-id="subject_id"
      @hide-edit-dialog="showEditSubjectDialog = !showEditSubjectDialog"
    />
  </q-dialog>
</template>

<script>
import editSubjectDialog from "src/components/academe/student-course/student-edit.subject.vue";

import { api } from "src/boot/axios";
import store from "src/store/academe/colleges/store";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
const pagination = {
  sortBy: "name",
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
    name: "code",
    label: "Code",
    field: "code",
    align: "left",
    sortable: true,
  },
  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    sortable: true,
  },
  {
    name: "grade",
    label: "Grade",
    field: "grade",
    align: "left",
    sortable: true,
  },
  {
    name: "unit",
    label: "Unit(s)",
    field: "unit",
    align: "left",
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
];
export default {
  props: ["searchData"],
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
      subject_id: null,
      showEditSubjectDialog: false,
      newToken: LocalStorage.getItem("jwt"),
      datas: store,
      check: false,
    };
  },
  methods: {
    ...mapActions("CollegeStore", ["getAllStudentSubject"]),

    onShowEditSubjectDialog(subject_id) {
      this.showEditSubjectDialog = true;
      this.subject_id = subject_id;
    },
    deleteDialog(subject_id) {
      this.$q
        .dialog({
          title: "Are you sure you want to delete this subject?",
          message: 'Please enter the word "delete" to proceed',
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          //   console.log(">>>> OK, received", data);
          if (data !== "delete") {
            this.$q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "top",
              message: 'Wrong word!, Please re-enter the word "delete" to proceed',
            });
          } else {
            this.$q.loading.show();

            api
              .delete("/api/student/subject/" + subject_id + "/delete", {
                headers: {
                  Authorization: "Bearer " + this.newToken,
                },
              })
              .then((response) => {
                // console.log(response);
                // console.log(Array.from(response.data.proof_image));
                if (response.data.status === 200) {
                  setTimeout(() => {
                    this.$q.loading.hide();
                    this.$q.notify({
                      type: "positive",
                      color: "positive",
                      timeout: 1000,
                      position: "bottom",
                      message: response.data.message,
                    });

                    this.getAllStudentSubject(this.$route.params.id);
                    // this.$emit("hideEditDialog");
                  }, 2000);
                } else {
                  setTimeout(() => {
                    this.$q.loading.hide();
                    this.$q.notify({
                      type: "negative",
                      color: "negative",
                      timeout: 1000,
                      position: "bottom",
                      message: response.data.message,
                    });

                    this.getAllStudentSubject(this.$route.params.id);
                    // this.$emit("hideEditDialog");
                  }, 2000);
                }
              })
              .catch((error) => {
                console.log(error);
                setTimeout(() => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    type: "negative",
                    color: "negative",
                    timeout: 2000,
                    position: "bottom",
                    message: error.message,
                  });

                  this.getAllStudentSubject(this.$route.params.id);
                  //   this.$emit("hideCreateDialog");
                }, 2000);
              });
          }
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },
  },
  computed: {
    getAllUsers() {
      return store.state.rowDatas;
    },
  },
  beforeMount() {
    // this.getAllUsers();
  },
  mounted() {},
  watch: {
    getAllUsers(newVal, oldVal) {
      console.log("New :" + newVal + "/ Old " + oldVal);
    },
  },
  components: {
    editSubjectDialog,
  },
  // emits: ["hideImageDialog"],
};
</script>

<style></style>
