# Gypsy SG — Vue 3 Modern SPA Template & Boilerplate

Template frontend modern berbasis **Vue 3**, **Vite**, **Vuetify 3**, dan **Pinia**, siap pakai untuk development web app performan tinggi dengan deployment mudah di **cPanel** (static SPA) maupun hosting modern lainnya.

---

## 🚀 Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| **Framework** | [Vue 3](https://vuejs.org/) (Composition API `<script setup>`) | `^3.5.x` |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^5.x` |
| **UI Library** | [Vuetify 3](https://vuetifyjs.com/) (Material Design 3) | `^3.5.x` |
| **State Management** | [Pinia](https://pinia.vuejs.org/) (Modular stores) | `^2.1.x` |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) (Lazy loading + Auth guards) | `^4.2.x` |
| **HTTP Client** | [Axios](https://axios-http.com/) (Centralized Interceptors) | `^1.4.x` |
| **Unit Testing** | [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) | `^1.x` |
| **Event Bus** | [mitt](https://github.com/developit/mitt) | `^3.0.x` |
| **Image Format** | WebP (Compressed with Sharp) | - |

---

## 📁 Struktur Direktori

```text
gypsy-new/
├── public/
│   ├── .htaccess                # Apache rewrite rules untuk Vue Router history mode di cPanel
│   └── favicon.ico
├── scripts/
│   └── convert-to-webp.js       # Script konversi otomatis gambar ke WebP menggunakan sharp
├── src/
│   ├── api/
│   │   └── http.js              # Axios instance dengan request & response interceptor terpusat
│   ├── assets/
│   │   ├── style/
│   │   │   ├── _variables.scss  # Design tokens (CSS custom properties & SCSS variables)
│   │   │   ├── App.scss         # Global styles
│   │   │   ├── fonts.scss       # Font definitions (Nunito)
│   │   │   └── responsive.scss  # Breakpoints & mobile responsive rules
│   │   └── images/              # Aset gambar WebP & icons SVG
│   ├── components/
│   │   ├── auth/steps/          # Multi-step auth components (Welcome, Personal, OTP, Password, dll.)
│   │   ├── base/                # Base design system components (BaseButton, BaseInput, BaseDialog, BaseLoader)
│   │   ├── header/              # Header sub-components (Nav, Location, User, Mobile Drawer)
│   │   ├── profile/             # MyProfile sub-components (BasicInfo, Contact, Location, Security, Avatar)
│   │   ├── Banner.vue           # Hero banner section
│   │   ├── Footer.vue           # Global footer
│   │   ├── Header.vue           # Header orchestrator
│   │   ├── ImageCropperDialog.vue # Avatar image cropper modal
│   │   ├── Landing.vue          # Landing page container
│   │   ├── Partners.vue         # Partners logo showcase
│   │   └── TrendingApps.vue     # Trending app grid section
│   ├── composables/
│   │   ├── useApi.js            # Composable wrapper untuk async API call dengan loading/error state
│   │   ├── useImageUpload.js    # Composable untuk handle file image selection & base64
│   │   ├── useResponsive.js     # Composable breakpoint listener (isSmall, isMedium)
│   │   └── __tests__/           # Unit tests suite (useResponsive.test.js)
│   ├── constants/
│   │   └── countries.js         # Master data daftar negara & dial code
│   ├── plugins/
│   │   └── vuetify.js           # Konfigurasi Vuetify 3 & custom theme colors
│   ├── router/
│   │   └── index.js             # Route definitions dengan lazy loading & global auth guard
│   ├── services/
│   │   ├── app.service.js       # API calls untuk domain App & Categories
│   │   ├── auth.service.js      # API calls untuk Login, Register, Logout, OTP
│   │   ├── content.service.js   # API calls untuk Privacy Policy & Terms
│   │   ├── location.service.js  # API calls untuk Countries, Cities, & Reverse Geocoding
│   │   ├── storage.service.js   # Abstraksi localStorage terpusat
│   │   └── user.service.js      # API calls untuk Profile & User management
│   ├── stores/
│   │   ├── auth.store.js        # Pinia store auth (token, user profile, login status)
│   │   ├── location.store.js    # Pinia store location (selected country, city, geolocation)
│   │   └── ui.store.js          # Pinia store UI (loading overlay, global snackbar, drawer)
│   ├── utils/
│   │   ├── eventBus.js          # Mitt event bus instance
│   │   └── logger.js            # Production-safe logger (silent di production build)
│   ├── views/
│   │   ├── AuthFlow.vue         # Orchestrator multi-step authentication flow
│   │   ├── EmailTemplate.vue    # Preview template email OTP
│   │   ├── HomeView.vue         # Landing page view
│   │   ├── MyProfile.vue        # Profile view
│   │   ├── PartnersOnBoarding.vue # Partners onboarding page
│   │   └── PrivacyTerms.vue     # Privacy policy & Terms of Service view
│   ├── App.vue                  # Root component dengan page transition & global loader/snackbar
│   └── main.js                  # Entry point aplikasi
├── .env.example                 # Template environment variables
├── index.html                   # Entry HTML dengan SEO & Open Graph meta tags
├── package.json
└── vite.config.js               # Konfigurasi Vite, rollup manual chunks, & Vitest
```

---

## 🛠️ Panduan Memulai (Quick Start)

### 1. Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`

### 2. Instalasi
```bash
# Clone repository
git clone <repository-url> my-new-project
cd my-new-project

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

### 3. Konfigurasi Environment (`.env`)
Sesuaikan URL API dan konfigurasi di file `.env`:
```env
VITE_API_BASE_URL=https://admin1.the-gypsy.sg/api
VITE_FILE_URL=https://admin1.the-gypsy.sg/img/app/
VITE_APP_ID=1
VITE_SYRINGE_URL=https://the-syringe.com
VITE_MALLE_URL=https://mall-e.in
```

### 4. Menjalankan Local Development
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🧪 Testing & Quality Check

```bash
# Menjalankan unit tests
npm run test:run

# Menjalankan tests dalam watch mode
npm run test

# Konversi dan optimasi gambar baru ke WebP
npm run optimize:images
```

---

## 📦 Build & Deployment

### 1. Production Build
```bash
npm run build
```
File hasil build akan berada di direktori `dist/`.

### 2. Deploy ke cPanel (Shared Hosting)
1. Jalankan `npm run build`.
2. Buka **cPanel File Manager** atau gunakan **FTP Client** (FileZilla).
3. Upload seluruh isi folder `dist/` ke direktori `public_html/` (atau direktori root domain).
4. Pastikan file `.htaccess` dari folder `public/` ikut ter-upload ke `public_html/` untuk mendukung Vue Router history mode (mencegah error 404 saat refresh halaman).

Isi `.htaccess`:
```apache
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

## 🧩 Panduan Menambah Fitur Baru

### Menambah Pinia Store Baru
1. Buat file baru di `src/stores/myFeature.store.js`:
```javascript
import { defineStore } from "pinia";

export const useMyFeatureStore = defineStore("myFeature", {
  state: () => ({
    items: [],
  }),
  actions: {
    setItems(data) {
      this.items = data;
    },
  },
});
```

### Menambah API Service Baru
1. Buat file baru di `src/services/myFeature.service.js`:
```javascript
import http from "@/api/http";

const MyFeatureService = {
  getItems: () => http.get("/my-items"),
  createItem: (payload) => http.post("/my-items", payload),
};

export default MyFeatureService;
```

### Menambah Route Baru
1. Daftarkan di `src/router/index.js` dengan pola **lazy loading**:
```javascript
{
  path: "/my-feature",
  name: "MyFeature",
  component: () => import("@/views/MyFeatureView.vue"),
  meta: {
    requiresAuth: true, // Berikan true jika halaman butuh login
  },
},
```

### Menggunakan Global Loader & Snackbar
Di komponen manapun:
```javascript
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();

// Tampilkan / sembunyikan global loading
uiStore.setLoading(true);

// Tampilkan notifikasi toast/snackbar
uiStore.showSnackbar("Data berhasil disimpan!", "success");
uiStore.showSnackbar("Terjadi kesalahan!", "error");
```
