// store.js
import { createStore } from "vuex";
import axios from "@/util/axios";

export default createStore({
  state: {
    activeTag: null, // Tag yang aktif
    itemSelected: "---Select Country---",
    itemSelectedComplete: null,
    itemSelected2: "---Select City---",
    itemSelected2Complete: null,
    selectedTrending: null,
    selectedCategory: {
      property_type_id: 1,
    },
    latitude: "",
    longitude: "",
    country: [],
    selectedPlace: "",
    activeCity: null,
    footerData: null,
  },
  mutations: {
    setActiveTag(state, tag) {
      state.activeTag = tag;
    },
    setItemSelected(state, item) {
      state.itemSelected = item;
    },
    setItemSelectedComplete(state, item) {
      state.itemSelectedComplete = item;
    },
    setItemSelected2(state, item) {
      state.itemSelected2 = item;
    },
    setItemSelected2Complete(state, item) {
      state.itemSelected2Complete = item;
    },
    setSelectedTrending(state, item) {
      state.selectedTrending = item;
    },
    setSelectedCategory(state, item) {
      state.selectedCategory = item;
    },
    setCountry(state, item) {
      state.country = item;
    },
    setLongLat(state, item) {
      state.latitude = item.latitude;
      state.longitude = item.longitude;
    },
    setActiveCity(state, item) {
      state.activeCity = item;
    },
    setSelectedPlace(state, item) {
      state.selectedPlace = item;
    },
    setFooterData(state, item) {
      state.footerData = item;
    },
  },
  actions: {
    async getLongLat({ commit }) {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              let lat = position.coords.latitude;
              let lon = position.coords.longitude;

              console.log("Geolocation berhasil:", lat, lon);

              // Simpan ke state dan localStorage
              localStorage.setItem("latitude", lat);
              localStorage.setItem("longitude", lon);
              commit("setLongLat", { latitude: lat, longitude: lon });
            },
            (error) => {
              console.error("Error geolocation:", error);
            }
          );
        } catch (error) {
          console.error("Error di getLongLat:", error);
        }
      } else {
        console.error("Geolocation tidak didukung di perangkat ini.");
      }
    },
    async setDefaultCountry({ commit, state, dispatch }) {
      console.log("Memulai setDefaultCountry...");

      // Cek jika latitude & longitude kosong, coba ambil dari localStorage
      if (!state.latitude || !state.longitude) {
        console.log(
          "Latitude & Longitude belum tersedia, mencoba mengambil dari localStorage..."
        );
        state.latitude = localStorage.getItem("latitude") || state.latitude;
        state.longitude = localStorage.getItem("longitude") || state.longitude;
      }

      // Jika masih kosong, panggil getLongLat untuk mendapatkan koordinat
      if (!state.latitude || !state.longitude) {
        console.log(
          "Latitude & Longitude masih kosong, memanggil getLongLat..."
        );
        await dispatch("getLongLat");

        // Cek ulang setelah getLongLat dipanggil
        if (!state.latitude || !state.longitude) {
          console.error(
            "Latitude & Longitude tetap kosong setelah retry. setDefaultCountry dibatalkan."
          );
          return;
        }
      }

      console.log(
        `Menggunakan Latitude: ${state.latitude}, Longitude: ${state.longitude}`
      );

      let link = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${state.latitude}&lon=${state.longitude}`;

      try {
        const { data } = await axios.get(link);
        console.log("Response dari Nominatim API:", data);

        if (data.address) {
          let country = data.address.country;
          console.log("Negara yang ditemukan:", country);

          // Simpan negara ke localStorage agar tidak perlu fetch ulang di lain waktu
          localStorage.setItem("countryDevice", country);

          // Cari negara di daftar negara yang sudah di-fetch sebelumnya
          const currentLocation = state.country.find(
            (data) => data.country_name === country
          );

          if (currentLocation) {
            console.log("Negara ditemukan di daftar:", currentLocation);
            commit("setItemSelectedComplete", currentLocation);
            commit("setItemSelected", currentLocation.title);
            commit("setSelectedPlace", currentLocation.title);
          } else {
            console.warn(
              "Negara tidak ditemukan dalam daftar country, menggunakan default."
            );
            commit("setItemSelectedComplete", state.country[0]);
            commit("setItemSelected", state.country[0]?.title || "");
            commit("setSelectedPlace", state.country[0]?.title || "");
          }

          console.log("setDefaultCountry berhasil dijalankan.");
        } else {
          console.warn("Alamat tidak ditemukan dalam response Nominatim.");
        }
      } catch (error) {
        console.error("Error di setDefaultCountry:", error);
      }
    },
    async getCityMall({ commit, state }) {
      console.log("Memulai getCityMall...");

      if (state.country.length === 0) {
        console.error(
          "getCityMall tidak bisa dijalankan karena state.country kosong."
        );
        return;
      }

      let link = `/app-city-list/1/${
        state.selectedTrending ? state.selectedTrending.id : "1"
      }`;

      try {
        const { data } = await axios.get(link);

        let filtering = state.country.map((item) => {
          let obj = { ...item, cities: [] };
          obj.cities = data.data.filter((city) => city.country_id === item.id);
          return obj;
        });

        state.country = filtering.filter(
          (dataCountry) => dataCountry.cities.length > 0
        );

        let getCountry = state.country.find(
          (country) => country.title === state.selectedPlace
        );

        if (getCountry?.cities.length > 0) {
          commit("setActiveCity", getCountry.cities[0]);
        }
        console.log("getCityMall selesai.");
      } catch (error) {
        console.error("Error di getCityMall:", error);
      }
    },
    async getCountryMall({ commit, dispatch, state }) {
      let link = `/app-country-list/1/${
        state.selectedTrending ? state.selectedTrending.id : "1"
      }`;

      try {
        // Tunggu getLongLat selesai agar latitude & longitude terisi
        await dispatch("getLongLat");
        console.log("getLongLat selesai, Latitude & Longitude sudah tersedia.");

        const { data } = await axios.get(link);

        let allCountry = data.data
          .sort((a, b) => b.property_count - a.property_count)
          .map((country) => ({
            ...country,
            id: country.country_id,
            title: country.country_name,
            count: country.property_count,
            oneCity: country.one_city == "Y",
            path: "#",
            flag: country.flag,
            cities: [],
          }));

        commit("setCountry", allCountry);
        console.log("setCountry selesai");

        // Panggil setDefaultCountry hanya jika latitude & longitude ada
        await dispatch("setDefaultCountry");
        console.log("setDefaultCountry selesai");

        await dispatch("getCityMall");
        console.log("getCityMall selesai");
      } catch (error) {
        console.error("Error di getCountryMall:", error);
      }
    },
  },
});
