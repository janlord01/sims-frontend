<template>
  <q-page class="">
    <div class="bg-white text-black">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Qrcode/RFID Locations</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="grey"
          size="sm"
          :label="$q.screen.gt.xs ? 'Add Location' : ''"
          style="height: 50px; margin-bottom: 10px"
          @click="onShowCreateDialog"
        />
      </q-toolbar>
      <locationList />

      <q-dialog v-model="showCreateDialog">
        <createRfidLocation
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent } from "vue";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import locationList from "src/components/settings/rfid/rfidLocationList.vue";
import createRfidLocation from "src/components/settings/rfid/createRfidLocation.vue";
// import createRfidLocation from "src/components/settings/rfid/createRfidLocation.vue;

export default defineComponent({
  setup() {
    return {};
    const $q = useQuasar();
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      showCreateDialog: false,
    };
  },

  methods: {
    ...mapActions("Userstore", ["getUserDetails"]),
    ...mapActions("RfidStore", ["getAllLocations"]),

    onShowCreateDialog() {
      this.showCreateDialog = true;
    },
  },

  computed: {
    ...mapState("Userstore", ["userDetails"]),
  },
  beforeMount() {},
  mounted() {
    this.getUserDetails();
    this.getAllLocations();
  },
  components: {
    locationList,
    createRfidLocation,
  },
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
