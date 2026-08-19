import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/partners",
    name: "PartnersOnBoarding",
    component: () => import("../views/PartnersOnBoarding.vue"),
  },
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
    meta: {
      locationSelection: true,
    },
  },
  {
    path: "/my-profile",
    component: () => import("../views/MyProfile.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/sign-in",
    name: "Welcome",
    component: () => import("../views/SignUpForm.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    component: () => import("../views/PrivacyTerms.vue"),
  },
  {
    path: "/our-terms",
    name: "OurTerms",
    component: () => import("../views/PrivacyTerms.vue"),
  },
  {
    path: "/sign-up-email",
    name: "SignUpEmail",
    component: () => import("../views/OTPEmailForm.vue"),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: "/signup-email",
    name: "Create Password",
    component: () => import("../views/CreatePasswordForm.vue"),
  },
  {
    path: "/try-email",
    name: "try email",
    component: () => import("../components/SignUp/EmailTemplate.vue"),
  },
  {
    path: "/social-sign-up",
    name: "Social Sign Up",
    component: () => import("../views/SocialLoginForm.vue"),
    beforeEnter(to, from, next) {
      const email = to.query.email || "";
      const name = to.query.name || "";
      const avatar = to.query.avatar || "";

      next((vm) => {
        if (vm) {
          vm.email = email;
          vm.name = name;
          vm.avatar = avatar;
        }
      });
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Auth Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Welcome", query: { redirect: to.fullPath } });
  } else if (guestOnly && authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
