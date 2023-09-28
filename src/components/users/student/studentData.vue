<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'email', 'number', 'action']
        : ['id', 'name', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          <q-btn round>
            <q-avatar size="42px">
              <q-img :src="props.row.profile_image" width="50px" />
            </q-avatar>
          </q-btn>

          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>

        <q-td key="number" :props="props">
          {{ props.row.number }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            :to="'/user/student/' + props.row.id + '/edit'"
          />

          <q-btn
            color="info"
            icon="camera_alt"
            size="sm"
            @click="changeImageDialog(props.row.id, $event)"
          />
          <q-btn
            color="indigo"
            icon="lock"
            size="sm"
            @click="changePasswordDialog(props.row.id, $event)"
          />
          <!-- <q-btn color="purple" icon="qr_code" size="sm" to="/qrcode" /> -->
          <q-btn color="orange" icon="folder_copy" size="sm" to="/qrcode" />

          <q-btn
            color="red"
            icon="no_accounts"
            size="sm"
            @click="changeStatusDialog(props.row.id, $event)"
            v-if="props.row.status == 1"
          />
          <q-btn
            color="green"
            icon="check_circle"
            size="sm"
            @click="changeStatusDialogActive(props.row.id, $event)"
            v-if="props.row.status == 0"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {};
</script>

<style></style>
