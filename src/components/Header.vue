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

<script>
import { useLocationStore } from "@/stores/location.store";
import { useAuthStore } from "@/stores/auth.store";
import AppHeaderMobile from "@/components/header/AppHeaderMobile.vue";
import AppHeaderUser from "@/components/header/AppHeaderUser.vue";
import AppHeaderLocation from "@/components/header/AppHeaderLocation.vue";
import AppHeaderNav from "@/components/header/AppHeaderNav.vue";
import app from "@/util/eventBus";
import axios from "@/util/axios";
import moment from "moment-timezone";

export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Header",
  components: {
    AppHeaderMobile,
    AppHeaderUser,
    AppHeaderLocation,
    AppHeaderNav,
  },
  props: ["isWelcome"],
  setup() {
    const locationStore = useLocationStore();
    const authStore = useAuthStore();
    return { locationStore, authStore };
  },
  data() {
    return {
      _timeInterval: null,
      isLoading: false,
      headerData: {},
      userImage: null,
      userName: null,
      userDated: null,
      titleWelcome: "Sign-Up / Sign-in",
      drawer: false,
      userLocation: false,
      isZero: false,
      cityName: null,
      categoryName: null,
      itemSelected: "Singapore",
      items: [
        { title: "Singapore", path: "#" },
        { title: "Mumbai", path: "#" },
        { title: "Goa", path: "#" },
        { title: "Kuala Lumpur", path: "#" },
      ],

      appData: null,
      contactData: null,
      trendingCard: [],
      trendingBtn: [],
      selectedType: 0,
      activeIndex: 1,
      screenWidth: window.innerWidth,
      currentTime: "",
      footerData: null,
    };
  },
  computed: {
    tokenProvider() {
      // Mendapatkan URL dari browser
      const url = new URL(window.location.href);

      // Mendapatkan nilai token dari parameter query 'token'
      const tokenParam = url.searchParams.get("token");
      if (tokenParam) {
        localStorage.setItem("token", tokenParam);
      }

      // Mengupdate data 'token' dalam komponen dengan nilai yang ditemukan
      return tokenParam;
    },
    isHome() {
      return this.$route.path == "/";
    },
    isPrivacy() {
      return this.$route.path == "/privacy-policy";
    },
    isMyProfile() {
      return this.$route.path == "/my-profile";
    },
    appId() {
      // Mendapatkan URL dari browser
      //return this.$route.query.app_id || "";
      const url = new URL(window.location.href);

      // Mendapatkan nilai token dari parameter query 'token'
      const appId = url.searchParams.get("app_id");
      return appId;
    },
    name() {
      // Mendapatkan URL dari browser
      //return this.$route.query.app_id || "";
      const url = new URL(window.location.href);

      // Mendapatkan nilai token dari parameter query 'token'
      const name = url.searchParams.get("name");
      return name;
    },
    isTerms() {
      return this.$route.path == "/our-terms";
    },
    isSmall() {
      return this.screenWidth < 640;
    },
    socialProvider() {
      return this.$route.query.social && this.$route.query.token
        ? this.capitalizeFirstLetter(this.$route.query.social)
        : "";
    },
    activeTag() {
      return this.locationStore.activeTag;
    },
    itemSelected() {
      return this.locationStore.itemSelected;
    },
    itemSelectedComplete() {
      return this.locationStore.itemSelectedComplete;
    },
    country() {
      return this.locationStore.country;
    },
    selectedPlace() {
      return this.locationStore.selectedPlace;
    },
    activeCity() {
      return this.locationStore.activeCity;
    },
    selectedTrending() {
      return this.locationStore.selectedTrending;
    },
    activeLocationButton() {
      return (
        this.$route.hasOwnProperty("meta") &&
        this.$route.meta.locationSelection === true
      );
    },
    locationPlaceholder() {
      return this.activeCity ? this.activeCity?.city_name : this.selectedPlace;
    },
    token() {
      return localStorage.getItem("token");
    },
  },
  watch: {
    selectedTrending(newVal) {
      setTimeout(() => {
        this.locationStore.getCountryMall();
      }, 400);
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this._timeInterval = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
    }
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    if (this.appId == "5" && this.tokenProvider && !this.name) {
      console.log(this.appId);
      const externalURL = `${import.meta.env.VITE_SYRINGE_URL}?token=${this.tokenProvider}`;
      window.location.href = externalURL;
    } else if (this.appId == "2" && this.tokenProvider && !this.name) {
      console.log(this.appId);
      const externalURL = `${import.meta.env.VITE_MALLE_URL}?token=${this.tokenProvider}`;
      window.location.href = externalURL;
    }
    this.getApplicantsData();
    this.getAppData();
    this.getAppContactData();
    this.getHeaderData();
    this.getCountry();
    this.getFooterData();
    this.getGroups();
    setTimeout(() => {
      this.locationStore.getCountryMall();
    }, 800);
    const token = localStorage.getItem("token");
    if (this.tokenProvider != null) {
      this.getHeaderUserData();
    } else if (token) {
      this.getHeaderUserData();
    }
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderImage",
      this.changeHeaderImage
    );
    app.config.globalProperties.$eventBus.$on(
      "getHeaderUserData",
      this.getHeaderUserData
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome",
      this.changeHeaderWelcome
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2
    );
    app.config.globalProperties.$eventBus.$on(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3
    );
    // this.interval = setInterval(this.setCurrentTime, 1000);
  },
  beforeUnmount() {
    // clearInterval(this.interval);
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderImage",
      this.changeHeaderImage
    );
    app.config.globalProperties.$eventBus.$off(
      "getHeaderUserData",
      this.getHeaderUserData
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome",
      this.changeHeaderWelcome
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome2",
      this.changeHeaderWelcome2
    );
    app.config.globalProperties.$eventBus.$off(
      "changeHeaderWelcome3",
      this.changeHeaderWelcome3
    );
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    changeHeaderImage(image) {
      console.log(image);
      this.userImage = this.$fileURL + image;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    getFooterData() {
      this.isLoading = true;
      axios
        .get(`/footer`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data[0]);
          this.footerData = data[0];
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setActiveTag(tag) {
      this.locationStore.setActiveTag(tag);
    },
    setItemSelected(item) {
      this.locationStore.setItemSelected(item);
    },
    setItemSelectedComplete(item) {
      this.locationStore.setItemSelectedComplete(item);
    },
    setSelectedTrending(item) {
      this.locationStore.setSelectedTrending(item);
    },
    setActiveCity(item) {
      this.locationStore.setActiveCity(item);
    },
    setSelectedPlace(item) {
      this.locationStore.setSelectedPlace(item);
    },
    changeItemSelected(city, country) {
      if (city.property_count == 0) {
        this.isZero = true;
        this.cityName = city.city_name;
        this.categoryName = this.selectedTrending?.title;
        return false;
      }
      this.setActiveCity(city);

      this.setItemSelectedComplete(country);
      this.setSelectedPlace(city.country_name);
    },
    updateTime() {
      // Ambil zona waktu Singapore
      const singaporeTime = moment().tz("Asia/Singapore");
      // Format waktu dalam hh:mm:ss
      this.currentTime = singaporeTime.format("HH:mm:ss");
    },
    goToSignIn() {
      this.authStore.clearAuth();
      this.$router.push("/sign-in");
    },
    logout() {
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.authStore.clearAuth();
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error);
          this.authStore.clearAuth();
          window.location.href = "/";
        });
    },
    changeHeaderWelcome(title) {
      this.titleWelcome = title;
    },
    changeHeaderWelcome2(title) {
      this.userName = localStorage.getItem("name");
      this.userDated = localStorage.getItem("last_login");
      this.userImage = this.$fileURL + localStorage.getItem("user_image");
      console.log(this.userName);
      console.log(this.userDated);
      console.log(this.userImage);
      this.getHeaderUserData();
      this.titleWelcome = title;
    },
    changeHeaderWelcome3(title) {
      this.getHeaderUserData2();
      this.titleWelcome = title;
    },
    selectTag(tag) {
      this.locationStore.setActiveTag(tag);
      app.config.globalProperties.$eventBus.$emit("scrollToCardSection");
    },
    getHeaderUserData() {
      this.isLoading = true;
      console.log(this.tokenProvider);
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);

          this.userName = data.name;
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getHeaderUserData2() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);

          this.userName = data.name;
          this.userDated = data.last_login;
          this.userImage =
            data.image != null ? this.$fileURL + data.image : null;
          // this.userImage = null;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getAppData() {
      // this.isLoading = true;
      axios
        .get(`/app`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.trendingCard = data.map((item) => {
            return {
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
                item.favorite == "N"
                  ? false
                  : item.favorite == "Y"
                  ? true
                  : null,
              group: item.app_group_name || "",
              user: item.user_id || 1,
              created: item.dated || "",
              likes: item.app_likes || "",
              shares: item.app_shares || "",
            };
          });
          // console.log(this.trendingCard);

          // app.config.globalProperties.$eventBus.$emit(
          //   'update-image',
          //   this.items
          // );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getApplicantsData() {
      // this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/applicants`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.appData = data;
          // console.log(this.trendingCard);

          // app.config.globalProperties.$eventBus.$emit(
          //   'update-image',
          //   this.items
          // );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getAppContactData() {
      // this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/app/contact/${this.$appId}`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.contactData = data;
          // console.log(this.trendingCard);

          // app.config.globalProperties.$eventBus.$emit(
          //   'update-image',
          //   this.items
          // );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getGroups() {
      this.isLoading = true;
      axios
        .get(`/groups`)
        .then((response) => {
          const data = response.data.data;
          this.isLoading = false;
          // console.log(data);
          this.trendingBtn = data.map((group) => {
            return {
              id: group.app_group_id,
              title: group.app_group_name,
              tag: group.app_group_name,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getHeaderData() {
      // this.isLoading = true;
      axios
        .get(`/header`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.headerData = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    getCountry() {
      axios
        .get(`/city`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.items = data.map((city) => {
            return {
              id: city.city_id,
              title: city.city_name,
              path: "#",
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    // emitFilterEvent(tag) {
    //   this.$emit("filter-card", tag);
    // },
    // filterCards(tag) {
    //   this.selectedTag = tag;
    //   app.config.globalProperties.$eventBus.$emit("filter-card-header", tag);
    //   // eventBus.emit("filter-card-header", tag);
    // },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    previousSlide() {
      this.activeIndex--;
    },
    nextSlide() {
      this.activeIndex++;
    },
  },
};
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
