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
import DOMPurify from "dompurify";
import Footer from "@/components/Footer.vue";
import http from "@/api/http";
import { logger } from "@/utils/logger";

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
  if (!info) return "";
  const withLineBreaks = info.replace(/\n/g, "<br>");
  return DOMPurify.sanitize(withLineBreaks, {
    ALLOWED_TAGS: ["br", "strong", "em", "p", "b", "i", "u", "span", "a"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

async function getPrivacyData() {
  isLoading.value = true;
  try {
    const response = await http.get(
      `/privacy-policy/type/${privacyType.value}`
    );
    privacyData.value = response.data.data;
  } catch (error) {
    logger.error("Error fetching privacy data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function getFooterData() {
  isLoading.value = true;
  try {
    const response = await http.get(`/footer`);
    footerData.value = response.data.data[0];
  } catch (error) {
    logger.error("Error fetching footer data:", error);
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
