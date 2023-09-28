<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-blue text-white">
      <q-tabs>
        <q-route-tab name="Todo" icon="list" label="Todo" to="/" />
        <q-route-tab
          name="Settings"
          icon="settings"
          label="Settings"
          to="/settings"
        />
      </q-tabs>
    </q-footer>

    <!-- <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              :active="menuItem.label === 'Outbox'"
              v-ripple
              :to="menuItem.to"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const menuList = [
  {
    icon: "inbox",
    label: "Dashboard",
    to: "/",
    separator: false,
  },
  {
    icon: "list",
    label: "Todo",
    to: "/",
    separator: false,
  },
  {
    icon: "settings",
    label: "Settings",
    to: "/settings",
    separator: true,
  },
  // {
  //   icon: "error",
  //   label: "Spam",
  //   separator: true,
  // },
  // {
  //   icon: "settings",
  //   label: "Settings",
  //   separator: false,
  // },
  // {
  //   icon: "feedback",
  //   label: "Send Feedback",
  //   separator: false,
  // },
  // {
  //   icon: "help",
  //   iconColor: "primary",
  //   label: "Help",
  //   separator: false,
  // },
];

// const linksList = [
//   {
//     title: "Todo",
//     // caption: "quasar.dev",
//     icon: "list",
//     link: "/",
//   },
//   {
//     title: "Settings",
//     // caption: "github.com/quasarframework",
//     icon: "settings",
//     link: "/settings",
//   },
// {
//   title: "Discord Chat Channel",
//   caption: "chat.quasar.dev",
//   icon: "chat",
//   link: "https://chat.quasar.dev",
// },
// {
//   title: "Forum",
//   caption: "forum.quasar.dev",
//   icon: "record_voice_over",
//   link: "https://forum.quasar.dev",
// },
// {
//   title: "Twitter",
//   caption: "@quasarframework",
//   icon: "rss_feed",
//   link: "https://twitter.quasar.dev",
// },
// {
//   title: "Facebook",
//   caption: "@QuasarFramework",
//   icon: "public",
//   link: "https://facebook.quasar.dev",
// },
// {
//   title: "Quasar Awesome",
//   caption: "Community Quasar projects",
//   icon: "favorite",
//   link: "https://awesome.quasar.dev",
// },
// ];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    // const leftDrawerOpen = ref(false);

    // return {
    //   essentialLinks: linksList,
    //   leftDrawerOpen,
    //   toggleLeftDrawer() {
    //     leftDrawerOpen.value = !leftDrawerOpen.value;
    //   },
    // };
    return {
      drawer: ref(false),
      menuList,
    };
  },
});
</script>
