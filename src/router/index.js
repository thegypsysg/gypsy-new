import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import SignUp from "../views/SignUpForm.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: SignUp,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
