# Analisis Codebase — The Gypsy SG

> **Tujuan**: Dokumen ini berisi hasil analisis mendalam terhadap struktur, kualitas kode, performa, dan keamanan project Gypsy, beserta rekomendasi refactoring menuju arsitektur yang modern, clean, dan scalable.

---

## 📐 Gambaran Umum Project

| Item | Detail |
|---|---|
| **Framework** | Vue 3 (Options API) |
| **UI Library** | Vuetify 3.x |
| **State Management** | Vuex 4 |
| **Build Tool** | Vite 3 |
| **HTTP Client** | Axios |
| **Routing** | Vue Router 4 |
| **Deployment** | cPanel (Static SPA) |
| **Backend** | Laravel REST API (`https://admin1.the-gypsy.sg/api`) |

---

## 📁 Struktur Direktori Saat Ini

```
src/
├── App.vue                  # Root component
├── main.js                  # App entry point
├── store.js                 # Vuex store (flat, satu file)
├── router/
│   └── index.js             # Router definition (satu file)
├── plugins/
│   ├── vuetify.js           # Vuetify setup
│   └── webfontloader.js     # Font loader
├── util/
│   ├── axios.js             # Axios instance
│   └── eventBus.js          # Custom event bus
├── assets/
│   ├── style/
│   │   ├── App.scss         # Global SCSS (535 baris)
│   │   ├── fonts.scss
│   │   └── responsive.scss
│   └── [34+ image files]    # Asset tanpa kompresi/optimasi
├── views/
│   ├── HomeView.vue         # Landing page orchestrator
│   ├── MyProfile.vue        # ⚠️ 2677 baris — God Component
│   ├── SignUpForm.vue        # Multi-step sign-up (mobile)
│   ├── OTPEmailForm.vue
│   ├── CreatePasswordForm.vue
│   ├── SocialLoginForm.vue
│   └── PrivacyTerms.vue
└── components/
    ├── Header.vue           # ⚠️ 1297 baris — God Component
    ├── Footer.vue           # 9069 bytes
    ├── TrendingApps.vue     # 728 baris
    ├── Banner.vue
    ├── Landing.vue
    ├── Partners.vue
    ├── ImageCropperDialog.vue
    ├── SignUp/              # Social sign-up flow
    │   ├── Welcome.vue      # 33752 bytes
    │   ├── PersonalDetails.vue
    │   ├── PersonalDetailSocials.vue  # ⚠️ 1073 baris
    │   ├── AdditionalData.vue
    │   ├── SelectSkills.vue
    │   ├── ResultRegister.vue
    │   └── EmailTemplate.vue
    ├── SignUpEmail/         # Email sign-up flow
    │   ├── PersonalDetailEmail.vue    # ⚠️ 1047 baris
    │   ├── OTPEmail.vue
    │   ├── AdditionalSecurity.vue
    │   └── ResultRegister.vue
    ├── SignUpMobile/        # Mobile sign-up flow
    │   ├── PersonalDetailMobile.vue   # ⚠️ ~1000 baris
    │   ├── AdditionalSecurity.vue
    │   └── ResultRegister.vue
    └── CreatePassword/      # Create password flow
        ├── AdditionalSecurity.vue
        └── ResultRegister.vue
```

---

## 🔴 Masalah Kritis

### 1. God Components — Violasi Single Responsibility Principle (SRP)

| File | Baris | Masalah |
|---|---|---|
| `views/MyProfile.vue` | **2677 baris** | Menangani UI, state, validasi, semua API calls, dan logika bisnis sekaligus |
| `components/Header.vue` | **1297 baris** | Mengurus navbar, data fetching, auth redirect, event listeners, dan logika routing |
| `SignUp/PersonalDetailSocials.vue` | **1073 baris** | Form logic, image cropper, API call, dan state — semua dalam satu file |
| `SignUpEmail/PersonalDetailEmail.vue` | **1047 baris** | Identik dengan PersonalDetailSocials tapi untuk alur email |

**Dampak**: Sulit di-test, sulit dipahami, coupling tinggi, sangat rentan bug saat dimodifikasi.

---

### 2. Duplikasi Kode Massif — Violasi DRY Principle

Terdapat **4 folder** untuk alur sign-up yang berbeda (`SignUp/`, `SignUpEmail/`, `SignUpMobile/`, `CreatePassword/`) yang masing-masing berisi komponen hampir identik:

- `AdditionalSecurity.vue` ada di 3 folder (SignUpEmail, SignUpMobile, CreatePassword) dengan ukuran nyaris sama (~12.4 KB)
- `ResultRegister.vue` ada di 4 folder yang berbeda
- `PersonalDetail*.vue` di 3 folder berbeda dengan 70-80% kode yang identik (image upload, form validation, API calls)

```
# Perbandingan ukuran file duplikat:
SignUpEmail/AdditionalSecurity.vue    -> 12,484 bytes
SignUpMobile/AdditionalSecurity.vue   -> 12,488 bytes  (HAMPIR IDENTIK)
CreatePassword/AdditionalSecurity.vue -> 12,484 bytes  (HAMPIR IDENTIK)
```

**Dampak**: Bug yang diperbaiki di satu komponen harus diperbaiki manual di semua duplikat. Maintenance nightmare.

---

### 3. Tidak Ada Service Layer — Violasi Separation of Concerns

Semua API calls langsung dilakukan di dalam komponen Vue, tersebar di **17+ file** berbeda:

```javascript
// Contoh di Header.vue (baris 917-935):
logout() {
  const token = localStorage.getItem("token");
  axios.get(`/gypsy-logout`, {
    headers: { Authorization: `Bearer ${token}` }
  })...
}

// Contoh di MyProfile.vue (baris 1686-1721):
verifyEmail() {
  const token = localStorage.getItem("token");
  axios.post(`/gypsy/send-verification-email`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })...
}
```

**Tidak ada**: Service class, repository pattern, atau abstraksi API. Perubahan endpoint atau auth strategy membutuhkan edit di puluhan tempat.

---

### 4. State Management Tidak Memadai

`store.js` hanya berisi **1 state property** (`activeTag`) dan **1 mutation**:

```javascript
// store.js — hampir tidak ada manfaatnya
export default createStore({
  state: { activeTag: null },
  mutations: {
    setActiveTag(state, tag) { state.activeTag = tag; }
  }
});
```

Padahal state krusial seperti **user data**, **token auth**, **app data**, dsb. tersimpan langsung di `localStorage` dan diakses secara raw dari banyak komponen tanpa enkapsulasi.

---

### 5. Keamanan (Security) — Beberapa Titik Rawan

#### a. Token Authentication yang Tidak Terenkapsulasi
```javascript
// Pola ini diulang di 15+ tempat tanpa abstraksi:
const token = localStorage.getItem("token");
axios.get(`/endpoint`, {
  headers: { Authorization: `Bearer ${token}` }
});
```
Token diambil secara langsung dari localStorage tanpa validasi, pengecekan expiry, atau abstraksi. Jika pola ini berubah, semua file harus diperbarui.

#### b. Token dari URL Query Parameter Disimpan ke localStorage
```javascript
// Header.vue — tokenProvider computed property (baris 728-738)
const tokenParam = url.searchParams.get("token");
if (tokenParam) {
  localStorage.setItem("token", tokenParam); // Langsung disimpan!
}
```
Token dari URL dapat terekam di browser history, server logs, dan referrer headers — ini adalah vulnerability yang dikenal (CWE-598).

#### c. Hardcoded URL dan Config di Multiple Places
```javascript
// main.js
app.config.globalProperties.$fileURL = "https://admin1.the-gypsy.sg/img/app/";
app.config.globalProperties.$appId = 1;

// axios.js
axios.defaults.baseURL = "https://admin1.the-gypsy.sg/api";

// Header.vue
const externalURL = `https://the-syringe.com?token=${this.tokenProvider}`;
const externalURL = `https://mall-e.in?token=${this.tokenProvider}`;
```
Tidak ada environment variable (`.env`) yang digunakan dengan benar.

#### d. Error Handling Hanya console.log
```javascript
// Pattern ini ada di 17+ file:
.catch((error) => {
  console.log(error); // Info error terekspos di console browser
});
```
Console.log aktif di production mengekspos detail error dan stack trace ke end user.

#### e. Route Guard Tidak Berfungsi
Router memiliki `beforeRouteEnter` yang salah implementasi:
```javascript
// router/index.js — ini tidak akan berfungsi:
beforeRouteEnter(to, from, next) { ... } // Seharusnya beforeEnter sebagai property route
```
Tidak ada route guard untuk `/my-profile` yang seharusnya memerlukan autentikasi.

---

### 6. Performa — Beberapa Bottleneck Kritis

#### a. No Lazy Loading Routes
```javascript
// router/index.js — semua komponen di-import langsung (eager loading):
import Home from "../views/HomeView.vue";
import MyProfile from "../views/MyProfile.vue";
import PrivacyTerms from "../views/PrivacyTerms.vue";
// ...dst
```
Semua views di-bundle menjadi satu chunk. Initial load time sangat lambat.

#### b. Asset Images Tidak Dioptimasi
Folder `assets/` mengandung gambar besar:
```
gypsy-11.jpg  -> 926,602 bytes  (906 KB!)
gypsy-7.jpg   -> 1,049,713 bytes (1 MB!)
gypsy-10.jpg  -> 586,757 bytes
header.png    -> 868,911 bytes
partner-2.png -> 579,389 bytes
partner-3.png -> 502,004 bytes
```
Total aset gambar raw: **~9 MB**. Tidak ada WebP conversion, srcset, atau lazy loading.

#### c. Duplikasi Import Dependencies
```javascript
// index.html: flag-icons dari CDN
<link href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.11.0/css/flag-icons.min.css" />

// main.js: flag-icons juga dari node_modules
import "/node_modules/flag-icons/css/flag-icons.min.css";
```
Flag icons CSS dimuat **dua kali** — dari CDN dan dari bundle Vite.

#### d. Dependency Bloat
Package.json memiliki banyak package redundan atau tidak digunakan:
- `flag-icon-css` AND `flag-icons` (keduanya ada, versi berbeda)
- `vue-country-code-select`, `vue3-country-intl`, `vue3-country-region-select`, `vue-phone-number-input`, `maz-ui` — banyak library phone/country yang kemungkinan tidak semuanya digunakan aktif
- `moment` AND `moment-timezone` (bisa diganti dengan `date-fns` yang lebih ringan, atau native Intl API)
- `animejs` dan `aos` — keduanya ada, tidak jelas mana yang aktif dipakai
- `vue-loader` — tidak perlu untuk Vite (hanya untuk webpack)

#### e. setInterval Tanpa Cleanup
```javascript
// Header.vue — created() lifecycle:
setInterval(this.updateTime, 1000); // Tidak ada clearInterval!
```
Interval timer tidak pernah dibersihkan, menyebabkan memory leak saat component di-unmount.

---

### 7. Kualitas Kode — Code Smell dan Bad Practices

#### a. Seluruh Kode Menggunakan Options API
Tidak ada satu pun komponen yang menggunakan **Composition API** (`<script setup>`), padahal Vue 3 sangat menganjurkan pola ini untuk reusability dan type-safety yang lebih baik.

#### b. Anti-pattern: Membuat App Instance di eventBus
```javascript
// util/eventBus.js
const app = createApp({}); // Membuat Vue app instance KEDUA hanya untuk event bus!
const eventBus = (app.config.globalProperties.$eventBus = {});
```
Ini adalah anti-pattern serius. Package `mitt` sudah diinstal tapi tidak digunakan. Solusi yang benar adalah menggunakan `mitt` langsung.

#### c. Ratusan Inline Style
Hampir semua komponen menggunakan inline style secara masif:
```html
<!-- Contoh dari MyProfile.vue -->
<div style="width: 170px; height: 120px; border-radius: 20px">
<div style="border: 1px solid #ced4da; border-radius: 0.25rem">
<div style="gap: 5px">
<!-- ...ratusan contoh serupa di seluruh codebase -->
```
Ini membuat theming, dark mode, dan maintainability sangat sulit.

#### d. Banyak Kode yang Dikomen Tapi Tidak Dihapus
Puluhan blok kode yang dikomen ada di hampir semua file besar, menambah noise yang tidak perlu.

#### e. ESLint Dikonfigurasi Tapi Banyak eslint-disable
```javascript
// Pola ini muncul di 15+ file:
.catch((error) => {
  // eslint-disable-next-line
  console.log(error);
});
```
ESLint ada tapi efektivitasnya dinetralisir dengan banyak disable comment.

#### f. process.env.BASE_URL di Vite
```javascript
// router/index.js
history: createWebHistory(process.env.BASE_URL)
```
`BASE_URL` tidak didefinisikan sehingga bernilai `undefined`. Seharusnya menggunakan `import.meta.env.BASE_URL`.

#### g. Versi Dependencies Sangat Lama

| Package | Versi Saat Ini | Versi Terbaru |
|---|---|---|
| Vite | 3.1.9 | 6.x |
| `@vitejs/plugin-vue` | 3.0.3 | 5.x |
| Vue | 3.2.38 | 3.5.x |
| Vuetify | 3.5.8 | 3.8.x |
| Vuex | 4.1.0 | (pertimbangkan Pinia) |
| ESLint | 8.x | 9.x (flat config) |

---

## 🟡 Masalah Sedang

### 8. Tidak Ada Testing
Tidak ada satu pun file test di seluruh project. Tidak ada Jest, Vitest, Cypress, atau Playwright.

### 9. TypeScript Tidak Digunakan
Semua kode dalam JavaScript murni tanpa type checking. Potensi bug runtime yang bisa dicegah dengan TypeScript sangat tinggi.

### 10. Tidak Ada Error Boundary
Tidak ada global error handling (`app.config.errorHandler`) atau error boundary component. Jika satu API gagal, tidak ada graceful fallback.

### 11. Aksesibilitas (a11y) Tidak Diperhatikan
- Tidak ada `aria-label` pada tombol icon-only
- `<h1>` di TrendingApps.vue digunakan dengan `align="center"` (atribut HTML deprecated)
- Banyak elemen klik yang bukan `<button>` (menggunakan `<span @click>`)

### 12. SEO Sangat Minimal
- `index.html` hanya punya `<title>Gypsy</title>` tanpa meta description
- Tidak ada Open Graph tags
- Tidak ada structured data

---

## ✅ Yang Sudah Baik

- **Vuetify 3**: Pilihan UI library yang tepat, konsisten digunakan
- **Vite**: Build tool modern yang sudah tepat
- **Vue Router 4**: Versi yang benar untuk Vue 3
- **Scroll behavior**: Router sudah memiliki `scrollBehavior` yang baik
- **SCSS**: Penggunaan SCSS sudah terstruktur (App.scss, fonts.scss, responsive.scss)
- **Auto-animate**: Penggunaan `@formkit/auto-animate` untuk list animation adalah pilihan yang baik
- **Transitions**: Ada page transition dengan `<Transition name="page-opacity">`
- **`.editorconfig`**: Sudah ada konfigurasi editor standar

---

## 🎯 Rekomendasi Refactoring

### Fase 1: Fondasi dan Tooling (Prioritas Tinggi)

#### 1.1 Upgrade Dependencies
```bash
# Upgrade ke versi terbaru yang stabil
npm install vite@latest @vitejs/plugin-vue@latest
npm install vue@latest vue-router@latest
npm install vuetify@latest vite-plugin-vuetify@latest
# Ganti Vuex dengan Pinia (state management modern Vue 3)
npm install pinia
npm remove vuex
# Ganti moment dengan date-fns (lebih ringan, tree-shakable)
npm install date-fns
npm remove moment moment-timezone
# Bersihkan duplikat package
npm remove flag-icon-css vue-loader vue-page-transition
```

#### 1.2 Setup Environment Variables
Buat file `.env`:
```env
VITE_API_BASE_URL=https://admin1.the-gypsy.sg/api
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
VITE_APP_ID=1
```

#### 1.3 Pindah ke TypeScript
```bash
npm install -D typescript vue-tsc @types/node
```
Rename secara bertahap: `*.js` → `*.ts`, komponen Vue gunakan `<script setup lang="ts">`.

#### 1.4 Setup Vitest untuk Testing
```bash
npm install -D vitest @vue/test-utils happy-dom @vitest/coverage-v8
```

---

### Fase 2: Arsitektur — Service Layer dan Store

#### 2.1 Struktur Direktori Target
```
src/
├── api/                     # [NEW] Service layer
│   ├── http.ts              # Axios instance + interceptors
│   ├── auth.service.ts      # Auth API calls
│   ├── user.service.ts      # User API calls
│   ├── app.service.ts       # App/trending API calls
│   └── location.service.ts  # Country/city/town API calls
├── stores/                  # [REPLACE] Vuex -> Pinia
│   ├── auth.store.ts        # Auth state (token, user)
│   ├── app.store.ts         # App listings state
│   └── ui.store.ts          # UI state (activeTag, etc.)
├── composables/             # [NEW] Reusable logic
│   ├── useAuth.ts           # Auth logic
│   ├── useResponsive.ts     # Screen size detection
│   ├── useImageCropper.ts   # Image crop/upload logic
│   └── useForm.ts           # Form validation
├── components/
│   ├── common/              # [NEW] Shared/reusable components
│   │   ├── AppButton.vue
│   │   ├── AppInput.vue
│   │   ├── PhoneInput.vue
│   │   ├── CountrySelect.vue
│   │   ├── ImageUploader.vue # Diekstrak dari 4+ komponen
│   │   └── OtpInput.vue
│   ├── layout/              # [NEW] Layout components
│   │   ├── AppHeader.vue    # Dipecah dari Header.vue (1297 baris)
│   │   ├── AppFooter.vue
│   │   └── AppNavbar.vue
│   ├── auth/                # [REFACTOR] Dari SignUp/Email/Mobile/CreatePassword
│   │   └── steps/
│   │       ├── WelcomeStep.vue
│   │       ├── PersonalDetailStep.vue  # Unified dari 3 versi
│   │       ├── OtpVerificationStep.vue
│   │       ├── SecurityStep.vue        # Unified AdditionalSecurity
│   │       └── SuccessStep.vue         # Unified ResultRegister
│   ├── home/                # Home-related components
│   │   ├── HeroBanner.vue
│   │   ├── TrendingApps.vue
│   │   └── PartnerSection.vue
│   └── profile/             # [SPLIT dari MyProfile.vue 2677 baris]
│       ├── ProfileAvatar.vue
│       ├── BasicInfoForm.vue
│       ├── LocationForm.vue
│       ├── SecurityForm.vue
│       └── SocialLinksForm.vue
├── router/
│   └── index.ts             # Dengan lazy loading dan auth guards
├── types/                   # [NEW] TypeScript interfaces
│   ├── user.types.ts
│   ├── app.types.ts
│   └── api.types.ts
└── utils/                   # [RENAME dari util/]
    ├── date.ts              # Date formatting helpers
    ├── format.ts            # String/number formatting
    └── validators.ts        # Form validation rules
```

#### 2.2 HTTP Client yang Benar
```typescript
// src/api/http.ts
import axios from "axios";
import router from "@/router";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor — auto-attach token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
    return Promise.reject(error);
  }
);

export default http;
```

#### 2.3 Auth Store dengan Pinia
```typescript
// src/stores/auth.store.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return { token, user, isAuthenticated, setToken, logout };
});
```

---

### Fase 3: Komponen — Migasi ke Composition API

#### 3.1 Contoh Composable useResponsive
```typescript
// src/composables/useResponsive.ts
import { ref, onMounted, onUnmounted, computed } from "vue";

export function useResponsive() {
  const windowWidth = ref(window.innerWidth);

  const onResize = () => { windowWidth.value = window.innerWidth; };
  onMounted(() => window.addEventListener("resize", onResize));
  onUnmounted(() => window.removeEventListener("resize", onResize));

  const isSmall = computed(() => windowWidth.value < 640);
  const isMedium = computed(() => windowWidth.value < 960);

  return { windowWidth, isSmall, isMedium };
}
```
Composable ini menggantikan logika `handleResize` dan `screenWidth` yang saat ini **diduplikasi di 5+ komponen**.

#### 3.2 Event Bus yang Benar dengan Mitt
```typescript
// src/utils/eventBus.ts
import mitt from "mitt";

type Events = {
  changeHeaderImage: string;
  getHeaderUserData: void;
  changeHeaderWelcome: string;
  scrollToCardSection: void;
};

export const eventBus = mitt<Events>();
```
Menggantikan anti-pattern `createApp({})` di `eventBus.js` yang sekarang.

---

### Fase 4: Router — Lazy Loading dan Auth Guards

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Fix: bukan process.env
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomeView.vue"), // Lazy loaded
    },
    {
      path: "/my-profile",
      component: () => import("@/views/MyProfile.vue"), // Lazy loaded
      meta: { requiresAuth: true }, // [NEW] Auth guard
    },
    {
      path: "/sign-in",
      component: () => import("@/views/SignInView.vue"), // Lazy loaded
      meta: { guestOnly: true },
    },
  ],
});

// Global navigation guard
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: "/sign-in" };
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { path: "/" };
  }
});

export default router;
```

---

### Fase 5: Performa

#### 5.1 Optimasi Gambar
- Konversi semua `.png`/`.jpg` ke `.webp` (estimasi penghematan 60-80%)
- Tambahkan lazy loading pada `v-img` yang tidak di-above-the-fold
- Gunakan `srcset` untuk responsive images

#### 5.2 Vite Build Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vuetify": ["vuetify"],
          "vue-vendor": ["vue", "vue-router", "pinia"],
        }
      }
    }
  }
});
```

#### 5.3 Fix Memory Leak setInterval
```typescript
// Header.vue — setelah direfactor ke Composition API:
const intervalId = setInterval(updateTime, 1000);
onUnmounted(() => clearInterval(intervalId)); // Wajib!
```

---

### Fase 6: Keamanan — Perbaikan

| Issue | Solusi |
|---|---|
| Token dari URL disimpan ke localStorage | Proses token dari URL di server/backend, atau hapus dari URL setelah dipakai dengan `history.replaceState` |
| `console.log` di production | Gunakan conditional logging: `if (import.meta.env.DEV) console.log(...)` |
| Error detail terekspos | Implementasikan `app.config.errorHandler` global yang user-friendly |
| Tidak ada route guard | Implementasikan `beforeEach` guard di router (lihat Fase 4) |
| Hardcoded URLs | Pindah semua ke `.env` file |
| `localStorage` tanpa enkapsulasi | Buat `StorageService` class sebagai abstraksi |

---

## 📊 Rangkuman Prioritas

| # | Item | Dampak | Effort | Prioritas |
|---|---|---|---|---|
| 1 | Perbaiki security token dari URL | Tinggi | Rendah | 🔴 Segera |
| 2 | Setup `.env` file untuk config | Tinggi | Rendah | 🔴 Segera |
| 3 | Fix memory leak `setInterval` | Medium | Rendah | 🔴 Segera |
| 4 | Fix router `process.env` ke `import.meta.env` | Medium | Rendah | 🔴 Segera |
| 5 | Hapus duplikat CSS import flag-icons | Rendah | Rendah | 🔴 Segera |
| 6 | Buat Service Layer (`src/api/`) | Sangat Tinggi | Sedang | 🟠 Sprint 1 |
| 7 | Migrasi Vuex ke Pinia | Tinggi | Sedang | 🟠 Sprint 1 |
| 8 | Lazy loading semua routes | Tinggi | Rendah | 🟠 Sprint 1 |
| 9 | Extract composables (useResponsive, useImageCropper) | Tinggi | Sedang | 🟠 Sprint 1 |
| 10 | Pecah `MyProfile.vue` (2677 baris) | Tinggi | Tinggi | 🟡 Sprint 2 |
| 11 | Pecah `Header.vue` (1297 baris) | Tinggi | Tinggi | 🟡 Sprint 2 |
| 12 | Unifikasi komponen SignUp yang duplikat | Sangat Tinggi | Tinggi | 🟡 Sprint 2 |
| 13 | Implementasikan Auth guard di router | Tinggi | Rendah | 🟡 Sprint 2 |
| 14 | Migrasi ke Composition API (`<script setup>`) | Sangat Tinggi | Sangat Tinggi | 🟢 Sprint 3 |
| 15 | Upgrade ke TypeScript | Tinggi | Sangat Tinggi | 🟢 Sprint 3 |
| 16 | Optimasi gambar (WebP conversion) | Tinggi | Sedang | 🟢 Sprint 3 |
| 17 | Setup Vitest untuk unit testing | Tinggi | Tinggi | 🟢 Sprint 3 |
| 18 | Perbaikan aksesibilitas dan SEO | Medium | Sedang | 🔵 Sprint 4 |

---

## 📏 Metrik Kode Saat Ini vs Target

| Metrik | Saat Ini | Target |
|---|---|---|
| File terpanjang | 2677 baris (`MyProfile.vue`) | < 300 baris per file |
| Duplikasi service code | 15+ komponen memanggil axios langsung | 1 centralized service layer |
| Lazy loaded routes | 0 dari 9 routes | 100% lazy loaded |
| Test coverage | 0% | >= 60% |
| TypeScript | 0% | 100% |
| Bundle size (estimasi) | ~5-8MB unoptimized | < 2MB |
| Gambar tidak dioptimasi | ~9MB total | < 2MB (WebP) |
| Reusable composables | 0 | >= 10 |
| Komponen > 500 baris | 7 komponen | 0 |
| Komponen duplikat | 3-4 set duplikat | 0 (unified) |

---

*Dokumen ini dibuat berdasarkan analisis codebase pada tanggal 17 Agustus 2026.*
