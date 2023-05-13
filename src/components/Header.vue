<template>
  <v-app-bar color="white" elevation="1" fixed>
    <router-link to="/">
      <img
        class="logo-img"
        src="@/assets/images/logo/logo.png"
        height="90"
        :class="{ 'ml-8': isWelcome }"
      />
    </router-link>
    <div v-if="isWelcome" class="ml-4 d-flex flex-row header-info">
      <div v-if="!isSmall" class="divider" />
      <span :class="{ 'header-info-span': isSmall }">Sign Up / Login</span>
    </div>
    <v-spacer v-if="isWelcome" />
    <form v-if="!isWelcome" class="navbar__search navbar__search__desktop">
      <input
        id="product_name"
        class="form-control mr-sm-2"
        type="text"
        placeholder="Type a Mall or merchant"
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
            Singapore
            <v-icon right dark> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
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
      <div class="mobile__app text-center">
        <div style="margin-bottom: 8px; margin-top: -16px">
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
                Singapore
                <v-icon right dark> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :value="index"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <form class="navbar__search navbar__search__mobile">
          <input
            id="product_name"
            class="form-control mr-sm-2"
            type="text"
            placeholder="Type a Mall or merchant"
            aria-label="Search"
            data-autocompleturl="https://boozards.com/merchant-product/search"
          />
          <button class="btn btn--search" type="submit">
            <v-icon color="white"> mdi-magnify </v-icon>
          </button>
        </form>
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
export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Header",
  props: ["isWelcome"],
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", path: "/home", icon: "home" },
        { title: "Sign Up", path: "/signup", icon: "face" },
        { title: "Sign In", path: "/signin", icon: "lock_open" },
      ],
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.v-app-bar.v-toolbar {
  max-width: 100%;
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
</style>
