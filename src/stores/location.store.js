/**
 * location.store.js
 *
 * Pinia store untuk manajemen lokasi (country, city, geolocation).
 * Migrasi dari Vuex store.js (Sprint 1).
 */
import { defineStore } from "pinia";
import LocationService from "@/services/location.service";
import StorageService from "@/services/storage.service";

export const useLocationStore = defineStore("location", {
  state: () => ({
    activeTag: null,
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
  }),

  actions: {
    // Setters (pengganti Vuex mutations)
    setActiveTag(tag) {
      this.activeTag = tag;
    },
    setItemSelected(item) {
      this.itemSelected = item;
    },
    setItemSelectedComplete(item) {
      this.itemSelectedComplete = item;
    },
    setItemSelected2(item) {
      this.itemSelected2 = item;
    },
    setItemSelected2Complete(item) {
      this.itemSelected2Complete = item;
    },
    setSelectedTrending(item) {
      this.selectedTrending = item;
    },
    setSelectedCategory(item) {
      this.selectedCategory = item;
    },
    setCountry(item) {
      this.country = item;
    },
    setLongLat(item) {
      this.latitude = item.latitude;
      this.longitude = item.longitude;
    },
    setActiveCity(item) {
      this.activeCity = item;
    },
    setSelectedPlace(item) {
      this.selectedPlace = item;
    },
    setFooterData(item) {
      this.footerData = item;
    },

    // Async actions
    async getLongLat() {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              console.log("Geolocation berhasil:", lat, lon);
              StorageService.setLatitude(lat);
              StorageService.setLongitude(lon);
              this.setLongLat({ latitude: lat, longitude: lon });
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

    async setDefaultCountry() {
      console.log("Memulai setDefaultCountry...");
      if (!this.latitude || !this.longitude) {
        console.log("Latitude & Longitude belum tersedia, mencoba dari StorageService...");
        this.latitude = StorageService.getLatitude() || this.latitude;
        this.longitude = StorageService.getLongitude() || this.longitude;
      }
      if (!this.latitude || !this.longitude) {
        console.log("Masih kosong, memanggil getLongLat...");
        await this.getLongLat();
        if (!this.latitude || !this.longitude) {
          console.error("Latitude & Longitude tetap kosong. setDefaultCountry dibatalkan.");
          return;
        }
      }
      console.log(`Menggunakan Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
      try {
        const { data } = await LocationService.reverseGeocode(this.latitude, this.longitude);
        console.log("Response dari Nominatim API:", data);
        if (data.address) {
          const country = data.address.country;
          console.log("Negara yang ditemukan:", country);
          StorageService.setCountryDevice(country);
          const currentLocation = this.country.find(
            (item) => item.country_name === country
          );
          if (currentLocation) {
            console.log("Negara ditemukan di daftar:", currentLocation);
            this.setItemSelectedComplete(currentLocation);
            this.setItemSelected(currentLocation.title);
            this.setSelectedPlace(currentLocation.title);
          } else {
            console.warn("Negara tidak ditemukan dalam daftar, menggunakan default.");
            this.setItemSelectedComplete(this.country[0]);
            this.setItemSelected(this.country[0]?.title || "");
            this.setSelectedPlace(this.country[0]?.title || "");
          }
          console.log("setDefaultCountry berhasil dijalankan.");
        } else {
          console.warn("Alamat tidak ditemukan dalam response Nominatim.");
        }
      } catch (error) {
        console.error("Error di setDefaultCountry:", error);
      }
    },

    async getCityMall() {
      console.log("Memulai getCityMall...");
      if (this.country.length === 0) {
        console.error("getCityMall tidak bisa dijalankan karena country kosong.");
        return;
      }
      try {
        const trendingId = this.selectedTrending ? this.selectedTrending.id : "1";
        const { data } = await LocationService.getCityMall(trendingId);
        let filtering = this.country.map((item) => {
          const obj = { ...item, cities: [] };
          obj.cities = data.data.filter((city) => city.country_id === item.id);
          return obj;
        });
        this.country = filtering.filter((dataCountry) => dataCountry.cities.length > 0);
        const getCountry = this.country.find(
          (country) => country.title === this.selectedPlace
        );
        if (getCountry?.cities.length > 0) {
          this.setActiveCity(getCountry.cities[0]);
        }
        console.log("getCityMall selesai.");
      } catch (error) {
        console.error("Error di getCityMall:", error);
      }
    },

    async getCountryMall() {
      try {
        await this.getLongLat();
        console.log("getLongLat selesai.");
        const trendingId = this.selectedTrending ? this.selectedTrending.id : "1";
        const { data } = await LocationService.getCountryMall(trendingId);
        const allCountry = data.data
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
        this.setCountry(allCountry);
        console.log("setCountry selesai");
        await this.setDefaultCountry();
        console.log("setDefaultCountry selesai");
        await this.getCityMall();
        console.log("getCityMall selesai");
      } catch (error) {
        console.error("Error di getCountryMall:", error);
      }
    },
  },
});
