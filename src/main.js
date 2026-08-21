/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { createApp } from "vue";
// Components
import App from "./App.vue";
import router from "./router";

import "maz-ui/css/main.css";
// import "@/css/path_to_your_main_file.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/brands.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

// Composables

// Plugins
import "aos/dist/aos.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(autoAnimatePlugin);
app.mount("#app");
