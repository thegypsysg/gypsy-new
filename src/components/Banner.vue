<template>
  <div class="banner-wrapper">
    <div
      class="bg-image"
      :style="{
        backgroundImage: `url(${$fileURL + headerData.app_main_image})`,
      }"
      :class="{ 'bg-image-mobile': isSmall }"
    >
      <v-container
        class="d-flex align-center"
        :class="{ 'banner-desktop': !isSmall, 'banner-mobile': isSmall }"
      >
        <v-row :class="{ 'd-flex justify-end': !isSmall }">
          <v-col :cols="!isSmall ? 5 : 12">
            <div
              class="hero_title text-center"
              :data-aos="!isSmall ? 'fade-left' : 'fade-right'"
              data-aos-offset="200"
              data-aos-duration="2000"
              data-aos-easing="ease-in-sine"
            >
              <h1
                style="
                  color: #032170;
                  font-family: 'Oswald', sans-serif !important;
                  font-weight: 700;
                  text-shadow: 0px 0px 8px rgba(255, 255, 255, 1),
                    0px 0px 16px rgba(255, 255, 255, 0.8),
                    0px 0px 24px rgba(255, 255, 255, 0.6), -1px -1px 0 #fff,
                    1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
                "
                :style="{ 'font-size': !isSmall ? '96px' : '66px' }"
              >
                All in One
              </h1>
              <h2
                class="mt-2"
                style="
                  color: #e3f2fd;
                  font-family: 'Oswald', sans-serif !important;
                  font-weight: 700;
                  text-shadow: 4px 6px 10px rgba(0, 0, 0, 0.6);
                "
                :style="{ 'font-size': !isSmall ? '96px' : '66px' }"
              >
                App
              </h2>
              <v-btn
                :height="isSmall ? 40 : 60"
                class="text-white elevation-4 mt-6 px-6"
                style="
                  background: linear-gradient(180deg, #103c7a 0%, #031433 100%);
                  border: 2px solid #ffffff;
                  border-radius: 8px;
                  font-size: 18px;
                  font-weight: 700;
                  letter-spacing: 1px;
                "
                @click="scrollToTrending"
              >
                <span>TRENDING APPS</span>
              </v-btn>

              <div class="d-md-flex d-none justify-center mt-10 ga-16">
                <v-btn
                  class="text-white elevation-3 px-6 rounded-pill text-none font-weight-bold"
                  style="
                    background-color: #5d9ba6;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                  "
                  height="48"
                  @click="$router.push('/partners')"
                >
                  <v-icon left size="22" class="mr-2"
                    >mdi-handshake-outline</v-icon
                  >
                  For Partners
                </v-btn>

                <v-btn
                  class="text-white elevation-3 px-6 rounded-pill text-none font-weight-bold"
                  style="
                    background-color: #a06e48;
                    font-size: 16px;
                    letter-spacing: 0.5px;
                  "
                  height="48"
                >
                  <v-icon left size="22" class="mr-2">mdi-moped</v-icon>
                  Riders
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Fixed Footer for Mobile -->
    <div
      class="d-md-none d-flex align-center justify-center py-3 px-4"
      style="
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #e8e8e8;
        z-index: 999;
        gap: 12px;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
      "
    >
      <v-btn
        class="text-white elevation-3 rounded-pill text-none font-weight-bold flex-grow-1"
        style="
          background-color: #5d9ba6;
          font-size: 14px;
          letter-spacing: 0.5px;
        "
        height="44"
        @click="$router.push('/partners')"
      >
        <v-icon left size="20" class="mr-1">mdi-handshake-outline</v-icon>
        For Partners
      </v-btn>

      <v-btn
        class="text-white elevation-3 rounded-pill text-none font-weight-bold flex-grow-1"
        style="
          background-color: #a06e48;
          font-size: 14px;
          letter-spacing: 0.5px;
        "
        height="44"
      >
        <v-icon left size="20" class="mr-1">mdi-moped</v-icon>
        Riders
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import AOS from "aos";

defineProps({
  headerData: {
    type: Object,
    default: () => ({}),
  },
});

const screenWidth = ref(window.innerWidth);

const isSmall = computed(() => screenWidth.value < 640);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => {
  AOS.init();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

function scrollToTrending() {
  const sectionElement = document.getElementById("trending");
  if (sectionElement && !isSmall.value) {
    const offset = 80;
    const topPos =
      sectionElement.getBoundingClientRect().top +
      window.pageYOffset -
      offset;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  } else if (sectionElement) {
    const offset = 240;
    const topPos =
      sectionElement.getBoundingClientRect().top +
      window.pageYOffset -
      offset;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap");
.bg-image-mobile {
  height: 73vh !important;
}

.banner-desktop {
  height: calc(100vh - 90px);
}
.banner-mobile {
  height: calc(100vh - 200px);
}

.hero_title {
  text-shadow: 2px 2px 10px #000000;
  font-weight: 900;
}

.hero_title h1 {
  font-family: "Oswald", sans-serif !important;
  color: #ffa42e;
}
</style>
