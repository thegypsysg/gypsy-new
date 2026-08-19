/**
 * storage.service.js
 *
 * Abstraksi localStorage untuk seluruh aplikasi.
 * Keuntungan:
 * - Semua key terdefinisi di satu tempat (tidak ada typo key)
 * - Mudah diganti implementasinya (misal: sessionStorage, cookies)
 * - Mudah di-mock untuk unit testing
 *
 * Digunakan oleh: auth.store.js, http.js, komponen-komponen
 */

const StorageService = {
  // --- Auth ---
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),

  getSocial: () => localStorage.getItem("social"),
  setSocial: (social) => localStorage.setItem("social", social),
  removeSocial: () => localStorage.removeItem("social"),

  // --- User Profile ---
  getName: () => localStorage.getItem("name"),
  setName: (name) => localStorage.setItem("name", name),

  getUserImage: () => localStorage.getItem("user_image"),
  setUserImage: (image) => localStorage.setItem("user_image", image),

  getLastLogin: () => localStorage.getItem("last_login"),
  setLastLogin: (date) => localStorage.setItem("last_login", date),

  getGId: () => localStorage.getItem("g_id"),
  setGId: (id) => localStorage.setItem("g_id", id),

  // --- Geolocation ---
  getLatitude: () => localStorage.getItem("latitude"),
  setLatitude: (lat) => localStorage.setItem("latitude", String(lat)),

  getLongitude: () => localStorage.getItem("longitude"),
  setLongitude: (lon) => localStorage.setItem("longitude", String(lon)),

  getCountryDevice: () => localStorage.getItem("countryDevice"),
  setCountryDevice: (country) => localStorage.setItem("countryDevice", country),

  // --- Helpers ---
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("social");
    localStorage.removeItem("name");
    localStorage.removeItem("user_image");
    localStorage.removeItem("last_login");
    localStorage.removeItem("g_id");
  },
};

export default StorageService;
