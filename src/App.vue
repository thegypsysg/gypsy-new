<template>
  <v-app>
    <div>
      <Header
        :is-welcome="
          currentRoute === '/sign-in' ||
          currentRoute === '/social-sign-up' ||
          currentRoute === '/signup-email' ||
          currentRoute === '/sign-up-email'
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

<script>
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";

export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { RouterView, Header },
  data() {
    return {
      currentRoute: this.$route.path,
    };
  },
  watch: {
    $route: function () {
      this.currentRoute = this.$route.path;
    },
  },
};
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
