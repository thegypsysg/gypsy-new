<template>
  <v-app-bar
    :class="{
      'app-bar-mobile':
        isSmall && !isWelcome && !isPrivacy && !isTerms && !isMyProfile,
    }"
    color="white"
    elevation="1"
    fixed
  >
    <router-link to="/">
      <div class="logo-img-container">
        <v-img
          class="logo-img"
          :src="$fileURL + headerData?.app_logo"
          height="90"
          :class="{ 'ml-8': isWelcome && isPrivacy && isTerms && isMyProfile }"
        >
          <template #placeholder>
            <div class="skeleton" />
          </template>
        </v-img>
      </div>
    </router-link>

    <template v-if="$route.path === '/partners' && !isSmall">
      <div style="width: 3px; height: 40px; background-color: #000; margin-left: 16px; margin-right: 16px;"></div>
      <h1 style="font-size: 28px; font-weight: 900; color: #000; margin: 0;">Partners On-Boarding</h1>
    </template>
    
    <template v-if="$route.path === '/partners' && isSmall">
      <div style="width: 2px; height: 30px; background-color: #000; margin-left: 12px; margin-right: 12px;"></div>
      <h1 style="font-size: 18px; font-weight: 900; color: #000; margin: 0;">Partners On-Boarding</h1>
    </template>
    <template v-if="activeLocationButton && !isSmall">
      <AppHeaderLocation
        v-model="userLocation"
        :location-placeholder="locationPlaceholder"
        :item-selected-complete="itemSelectedComplete"
        :country="country"
        :active-city="activeCity"
        :is-desktop="true"
        @change-item-selected="changeItemSelected"
      />
    </template>
    <!-- <v-btn
      v-if="isHome"
      style="background: #f4f5f7; color: black"
      variant="text"
      color="black"
      icon="mdi-share-outline"
      width="40"
      height="40"
    >
      <v-icon color="rgb(38, 38, 38)" size="22"> mdi-share-outline </v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18">
                mdi-email-outline </v-icon
              >Email
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-facebook-f" /> </v-icon
              >Facebook
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" color="black" size="18"> mdi-twitter </v-icon
              >Twitter
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="console.log('share')">
            <v-list-item-title>
              <v-icon class="mr-4" size="18">
                <i class="fa-brands fa-linkedin-in" /> </v-icon
              >Linkedin
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn> -->
    <div v-if="isWelcome && $route.path !== '/partners'" class="ml-10 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span': isSmall }">{{ titleWelcome }}</span>
    </div>
    <div
      v-if="isMyProfile"
      class="ml-md-10 ml-sm-6 d-flex flex-row header-info"
    >
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span': isSmall }">My Profile</span>
    </div>
    <div v-if="isPrivacy" class="ml-md-10 ml-sm-6 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span': isSmall }">Privacy Policy</span>
    </div>
    <div v-if="isTerms" class="ml-md-10 ml-sm-6 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span-2': isSmall }">Terms & Conditions</span>
    </div>
    <v-spacer v-if="isWelcome || isPrivacy || isTerms || isMyProfile" />
    <form
      v-if="!isWelcome && !isPrivacy && !isTerms && !isMyProfile"
      class="navbar__search navbar__search__desktop"
    >
      <input
        id="product_name"
        class="form-control mr-sm-2"
        type="text"
        placeholder="What are you looking for . ?"
        aria-label="Search"
        data-autocompleturl="https://boozards.com/merchant-product/search"
      />
      <button class="btn btn--search" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>

    <AppHeaderUser
      :user-name="userName"
      :user-image="userImage"
      :is-loading="isLoading"
      :is-welcome="isWelcome"
      :is-privacy="isPrivacy"
      :is-terms="isTerms"
      :is-my-profile="isMyProfile"
      @go-to-sign-in="goToSignIn"
      @logout="logout"
      @toggle-drawer="drawer = !drawer"
    />

    <template
      v-if="!isWelcome && !isPrivacy && !isTerms && !isMyProfile"
      #extension
    >
      <AppHeaderNav
        :active-location-button="activeLocationButton"
        :is-small="isSmall"
        :location-placeholder="locationPlaceholder"
        :item-selected-complete="itemSelectedComplete"
        :country="country"
        :user-location="userLocation"
        :active-city="activeCity"
        :trending-btn="trendingBtn"
        :trending-card="trendingCard"
        :is-loading="isLoading"
        :active-tag="activeTag"
        @select-tag="selectTag"
        @change-item-selected="changeItemSelected"
        @update:user-location="userLocation = $event"
        @update:active-tag="setActiveTag"
      />
    </template>
  </v-app-bar>
  <AppHeaderMobile
    v-model="drawer"
    :user-name="userName"
    :user-image="userImage"
    :user-dated="userDated"
    :header-data="headerData"
    :footer-data="footerData"
    :contact-data="contactData"
    :current-time="currentTime"
    :is-welcome="isWelcome"
    :is-small="isSmall"
    @logout="logout"
  />

  <v-dialog v-model="isZero" persistent width="auto">
    <v-card width="350">
      <v-card-text>
        <p class="my-4">
          We don't have any property for {{ cityName }} on
          {{ categoryName || "Rent" }} as of now.
        </p>
        <v-btn class="mb-4 w-100 bg-primary" @click="isZero = false">
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocationStore } from "@/stores/location.store";
import { useAuthStore } from "@/stores/auth.store";
import AppHeaderMobile from "@/components/header/AppHeaderMobile.vue";
import AppHeaderUser from "@/components/header/AppHeaderUser.vue";
import AppHeaderLocation from "@/components/header/AppHeaderLocation.vue";
import AppHeaderNav from "@/components/header/AppHeaderNav.vue";
import { emitter } from "@/util/eventBus";
import axios from "@/util/axios";
import moment from "moment-timezone";

const props = defineProps({
  isWelcome: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();
const locationStore = useLocationStore();
const authStore = useAuthStore();

let timeInterval = null;
const isLoading = ref(false);
const headerData = ref({});
const userImage = ref(null);
const userName = ref(null);
const userDated = ref(null);
const titleWelcome = ref("Sign-Up / Sign-in");
const drawer = ref(false);
const userLocation = ref(false);
const isZero = ref(false);
const cityName = ref(null);
const categoryName = ref(null);
const itemSelected = ref("Singapore");
const items = ref([
  { title: "Singapore", path: "#" },
  { title: "Mumbai", path: "#" },
  { title: "Goa", path: "#" },
  { title: "Kuala Lumpur", path: "#" },
]);

const appData = ref(null);
const contactData = ref(null);
const trendingCard = ref([]);
const trendingBtn = ref([]);
const selectedType = ref(0);
const activeIndex = ref(1);
const screenWidth = ref(window.innerWidth);
const currentTime = ref("");
const footerData = ref(null);

const tokenProvider = computed(() => {
  const url = new URL(window.location.href);
  const tokenParam = url.searchParams.get("token");
  if (tokenParam) {
    localStorage.setItem("token", tokenParam);
  }
  return tokenParam;
});

const isHome = computed(() => route.path === "/");
const isPrivacy = computed(() => route.path === "/privacy-policy");
const isMyProfile = computed(() => route.path === "/my-profile");
const appId = computed(() => {
  const url = new URL(window.location.href);
  return url.searchParams.get("app_id");
});
const nameParam = computed(() => {
  const url = new URL(window.location.href);
  return url.searchParams.get("name");
});
const isTerms = computed(() => route.path === "/our-terms");
const isSmall = computed(() => screenWidth.value < 640);
const socialProvider = computed(() => {
  return route.query.social && route.query.token
    ? capitalizeFirstLetter(route.query.social)
    : "";
});
const activeTag = computed(() => locationStore.activeTag);
const itemSelectedComplete = computed(() => locationStore.itemSelectedComplete);
const country = computed(() => locationStore.country);
const selectedPlace = computed(() => locationStore.selectedPlace);
const activeCity = computed(() => locationStore.activeCity);
const selectedTrending = computed(() => locationStore.selectedTrending);
const activeLocationButton = computed(
  () => route.meta?.locationSelection === true
);
const locationPlaceholder = computed(() =>
  activeCity.value ? activeCity.value?.city_name : selectedPlace.value
);
const token = computed(() => localStorage.getItem("token"));

watch(selectedTrending, () => {
  setTimeout(() => {
    locationStore.getCountryMall();
  }, 400);
});

function handleResize() {
  screenWidth.value = window.innerWidth;
}

function updateTime() {
  const singaporeTime = moment().tz("Asia/Singapore");
  currentTime.value = singaporeTime.format("HH:mm:ss");
}

function changeHeaderImage(image) {
  userImage.value = (window.$fileURL || "/file/") + image;
}

function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

function getFooterData() {
  isLoading.value = true;
  axios
    .get(`/footer`)
    .then((response) => {
      const data = response.data.data;
      footerData.value = data[0];
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function setActiveTag(tag) {
  locationStore.setActiveTag(tag);
}

function setItemSelected(item) {
  locationStore.setItemSelected(item);
}

function setItemSelectedComplete(item) {
  locationStore.setItemSelectedComplete(item);
}

function setSelectedTrending(item) {
  locationStore.setSelectedTrending(item);
}

function setActiveCity(item) {
  locationStore.setActiveCity(item);
}

function setSelectedPlace(item) {
  locationStore.setSelectedPlace(item);
}

function changeItemSelected(city, countryItem) {
  if (city.property_count == 0) {
    isZero.value = true;
    cityName.value = city.city_name;
    categoryName.value = selectedTrending.value?.title;
    return false;
  }
  setActiveCity(city);
  setItemSelectedComplete(countryItem);
  setSelectedPlace(city.country_name);
}

function goToSignIn() {
  authStore.clearAuth();
  router.push("/sign-in");
}

function logout() {
  const tokenVal = localStorage.getItem("token");
  axios
    .get(`/gypsy-logout`, {
      headers: {
        Authorization: `Bearer ${tokenVal}`,
      },
    })
    .then(() => {
      authStore.clearAuth();
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
      authStore.clearAuth();
      window.location.href = "/";
    });
}

function changeHeaderWelcome(title) {
  titleWelcome.value = title;
}

function changeHeaderWelcome2(title) {
  userName.value = localStorage.getItem("name");
  userDated.value = localStorage.getItem("last_login");
  const img = localStorage.getItem("user_image");
  userImage.value = img ? (window.$fileURL || "/file/") + img : null;
  getHeaderUserData();
  titleWelcome.value = title;
}

function changeHeaderWelcome3(title) {
  getHeaderUserData2();
  titleWelcome.value = title;
}

function selectTag(tag) {
  locationStore.setActiveTag(tag);
  emitter.emit("scrollToCardSection");
}

function getHeaderUserData() {
  isLoading.value = true;
  const tokenVal = localStorage.getItem("token");
  axios
    .get(`/gypsy-user`, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : tokenVal
        }`,
      },
    })
    .then((response) => {
      const data = response.data.data;
      userName.value = data.name;
      userDated.value = data.last_login;
      userImage.value =
        data.image != null ? (window.$fileURL || "/file/") + data.image : null;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function getHeaderUserData2() {
  isLoading.value = true;
  const tokenVal = localStorage.getItem("token");
  axios
    .get(`/gypsy-user`, {
      headers: {
        Authorization: `Bearer ${tokenVal}`,
      },
    })
    .then((response) => {
      const data = response.data.data;
      userName.value = data.name;
      userDated.value = data.last_login;
      userImage.value =
        data.image != null ? (window.$fileURL || "/file/") + data.image : null;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function getAppData() {
  axios
    .get(`/app`)
    .then((response) => {
      const data = response.data.data;
      trendingCard.value = data.map((item) => ({
        img: item.app_main_image || "",
        title: item.app_name || "",
        desc: item.app_description || "",
        tag: item.app_group_name || "",
        link: item.app_link || "",
        views: item.app_views || "0",
        id: item.app_id || 1,
        group_id: item.app_group_id || 1,
        logo: item.app_logo || null,
        image: item.app_main_image || null,
        name: item.app_name || "",
        description: item.app_description || "",
        details: item.app_detail || "",
        isActive:
          item.active == "N" ? false : item.active == "Y" ? true : null,
        isFav:
          item.favorite == "N" ? false : item.favorite == "Y" ? true : null,
        group: item.app_group_name || "",
        user: item.user_id || 1,
        created: item.dated || "",
        likes: item.app_likes || "",
        shares: item.app_shares || "",
      }));
    })
    .catch((error) => {
      console.log(error);
    });
}

function getApplicantsData() {
  const tokenVal = localStorage.getItem("token");
  axios
    .get(`/applicants`, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : tokenVal
        }`,
      },
    })
    .then((response) => {
      appData.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getAppContactData() {
  const tokenVal = localStorage.getItem("token");
  axios
    .get(`/app/contact/1`, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : tokenVal
        }`,
      },
    })
    .then((response) => {
      contactData.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getGroups() {
  isLoading.value = true;
  axios
    .get(`/groups`)
    .then((response) => {
      const data = response.data.data;
      trendingBtn.value = data.map((group) => ({
        id: group.app_group_id,
        title: group.app_group_name,
        tag: group.app_group_name,
      }));
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function getHeaderData() {
  axios
    .get(`/header`)
    .then((response) => {
      headerData.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getCountry() {
  axios
    .get(`/city`)
    .then((response) => {
      const data = response.data.data;
      items.value = data.map((city) => ({
        id: city.city_id,
        title: city.city_name,
        path: "#",
      }));
    })
    .catch((error) => {
      console.log(error);
    });
}

function previousSlide() {
  activeIndex.value--;
}

function nextSlide() {
  activeIndex.value++;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  timeInterval = setInterval(updateTime, 1000);

  if (appId.value === "5" && tokenProvider.value && !nameParam.value) {
    const externalURL = `${import.meta.env.VITE_SYRINGE_URL}?token=${
      tokenProvider.value
    }`;
    window.location.href = externalURL;
  } else if (appId.value === "2" && tokenProvider.value && !nameParam.value) {
    const externalURL = `${import.meta.env.VITE_MALLE_URL}?token=${
      tokenProvider.value
    }`;
    window.location.href = externalURL;
  }

  getApplicantsData();
  getAppData();
  getAppContactData();
  getHeaderData();
  getCountry();
  getFooterData();
  getGroups();
  setTimeout(() => {
    locationStore.getCountryMall();
  }, 800);

  const tokenVal = localStorage.getItem("token");
  if (tokenProvider.value != null || tokenVal) {
    getHeaderUserData();
  }

  emitter.on("changeHeaderImage", changeHeaderImage);
  emitter.on("getHeaderUserData", getHeaderUserData);
  emitter.on("changeHeaderWelcome", changeHeaderWelcome);
  emitter.on("changeHeaderWelcome2", changeHeaderWelcome2);
  emitter.on("changeHeaderWelcome3", changeHeaderWelcome3);
});

onBeforeUnmount(() => {
  if (timeInterval) clearInterval(timeInterval);
  window.removeEventListener("resize", handleResize);
  emitter.off("changeHeaderImage", changeHeaderImage);
  emitter.off("getHeaderUserData", getHeaderUserData);
  emitter.off("changeHeaderWelcome", changeHeaderWelcome);
  emitter.off("changeHeaderWelcome2", changeHeaderWelcome2);
  emitter.off("changeHeaderWelcome3", changeHeaderWelcome3);
});
</script>

<style scoped>
.v-app-bar.v-toolbar {
  max-width: 100%;
}
.app-bar-mobile {
  height: 29vh;
}

.divider {
  background: rgb(173, 173, 173);
  width: 2px;
  height: 70px;
}
.divider-2 {
  background: rgb(51, 51, 51);
  width: 2px;
  height: 50px;
}

.header-info {
  align-items: center;
  gap: 25px;
  font-size: 30px;
  color: black;
  font-weight: 800;
}

.header-info-span {
  font-size: 25px;
  font-weight: 800;
}
.header-info-span-2 {
  font-size: 22px;
  font-weight: 800;
}

.logo-img-container {
  height: 80px;
  min-width: 100px;
}

.logo-img {
  width: 100%;
  height: 100%;
}

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
