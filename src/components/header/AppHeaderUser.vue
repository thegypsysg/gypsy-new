<template>
  <div class="d-flex align-center ga-10">
    <v-btn
      v-if="
        !isWelcome &&
        !isPrivacy &&
        !isTerms &&
        !isMyProfile &&
        !isLoading &&
        userName == null
      "
      elevation="0"
      class="btn_sign__up rounded-xl text-white"
      @click="$emit('go-to-sign-in')"
    >
      <v-icon color="white" class="text-white mr-2">mdi-account-outline</v-icon>
      Sign up / Sign In
    </v-btn>

    <v-btn
      v-if="
        !isWelcome && !isPrivacy && !isTerms && !isMyProfile && userName != null
      "
      elevation="0"
      class="btn_log__out"
      @click="$emit('logout')"
    >
      Logout
    </v-btn>

    <div
      v-if="!isWelcome || $route.path === '/partners'"
      style="height: 48px; width: 48px; border-radius: 50%; cursor: pointer"
      icon
      :class="{
        'mr-2':
          isPrivacy || isTerms || isMyProfile || $route.path === '/partners',
      }"
      @click="$emit('toggle-drawer')"
    >
      <v-img
        v-if="userImage != null"
        :src="userImage"
        cover
        style="height: 100%; width: 100%; border-radius: 50%"
      >
        <template #placeholder>
          <div class="skeleton" />
        </template>
      </v-img>
      <img
        v-else-if="userImage == null && !isLoading"
        src="@/assets/images/icons/user_icon.png"
        cover
        height="48"
        style="height: 100%; width: 100%"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeaderUser",
  props: {
    userName: {
      type: String,
      default: null,
    },
    userImage: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isWelcome: {
      type: Boolean,
      default: false,
    },
    isPrivacy: {
      type: Boolean,
      default: false,
    },
    isTerms: {
      type: Boolean,
      default: false,
    },
    isMyProfile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["go-to-sign-in", "logout", "toggle-drawer"],
};
</script>

<style scoped>
.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;
  z-index: 10000;
  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
