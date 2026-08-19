/**
 * auth.store.js
 *
 * Pinia store untuk state autentikasi.
 * Digunakan oleh: router/index.js (auth guard), Header.vue, komponen lain.
 */
import { defineStore } from "pinia";
import StorageService from "@/services/storage.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: StorageService.getToken() || null,
    userName: StorageService.getName() || null,
    userImage: StorageService.getUserImage() || null,
    isLoading: false,
  }),

  getters: {
    /** True jika user sudah login (ada token) */
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    /** Set token setelah login berhasil */
    setToken(token) {
      this.token = token;
      StorageService.setToken(token);
    },

    /** Set data user setelah login/fetch profile */
    setUserData({ name, image, lastLogin, gId }) {
      this.userName = name || this.userName;
      this.userImage = image || this.userImage;
      if (name) StorageService.setName(name);
      if (image) StorageService.setUserImage(image);
      if (lastLogin) StorageService.setLastLogin(lastLogin);
      if (gId) StorageService.setGId(gId);
    },

    /** Hapus semua state auth (logout) */
    clearAuth() {
      this.token = null;
      this.userName = null;
      this.userImage = null;
      StorageService.clearAuth();
    },
  },
});
