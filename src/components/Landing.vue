<template>
  <div>
    <Banner :header-data="headerData" />
    <TrendingApps />
    <Partners />
    <hr />
    <Footer :header-data="headerData" :footer-data="footerData" />
  </div>
</template>

<script setup>
import Banner from "@/components/Banner.vue";
import TrendingApps from "@/components/TrendingApps.vue";
import Partners from "@/components/Partners.vue";
import Footer from "@/components/Footer.vue";
import axios from "@/util/axios";
</script>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      headerData: {},
      footerData: {},
      appData: [],
    };
  },
  mounted() {
    this.getHeaderData();
    this.getFooterData();
  },
  methods: {
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
    getFooterData() {
      // this.isLoading = true;
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
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
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
</style>
