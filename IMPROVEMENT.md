# Improvement Roadmap — Gypsy SG Template

> Dokumen ini mencatat semua improvement yang belum diimplementasi dari `ANALYSIS.md` serta rekomendasi tambahan untuk menjadikan project ini sebagai **template/boilerplate** yang bersih dan siap pakai untuk project lain.

> **Tanggal Dibuat**: 20 Agustus 2026

---

## Status Implementasi Saat Ini

| Sprint | Deskripsi | Status |
|---|---|---|
| Sprint 0 | Hygiene & Quick Wins | ✅ Selesai |
| Sprint 1 | Fondasi (Pinia, HTTP Client, Mitt) | ✅ Selesai |
| Sprint 2 | Arsitektur (Composables, Lazy Loading, Auth Guard) | ✅ Selesai |
| Sprint 3 | Komponen (Refactor Header, MyProfile, Auth Flow, Composition API) | ✅ Selesai |
| Sprint 4 | Performa & Polish (WebP, Code Splitting, Vitest, SEO, A11y) | ✅ Selesai |

---

## Improvement yang Belum Diimplementasi

### 🔴 Must Have (Wajib untuk Template)

#### 1. Hapus Folder Legacy Auth
**Prioritas**: Sangat Tinggi

Folder-folder berikut adalah sisa dari sebelum refactoring Sprint 3. Sudah digantikan sepenuhnya oleh `src/components/auth/steps/` dan `src/views/AuthFlow.vue`, namun belum dihapus — menyebabkan kebingungan dan bloat:

```
src/components/SignUp/          # 8 file — sudah digantikan
src/components/SignUpEmail/     # 4 file — sudah digantikan
src/components/SignUpMobile/    # 3 file — sudah digantikan
src/components/CreatePassword/  # 2 file — sudah digantikan
```

**Langkah**: Hapus keempat folder tersebut dan pastikan tidak ada import aktif ke dalamnya.

---

#### 2. Guard `console.log` untuk Production
**Prioritas**: Tinggi

20+ `console.log` di source code yang mengekspos data sensitif (token, user data, API response) ke browser console user di production.

**Implementasi**:
```javascript
// Ganti semua console.log dengan:
if (import.meta.env.DEV) {
  console.log("...");
}

// Atau buat helper global di src/utils/logger.js:
export const log = (...args) => {
  if (import.meta.env.DEV) console.log(...args);
};
```

**File yang perlu diupdate**: Semua file di `src/` yang masih menggunakan `console.log`.

---

#### 3. `ui.store.js` — Centralized UI State
**Prioritas**: Tinggi

State loading, snackbar, dan drawer saat ini tersebar di tiap komponen secara lokal. Perlu dipusatkan di Pinia.

```javascript
// src/stores/ui.store.js
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    isLoading: false,
    snackbar: { show: false, message: "", color: "success" },
    isDrawerOpen: false,
  }),
  actions: {
    showSnackbar(message, color = "success") {
      this.snackbar = { show: true, message, color };
    },
    setLoading(val) {
      this.isLoading = val;
    },
  },
});
```

---

### 🟡 Should Have (Sangat Direkomendasikan untuk Template)

#### 4. Service Layer Lengkap (`src/api/`)
**Prioritas**: Tinggi

`src/api/http.js` sudah ada, tapi service per domain belum dibuat. Komponen masih memanggil `http.get(...)` langsung. Jika endpoint berubah, harus edit puluhan komponen.

**Struktur target**:
```
src/api/
├── http.js              ✅ Sudah ada
├── auth.service.js      ❌ Belum — login, logout, register, verifyOTP
├── user.service.js      ❌ Belum — getProfile, updateProfile, uploadAvatar
├── app.service.js       ❌ Belum — getTrendingApps, getCategories, getBanners
├── location.service.js  ❌ Belum — getCountries, getCities
└── header.service.js    ❌ Belum — getHeaderData, getFooterData, getMenus
```

**Contoh**:
```javascript
// src/api/auth.service.js
import http from "./http";

export const authService = {
  login: (data) => http.post("/login", data),
  register: (data) => http.post("/register", data),
  verifyOTP: (data) => http.post("/otp/verify", data),
  logout: () => http.post("/logout"),
};
```

---

#### 5. `StorageService` — Abstraksi localStorage
**Prioritas**: Sedang

Token dan data user saat ini diakses raw via `localStorage.getItem("token")` di 10+ komponen. Jika nanti perlu ganti ke `sessionStorage` atau cookie, harus edit semua komponen.

```javascript
// src/utils/storage.js
const PREFIX = "gypsy_";

export const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(PREFIX + key));
    } catch {
      return localStorage.getItem(PREFIX + key);
    }
  },
  set: (key, value) => localStorage.setItem(PREFIX + key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(PREFIX + key),
  clear: () => localStorage.clear(),
};
```

---

#### 6. Base Components (`src/components/base/`)
**Prioritas**: Sedang

Saat ini tidak ada komponen UI standar. Setiap bagian app menggunakan `<v-btn>`, `<v-text-field>`, dll. secara langsung dengan styling berbeda-beda. Ini menyulitkan rebranding di project mendatang.

**Struktur target**:
```
src/components/base/
├── BaseButton.vue    # Wrapper v-btn dengan variant & color standar
├── BaseInput.vue     # Wrapper v-text-field dengan styling konsisten
├── BaseDialog.vue    # Wrapper v-dialog dengan slot header/body/footer
├── BaseCard.vue      # Wrapper v-card dengan styling standar
└── BaseLoader.vue    # Full-screen / inline loader component
```

---

#### 7. SCSS Design Tokens (`_variables.scss`)
**Prioritas**: Sedang

`App.scss` saat ini adalah file monolitik 500+ baris. Warna, spacing, font diulang hardcoded. Perlu dipisahkan menjadi design tokens agar mudah di-rebrand.

**Struktur target**:
```
src/assets/style/
├── _variables.scss    # ❌ Belum — CSS custom properties & SCSS vars
├── _typography.scss   # ❌ Belum — Font definitions terpusat
├── _components.scss   # ❌ Belum — Vuetify component overrides
├── _utilities.scss    # ❌ Belum — Helper classes
├── App.scss           # ✅ Ada — Dikecilkan, hanya import file di atas
├── fonts.scss         # ✅ Ada
└── responsive.scss    # ✅ Ada
```

**Contoh**:
```scss
// _variables.scss
:root {
  --color-primary: #your-brand-color;
  --color-secondary: #your-secondary;
  --color-surface: #ffffff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --border-radius: 12px;
}
```

---

#### 8. `useForm.js` Composable
**Prioritas**: Sedang

Logika validasi form tersebar di tiap komponen. Perlu composable terpusat.

```javascript
// src/composables/useForm.js
import { ref, reactive } from "vue";

export function useForm(initialValues) {
  const form = reactive({ ...initialValues });
  const errors = reactive({});
  const isSubmitting = ref(false);

  const validate = (rules) => {
    Object.keys(rules).forEach((field) => {
      const error = rules[field](form[field]);
      if (error !== true) errors[field] = error;
      else delete errors[field];
    });
    return Object.keys(errors).length === 0;
  };

  const reset = () => Object.assign(form, initialValues);

  return { form, errors, isSubmitting, validate, reset };
}
```

---

#### 9. README.md — Dokumentasi Template
**Prioritas**: Sedang

Tidak ada README. Siapapun yang menggunakan template ini harus membaca kode untuk tahu cara setup.

**Isi yang direkomendasikan**:
- Tech stack & arsitektur
- Prerequisites
- Setup dari nol (`git clone`, `cp .env.example .env`, `npm install`, `npm run dev`)
- Cara ganti API URL (`.env`)
- Cara build & deploy ke cPanel
- Struktur folder dan penjelasan singkat tiap bagian
- Cara menambah route baru
- Cara menambah store baru (Pinia)
- Cara menambah service baru (`src/api/`)
- Cara menjalankan tests

---

### 🟢 Nice to Have (Opsional, Jika Ada Waktu)

#### 10. Vite Plugin Prerender untuk SEO
**Prioritas**: Rendah

Jika halaman home/landing butuh SEO tanpa migrasi ke Nuxt:

```bash
npm install vite-plugin-prerender
```

```javascript
// vite.config.js
import PrerenderPlugin from "vite-plugin-prerender";

plugins: [
  PrerenderPlugin({
    staticDir: path.join(__dirname, "dist"),
    routes: ["/", "/privacy-terms"],
  }),
]
```

---

#### 11. GitHub Actions CI/CD — Auto Deploy ke cPanel
**Prioritas**: Rendah

Otomatis build dan upload ke cPanel via FTP setiap push ke branch `main`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to cPanel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Upload via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local-dir: ./dist/
          server-dir: /public_html/
```

---

#### 12. TypeScript (Bertahap)
**Prioritas**: Rendah

Tidak perlu migrasi penuh sekaligus. Cukup ubah `jsconfig.json` menjadi `tsconfig.json` dan tambahkan type annotation bertahap mulai dari composables dan stores.

---

#### 13. E2E Testing dengan Playwright
**Prioritas**: Rendah

Vitest sudah setup untuk unit test. Playwright untuk E2E flow kritis (login, register):

```bash
npm init playwright@latest
```

---

## Checklist Template Readiness

### ✅ Sudah Selesai
- [x] File `.env` dan `.env.example` ada
- [x] `.htaccess` tersedia di `public/` untuk cPanel
- [x] Tidak ada URL hardcoded (setelah Sprint 0)
- [x] Semua routes menggunakan lazy loading
- [x] Auth guard berfungsi di router
- [x] Axios dengan token auto-attach dan 401 handling (`src/api/http.js`)
- [x] State management Pinia (`auth.store.js`, `location.store.js`)
- [x] Event bus menggunakan mitt
- [x] `useResponsive` composable tersedia
- [x] Fix `process.env.BASE_URL` → `import.meta.env.BASE_URL`
- [x] Memory leak `setInterval` diperbaiki
- [x] Gambar dioptimasi ke WebP
- [x] Minimal 1 unit test sebagai contoh pola
- [x] SEO meta tags dan Open Graph
- [x] Aksesibilitas dasar (aria-label)
- [x] Composition API (`<script setup>`) di semua komponen aktif
- [x] Vite build chunks (`manualChunks`)

### ❌ Belum Selesai
- [ ] Hapus folder legacy `SignUp/`, `SignUpEmail/`, `SignUpMobile/`, `CreatePassword/`
- [ ] Console.log production dihapus/guarded
- [ ] `ui.store.js` — centralized UI state
- [ ] Service layer lengkap (`src/api/*.service.js`)
- [ ] Base components (`src/components/base/`)
- [ ] SCSS variables dengan design tokens (`_variables.scss`)
- [ ] `StorageService` — abstraksi localStorage
- [ ] `useForm.js` composable
- [ ] README.md yang jelas dengan instruksi setup

---

*Dokumen ini diperbarui pada 20 Agustus 2026.*
