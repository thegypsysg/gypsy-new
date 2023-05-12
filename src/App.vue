<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <div>
      <!-- <page-transition name="fade" mode="out-in">
        <router-view />
      </page-transition> -->
      <!-- <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <component :is="Component" />
        </transition>
      </router-view> -->
      <RouterView v-slot="{ Component }">
        <Transition name="page-opacity" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </v-app>
</template>

<style>
@import "@/assets/style/App.scss";

.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: 600ms ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
}
</style>
