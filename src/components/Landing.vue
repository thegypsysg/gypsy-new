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

<script>
import Banner from "@/components/Banner.vue";
import TrendingApps from "@/components/TrendingApps.vue";
import Partners from "@/components/Partners.vue";
import Footer from "@/components/Footer.vue";
import axios from "@/util/axios";

export default {
  name: "Landing",
  components: { Banner, TrendingApps, Partners, Footer },
  data() {
    return {
      drawer: false,
      headerData: {},
      footerData: {},
      appData: [],
      isLoading: false,
    };
  },
  mounted() {
    this.getHeaderData();
    this.getFooterData();
  },
  methods: {
    getHeaderData() {
      this.isLoading = true;
      axios
        .get(`/header`)
        .then((response) => {
          const data = response.data.data;
          this.headerData = data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getFooterData() {
      this.isLoading = true;
      axios
        .get(`/footer`)
        .then((response) => {
          const data = response.data.data;
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
  },
};
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
