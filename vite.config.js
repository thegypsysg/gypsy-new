// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: ["legacy-js-api", "import"],
        quietDeps: true,
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vuetify")) {
              return "vuetify";
            }
            if (id.includes("maz-ui")) {
              return "maz-ui";
            }
            if (
              id.includes("@fortawesome") ||
              id.includes("@mdi") ||
              id.includes("flag-icons")
            ) {
              return "icons";
            }
            if (
              id.includes("vue3-country-intl") ||
              id.includes("vue-country-code-select") ||
              id.includes("vue3-country-region-select") ||
              id.includes("libphonenumber-js")
            ) {
              return "country-phone";
            }
            if (id.includes("cropperjs") || id.includes("vue-cropperjs")) {
              return "cropper";
            }
            if (id.includes("animejs") || id.includes("aos")) {
              return "animations";
            }
            if (
              id.includes("vue") ||
              id.includes("vue-router") ||
              id.includes("pinia") ||
              id.includes("axios")
            ) {
              return "vendor";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
