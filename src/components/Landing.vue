<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <div v-if="!isLoading">
      <Banner :header-data="headerData" />
      <TrendingApps />
      <Partners />
      <hr />
      <Footer :header-data="headerData" :footer-data="footerData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Banner from "@/components/Banner.vue";
import TrendingApps from "@/components/TrendingApps.vue";
import Partners from "@/components/Partners.vue";
import Footer from "@/components/Footer.vue";
import { logger } from "@/utils/logger";
import http from "@/api/http";

const headerData = ref({});
const footerData = ref({});
const isLoading = ref(false);

async function getHeaderData() {
  isLoading.value = true;
  try {
    const response = await http.get(`/header`);
    headerData.value = response.data.data;
  } catch (error) {
    logger.error("Landing getHeaderData error:", error);
  } finally {
    isLoading.value = false;
  }
}

async function getFooterData() {
  isLoading.value = true;
  try {
    const response = await http.get(`/footer`);
    footerData.value = response.data.data?.[0] || {};
  } catch (error) {
    logger.error("Landing getFooterData error:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getHeaderData();
  getFooterData();
});
</script>

<style>
@font-face {
  font-family: "Nunito";
  font-style: normal;
  font-weight: normal;
  src: url("@/assets/font/nunito/Nunito-VariableFont_wght.ttf")
    format("opentype");
}
.loading-page {
  margin-top: 300px;
}

@media (max-width: 599px) {
  .loading-page {
    margin-top: 450px;
  }
}
</style>
