/**
 * ui.store.js
 *
 * Pinia store untuk state UI global.
 * Mengelola: loading overlay, snackbar/toast notification, dan mobile navigation drawer.
 */
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    /** Global loading overlay */
    isLoading: false,

    /** Snackbar / toast notification */
    snackbar: {
      show: false,
      message: "",
      color: "success", // success | error | warning | info
      timeout: 3000,
    },

    /** Mobile navigation drawer */
    isDrawerOpen: false,
  }),

  actions: {
    setLoading(val) {
      this.isLoading = !!val;
    },

    showSnackbar(message, color = "success", timeout = 3000) {
      this.snackbar = {
        show: true,
        message,
        color,
        timeout,
      };
    },

    hideSnackbar() {
      this.snackbar.show = false;
    },

    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },

    setDrawer(val) {
      this.isDrawerOpen = !!val;
    },
  },
});

export default useUiStore;
