<template>
  <v-app-bar
    :class="{ 'app-bar-mobile': isSmall && !isWelcome }"
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
          :class="{ 'ml-8': isWelcome }"
        >
          <template #placeholder>
            <div class="skeleton" />
          </template>
        </v-img>
      </div>
    </router-link>
    <div v-if="isWelcome" class="ml-10 d-flex flex-row header-info">
      <div v-if="!isSmall" class="divider" />
      <span :class="{ 'header-info-span': isSmall }">Sign Up / Login</span>
    </div>
    <v-spacer v-if="isWelcome" />
    <form v-if="!isWelcome" class="navbar__search navbar__search__desktop">
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
    <div v-if="!isWelcome" class="desktop__app">
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
    <v-btn v-if="!isWelcome" elevation="0" class="btn_sign__up" to="/welcome">
      Sign up / Register
    </v-btn>
    <v-btn v-if="!isWelcome" icon @click="drawer = !drawer">
      <img
        src="@/assets/images/icons/user_icon.png"
        style="height: 48px; width: auto"
      />
    </v-btn>

    <template v-if="!isWelcome" #extension>
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
    <div class="drawer__top">
      <a style="font-size: 1.125rem; color: white">Sign up / Register</a>
    </div>
    <div class="drawer__heading">
      <div class="drawer-logo">
        <span class="logo">MALL-</span>
        <span class="text-danger">e</span>
      </div>
      <div class="text-muted" style="font-size: 10px">Version 1.0</div>
    </div>
    <v-divider />
    <ul nav dense>
      <li class="v-list-item">
        <div class="v-list-item__icon">
          <img src="@/assets/images/icons/home.png" />
        </div>
        <v-list-item-title>Home</v-list-item-title>
      </li>

      <li class="v-list-item">
        <div class="v-list-item__icon">
          <img src="@/assets/images/icons/shop.png" />
        </div>
        <v-list-item-title>Merchants</v-list-item-title>
      </li>

      <li class="v-list-item">
        <div class="v-list-item__icon">
          <img src="@/assets/images/icons/shopping-mall.png" />
        </div>
        <v-list-item-title>Mall owner</v-list-item-title>
      </li>

      <li class="v-list-item">
        <div class="v-list-item__icon">
          <img src="@/assets/images/icons/menu-drivers.png" />
        </div>
        <v-list-item-title>Drivers / Riders</v-list-item-title>
      </li>
    </ul>

    <div class="drawer__bottom">
      <div class="text-center" style="width: 100%">
        <p style="font-size: 16px; margin-bottom: 2px">Made in Singapore</p>
        <h3 style="font-size: 13px">Get connected</h3>
        <div class="d-flex justify-center">
          <img
            src="@/assets/images/icons/facebook.png"
            height="48"
            width="auto"
          />
          <img src="@/assets/images/icons/insta.png" height="48" width="auto" />
        </div>
        <div class="drawer-social d-flex" style="width: 100%">
          <div>
            <h6>WhatsApp</h6>
            <a
              style="text-decoration: none"
              href="https://api.whatsapp.com/send?phone=+65.94694136&text=Hello!"
            >
              +65 9469 4136
            </a>
          </div>
          <div>
            <h6>Contact us</h6>
            <a style="text-decoration: none" href="mailto:help@mall-e.net"
              >help@mall-e.net</a
            >
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import app from "@/util/eventBus";
import axios from "@/util/axios";

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
      // selectedTag: null,
      trendingBtn: [],
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
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    ...mapState(["activeTag"]),
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
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.getAppData();
    this.getHeaderData();
    this.getCountry();
    this.getGroups();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapMutations(["setActiveTag"]),
    selectTag(tag) {
      this.setActiveTag(tag); // Menetapkan tag yang dipilih sebagai tag aktif

      app.config.globalProperties.$eventBus.$emit("scrollToCardSection");
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
