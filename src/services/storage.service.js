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
  getToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const expiry = localStorage.getItem("token_expiry");
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
      return null;
    }
    return token;
  },
  setToken: (token, expiryMs = 24 * 60 * 60 * 1000) => {
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", String(Date.now() + expiryMs));
  },
  removeToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
  },

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

  getGypsyId: () => localStorage.getItem("gypsy_id"),
  setGypsyId: (id) => localStorage.setItem("gypsy_id", String(id)),

  getEmail: () => localStorage.getItem("email"),
  setEmail: (email) => localStorage.setItem("email", email || ""),

  getMobile: () => localStorage.getItem("mobile"),
  setMobile: (mobile) => localStorage.setItem("mobile", mobile || ""),

  getAppId: () => localStorage.getItem("app_id"),
  setAppId: (id) => localStorage.setItem("app_id", String(id || "")),

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
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("social");
    localStorage.removeItem("name");
    localStorage.removeItem("user_image");
    localStorage.removeItem("last_login");
    localStorage.removeItem("g_id");
    localStorage.removeItem("gypsy_id");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile");
  },
};

export default StorageService;
