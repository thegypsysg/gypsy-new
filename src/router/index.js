import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import MyProfile from "../views/MyProfile.vue";
import PrivacyTerms from "../views/PrivacyTerms.vue";
import SignUp from "../views/SignUpForm.vue";
import SocialLogin from "../views/SocialLoginForm.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/my-profile",
    component: MyProfile,
  },
  {
    path: "/sign-in",
    name: "Welcome",
    component: SignUp,
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    component: PrivacyTerms,
  },
  {
    path: "/our-terms",
    name: "OurTerms",
    component: PrivacyTerms,
  },
  {
    path: "/social-sign-up",
    name: "Social Sign Up",
    component: SocialLogin,
    beforeRouteEnter(to, from, next) {
      const email = to.query.email || "";
      const name = to.query.name || "";
      const avatar = to.query.avatar || "";

      // Anda dapat menyimpan nilai-nilai ini dalam state Vuex atau menggunakan mereka langsung dalam komponen
      next((vm) => {
        vm.email = email;
        vm.name = name;
        vm.avatar = avatar;
      });
    },
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
