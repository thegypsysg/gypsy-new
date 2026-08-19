/**
 * location.service.js
 *
 * Service untuk data lokasi (country, city, town, geolocation).
 */
import http from "@/api/http";

const LocationService = {
  /** Daftar semua negara */
  getCountries: () => http.get("/country"),

  /** Daftar kota (opsional filter per negara) */
  getCities: () => http.get("/city"),

  /** Daftar kecamatan/town */
  getTowns: () => http.get("/town-list"),

  /** Daftar negara untuk trending apps (per category/trending ID) */
  getCountryMall: (trendingId = 1) =>
    http.get(`/app-country-list/1/${trendingId}`),

  /** Daftar kota untuk trending apps */
  getCityMall: (trendingId = 1) =>
    http.get(`/app-city-list/1/${trendingId}`),

  /** Reverse geocoding dari Nominatim (OpenStreetMap) */
  reverseGeocode: (lat, lon) =>
    http.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    ),
};

export default LocationService;
