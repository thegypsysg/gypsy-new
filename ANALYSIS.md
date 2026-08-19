# Analisis Codebase — The Gypsy SG
# Edisi Template & Boilerplate

> **Tujuan Revisi**: Dokumen ini diperbarui dengan fokus utama untuk menjadikan project ini sebagai **template/boilerplate** yang bersih, maintainable, mudah dipahami, dan mudah dimodifikasi untuk project-project mendatang. Analisis mencakup pertimbangan mendalam tentang **Vue vs Nuxt** dalam konteks **deployment cPanel**.

> **Tanggal Analisis**: 19 Agustus 2026

---

## Gambaran Umum Project

| Item | Detail |
|---|---|
| **Framework** | Vue 3 (Options API dominan, 1 file pakai script setup) |
| **UI Library** | Vuetify 3.5.8 |
| **State Management** | Vuex 4.1.0 (flat, 1 file) |
| **Build Tool** | Vite 3.1.9 (sangat outdated, versi terbaru: 6.x) |
| **HTTP Client** | Axios 1.4.0 |
| **Routing** | Vue Router 4.2.0 |
| **Deployment** | cPanel (Static SPA via dist/ folder) |
| **Backend** | Laravel REST API (https://admin1.the-gypsy.sg/api) |
| **CSS** | SCSS (global App.scss, responsive.scss, fonts.scss) |
| **Event Bus** | Custom implementation (anti-pattern) + mitt terinstal tapi tidak dipakai |

---

## Keputusan Strategis: Vue SPA vs Nuxt — Analisis untuk cPanel

> Ini adalah keputusan paling krusial sebelum mulai refactoring sebagai template.

cPanel adalah shared hosting tradisional. Project ini saat ini di-build dengan `vite build` menghasilkan folder `dist/` yang di-upload ke `public_html/` — ini adalah **mode SPA murni**.

### Pilihan A: Tetap Vue SPA (Rekomendasi)

| Aspek | Detail |
|---|---|
| Kompatibilitas cPanel | 100% — hanya file statis HTML/CSS/JS |
| Kompleksitas deploy | Sangat sederhana: FTP/FileManager upload |
| Server requirement | Tidak perlu Node.js di server |
| SEO | Buruk secara native — butuh workaround (prerender) |
| Cocok untuk | Web app yang tidak butuh SEO kuat (dashboard, portal member, app) |

### Pilihan B: Nuxt 3 (Tidak Direkomendasikan untuk cPanel saat ini)

| Aspek | Detail |
|---|---|
| Mode SSR | Butuh Node.js berjalan di server — cPanel shared hosting tidak support |
| Mode SSG | Bisa di cPanel — tapi hanya cocok untuk konten statis |
| Mode SPA | Bisa di cPanel — tapi tidak ada bedanya dengan Vue biasa |
| Complexity | Jauh lebih kompleks dari Vue SPA |

**Kesimpulan**: Nuxt SSR butuh VPS atau server Node.js. Project ini adalah web app dinamis (auth, real-time data) — bukan blog statis. SSG tidak cocok.

### Rekomendasi Final: Tetap Vue 3 SPA

**Alasan**:
1. cPanel compatibility — tidak perlu Node.js server
2. Project ini adalah web app, bukan website konten — SEO bukan prioritas utama
3. Tim sudah familiar dengan Vue, lebih mudah onboarding
4. Nuxt dapat ditambahkan nanti jika butuh SEO kuat, tanpa harus ubah backend

**Jika di masa depan butuh SEO** (untuk halaman landing/home), pertimbangkan `vite-plugin-prerender` atau `vite-plugin-ssg` sebagai solusi ringan tanpa migrasi ke Nuxt.

**Catatan penting — .htaccess untuk cPanel**:
Karena Vue Router menggunakan `createWebHistory`, semua route harus dikonfigurasi di `.htaccess` agar tidak 404 saat di-refresh:

```apache
# public_html/.htaccess — WAJIB ADA untuk Vue Router History Mode
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Struktur Direktori Saat Ini (Aktual)

```
gypsy-new/
├── index.html                   # Entry HTML — SEO minimal, duplikat CSS import
├── vite.config.js               # Vite 3 config
├── package.json                 # 40 dependencies (banyak redundan)
├── .eslintrc.js                 # ESLint dikonfigurasi tapi banyak di-disable
├── .editorconfig                # Editor standard config
├── public/
│   ├── favicon.ico
│   └── header.png               # MASALAH: Duplikat dengan src/assets/header.png
└── src/
    ├── App.vue                  # Root — Options API, route-string check manual
    ├── main.js                  # Entry — globalProperties hardcoded URL
    ├── store.js                 # Vuex flat — 11 state props, semua logic tercampur
    ├── router/
    │   └── index.js             # 9 routes, eager loading semua, no auth guard
    ├── plugins/
    │   ├── vuetify.js           # Minimal setup (theme tidak dikonfigurasi)
    │   └── webfontloader.js     # Roboto loader (tidak dipakai di main.js)
    ├── util/
    │   ├── axios.js             # baseURL hardcoded, no request interceptor auth
    │   └── eventBus.js          # ANTI-PATTERN: createApp({}) hanya untuk event bus
    ├── assets/
    │   ├── style/
    │   │   ├── App.scss         # 533 baris — global styles tercampur, banyak !important
    │   │   ├── fonts.scss       # Font face declaration
    │   │   └── responsive.scss  # 150 baris responsive breakpoints
    │   └── [34+ file gambar]    # Tidak terkompresi, total ~9MB raw
    ├── views/
    │   ├── HomeView.vue         # Thin wrapper 14 baris — layer redundant
    │   ├── MyProfile.vue        # GOD COMPONENT: 2677 baris / 95 KB
    │   ├── SignUpForm.vue
    │   ├── OTPEmailForm.vue
    │   ├── CreatePasswordForm.vue
    │   ├── SocialLoginForm.vue
    │   └── PrivacyTerms.vue
    └── components/
        ├── Header.vue           # GOD COMPONENT: 1456 baris / 48 KB
        ├── Footer.vue           # 9083 bytes
        ├── TrendingApps.vue     # 728 baris — bisa dipecah
        ├── Banner.vue           # 237 baris — mixed inline styles
        ├── Landing.vue          # ANTI-PATTERN: Dual script (setup + Options API)
        ├── Partners.vue         # 4731 bytes
        ├── SignUp/              # Social sign-up flow (8 files)
        │   ├── Welcome.vue      # 1019 baris
        │   ├── PersonalDetailSocials.vue  # ~37 KB (duplikat logika)
        │   ├── AdditionalData.vue
        │   ├── SelectSkills.vue
        │   ├── ResultRegister.vue
        │   └── ...
        ├── SignUpEmail/         # Email sign-up flow (4 files)
        │   ├── PersonalDetailEmail.vue  # 37190 bytes — DUPLIKAT
        │   ├── OTPEmail.vue
        │   ├── AdditionalSecurity.vue   # 12484 bytes — hampir identik dg yg lain
        │   └── ResultRegister.vue
        ├── SignUpMobile/        # Mobile sign-up flow (3 files)
        │   ├── PersonalDetailMobile.vue # 35368 bytes — DUPLIKAT
        │   ├── AdditionalSecurity.vue   # 12488 bytes — hampir identik
        │   └── ResultRegister.vue
        └── CreatePassword/      # Create password flow (2 files)
            ├── AdditionalSecurity.vue   # 12484 bytes — hampir identik
            └── ResultRegister.vue
```

---

## Masalah Kritis yang Harus Diperbaiki

### 1. God Components — Violasi Single Responsibility Principle

| File | Ukuran | Masalah |
|---|---|---|
| `views/MyProfile.vue` | **2677 baris / 95 KB** | UI, validasi, semua API calls, state lokal, bisnis logika sekaligus |
| `components/Header.vue` | **1456 baris / 48 KB** | Navbar, auth, data fetching, location logic, event listeners |
| `components/SignUp/Welcome.vue` | **1019 baris / 33 KB** | Multi-step form, social auth, OTP, dan UI dalam 1 file |
| `SignUpEmail/PersonalDetailEmail.vue` | **37 KB** | Duplikat dari PersonalDetailSocials |
| `SignUpMobile/PersonalDetailMobile.vue` | **35 KB** | Duplikat dari PersonalDetailSocials |

**Aturan untuk template**: Tidak ada file Vue yang boleh melebihi **300 baris** untuk komponen, dan **500 baris** untuk halaman.

---

### 2. Duplikasi Kode Massif — Violasi DRY Principle

```
# File yang hampir identik (byte-per-byte):
SignUpEmail/AdditionalSecurity.vue    -> 12,484 bytes  ---|
SignUpMobile/AdditionalSecurity.vue   -> 12,488 bytes     |-- HAMPIR IDENTIK
CreatePassword/AdditionalSecurity.vue -> 12,484 bytes  ---|

SignUp/ResultRegister.vue             -> 5,102 bytes   ---|
SignUpEmail/ResultRegister.vue        -> 5,252 bytes      |-- SANGAT MIRIP
SignUpMobile/ResultRegister.vue       -> 5,253 bytes      |
CreatePassword/ResultRegister.vue     -> 4,643 bytes   ---|
```

**Dampak**: Bug di satu file harus diperbaiki manual di semua salinannya.

---

### 3. Tidak Ada Service Layer

Semua HTTP calls langsung di dalam komponen Vue, tersebar di **17+ file**. Tidak ada abstraksi API sama sekali. Ganti 1 endpoint = edit puluhan file.

---

### 4. Axios Interceptor Tidak Lengkap

```javascript
// src/util/axios.js — MASALAH:
// 1. Token TIDAK otomatis di-attach (setiap komponen harus manual!)
// 2. 401 response TIDAK di-handle untuk auto-logout
// 3. baseURL hardcoded, tidak dari .env
axios.defaults.baseURL = "https://admin1.the-gypsy.sg/api"; // Hardcoded!
```

---

### 5. State Management Tidak Memadai

`store.js` adalah flat file tanpa module. Tidak ada state auth (user, token). Token diakses raw dari localStorage di 15+ komponen berbeda.

---

### 6. Anti-Patterns Serius

**a. Dual Script Tag di Landing.vue**

```vue
<!-- ANTI-PATTERN: mencampur dua API style dalam 1 file -->
<script setup>
import Banner from "@/components/Banner.vue";
</script>

<script>
export default {
  data() { ... },
  methods: { ... }
};
</script>
```

**b. Event Bus Anti-Pattern**

```javascript
// src/util/eventBus.js — membuat Vue app KEDUA hanya untuk event bus
const app = createApp({});
const eventBus = (app.config.globalProperties.$eventBus = {});
// mitt sudah terinstal tapi tidak digunakan!
```

**c. process.env.BASE_URL di Vite**

```javascript
// router/index.js — SALAH untuk Vite:
history: createWebHistory(process.env.BASE_URL)
// Seharusnya:
history: createWebHistory(import.meta.env.BASE_URL)
```

**d. setInterval Tanpa Cleanup (Memory Leak)**

```javascript
// Header.vue — created():
setInterval(this.updateTime, 1000); // Tidak ada clearInterval!
```

---

### 7. Keamanan

- **Token dari URL ke localStorage**: Token yang ada di URL query param langsung disimpan — terekam di browser history (CWE-598)
- **Konfigurasi hardcoded**: URL API, file URL, app ID tersebar di 5+ file berbeda
- **Route guard tidak berfungsi**: `beforeRouteEnter` ditulis salah — tidak ada guard aktif untuk halaman yang butuh auth
- **Console.log di production**: 20+ console.log dengan data sensitif yang terekspos ke browser user

---

### 8. Performa

- **Zero lazy loading**: Semua 9 routes eager-loaded — 1 bundle besar
- **Gambar ~9MB tidak teroptimasi**: Beberapa file > 1MB, tidak ada WebP/srcset
- **Duplikat CSS import**: flag-icons dimuat dari CDN (index.html) DAN dari npm (main.js)
- **40 dependencies**: Banyak redundan (2 package flag-icons, 2 date libraries, dll)
- **Versi sangat outdated**: Vite 3 (seharusnya 6), Vue 3.2 (seharusnya 3.5), Vuex (seharusnya Pinia)

---

### 9. Kualitas Kode Umum

- Tidak konsisten: mayoritas Options API, 1 file script setup, 1 file campuran keduanya
- Tidak ada TypeScript — bug tipe data baru ketahuan saat runtime
- Tidak ada testing (0 file test)
- Ratusan inline style hardcoded — susah di-theme
- Puluhan blok kode dikomen tapi tidak dihapus
- Banyak `!important` di SCSS — tanda CSS override yang tidak terstruktur

---

## Yang Sudah Baik (Pertahankan)

| Item | Detail |
|---|---|
| **Vite** | Build tool modern yang tepat untuk SPA |
| **Vuetify 3** | UI library konsisten dan kaya komponen |
| **Vue Router 4** | Versi benar untuk Vue 3, scrollBehavior sudah dikonfigurasi |
| **SCSS terpisah** | App.scss, fonts.scss, responsive.scss sudah dipisahkan |
| **Auto-animate** | @formkit/auto-animate untuk list animation |
| **Page Transition** | Transition page-opacity di App.vue |
| **@ alias** | Path alias sudah dikonfigurasi di vite.config.js |
| **AOS** | Animasi scroll di Banner.vue berfungsi |
| **Geolocation** | Logika auto-detect negara pengguna di store |

---

## Visi Target: Template Architecture

```
src/
├── App.vue                      # Root — Composition API, tidak ada hardcoded route strings
├── main.js                      # Entry — bersih, config dari .env
│
├── api/                         # [NEW] Centralized service layer
│   ├── http.js                  # Axios + interceptors (auto token, auto 401 handler)
│   ├── auth.service.js          # login, logout, register, verifyEmail
│   ├── user.service.js          # getProfile, updateProfile, uploadAvatar
│   ├── app.service.js           # getTrendingApps, getCategories
│   ├── location.service.js      # getCountries, getCities
│   └── header.service.js        # getHeaderData, getFooterData
│
├── stores/                      # [REPLACE] Vuex ke Pinia
│   ├── auth.store.js            # token, user, isAuthenticated, login, logout
│   ├── location.store.js        # country, city, geolocation logic
│   ├── app.store.js             # trending apps, categories, activeTag
│   └── ui.store.js              # loading states, snackbar, drawer
│
├── composables/                 # [NEW] Reusable logic
│   ├── useResponsive.js         # isSmall, isMedium (gantikan duplikasi di 5+ komponen)
│   ├── useAuth.js               # auth logic reusable
│   ├── useImageUpload.js        # crop, upload logic (ada di 4+ komponen sekarang)
│   ├── useForm.js               # validation helpers
│   └── useApi.js                # loading/error state wrapper
│
├── components/
│   ├── base/                    # [NEW] Design system components
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseDialog.vue
│   │   ├── BaseCard.vue
│   │   └── BaseLoader.vue
│   │
│   ├── layout/                  # [NEW] Layout components
│   │   ├── AppHeader.vue        # Dipecah dari Header.vue 1456 baris
│   │   ├── AppHeaderNav.vue     # Navigation desktop
│   │   ├── AppHeaderMobile.vue  # Drawer mobile
│   │   ├── AppHeaderLocation.vue # Location dropdown
│   │   └── AppFooter.vue
│   │
│   ├── home/                    # Home page components
│   │   ├── HeroBanner.vue       # Dari Banner.vue
│   │   ├── TrendingApps.vue     # Dari TrendingApps.vue, dipecah
│   │   ├── TrendingCard.vue     # [NEW] Single app card
│   │   └── PartnersSection.vue  # Dari Partners.vue
│   │
│   ├── auth/                    # [REFACTOR] Semua flow auth disatukan
│   │   ├── WelcomeStep.vue
│   │   ├── PersonalDetailStep.vue  # [UNIFIED] Gantikan 3 PersonalDetail duplikat
│   │   ├── OtpVerificationStep.vue
│   │   ├── AdditionalSecurityStep.vue  # [UNIFIED] Gantikan 3 AdditionalSecurity
│   │   ├── AdditionalDataStep.vue
│   │   ├── SelectSkillsStep.vue
│   │   └── RegisterSuccessStep.vue  # [UNIFIED] Gantikan 4 ResultRegister
│   │
│   ├── profile/                 # [SPLIT dari MyProfile.vue 2677 baris]
│   │   ├── ProfileHeader.vue
│   │   ├── BasicInfoForm.vue
│   │   ├── ContactForm.vue
│   │   ├── LocationForm.vue
│   │   ├── SecurityForm.vue
│   │   └── SocialLinksForm.vue
│   │
│   └── shared/                  # Cross-domain shared components
│       ├── PhoneInput.vue
│       ├── CountrySelect.vue
│       ├── ImageUploader.vue    # Diekstrak dari 4+ komponen
│       └── OtpInput.vue
│
├── router/
│   └── index.js                 # Lazy loading semua + auth guards
│
├── views/                       # Thin wrappers saja (orchestrators)
│   ├── HomeView.vue
│   ├── ProfileView.vue
│   ├── AuthView.vue
│   ├── PrivacyView.vue
│   └── PartnersView.vue
│
├── utils/                       # [RENAME dari util/]
│   ├── eventBus.js              # mitt instance yang benar
│   ├── storage.js               # LocalStorage abstraction
│   ├── date.js                  # Date formatting helpers
│   └── validators.js            # Form validation rules
│
└── assets/
    ├── style/
    │   ├── _variables.scss      # [NEW] CSS design tokens
    │   ├── _typography.scss     # [NEW] Font definitions terpusat
    │   ├── _components.scss     # Component-level overrides
    │   ├── _utilities.scss      # Helper classes
    │   ├── responsive.scss      # Breakpoints
    │   └── main.scss            # Root import
    ├── fonts/
    └── images/                  # Gambar teroptimasi WebP
```

---

## Roadmap Refactoring

### Sprint 0: Hygiene & Quick Wins (1-2 hari)

Perbaikan tanpa breaking changes — lakukan duluan:

1. **Buat `.env` file** — pindahkan semua hardcoded config:
   ```env
   VITE_API_BASE_URL=https://admin1.the-gypsy.sg/api
   VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
   VITE_APP_ID=1
   VITE_SYRINGE_URL=https://the-syringe.com
   VITE_MALLE_URL=https://mall-e.in
   ```

2. **Tambah `.htaccess`** di `public/` untuk Vue Router history mode di cPanel

3. **Fix router**: `process.env.BASE_URL` => `import.meta.env.BASE_URL`

4. **Fix memory leak**: tambahkan `clearInterval` di `Header.vue`

5. **Hapus duplikat CSS import**: pilih satu (CDN atau npm) untuk flag-icons

6. **Hapus `public/header.png`**: duplikat dengan `src/assets/header.png`

7. **Bersihkan commented code** di semua file

8. **Fix `Landing.vue`**: gunakan satu pola API style (hapus script setup kosong)

9. **Buat `.env.example`** sebagai referensi developer baru

---

### Sprint 1: Fondasi (3-5 hari)

1. **Upgrade dependencies utama**:
   ```bash
   npm install vite@latest @vitejs/plugin-vue@latest
   npm install vue@latest vue-router@latest
   npm install pinia
   npm remove vuex
   npm remove flag-icon-css vue-loader vue-page-transition
   npm remove moment moment-timezone
   npm install date-fns
   ```

2. **Buat HTTP client baru** (`src/api/http.js`) dengan:
   - Auto-attach token via request interceptor
   - Auto-handle 401 (redirect ke login)
   - baseURL dari `.env`
   - Timeout 10 detik

3. **Setup Pinia stores**:
   - `auth.store.js` — token, user, isAuthenticated
   - `location.store.js` — pindahkan logika dari store.js
   - `ui.store.js` — loading, snackbar, drawer state

4. **Fix eventBus** menggunakan mitt:
   ```javascript
   // src/utils/eventBus.js
   import mitt from "mitt";
   export const emitter = mitt();
   ```

5. **Setup Vuetify theme** yang benar dengan design tokens

---

### Sprint 2: Arsitektur (1-2 minggu)

1. **Buat composables**: `useResponsive.js`, `useImageUpload.js`, `useApi.js`

2. **Buat Service Layer** — satu service per domain, tidak ada komponen yang langsung import axios

3. **Buat base components** — komponen UI standar reusable

4. **Lazy loading** semua routes:
   ```javascript
   {
     path: "/my-profile",
     component: () => import("@/views/ProfileView.vue"),
     meta: { requiresAuth: true }
   }
   ```

5. **Auth guard** di router dengan Pinia

6. **StorageService** — abstraksi localStorage

---

### Sprint 3: Komponen (2-3 minggu)

1. **Pecah `Header.vue`** (1456 baris) => AppHeader, AppHeaderNav, AppHeaderMobile, AppHeaderLocation, AppHeaderUser

2. **Pecah `MyProfile.vue`** (2677 baris) => ProfileView + BasicInfoForm + ContactForm + LocationForm + SecurityForm

3. **Unifikasi sign-up** — 4 folder + 12 file menjadi 7 step components + 1 AuthFlow orchestrator

4. **Migrasi ke Composition API** (`<script setup>`) di semua komponen

---

### Sprint 4: Performa & Polish (1 minggu)

1. **Optimasi gambar** ke WebP — estimasi 9MB => <2MB

2. **Vite build chunks**:
   ```javascript
   manualChunks: {
     "vuetify": ["vuetify"],
     "vendor": ["vue", "vue-router", "pinia"]
   }
   ```

3. **Setup Vitest** untuk unit testing

4. **SEO dasar**: meta description, Open Graph tags

5. **Aksesibilitas**: aria-label untuk icon-only buttons

---

## Metrik: Saat Ini vs Target

| Metrik | Saat Ini | Target Template |
|---|---|---|
| **File terpanjang** | 2677 baris (MyProfile.vue) | < 300 baris per komponen |
| **API calls tersentralisasi** | 0% (17+ file) | 100% via service layer |
| **Lazy loaded routes** | 0 dari 9 | 100% |
| **Reusable composables** | 0 | >= 5 |
| **Komponen > 500 baris** | 7 komponen | 0 |
| **Duplikasi komponen** | 3-4 set duplikat | 0 (unified) |
| **Environment variables** | 0 (.env tidak ada) | 100% via .env |
| **Test coverage** | 0% | >= 40% |
| **Bundle size** | ~5-8 MB unoptimized | < 2 MB |
| **Ukuran gambar** | ~9 MB raw | < 2 MB (WebP) |
| **Dependencies aktif** | ~40 (banyak redundan) | < 25 |
| **State management** | Vuex flat 1 file | Pinia modular |
| **Auth handling** | Manual 15+ komponen | Centralized store + service |

---

## Checklist Template Readiness

### Wajib (Must Have)
- [ ] File `.env` dan `.env.example` ada
- [ ] `.htaccess` tersedia di `public/` untuk cPanel
- [ ] Tidak ada URL hardcoded di source code
- [ ] Semua routes menggunakan lazy loading
- [ ] Auth guard berfungsi di router
- [ ] Axios dengan token auto-attach dan 401 handling
- [ ] State management Pinia (auth, ui, domain-specific)
- [ ] Event bus menggunakan mitt
- [ ] `useResponsive` composable tersedia
- [ ] Fix: `process.env.BASE_URL` => `import.meta.env.BASE_URL`
- [ ] Memory leak setInterval diperbaiki
- [ ] Console.log production dihapus/guarded
- [ ] Tidak ada file Vue > 500 baris

### Direkomendasikan (Should Have)
- [ ] Service layer (`src/api/`) — semua API terpusat
- [ ] Base components (`src/components/base/`) — design system dasar
- [ ] SCSS variables dengan design tokens
- [ ] StorageService — abstraksi localStorage
- [ ] `useImageUpload` composable
- [ ] Vuetify custom theme dikonfigurasi
- [ ] README.md yang jelas dengan instruksi setup
- [ ] Gambar dioptimasi ke WebP
- [ ] Minimal 1 unit test sebagai contoh pola

### Opsional (Nice to Have)
- [ ] TypeScript (bertahap)
- [ ] Vitest setup
- [ ] E2E test dengan Playwright
- [ ] SEO meta tags dan Open Graph
- [ ] Aksesibilitas dasar (aria-label)

---

## Catatan Deployment cPanel

```bash
# Flow deploy:
npm run build
# Upload isi dist/ ke public_html/ via FTP atau File Manager cPanel
# Pastikan .htaccess ada di public_html/
```

**Jika deploy ke subfolder** (misal: `domain.com/app/`):

```javascript
// vite.config.js
export default defineConfig({
  base: "/app/",
})
```

```javascript
// router/index.js
history: createWebHistory("/app/")
```

---

*Dokumen ini diperbarui berdasarkan analisis mendalam codebase pada 19 Agustus 2026.*
*Fokus: Menjadikan project sebagai template/boilerplate yang bersih, modern, dan maintainable dengan tetap mempertahankan deployment cPanel.*
