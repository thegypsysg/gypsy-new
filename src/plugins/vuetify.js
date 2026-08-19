// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

/**
 * Design Tokens — Gypsy SG Brand Colors
 */
const gypsyTheme = {
  dark: false,
  colors: {
    // Brand Colors
    primary: "#FF6B35",
    secondary: "#1A1A2E",
    accent: "#E94560",

    // UI Colors
    background: "#FFFFFF",
    surface: "#F8F8F8",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "gypsyTheme",
    themes: {
      gypsyTheme,
    },
  },
  defaults: {
    VBtn: {
      style: "text-transform: none;",
    },
  },
});
