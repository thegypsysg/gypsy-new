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
    this.getGroups();
    this.getAppData();
  },
  methods: {
    getAppData() {
      // this.isLoading = true;
      axios
        .get(`/app`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          this.appData = data.map((item) => {
            return {
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
              views: item.app_views || "",
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
        .get(`/app/groups`)
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          // this.resource.groups = data.map((group) => {
          //   return {
          //     value: group.app_group_id,
          //     name: group.app_group_name,
          //   };
          // });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
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
