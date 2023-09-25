<template>
  <v-app-bar
    :class="{
      'app-bar-mobile': isSmall && !isWelcome && !isPrivacy && !isTerms,
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
          :class="{ 'ml-8': isWelcome && isPrivacy && isTerms }"
        >
          <template #placeholder>
            <div class="skeleton" />
          </template>
        </v-img>
      </div>
    </router-link>
    <v-btn
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
    </v-btn>
    <div v-if="isWelcome" class="ml-10 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span': isSmall }">{{ titleWelcome }}</span>
    </div>
    <div v-if="isPrivacy" class="ml-md-10 ml-sm-6 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span': isSmall }">Privacy Policy</span>
    </div>
    <div v-if="isTerms" class="ml-md-10 ml-sm-6 d-flex flex-row header-info">
      <div :class="{ divider: !isSmall, 'divider-2': isSmall }" />
      <span :class="{ 'header-info-span-2': isSmall }">Terms & Conditions</span>
    </div>
    <v-spacer v-if="isWelcome || isPrivacy || isTerms" />
    <form
      v-if="!isWelcome && !isPrivacy && !isTerms"
      class="navbar__search navbar__search__desktop"
    >
      <input
        id="product_name"
        class="form-control mr-sm-2"
        type="text"
        placeholder="Type anything that you are looking for "
        aria-label="Search"
        data-autocompleturl="https://boozards.com/merchant-product/search"
      />
      <button class="btn btn--search" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>
    <div v-if="!isWelcome && !isPrivacy && !isTerms" class="desktop__app">
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            style="
              margin-left: 30px;
              margin-right: 30px;
              font-size: 16px;
              color: #494949;
            "
            v-bind="props"
            variant="text"
          >
            {{ itemSelected }}
            <v-icon right dark> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            @click="itemSelected = item.title"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-btn
      v-if="
        !isWelcome && !isPrivacy && !isTerms && !isLoading && userName == null
      "
      elevation="0"
      class="btn_sign__up"
      to="/sign-in"
    >
      Sign up / Sign In
    </v-btn>
    <v-btn
      v-if="!isWelcome && !isPrivacy && !isTerms && userName != null"
      elevation="0"
      class="btn_log__out"
      @click="logout"
    >
      Logout
    </v-btn>
    <div
      v-if="!isWelcome"
      style="height: 48px; width: 48px; border-radius: 50%; cursor: pointer"
      icon
      :class="{ 'mr-2': isPrivacy || isTerms }"
      @click="drawer = !drawer"
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

    <template v-if="!isWelcome && !isPrivacy && !isTerms" #extension>
      <div
        class="mobile__app text-center scroll-container d-flex flex-column justify-center align-content-space-between mx-2"
      >
        <div>
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                style="
                  margin-left: 30px;
                  margin-right: 30px;
                  font-size: 16px;
                  color: #494949;
                "
                v-bind="props"
                variant="text"
              >
                {{ itemSelected }}
                <v-icon right dark> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :value="index"
                @click="itemSelected = item.title"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <form
          class="navbar__search navbar__search__mobile mx-auto"
          @submit="preventSubmit"
        >
          <input
            id="product_name"
            class="form-control mr-sm-2"
            type="text"
            placeholder="Type anything that you are looking for "
            aria-label="Search"
            data-autocompleturl="https://boozards.com/merchant-product/search"
          />
          <button class="btn btn--search" type="submit">
            <v-icon color="white"> mdi-magnify </v-icon>
          </button>
        </form>

        <div v-if="!isLoading" class="my-slide d-flex">
          <v-btn
            class="sub-menu-btn view-all"
            :class="{
              active: isSelected,
            }"
            style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
            @click="selectTag('')"
          >
            <p style="font-size: 12px" elevation>View All</p>
            <!-- <span class="badge" :class="isSelected ? 'active' : ''"
            >2.7K</span
          > -->
          </v-btn>
          <v-slide-group v-model="activeTag">
            <v-slide-group-item
              v-for="btn in trendingBtn"
              :key="btn.id"
              v-slot="{ isSelected }"
              :value="btn.tag"
            >
              <v-btn
                class="sub-menu-btn"
                :class="{
                  active: isSelected,
                }"
                style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
                @click="selectTag(btn.tag)"
              >
                <p style="font-size: 12px" elevation>
                  {{ btn.title }}
                  <span>{{
                    countCards(btn.tag) == 0 ? "" : `(${countCards(btn.tag)})`
                  }}</span>
                </p>
                <!-- <span class="badge" :class="isSelected ? 'active' : ''"
                >2.7K</span
              > -->
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </div>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-if="!isWelcome || (isWelcome && isSmall)"
    v-model="drawer"
    temporary
    location="right"
  >
    <div
      class="drawer__top"
      :class="{ 'py-6': userName == null, 'py-2': userName != null }"
    >
      <router-link
        v-if="userName == null"
        class="text-decoration-none"
        to="/sign-in"
      >
        <span style="font-size: 1.125rem; color: white">Sign up / Sign In</span>
      </router-link>
      <div v-else class="d-flex align-center">
        <div style="width: 55px; height: 55px; border-radius: 50%">
          <v-img
            cover
            style="border-radius: 50%; width: 100%; height: 100%"
            :src="
              userImage != null
                ? userImage
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            "
          >
            <template #placeholder>
              <div class="skeleton" />
            </template>
          </v-img>
        </div>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 14px">
              {{ userName }}
            </v-list-item-title>
            <v-list-item-subtitle style="font-size: 10px" class="mt-1">
              Last Login: {{ userDated }}
            </v-list-item-subtitle>
            <div
              class="text-red mt-1"
              style="font-size: 12px; cursor: pointer"
              @click="logout"
            >
              Logout
            </div>
          </v-list-item-content>
        </v-list-item>
      </div>
    </div>
    <div class="drawer__heading">
      <div class="drawer-logo">
        <v-img height="35" width="80" :src="$fileURL + headerData?.app_logo" />
      </div>
      <v-menu contained style="z-index: 1000">
        <template #activator="{ props }">
          <v-btn
            style="background: #f4f5f7; color: black"
            variant="text"
            color="black"
            icon="mdi-share-outline"
            width="30"
            height="30"
            class="mx-4"
            v-bind="props"
          >
            <v-icon color="rgb(38, 38, 38)" size="15">
              mdi-share-outline
            </v-icon>
          </v-btn>
        </template>
        <v-list style="z-index: 1000">
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
      <div class="text-muted" style="font-size: 10px">Version 1.0</div>
    </div>
    <v-divider />
    <ul class="pt-1" nav dense>
      <li class="v-list-item">
        <div class="v-list-item__icon">
          <v-img height="20" width="30" src="@/assets/images/icons/home.png" />
        </div>
        <v-list-item-title style="font-size: 12px"> Home </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img
            height="18"
            width="25"
            src="@/assets/images/icons/menu-shopper.png"
          />
        </div>
        <router-link class="text-decoration-none text-black" to="/my-profile">
          <v-list-item-title style="font-size: 12px">
            My Profile
          </v-list-item-title>
        </router-link>
      </li>

      <li class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img height="18" width="25" src="@/assets/images/icons/shop.png" />
        </div>
        <v-list-item-title style="font-size: 12px"> My Cart </v-list-item-title>
      </li>

      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <v-list-item-title style="font-size: 12px">
          My Vouchers
        </v-list-item-title>
      </li>
      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <v-list-item-title style="font-size: 12px">
          My Favorites
        </v-list-item-title>
      </li>
      <li v-if="userName != null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <v-list-item-title style="font-size: 12px"> My Apps </v-list-item-title>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>
        <router-link
          class="text-decoration-none text-black"
          to="/privacy-policy"
        >
          <v-list-item-title style="font-size: 12px">
            Privacy Policy
          </v-list-item-title>
        </router-link>
      </li>
      <li v-if="userName == null" class="v-list-item mt-n2">
        <div class="v-list-item__icon">
          <v-img src="" />
        </div>

        <router-link class="text-decoration-none text-black" to="/our-terms">
          <v-list-item-title style="font-size: 12px">
            Terms & Conditions
          </v-list-item-title>
        </router-link>
      </li>
    </ul>
    <div class="drawer__bottom">
      <div class="text-center" style="width: 100%">
        <p style="font-size: 13px" class="mb-1">Made in Singapore</p>
        <h3 style="font-size: 13px">Get connected</h3>
        <v-row
          class="d-flex justify-center mt-1"
          :class="{ 'mb-2': userName == null }"
        >
          <v-col cols="3" class="d-flex justify-end">
            <v-img
              src="@/assets/images/icons/facebook.png"
              height="40"
              width="32"
            />
          </v-col>
          <v-col class="d-flex justify-center" cols="3">
            <v-img
              src="@/assets/images/icons/insta.png"
              height="40"
              width="32"
            />
          </v-col>
          <v-col class="d-flex justify-start" cols="3">
            <v-img
              src="@/assets/images/icons/tiktok.png"
              class="mt-1"
              height="35"
              width="35"
            />
          </v-col>
        </v-row>
        <div
          v-if="userName != null"
          style="font-size: 12px"
          class="text-grey my-1"
        >
          <router-link
            class="text-decoration-none text-grey"
            to="/privacy-policy"
          >
            Privacy
          </router-link>
          |
          <router-link class="text-decoration-none text-grey" to="/our-terms">
            Terms
          </router-link>
        </div>
        <div class="drawer-social d-flex" style="width: 100%">
          <div>
            <h5>WhatsApp</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`https://api.whatsapp.com/send?phone=${footerData?.whats_app}&text=Hello!`"
            >
              {{ footerData?.whats_app }}
            </a>
          </div>
          <div>
            <h5>Contact us</h5>
            <a
              style="text-decoration: none; font-size: 10px"
              :href="`mailto:${footerData?.email_id}`"
              >{{ footerData?.email_id }}</a
            >
          </div>
        </div>
        <v-divider class="mt-2 mb-n2" />
        <v-container class="footer-bottom pb-2 d-flex justify-center">
          <div class="d-flag d-flex justify-space-between w-100 align-center">
            <img
              style="max-width: 40px; border: 1px solid black"
              src="data:image/png;base64,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"
              alt="Singapore"
            />
            <div id="footerCurrentTime" style="font-size: 0.7rem">
              {{ currentTime }}
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import app from "@/util/eventBus";
import axios from "@/util/axios";
import moment from "moment-timezone";

// import eventBus from "@/util/eventBus";
// import eventBus from "@/util/eventBus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Header",
  props: ["isWelcome"],
  data() {
    return {
      isLoading: false,
      // fileURL: "https://admin1.the-gypsy.sg",
      headerData: {},
      userImage: null,
      userName: null,
      userDated: null,
      // selectedTag: null,
      trendingBtn: [],
      titleWelcome: "Sign-Up / Sign-in",
      //   {
      //     title: "View All",
      //   },
      //   { title: "Promo App", tag: "Promo App" },
      //   { title: "Alcohol App", tag: "Alcohol App" },
      //   { title: "Jobs App", tag: "Job App" },
      //   { title: "On The Run Apps", tag: "On the Run App" },
      //   { title: "Housing App", tag: "Housing App" },
      //   { title: "Travel App", tag: "Travel App" },
      //   { title: "Staycation App", tag: "Staycation App" },
      //   { title: "Listings App", tag: "Listing App" },
      //   { title: "Tournaments App", tag: "Tournament App" },
      //   { title: "Cafe App", tag: "Cafe App" },
      //   { title: "Overseas Study App", tag: "Overseas Study App" },
      // ],
      drawer: false,
      itemSelected: "Singapore",
      items: [
        { title: "Singapore", path: "#" },
        { title: "Mumbai", path: "#" },
        { title: "Goa", path: "#" },
        { title: "Kuala Lumpur", path: "#" },
      ],

      trendingCard: [],
      //   {
      //     img: "assets/gypsy-1.png",
      //     title: "Mall-e",
      //     desc: "Promotions Happening in Malls",
      //     tag: "Promo App",
      //   },
      //   {
      //     img: "assets/gypsy-2.png",
      //     title: "Boozards",
      //     desc: "Marketplace for Alcohol, Clubs, Happy Hours",
      //     tag: "Alcohol App",
      //   },
      //   {
      //     img: "assets/gypsy-3.png",
      //     title: "Flea",
      //     desc: "Promotions Happening in Streets , Office Buildings Gas Stations etc",
      //     tag: "Promo App",
      //   },
      //   {
      //     img: "assets/gypsy-4.png",
      //     title: "Mendesliga",
      //     desc: "Marketplace for Sports Tournaments.",
      //     tag: "Tournament App",
      //   },
      //   {
      //     img: "assets/gypsy-5.png",
      //     title: "Cake Run",
      //     desc: "Marketplace for all Types of Cakes.",
      //     tag: "On the Run App",
      //   },
      //   {
      //     img: "assets/gypsy-6.png",
      //     title: "Cafino",
      //     desc: "Maketplace for Cafes around you.",
      //     tag: "Cafe App",
      //   },
      //   {
      //     img: "assets/gypsy-7.jpg",
      //     title: "4 Walls",
      //     desc: "Marketplace for Housing",
      //     tag: "Housing App",
      //   },
      //   {
      //     img: "assets/gypsy-8.jpg",
      //     title: "Staycasey",
      //     desc: "Marketplace for Staycation",
      //     tag: "Staycation App",
      //   },
      //   {
      //     img: "assets/gypsy-9.jpg",
      //     title: "Astalavista",
      //     desc: "Marketplace for Overseas Travel",
      //     tag: "Travel App",
      //   },
      //   {
      //     img: "assets/gypsy-10.jpg",
      //     title: "i-Study",
      //     desc: "Marketplace for Study Overseas",
      //     tag: "Overseas Study App",
      //   },
      //   {
      //     img: "assets/gypsy-11.jpg",
      //     title: "Mart-In",
      //     desc: "Marketplace for Mini Mart",
      //     tag: "Mini Mart App",
      //   },
      //   {
      //     img: "assets/gypsy-12.jpg",
      //     title: "Biryani-Run",
      //     desc: "Marketplace for Biryani",
      //     tag: "On the Run App",
      //   },
      //   {
      //     img: "assets/gypsy-13.jpg",
      //     title: "i-Hired",
      //     desc: "Marketplace for Jobs",
      //     tag: "Job App",
      //   },
      //   {
      //     img: "assets/gypsy-14.jpg",
      //     title: "Pizza Run",
      //     desc: "Marketplace for Pizza",
      //     tag: "On the Run App",
      //   },
      //   {
      //     img: "assets/gypsy-15.jpg",
      //     title: "Listings",
      //     desc: "Marketplace for Listings",
      //     tag: "Listing App",
      //   },
      // ],

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
    ...mapState(["activeTag"]),
    token() {
      return localStorage.getItem("token");
    },
    // trendingBtn() {
    //   return [
    //     {
    //       title: "View All",
    //     },
    //     { title: "Promo App", tag: "Promo App" },
    //     { title: "Alcohol App", tag: "Alcohol App" },
    //     { title: "Jobs App", tag: "Job App" },
    //     { title: "On The Run Apps", tag: "On the Run App" },
    //     { title: "Housing App", tag: "Housing App" },
    //     { title: "Travel App", tag: "Travel App" },
    //     { title: "Staycation App", tag: "Staycation App" },
    //     { title: "Listings App", tag: "Listing App" },
    //     { title: "Tournaments App", tag: "Tournament App" },
    //     { title: "Cafe App", tag: "Cafe App" },
    //     { title: "Overseas Study App", tag: "Overseas Study App" },
    //   ];
    // },
  },
  // watch: {
  //   socialProvider(newVal) {
  //     if (newVal != "") {
  //       localStorage.setItem("social", newVal);
  //     }
  //   },
  // },
  created() {
    window.addEventListener("resize", this.handleResize);
    setInterval(this.updateTime, 1000);
  },
  mounted() {
    this.getAppData();
    this.getHeaderData();
    this.getCountry();
    this.getFooterData();
    this.getGroups();
    const token = localStorage.getItem("token");
    if (this.tokenProvider != null) {
      this.getHeaderUserData();
    } else if (token) {
      this.getHeaderUserData();
    }
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
    ...mapMutations(["setActiveTag"]),
    updateTime() {
      // Ambil zona waktu Singapore
      const singaporeTime = moment().tz("Asia/Singapore");
      // Format waktu dalam hh:mm:ss
      this.currentTime = singaporeTime.format("HH:mm:ss");
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
          localStorage.setItem("name", null);
          localStorage.setItem("g_id", null);
          localStorage.setItem("user_image", null);
          localStorage.setItem("token", null);
          window.location.href = "/";
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
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
      this.setActiveTag(tag); // Menetapkan tag yang dipilih sebagai tag aktif

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
    countCards(tag) {
      const count = this.trendingCard.filter(
        (trend) => trend.tag === tag
      ).length;
      return count;
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    previousSlide() {
      this.activeIndex--;
    },
    nextSlide() {
      this.activeIndex++;
    },
    preventSubmit(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.view-all {
  position: sticky !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1000 !important;
  /* Gaya view all yang sticky */
}
.scroll-container {
  margin-top: -80px;
  overflow-x: auto;
  white-space: nowrap;
  gap: 20px;
}
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
