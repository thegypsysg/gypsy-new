<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <div v-if="!isLoading" class="pt-16" :class="{ 'mt-8': !isSmall }">
      <v-container>
        <div v-for="i in 9" :key="i" :class="{ 'w-75': !isSmall }">
          <h3
            v-if="privacyData['header_' + i]"
            :class="{ 'ml-5': !privacyData['header_' + i][0].match(/^\d/) }"
            class="my-4"
          >
            {{ privacyData["header_" + i] }}
          </h3>

          <p
            v-if="privacyData['info_' + i]"
            class="ml-5"
            v-html="formatInfo(privacyData['info_' + i])"
          />
        </div>
      </v-container>
      <v-divider class="my-4" />
      <Footer :header-data="headerData" :footer-data="footerData" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import axios from "@/util/axios";

const route = useRoute();

const drawer = ref(false);
const privacyData = ref({});
const footerData = ref({});
const headerData = ref({});
const isLoading = ref(false);
const screenWidth = ref(window.innerWidth);

const privacyType = computed(() => {
  return route.path === "/privacy-policy" ? "P" : "T";
});

const isSmall = computed(() => screenWidth.value < 640);

function formatInfo(info) {
  return info ? info.replace(/\n/g, "<br>") : "";
}

async function getPrivacyData() {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `/privacy-policy/type/${privacyType.value}`
    );
    privacyData.value = response.data.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

async function getFooterData() {
  isLoading.value = true;
  try {
    const response = await axios.get(`/footer`);
    footerData.value = response.data.data[0];
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

function handleResize() {
  screenWidth.value = window.innerWidth;
}

watch(privacyType, () => {
  getPrivacyData();
});

onMounted(() => {
  getPrivacyData();
  getFooterData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped></style>
