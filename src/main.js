/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/brands.css";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import "aos/dist/aos.css";

const app = createApp(App);
app.config.globalProperties.$fileURL = "https://admin1.the-gypsy.sg/img/app/";

registerPlugins(app);
app.use(router);
app.use(store);
app.use(autoAnimatePlugin);
app.mount("#app");
