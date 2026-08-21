# Additional Improvement Roadmap

> Audit mendalam pasca-Sprint 5. Dokumen ini mencatat semua improvement teknis yang masih tersisa di project
> dan perlu diprioritaskan untuk menjadikan template ini production-ready dan reusable secara optimal.
>
> **Tanggal Dibuat**: 21 Agustus 2026

---

## Status Saat Ini (Post Sprint 6)

| Item | Status |
|---|---|
| Legacy Auth folders dihapus | ✅ Selesai |
| `logger.js` dibuat | ✅ Selesai |
| `ui.store.js` dibuat & ditest | ✅ Selesai |
| `_variables.scss` design tokens | ✅ Selesai |
| Base components (Button, Input, Dialog, Loader, Card) | ✅ Selesai |
| `README.md` template | ✅ Selesai |
| `esbuild.drop` console di production build | ✅ Selesai |
| Package audit & cleanup | ✅ Selesai |
| Sass `@use` migration & modular partials | ✅ Selesai |
| `AGENTS.md` & `.agents/skills/` | ✅ Selesai |
| `console.log` di `views/`, `stores/`, dan `components/` | ✅ Selesai (0 sisa) |
| `localStorage` langsung di components & views | ✅ Selesai (terpusat di StorageService) |
| Legacy `src/util/eventBus.js` (Vue 2 stub) | ✅ Selesai (dibersihkan) |
| `useApi.js` — logger integration | ✅ Selesai |
| `window.$fileURL` antipattern diganti `useAppConfig` | ✅ Selesai |
| `useForm.js` composable | ✅ Selesai |
| Unit tests (5 suites, 18 tests passing) | ✅ Selesai |
| `.env.example` sinkron & up-to-date | ✅ Selesai |

---

## 🔴 Prioritas Tinggi

### 1. Sisa `console.log` di Components

**Temuan**: Masih ada **40+ baris `console.log`** yang tersisa di file-file komponen berikut.
Perlu diganti dengan `logger` dari `@/utils/logger` agar tidak bocor ke production browser console.

**File yang perlu diupdate:**
- `src/components/Header.vue` — 14 baris `console.log(error)`
- `src/components/auth/steps/StepWelcome.vue` — 10+ baris
- `src/components/auth/steps/StepPersonalSocials.vue` — 3 baris
- `src/components/auth/steps/StepPersonalMobile.vue` — 3 baris
- `src/components/auth/steps/StepPersonalEmail.vue` — 3 baris
- `src/components/auth/steps/StepOTPEmail.vue` — 4 baris
- `src/components/auth/steps/StepCreatePassword.vue` — 2 baris
- `src/components/TrendingApps.vue` — 2 baris
- `src/components/Landing.vue` — 2 baris
- `src/components/Footer.vue` — 1 baris

**Tambahan**: Di `src/components/header/AppHeaderMobile.vue`, ada `@click="console.log('share')"` langsung di template HTML — ini perlu dihapus sama sekali.

**Cara fix:**
```js
// Ganti:
console.log(error)
// Dengan:
logger.error("Context description:", error)

// Ganti:
console.log(data)
// Dengan:
logger.log("Data received:", data)
```

---

### 2. Direct `localStorage` Access di Components

**Temuan**: Ada **50+ baris** akses `localStorage` langsung tersebar di komponen, padahal `StorageService` sudah tersedia di `src/services/storage.service.js`.

**File yang bermasalah:**
- `src/components/Header.vue` — 11 baris (token, name, last_login, user_image)
- `src/components/auth/steps/StepWelcome.vue` — 15+ baris
- `src/components/auth/steps/StepPersonalMobile.vue` — 8 baris
- `src/components/auth/steps/StepPersonalSocials.vue` — 6 baris
- `src/components/auth/steps/StepResult.vue` — 4 baris

**Masalah**: Jika perlu pindah ke `sessionStorage` atau `cookie` di masa depan, harus edit 50+ baris di 5+ file berbeda.

**Cara fix:**
```js
// ❌ JANGAN:
localStorage.setItem("token", data.token);
const token = localStorage.getItem("token");

// ✅ GUNAKAN StorageService:
import StorageService from "@/services/storage.service";
StorageService.setToken(data.token);
const token = StorageService.getToken();
```

> Cek terlebih dahulu method yang sudah ada di `src/services/storage.service.js` sebelum menambah method baru.

---

### 3. Refactor `src/util/eventBus.js` (Vue 2 Stub Berbahaya)

**Temuan**: `src/util/eventBus.js` saat ini **membuat Vue instance kedua yang tidak perlu** (`createApp({})`) hanya untuk backward compatibility:

```js
// Ini ada di eventBus.js sekarang — BERBAHAYA dan membuang resource
const app = createApp({});  // ← Vue app kedua yang tidak pernah di-mount!
app.config.globalProperties.$eventBus = eventBus;
```

Kode baru sudah menggunakan `import { emitter } from "@/util/eventBus"` secara langsung (yang benar).
Vue app stub ini sudah tidak diperlukan.

**Cara fix:**
```js
// eventBus.js yang bersih — hapus bagian Vue app stub:
import mitt from "mitt";

export const emitter = mitt();
export default emitter;
```

Pastikan grep seluruh codebase untuk `$eventBus` dan ganti dengan `emitter` sebelum menghapus stub-nya.

---

## 🟡 Prioritas Sedang

### 4. `useApi.js` Composable — Masih Pakai `console.error`

**File**: `src/composables/useApi.js`, baris 28.

```js
// ❌ Sekarang:
console.error("API Error:", err);

// ✅ Seharusnya:
import { logger } from "@/utils/logger";
logger.error("API Error:", err);
```

Kecil tapi penting — inkonsisten dengan standar logger yang sudah ditetapkan.

---

### 5. Antipattern `window.$fileURL` dan `app.config.globalProperties`

**Temuan**: `main.js` mendaftarkan `$fileURL` dan `$appId` sebagai global properties:

```js
// main.js
app.config.globalProperties.$fileURL = import.meta.env.VITE_FILE_URL;
app.config.globalProperties.$appId = Number(import.meta.env.VITE_APP_ID) || 1;
```

Dan komponen mengaksesnya via `window.$fileURL` — ini adalah antipattern Vue 3 yang menyebabkan:
- Tidak ada type-checking
- Sulit di-trace ketika debug
- Tidak reaktif

**Cara fix yang direkomendasikan**:

Buat composable `useAppConfig.js`:

```js
// src/composables/useAppConfig.js
export function useAppConfig() {
  return {
    fileURL: import.meta.env.VITE_FILE_URL || "/file/",
    appId: Number(import.meta.env.VITE_APP_ID) || 1,
  };
}
```

Dan gunakan di komponen:
```js
import { useAppConfig } from "@/composables/useAppConfig";
const { fileURL, appId } = useAppConfig();
// Lalu gunakan: fileURL + imagePath
```

---

### 6. `useForm.js` Composable untuk Validasi Form

**Masalah**: Logika validasi form (rules, error messages, state submit) saat ini ditulis ulang di setiap komponen form secara terpisah. Tidak konsisten dan sulit dimaintain.

**Target file**: `src/composables/useForm.js`

```js
import { reactive, ref } from "vue";

export function useForm(initialValues = {}) {
  const values = reactive({ ...initialValues });
  const errors = reactive({});
  const isSubmitting = ref(false);

  function validate(rules) {
    Object.keys(errors).forEach((k) => delete errors[k]);
    let isValid = true;
    Object.entries(rules).forEach(([field, ruleFns]) => {
      for (const fn of ruleFns) {
        const result = fn(values[field]);
        if (result !== true) {
          errors[field] = result;
          isValid = false;
          break;
        }
      }
    });
    return isValid;
  }

  function reset() {
    Object.assign(values, initialValues);
    Object.keys(errors).forEach((k) => delete errors[k]);
    isSubmitting.value = false;
  }

  return { values, errors, isSubmitting, validate, reset };
}
```

---

### 7. Unit Test Coverage yang Lebih Luas

**Saat ini**: Hanya ada 1 test file: `src/composables/__tests__/useResponsive.test.js` (4 tests).

**Target yang direkomendasikan untuk template yang solid**:

```
src/composables/__tests__/
├── useResponsive.test.js  ✅ Sudah ada (4 tests)
├── useApi.test.js         ❌ Belum — test loading/error/data state
├── useForm.test.js        ❌ Belum — test validate, reset
src/stores/__tests__/
├── ui.store.test.js       ❌ Belum — test setLoading, showSnackbar, drawer
src/utils/__tests__/
├── logger.test.js         ❌ Belum — test dev/production mode
```

**Contoh test untuk `ui.store.js`**:

```js
import { setActivePinia, createPinia } from "pinia";
import { useUiStore } from "@/stores/ui.store";
import { describe, it, expect, beforeEach } from "vitest";

describe("useUiStore", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("setLoading mengubah isLoading", () => {
    const store = useUiStore();
    expect(store.isLoading).toBe(false);
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
  });

  it("showSnackbar mengisi data snackbar", () => {
    const store = useUiStore();
    store.showSnackbar("Berhasil!", "success");
    expect(store.snackbar.show).toBe(true);
    expect(store.snackbar.message).toBe("Berhasil!");
    expect(store.snackbar.color).toBe("success");
  });
});
```

---

### 8. Pisahkan `App.scss` yang Masih Monolitik (534 baris)

**Masalah**: `App.scss` masih berisi 534 baris style campur aduk — ada style untuk header, card, scroll bar, media queries, animasi dll. dalam satu file.

**Refactor yang direkomendasikan**:

```
src/assets/style/
├── _variables.scss      ✅ Ada — design tokens
├── _typography.scss     ❌ Belum — font size, weight, line-height classes
├── _utilities.scss      ❌ Belum — helper classes (.truncate, .ellipsis, dll.)
├── _components.scss     ❌ Belum — Vuetify component overrides (.v-btn, .v-card, dll.)
├── _animations.scss     ❌ Belum — keyframes & transition classes
├── App.scss             ✅ Ada — hanya import @use, global reset
├── fonts.scss           ✅ Ada
└── responsive.scss      ✅ Ada
```

**Manfaat untuk template baru**: Cukup edit `_variables.scss` dan `_components.scss` untuk rebranding.

---

## 🟢 Prioritas Rendah (Nice to Have)

### 9. GitHub Actions CI/CD — Auto Deploy ke cPanel

Setup otomatis build dan upload ke cPanel setiap push ke branch `main`:

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:run
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

**Secret yang perlu didaftarkan di GitHub**: `FTP_HOST`, `FTP_USER`, `FTP_PASS`.

---

### 10. `BaseCard.vue` — Base Component yang Hilang

Saat ini sudah ada `BaseButton`, `BaseInput`, `BaseDialog`, `BaseLoader`.
Satu lagi yang berguna untuk template adalah `BaseCard.vue`:

```vue
<!-- src/components/base/BaseCard.vue -->
<script setup>
defineProps({
  elevation: { type: [String, Number], default: 1 },
  rounded: { type: String, default: "lg" },
  loading: { type: Boolean, default: false },
  hover: { type: Boolean, default: false },
});
</script>

<template>
  <v-card :elevation="elevation" :rounded="rounded" :loading="loading" :hover="hover">
    <v-card-title v-if="$slots.title"><slot name="title" /></v-card-title>
    <v-card-text><slot /></v-card-text>
    <v-card-actions v-if="$slots.actions"><slot name="actions" /></v-card-actions>
  </v-card>
</template>
```

---

### 11. `useAppConfig.js` Composable (Lanjutan dari #5)

Setelah menghapus antipattern `window.$fileURL`, buat composable ini untuk akses konfigurasi global yang konsisten:

```js
// src/composables/useAppConfig.js
export function useAppConfig() {
  return {
    fileURL: import.meta.env.VITE_FILE_URL || "/file/",
    appId: Number(import.meta.env.VITE_APP_ID) || 1,
    apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  };
}
```

---

### 12. Verifikasi `.env.example` Selalu Sinkron

Pastikan `.env.example` selalu diperbarui setiap ada environment variable baru yang ditambahkan ke `.env`. Ini kritis saat menggunakan project ini sebagai template — developer baru tidak akan tahu variable apa yang dibutuhkan jika `.env.example` sudah stale.

**Isi `.env.example` yang direkomendasikan untuk dicek**:
```env
VITE_API_BASE_URL=https://your-api.domain.com/api
VITE_FILE_URL=https://your-api.domain.com/storage/
VITE_APP_ID=1
VITE_SYRINGE_URL=
VITE_MALLE_URL=
```

---

## Checklist Template Readiness (Updated)

### ✅ Sudah Selesai (Post Sprint 6)
- [x] Semua folder legacy dihapus
- [x] `logger.js` dibuat dan digunakan di views/stores/components/api
- [x] `ui.store.js` terpusat dan teruji
- [x] Design tokens `_variables.scss`
- [x] Base components (Button, Input, Dialog, Loader, Card)
- [x] `README.md` komprehensif
- [x] `esbuild.drop` console di production
- [x] Vulnerability packages dihapus
- [x] Sass `@use` (bukan `@import`) & pemisahan `App.scss` ke partials modular
- [x] `AGENTS.md` + `.agents/skills/` (local, tidak di Git)
- [x] Unit test Vitest terpasang (18 tests, 5 suites passing)
- [x] `console.log` di seluruh `src/` dibersihkan & dipusatkan ke `logger`
- [x] `localStorage` langsung di components & views digantikan `StorageService`
- [x] Bersihkan stub Vue 2 di `src/util/eventBus.js`
- [x] Ganti `console.error` di `src/composables/useApi.js` dengan `logger.error`
- [x] Hapus antipattern `window.$fileURL` dan `app.config.globalProperties` → diganti `useAppConfig.js`
- [x] `useForm.js` composable dibuat dan diuji
- [x] `BaseCard.vue` base component dibuat
- [x] Verifikasi `.env.example` sinkron

---

*Dokumen ini dibuat berdasarkan audit codebase pada 21 Agustus 2026.*

---

## 🔐 Security & Performance Audit (Sprint 7)

> Audit mendalam fokus pada security dan performance. Ditemukan 9 issue yang perlu ditangani.
> **Tanggal Audit**: 21 Agustus 2026

---

### 🔴 Keamanan (CRITICAL)

#### S1. Token Auth Dikirim via URL Query String — Masalah Keamanan Serius

**Severity**: 🔴 HIGH

**Temuan**: Auth token dikirim sebagai query parameter URL (`?token=...`) di beberapa tempat:
```js
// StepWelcome.vue, StepResult.vue, Header.vue
router.push(`/?token=${data.token}`);
window.location.href = `${VITE_SYRINGE_URL}?token=${tokenProvider.value}`;
```

**Risiko**:
1. Token **tersimpan di browser history** dan bisa dilihat siapapun yang mengakses riwayat browser
2. Token **muncul di server access log** (Apache/Nginx di cPanel) — sysadmin bisa membacanya
3. Token **dikirim ke referer header** jika user klik link ke situs lain
4. Token bisa dicuri via XSS dari `window.location.href`

**Solusi yang Direkomendasikan**:
```js
// ❌ JANGAN — token di URL
router.push(`/?token=${data.token}`);

// ✅ GUNAKAN — simpan token dulu, redirect ke home biasa
StorageService.setToken(data.token);
router.push("/");

// Untuk redirect ke app eksternal:
// POST token via form tersembunyi, atau gunakan sessionStorage sementara
// kemudian baca dari StorageService di halaman target
```

> **Catatan untuk cross-app redirect** (`VITE_SYRINGE_URL`, `VITE_MALLE_URL`):
> Karena redirect ke app berbeda (cross-origin), token di URL memang diperlukan. Namun token harus **segera dihapus dari URL** setelah app target menerimanya (menggunakan `replaceState`) dan dipindahkan ke localStorage. Ini sudah menjadi best practice SSO sederhana.

**File yang perlu diupdate:**
- `src/components/auth/steps/StepWelcome.vue` — 4 lokasi
- `src/components/auth/steps/StepResult.vue` — 1 lokasi  
- `src/components/Header.vue` — 2 lokasi (route `/` setelah mount)

---

#### S2. Token Disimpan di `localStorage` — XSS Vulnerability

**Severity**: 🟠 MEDIUM (mitigasi parsial sudah ada)

**Temuan**: Auth token bearer disimpan di `localStorage` via `StorageService.setToken()`.

**Risiko**: `localStorage` dapat diakses oleh JavaScript apapun yang berjalan di halaman — termasuk script XSS. Jika ada XSS attack berhasil, token langsung bisa dicuri.

**Alternatif yang lebih aman (pertimbangan):**

| Opsi | XSS Safe | CSRF Safe | Kompleksitas |
|---|---|---|---|
| `localStorage` *(sekarang)* | ❌ | ✅ | Rendah |
| `httpOnly Cookie` | ✅ | ❌ (butuh CSRF token) | Tinggi (butuh backend) |
| `sessionStorage` | ❌ | ✅ | Rendah (tab-isolated) |
| `Memory (Pinia)` + refresh token | ✅ | ✅ | Tinggi |

**Rekomendasi untuk project ini** (cPanel static hosting):
Karena backend tidak dikontrol, opsi `httpOnly cookie` tidak bisa diimplementasikan dari frontend. Langkah mitigasi yang bisa dilakukan:

```js
// 1. Implementasi token expiry check di StorageService
getToken: () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");
  if (expiry && Date.now() > Number(expiry)) {
    StorageService.clearAuth();
    return null;
  }
  return token;
},
setToken: (token, expiryMs = 24 * 60 * 60 * 1000) => {
  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", String(Date.now() + expiryMs));
},
```

```js
// 2. Bersihkan token saat tab/window ditutup (gunakan sessionStorage untuk non-remember-me)
// Di auth.store.js atau main.js:
window.addEventListener("beforeunload", () => {
  if (!StorageService.getRememberMe()) {
    StorageService.clearAuth();
  }
});
```

---

#### S3. `v-html` Digunakan Tanpa Sanitasi — Potensi XSS

**Severity**: 🟠 MEDIUM

**Temuan**: `v-html` digunakan di `PrivacyTerms.vue` untuk merender konten dari API:
```js
// PrivacyTerms.vue
v-html="formatInfo(privacyData['info_' + i])"

function formatInfo(info) {
  return info ? info.replace(/\n/g, "<br>") : "";
}
```

**Risiko**: Jika endpoint `/privacy-policy/type/...` berhasil di-inject oleh attacker, konten `<script>` bisa dieksekusi di browser user.

**Solusi**: Install `DOMPurify` dan sanitasi sebelum `v-html`:
```bash
npm install dompurify
```

```js
import DOMPurify from "dompurify";

function formatInfo(info) {
  if (!info) return "";
  const withLineBreaks = info.replace(/\n/g, "<br>");
  return DOMPurify.sanitize(withLineBreaks);
}
```

---

#### S4. `.htaccess` Tidak Ada Security Headers

**Severity**: 🟡 LOW-MEDIUM

**Temuan**: `public/.htaccess` saat ini hanya mengandung konfigurasi rewrite Vue Router, tanpa security headers sama sekali.

**Risiko**: Browser tidak mendapat instruksi keamanan → rentan terhadap clickjacking, MIME sniffing, dan XSS dari browser lama.

**Solusi**: Tambahkan security headers ke `.htaccess`:
```apache
# Security Headers
<IfModule mod_headers.c>
  # Cegah clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # Cegah MIME-type sniffing
  Header always set X-Content-Type-Options "nosniff"
  
  # Enable XSS Protection di browser lama
  Header always set X-XSS-Protection "1; mode=block"
  
  # Referrer Policy — jangan kirim token ke referer header
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  
  # Content Security Policy (sesuaikan dengan CDN yang dipakai)
  # Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  
  # HSTS (aktifkan jika sudah HTTPS)
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

---

### 🟡 Kualitas Kode & Maintainability

#### S5. `logger.log(error)` di `MyProfile.vue` — Seharusnya `logger.error`

**Severity**: 🟡 LOW

**Temuan**: Di `src/views/MyProfile.vue`, error dari catch block di-log menggunakan `logger.log()` bukan `logger.error()`. Ini berarti error **tidak akan muncul di production** karena `logger.log` hanya aktif di dev mode.

```js
// MyProfile.vue — 10+ lokasi
} catch (error) {
  logger.log(error);  // ❌ Salah! Tidak terlihat di production
```

**Perbaikan:**
```js
} catch (error) {
  logger.error("MyProfile error:", error);  // ✅ Aktif di dev & production
```

---

#### S6. Dua HTTP Client Berbeda (`@/util/axios` vs `@/api/http.js`)

**Severity**: 🟡 MEDIUM

**Temuan**: Project memiliki dua HTTP client berbeda:

| File | Fitur | Dipakai oleh |
|---|---|---|
| `src/util/axios.js` | baseURL only, tidak ada auth interceptor | Header.vue, MyProfile.vue, semua steps, Footer.vue, TrendingApps.vue, Landing.vue |
| `src/api/http.js` | Auto auth header, 401 handler, timeout 10s | `src/composables/useApi.js` (1 file) |

**Masalah**: Seluruh komponen masih menggunakan `@/util/axios` yang **tidak memiliki auto-attach token** — setiap komponen harus manual fetch token dari `StorageService` dan set header `Authorization: Bearer`. Duplikasi boilerplate di setiap function.

**Solusi**: Migrasi seluruh komponen/views untuk menggunakan `@/api/http.js`:
```js
// ❌ Sekarang — di setiap function
const tokenVal = StorageService.getToken();
axios.get("/gypsy-user", {
  headers: { Authorization: `Bearer ${tokenVal}` }
});

// ✅ Seharusnya — http.js sudah auto-attach token
http.get("/gypsy-user"); // Token otomatis ditambahkan via interceptor
```

**File yang perlu dimigrasi:**
- `src/components/Header.vue` — ~10 API calls manual
- `src/views/MyProfile.vue` — ~12 API calls manual
- `src/components/auth/steps/StepWelcome.vue`
- `src/components/auth/steps/StepPersonalMobile.vue`
- `src/components/auth/steps/StepPersonalSocials.vue`
- `src/components/auth/steps/StepPersonalEmail.vue`
- `src/components/auth/steps/StepOTPEmail.vue`
- `src/components/auth/steps/StepCreatePassword.vue`
- `src/components/Footer.vue`, `TrendingApps.vue`, `Landing.vue`, `PrivacyTerms.vue`

**Manfaat**: Setiap komponen tidak perlu lagi `const tokenVal = StorageService.getToken()` + manual header — lebih bersih, DRY, dan konsisten.

---

### 🟢 Performance

#### P1. Tidak Ada Request Deduplication / Caching untuk Data Statis

**Severity**: 🟢 LOW

**Temuan**: Data seperti `/groups`, `/header`, `/city`, `/footer` di-fetch ulang setiap kali `Header.vue` di-mount — padahal data ini jarang berubah.

**Solusi**: Tambahkan in-memory cache sederhana untuk request idempotent:
```js
// di http.js atau useApi.js
const _cache = new Map();

async function fetchCached(url, ttlMs = 5 * 60 * 1000) {
  const cached = _cache.get(url);
  if (cached && Date.now() - cached.ts < ttlMs) return cached.data;
  const res = await http.get(url);
  _cache.set(url, { data: res.data, ts: Date.now() });
  return res.data;
}
```

---

#### P2. `old/util/axios.js` Tidak Punya Timeout

**Severity**: 🟢 LOW

**Temuan**: `src/util/axios.js` (legacy) tidak menetapkan timeout sama sekali. Jika server lambat atau tidak merespons, request akan menggantung selamanya.

```js
// util/axios.js — TIDAK ada timeout
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// Tidak ada: axios.defaults.timeout = ...
```

`src/api/http.js` (baru) sudah menetapkan `timeout: 10000`. Ini jadi alasan tambahan untuk migrasi ke `http.js` (lihat S6).

---

#### P3. Geolocation di `location.store.js` Tidak Ada Timeout/Fallback Eksplisit

**Severity**: 🟢 LOW

**Temuan**: `navigator.geolocation.getCurrentPosition()` di `location.store.js` tidak menetapkan opsi `timeout` dan `maximumAge`:
```js
navigator.geolocation.getCurrentPosition(
  (position) => { ... },
  (error) => { logger.error("Error geolocation:", error); }
  // Tidak ada opsi: timeout, maximumAge
);
```

**Solusi**:
```js
navigator.geolocation.getCurrentPosition(
  (position) => { ... },
  (error) => { logger.error("Error geolocation:", error); },
  { timeout: 5000, maximumAge: 60000, enableHighAccuracy: false }
);
```

---

## Checklist Sprint 7 (Security & Performance)

### ✅ Sudah Selesai (Post Sprint 7)

**Security**:
- [x] **[S1]** Hapus token dari URL query string — ganti dengan simpan ke StorageService → redirect bersih (`StepWelcome.vue`, `StepResult.vue`, `Header.vue`)
- [x] **[S2]** Tambah token expiry check di `StorageService.getToken()` / `setToken()` / `clearAuth()`
- [x] **[S3]** Install `dompurify` dan sanitasi `v-html` di `PrivacyTerms.vue`
- [x] **[S4]** Tambah security headers ke `public/.htaccess`
- [x] **[S5]** Ganti `logger.log(error)` → `logger.error(...)` di `MyProfile.vue` (15 lokasi catch block)

**Architecture / Performance**:
- [x] **[S6]** Migrasi seluruh komponen dari `@/util/axios` ke `@/api/http.js` (eliminasi manual token header di seluruh view/component)
- [x] **[P1]** Buat `useFetch.js` composable dengan in-memory cache + unit test (21 total tests passing)
- [x] **[P2/P3]** Migrasi ke `http.js` (dengan default timeout 10s) dan tambah geolocation timeout 5s di `location.store.js`
- [x] **[DEP]** Deprecate `src/util/axios.js`

---

*Audit dan eksekusi selesai pada 21 Agustus 2026. Seluruh 9 issue keamanan dan performa telah berhasil diimplementasikan dan diverifikasi.*
