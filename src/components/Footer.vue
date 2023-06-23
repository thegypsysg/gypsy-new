<template>
  <v-container class="mt-6 footer_lks">
    <v-row>
      <v-col cols="12" sm="12" md="3">
        <h2 class="footer_title">About {{ headerData?.app_name }}</h2>
        <p
          class="footer_paragraph"
          style="margin-bottom: 16px; margin-top: 34px"
        >
          {{ headerData?.app_detail }}
        </p>
        <ul class="footer_social">
          <li>
            <img src="@/assets/map-pointer.svg" height="24" />
            {{ footerData?.location }}
          </li>
          <li>
            <img src="@/assets/phone.svg" height="24" />
            {{ footerData?.mobile_number }}
          </li>
          <li>
            <img src="@/assets/whatsapp.svg" height="24" />
            {{ footerData?.whats_app }}
          </li>
          <li>
            <img src="@/assets/mail.svg" height="24" />
            <a :href="`mailto:${footerData?.email_id}`">{{
              footerData?.email_id
            }}</a>
          </li>
        </ul>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <h2 class="footer_title" style="margin-bottom: 16px">Quick links</h2>
        <ul class="footer_links" style="margin-top: 37px">
          <li>
            <img src="@/assets/links-arrow.svg" height="12" />
            Our Apps
          </li>
          <li>
            <img src="@/assets/links-arrow.svg" height="12" />
            Sign Up/Register
          </li>
          <li>
            <img src="@/assets/links-arrow.svg" height="12" />
            Delivery partners
          </li>
          <li>
            <img src="@/assets/links-arrow.svg" height="12" />
            Merchants
          </li>
          <li>
            <img src="@/assets/links-arrow.svg" height="12" />
            Employers
          </li>
        </ul>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <h2 class="footer_title">Our Apps</h2>
        <v-row
          class="footer_apps"
          style="margin-top: 37px; padding-right: 20px"
        >
          <v-col v-for="item in trendingCard" :key="item.id" cols="4">
            <p style="margin-bottom: 10px">
              {{ item.title }}
            </p>
            <div class="our-apps">
              <v-img
                class="our-apps-img"
                transition="fade-transition"
                :src="fileURL + item.img"
              >
                <template #placeholder>
                  <div class="skeleton" />
                </template>
              </v-img>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <a
              href="javascript:void(0)"
              style="
                color: #00cdcd;
                font-size: 14px;
                font-weight: 600;
                line-height: 19px;
                text-decoration: none;
              "
              @click="scrollToTrending"
            >
              View all</a
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <h2 class="footer_title">Sign up / Register</h2>
        <p
          class="footer_paragraph"
          style="margin-bottom: 16px; margin-top: 34px"
        >
          Sign up and be part of the Gypsy Community. Please Register for a
          Gypsy ID which can be used for all our Apps.<br />
          Type your email and press get started.
        </p>
        <input class="footer_input" placeholder="Type your email" />
        <v-btn
          style="
            width: inherit;
            border-radius: 0 !important;
            margin-top: 16px;
            background: #00cdcd;
            color: white;
          "
        >
          Get started
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-footer class="bg-black text-center footer__content">
    <div class="footer_text">
      {{ footerData?.copyright }}
    </div>
    <div style="display: flex; justify-content: center">
      <v-btn
        :href="footerData?.facebook"
        variant="text"
        color="#00CDCD"
        icon="mdi-facebook"
      />
      <v-btn
        :href="footerData?.twitter"
        variant="text"
        color="#00CDCD"
        icon="mdi-twitter"
      />
      <v-btn
        :href="footerData?.instagram"
        variant="text"
        color="#00CDCD"
        icon="mdi-instagram"
      />
      <v-btn
        :href="footerData?.youtube"
        variant="text"
        color="#00CDCD"
        icon="mdi-youtube"
      />
    </div>
  </v-footer>
</template>

<script>
import axios from "@/util/axios";
import app from "@/util/eventBus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Footer",
  props: ["footerData", "headerData"],
  data() {
    return {
      fileURL: "https://admin1.the-gypsy.sg",
      trendingCard: [],
    };
  },
  mounted() {
    this.getAppData();
  },
  methods: {
    scrollToTrending() {
      app.config.globalProperties.$eventBus.$emit("scrollToTrendingSection");
    },
    getAppData() {
      // this.isLoading = true;
      axios
        .get(`/app`)
        .then((response) => {
          const data = response.data.data;
          const dataItem = data.slice(0, 6);
          // console.log(data);
          this.trendingCard = dataItem.map((item) => {
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
  },
};
</script>

<style scoped>
.our-apps {
  position: relative;
  overflow: hidden;
  min-height: 10px;
  max-height: 52px;
}
.our-apps-img {
  max-width: 100%;
  transition: all 0.3s;
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.our-apps:hover .our-apps-img {
  transform: scale(1.2);
}
.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;
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
