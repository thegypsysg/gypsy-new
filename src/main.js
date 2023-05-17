/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import router from "./router";

import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/brands.css";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import "aos/dist/aos.css";

const app = createApp(App);

registerPlugins(app);
app.use(router);
app.mount("#app");
