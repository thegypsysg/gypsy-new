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
    </div>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";
import Header from "./components/Header.vue";

const route = useRoute();
const currentRoute = computed(() => route.path);
</script>

<style>
@import "@/assets/style/App.scss";

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 400ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
