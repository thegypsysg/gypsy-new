<template>
  <v-container>
    <div
      id="trending-section"
      class="jumbotron-text"
      :class="{ 'mb-n4 mt-n10': isSmall }"
    >
      <h1
        align="center"
        class="header-title mb-n10"
        style="font-size: 56px; font-style: normal; font-weight: 700"
      >
        The Gypsy Trending Web Apps
      </h1>
      <!-- <p class="header-title-sub" style="margin-top: 32px">
        The gypsy Trending Web Apps
      </p> -->
    </div>
  </v-container>

  <v-container id="trending" class="wrapper-box">
    <div class="d-flex">
      <v-btn
        v-if="!isSmall"
        class="sub-menu-btn view-all"
        :size="isSmall ? 30 : 120"
        :class="{
          active: isSelected,
          'py-n4 ml-n14': !isSmall,
        }"
        style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
        @click="filterCards('')"
      >
        <p style="font-size: 12px" elevation>View All</p>
      </v-btn>
      <v-slide-group
        v-if="!isSmall"
        v-model="selectedTag"
        class="trending-slide my-slide"
      >
        <template #prev="{ on, attrs }">
          <v-btn
            v-if="activeIndex > 1"
            color="#0596d5"
            rounded
            icon
            size="40"
            v-bind="attrs"
            v-on="on"
            @click="previousSlide"
          >
            <v-icon size="20" color="white"> mdi-arrow-left </v-icon>
          </v-btn>
        </template>
        <template #next="{ on, attrs }">
          <v-btn
            v-if="activeIndex + 1 <= trendingBtn.length / 4"
            color="#0596d5"
            rounded
            size="40"
            icon
            v-bind="attrs"
            @click="nextSlide"
            v-on="on"
          >
            <v-icon size="20" color="white"> mdi-arrow-right </v-icon>
          </v-btn>
        </template>
        <v-slide-group-item
          v-for="btn in trendingBtn"
          :key="btn.tag"
          v-slot="{ isSelected, toggle }"
          :value="btn.tag"
          class="my-slide-item"
          @click="filterCards(btn.tag)"
        >
          <v-btn
            class="sub-menu-btn"
            :size="isSmall ? 30 : 155"
            :class="{
              active: isSelected,
              'py-4 mx-2': !isSmall,
            }"
            style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
            @click="toggle"
          >
            <p style="font-size: 12px" elevation>
              {{ btn.title }}
              <span>{{
                countCards(btn.tag) == 0 ? "" : `(${countCards(btn.tag)})`
              }}</span>
            </p>
            <!-- <span class="badge" :class="isSelected ? 'active' : ''">2.7K</span> -->
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </div>
    <v-row class="trending__app__wrapper">
      <template v-if="isSmall">
        <transition-group name="card-transition" mode="out-in">
          <v-col
            v-for="(card, i) in filteredItemsMobile"
            :key="i"
            xs="6"
            sm="6"
            md="4"
            cols="12"
          >
            <v-lazy :options="{ threshold: 0.5 }" min-height="200">
              <v-card
                class="trending__app"
                style="
                  box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.15);
                  border-radius: 0px;
                "
              >
                <div class="img-cont">
                  <div class="cart clearfix animate-effect">
                    <div class="action d-flex justify-center">
                      <v-btn
                        :href="card.isLive ? card.link : ''"
                        target="_blank"
                        elevation="4"
                        style="
                          background-color: #fa2964;
                          border-radius: 50px;
                          padding-left: 8px;
                          padding-right: 8px;
                          padding-top: 5px;
                          padding-bottom: 5px;
                        "
                        @click="card.isLive ? '' : openLive(card)"
                      >
                        <span class="text-white" style="">View App</span>
                        <v-icon right style="color: #fff">
                          mdi-chevron-right
                        </v-icon>
                      </v-btn>
                      <!-- <ul class="list-unstyled">
                        <li class="add-cart-button">
                          <v-btn rounded icon color="#ee4054">
                            <v-icon color="white"> mdi-cart </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Add Cart
                            </v-tooltip>
                          </v-btn>
                        </li>
                        <li class="lnk wishlist">
                          <v-btn rounded icon color="white">
                            <v-icon color="#ee4054"> mdi-heart </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Wishlist
                            </v-tooltip>
                          </v-btn>
                        </li>
                        <li class="lnk compare">
                          <v-btn rounded icon color="white">
                            <v-icon color="#ee4054"> mdi-signal </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Compare
                            </v-tooltip>
                          </v-btn>
                        </li>
                      </ul> -->
                    </div>
                  </div>
                  <v-img
                    :src="$fileURL + card.img"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover
                    class="img-item"
                  >
                    <template #placeholder>
                      <div class="skeleton" />
                    </template>
                  </v-img>
                  <div class="mobile__app">
                    <h3 class="text_title" style="padding-bottom: 12px">
                      {{ card.title }}
                    </h3>
                    <p class="text_subtitle">
                      {{ card.desc }}
                    </p>
                  </div>
                  <div class="tag">
                    <v-chip> {{ card.tag }} </v-chip>
                  </div>
                </div>
                <div class="desktop__app">
                  <h3
                    class="text_title text-black text-left"
                    style="padding-bottom: 16px"
                  >
                    {{ card.title }}
                  </h3>
                  <div class="desktop-card-desc">
                    <p
                      style="padding-bottom: 32px"
                      class="text_subtitle text-left"
                    >
                      {{ card.desc }}
                    </p>
                  </div>
                  <v-card-actions class="d-flex">
                    <v-btn
                      :href="card.isLive ? card.link : ''"
                      target="_blank"
                      elevation="4"
                      style="
                        background-color: #fa2964;
                        border-radius: 50px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-top: 10px;
                        padding-bottom: 10px;
                      "
                      @click="card.isLive ? '' : openLive(card)"
                    >
                      <span class="text-white" style="">View App</span>
                      <v-icon right style="color: #fff">
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-spacer />
                    <div class="d-flex">
                      <!-- <v-icon style="color: #808080;">mdi-eye</v-icon> -->
                      <svg
                        align="center"
                        width="24"
                        height="24"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_61_42)">
                          <path
                            d="M33.62 17.53C30.25 11.3 24.34 7.53 17.8 7.53C11.26 7.53 5.34 11.3 2 17.53L1.72 18L1.98 18.48C5.35 24.71 11.26 28.48 17.8 28.48C24.34 28.48 30.26 24.76 33.62 18.48L33.88 18L33.62 17.53ZM17.8 26.43C12.17 26.43 7 23.29 4 18C7 12.71 12.17 9.57 17.8 9.57C23.43 9.57 28.54 12.72 31.59 18C28.54 23.29 23.42 26.43 17.8 26.43Z"
                            fill="#808080"
                          />
                          <path
                            d="M18.09 11.17C16.7341 11.1799 15.4116 11.5914 14.2894 12.3525C13.1673 13.1136 12.2958 14.1902 11.7852 15.4462C11.2745 16.7023 11.1475 18.0816 11.4203 19.4098C11.693 20.738 12.3533 21.9555 13.3176 22.9087C14.282 23.8619 15.5072 24.5079 16.8385 24.7652C18.1697 25.0225 19.5474 24.8794 20.7975 24.3542C22.0475 23.8289 23.1139 22.945 23.8619 21.8141C24.6098 20.6831 25.0059 19.3559 25 18C24.9961 17.0974 24.8141 16.2045 24.4644 15.3724C24.1148 14.5403 23.6044 13.7854 22.9625 13.1509C22.3206 12.5164 21.5598 12.0148 20.7236 11.6749C19.8875 11.335 18.9925 11.1634 18.09 11.17ZM18.09 22.89C17.1323 22.8801 16.1988 22.5875 15.4068 22.0488C14.6148 21.5101 13.9997 20.7495 13.6386 19.8623C13.2776 18.9752 13.1867 18.0012 13.3774 17.0625C13.5681 16.1239 14.0319 15.2626 14.7106 14.5867C15.3892 13.9108 16.2524 13.4505 17.1918 13.2637C18.1312 13.0768 19.1049 13.1716 19.9905 13.5363C20.8762 13.901 21.6343 14.5192 22.1698 15.3134C22.7052 16.1076 22.994 17.0422 23 18C23.0027 18.6446 22.8773 19.2833 22.6313 19.8791C22.3852 20.4749 22.0233 21.0159 21.5666 21.4708C21.1099 21.9257 20.5674 22.2853 19.9706 22.529C19.3738 22.7726 18.7346 22.8953 18.09 22.89Z"
                            fill="#808080"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_61_42">
                            <rect width="36" height="36" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span
                        align="center"
                        style="color: #808080; padding-right: 16px"
                        >1336</span
                      >
                    </div>
                  </v-card-actions>
                </div>
              </v-card>
            </v-lazy>
          </v-col>
        </transition-group>
      </template>
      <template v-if="!isSmall">
        <transition-group name="card-transition" mode="out-in">
          <v-col
            v-for="(card, i) in filteredItemsDesktop"
            :key="i"
            xs="6"
            sm="6"
            md="4"
            cols="12"
            class="card"
          >
            <v-lazy :options="{ threshold: 0.5 }" min-height="250">
              <v-card
                class="trending__app"
                style="
                  box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.15);
                  border-radius: 0px;
                "
              >
                <div class="img-cont">
                  <div class="cart clearfix animate-effect">
                    <div class="action">
                      <ul class="list-unstyled">
                        <li class="add-cart-button">
                          <v-btn rounded icon color="#ee4054">
                            <v-icon color="white"> mdi-cart </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Add Cart
                            </v-tooltip>
                          </v-btn>
                        </li>
                        <li class="lnk wishlist">
                          <v-btn rounded icon color="white">
                            <v-icon color="#ee4054"> mdi-heart </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Wishlist
                            </v-tooltip>
                          </v-btn>
                        </li>
                        <li class="lnk compare">
                          <v-btn rounded icon color="white">
                            <v-icon color="#ee4054"> mdi-signal </v-icon>
                            <v-tooltip activator="parent" location="top">
                              Compare
                            </v-tooltip>
                          </v-btn>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <v-img
                    :src="$fileURL + card.img"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover
                    class="img-item"
                  >
                    <template #placeholder>
                      <div class="skeleton" />
                    </template>
                    <div class="mobile__app">
                      <h3 class="text_title" style="padding-bottom: 12px">
                        {{ card.title }}
                      </h3>
                      <p class="text_subtitle">
                        {{ card.desc }}
                      </p>
                    </div>
                  </v-img>
                  <div class="tag">
                    <v-chip> {{ card.tag }} </v-chip>
                  </div>
                </div>
                <div class="desktop__app">
                  <h3
                    class="text_title text-black text-left"
                    style="padding-bottom: 16px"
                  >
                    {{ card.title }}
                  </h3>
                  <div class="desktop-card-desc">
                    <p
                      style="padding-bottom: 32px"
                      class="text_subtitle text-left"
                    >
                      {{ card.desc }}
                    </p>
                  </div>
                  <v-card-actions class="d-flex">
                    <v-btn
                      :href="card.isLive ? card.link : ''"
                      target="_blank"
                      elevation="4"
                      style="
                        background-color: #fa2964;
                        border-radius: 50px;
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-top: 10px;
                        padding-bottom: 10px;
                      "
                      @click="card.isLive ? '' : openLive(card)"
                    >
                      <span class="text-white" style="">View App</span>
                      <v-icon right style="color: #fff">
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-spacer />
                    <div class="d-flex">
                      <!-- <v-icon style="color: #808080;">mdi-eye</v-icon> -->
                      <svg
                        align="center"
                        width="24"
                        height="24"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_61_42)">
                          <path
                            d="M33.62 17.53C30.25 11.3 24.34 7.53 17.8 7.53C11.26 7.53 5.34 11.3 2 17.53L1.72 18L1.98 18.48C5.35 24.71 11.26 28.48 17.8 28.48C24.34 28.48 30.26 24.76 33.62 18.48L33.88 18L33.62 17.53ZM17.8 26.43C12.17 26.43 7 23.29 4 18C7 12.71 12.17 9.57 17.8 9.57C23.43 9.57 28.54 12.72 31.59 18C28.54 23.29 23.42 26.43 17.8 26.43Z"
                            fill="#808080"
                          />
                          <path
                            d="M18.09 11.17C16.7341 11.1799 15.4116 11.5914 14.2894 12.3525C13.1673 13.1136 12.2958 14.1902 11.7852 15.4462C11.2745 16.7023 11.1475 18.0816 11.4203 19.4098C11.693 20.738 12.3533 21.9555 13.3176 22.9087C14.282 23.8619 15.5072 24.5079 16.8385 24.7652C18.1697 25.0225 19.5474 24.8794 20.7975 24.3542C22.0475 23.8289 23.1139 22.945 23.8619 21.8141C24.6098 20.6831 25.0059 19.3559 25 18C24.9961 17.0974 24.8141 16.2045 24.4644 15.3724C24.1148 14.5403 23.6044 13.7854 22.9625 13.1509C22.3206 12.5164 21.5598 12.0148 20.7236 11.6749C19.8875 11.335 18.9925 11.1634 18.09 11.17ZM18.09 22.89C17.1323 22.8801 16.1988 22.5875 15.4068 22.0488C14.6148 21.5101 13.9997 20.7495 13.6386 19.8623C13.2776 18.9752 13.1867 18.0012 13.3774 17.0625C13.5681 16.1239 14.0319 15.2626 14.7106 14.5867C15.3892 13.9108 16.2524 13.4505 17.1918 13.2637C18.1312 13.0768 19.1049 13.1716 19.9905 13.5363C20.8762 13.901 21.6343 14.5192 22.1698 15.3134C22.7052 16.1076 22.994 17.0422 23 18C23.0027 18.6446 22.8773 19.2833 22.6313 19.8791C22.3852 20.4749 22.0233 21.0159 21.5666 21.4708C21.1099 21.9257 20.5674 22.2853 19.9706 22.529C19.3738 22.7726 18.7346 22.8953 18.09 22.89Z"
                            fill="#808080"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_61_42">
                            <rect width="36" height="36" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span
                        align="center"
                        style="color: #808080; padding-right: 16px"
                        >{{ card.views }}</span
                      >
                    </div>
                  </v-card-actions>
                </div>
              </v-card>
            </v-lazy>
          </v-col>
        </transition-group>
      </template>
    </v-row>

    <v-dialog v-model="isOpenLive" persistent width="auto">
      <v-card width="450">
        <v-card-text class="text-center">
          <v-img height="100" :src="liveData.img" />
          <h2 class="my-4">{{ liveData.title }} would be Live Soon</h2>
          <v-btn class="mb-4" @click="closeLive()"> OK </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import app from "@/util/eventBus";
// import { computed, onMounted, onUnmounted } from "vue";
// import eventBus from "@/util/eventBus";
import { mapState } from "vuex";
import axios from "@/util/axios";

export default {
  name: "TrendingApps",
  props: ["appData"],
  data() {
    return {
      isOpenLive: false,
      liveData: {
        img: "",
        title: "",
      },
      selectedTag: null,
      trendingBtn: [],
      trendingCard: [],
      selectedType: 0,
      activeIndex: 1,
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState(["activeTag"]),
    isSmall() {
      return this.screenWidth < 640;
    },
    filteredItemsMobile() {
      // console.log(this.activeTag);
      if (!this.activeTag || this.activeTag == undefined) {
        return this.trendingCard;
      } else {
        // const searchTextLower = this.search.toLowerCase();
        return this.trendingCard.filter((item) => {
          return item.tag.includes(this.activeTag);
        });
      }
    },
    filteredItemsDesktop() {
      if (!this.selectedTag) {
        return this.trendingCard;
      } else {
        // const searchTextLower = this.search.toLowerCase();
        return this.trendingCard.filter((item) => {
          return item.tag.includes(this.selectedTag);
        });
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    app.config.globalProperties.$eventBus.$on(
      "scrollToCardSection",
      this.scrollToCardSection
    );
    app.config.globalProperties.$eventBus.$on(
      "scrollToTrendingSection",
      this.scrollToTrendingSection
    );
    this.getAppData();
    this.getGroups();
  },
  beforeUnmount() {
    app.config.globalProperties.$eventBus.$off(
      "scrollToCardSection",
      this.scrollToCardSection
    );
    app.config.globalProperties.$eventBus.$off(
      "scrollToTrendingSection",
      this.scrollToTrendingSection
    );
    // eventBus.off("filter-card-header", this.filterCards);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    // selectTag(tag) {
    //   this.activeTag = tag; // Menetapkan tag yang dipilih sebagai tag aktif di komponen kartu
    // },
    openLive(item) {
      this.isOpenLive = true;
      this.liveData = {
        img: this.$fileURL + item.img,
        title: item.title,
      };
    },
    closeLive() {
      this.isOpenLive = false;
      this.liveData = {
        img: "",
        title: "",
      };
    },
    getAppData() {
      // this.isLoading = true;
      axios
        .get(`/app`)
        .then((response) => {
          const data = response.data.data;

          this.trendingCard = data.map((item) => {
            return {
              img: item.app_main_image || "",
              title: item.app_name || "",
              desc: item.app_description || "",
              tag: item.app_group_name || "",
              link:
                item.app_name == "4 Walls"
                  ? "https://4walls.the-gypsy.sg/"
                  : item.app_link,
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
              isLive:
                item.live == "N" || item.live == null
                  ? false
                  : item.live == "Y"
                  ? true
                  : null,
              group: item.app_group_name || "",
              user: item.user_id || 1,
              created: item.dated || "",
              likes: item.app_likes || "",
              shares: item.app_shares || "",
            };
          });

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
      axios
        .get(`/groups`)
        .then((response) => {
          const data = response.data.data;
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
        });
    },
    scrollToCardSection() {
      const cardSection = document.getElementById("trending");
      const cardRect = cardSection.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const offset = cardRect.top + scrollTop - 300; // Nilai offset yang diinginkan, dalam piksel

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
      // window.scrollBy(0, -scrollOffset);
    },
    scrollToTrendingSection() {
      const cardSection = document.getElementById("trending");
      const cardRect = cardSection.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const offset = this.isSmall
        ? cardRect.top + scrollTop - 300
        : cardRect.top + scrollTop - 200; // Nilai offset yang diinginkan, dalam piksel

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
      // window.scrollBy(0, -scrollOffset);
    },

    selectTag(tag) {
      this.$store.commit("setActiveTag", tag); // Menetapkan tag yang dipilih sebagai tag aktif
    },
    filterCards(tag) {
      // console.log("ok");
      this.selectedTag = tag;
    },
    filterCardHeader(tag) {
      this.activeTag = tag;
      // console.log(this.activeTag);
    },
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
  },
};
</script>

<style scoped>
.my-slide {
  position: relative !important;
}
.view-all {
  background: #0596d5;
  color: white;
  height: 50px !important;
  z-index: 1000 !important;
  /* Gaya view all yang sticky */
}
.card-transition-enter-active,
.card-transition-leave-active {
  transition: transform 0.5s, opacity 0.3s;
}

.card-transition-enter {
  opacity: 0;
  transform: translateX(-50%);
}

.card-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.img-cont {
  position: relative;
  overflow: hidden;
}

.img-item {
  transition: all 0.3s;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.trending__app:hover .img-item {
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

.desktop-card-desc {
  height: 70px !important;
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
