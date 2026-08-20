<template>
  <v-app>
    <div>
      <Header
        :is-welcome="
          currentRoute === '/sign-in' ||
          currentRoute === '/social-sign-up' ||
          currentRoute === '/signup-email' ||
          currentRoute === '/sign-up-email' ||
          currentRoute === '/partners'
            ? true
            : false
        "
      />
      <RouterView v-slot="{ Component }">
        <Transition name="page-opacity" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      <BaseLoader />
      <v-snackbar
        v-model="uiStore.snackbar.show"
        :color="uiStore.snackbar.color"
        :timeout="uiStore.snackbar.timeout"
        location="top right"
      >
        {{ uiStore.snackbar.message }}
        <template #actions>
          <v-btn variant="text" @click="uiStore.hideSnackbar"> Close </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";
import Header from "./components/Header.vue";
import BaseLoader from "./components/base/BaseLoader.vue";
import { useUiStore } from "@/stores/ui.store";

const route = useRoute();
const uiStore = useUiStore();
const currentRoute = computed(() => route.path);
</script>

<style lang="scss">
@use "@/assets/style/App.scss";

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 400ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
