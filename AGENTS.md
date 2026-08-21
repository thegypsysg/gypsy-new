# Project Rules — Gypsy SG Vue 3 Template

Rules ini WAJIB diikuti oleh AI di setiap sesi kerja.
Project ini adalah **Vue 3 SPA Boilerplate** yang di-deploy ke **cPanel** (static file hosting).

---

## 🏗️ Arsitektur & Stack

- **Framework**: Vue 3 dengan `<script setup>` Composition API — TIDAK BOLEH menggunakan Options API.
- **Build Tool**: Vite 3 (JANGAN upgrade Vite ke versi mayor baru tanpa konfirmasi eksplisit user).
- **UI Library**: Vuetify 3 (Material Design 3). Gunakan Vuetify components terlebih dahulu sebelum membuat custom component dari scratch.
- **State Management**: Pinia — TIDAK BOLEH menggunakan Vuex atau global data store lain.
- **HTTP Client**: Gunakan `src/api/http.js` (centralized Axios instance) untuk API calls di stores dan services baru. `src/util/axios.js` sudah **@deprecated** — jangan digunakan untuk code baru.
- **Routing**: Vue Router 4 dengan lazy loading dan auth guard sudah terpasang di `src/router/index.js`.

---

## 📁 Struktur Direktori Wajib

| Path | Keterangan |
|---|---|
| `src/api/http.js` | Axios centralized client. Gunakan ini untuk service baru. |
| `src/assets/style/_variables.scss` | SATU-SATUNYA sumber design tokens. Ubah DI SINI untuk rebranding. |
| `src/assets/style/_animations.scss` | Reusable CSS keyframe animations global. |
| `src/assets/style/_components.scss` | Shared component styles. |
| `src/assets/style/_typography.scss` | Typography scale & heading utilities. |
| `src/assets/style/_utilities.scss` | Utility classes (spacing, flex, dll). |
| `src/components/base/` | BaseButton, BaseInput, BaseDialog, BaseCard, BaseLoader. Gunakan sebelum membuat komponen baru. |
| `src/composables/` | Reusable composables. `useApi`, `useFetch`, `useForm`, `useAppConfig`, `useResponsive`. |
| `src/plugins/vuetify.js` | Konfigurasi Vuetify & custom brand theme. |
| `src/router/index.js` | Route definitions. Selalu gunakan lazy loading. |
| `src/services/` | API service layer. Satu file per domain. |
| `src/services/storage.service.js` | Token + localStorage management dengan expiry support. |
| `src/stores/` | Pinia stores. Satu file per domain. |
| `src/stores/ui.store.js` | UI state: loading overlay, snackbar, drawer. |
| `src/utils/logger.js` | Logger production-safe. WAJIB digunakan, bukan console.log langsung. |
| `src/views/` | Page-level components. Satu file per halaman/route. |
| `public/.htaccess` | Konfigurasi Apache: rewrite rules Vue Router + security headers HTTP. |

---

## ✅ Coding Standards Wajib

### Logging
DILARANG menggunakan `console.log()` langsung. Gunakan selalu:
```js
import { logger } from "@/utils/logger";
logger.log("...");    // hanya aktif di dev
logger.warn("...");   // hanya aktif di dev
logger.error("...");  // aktif di dev & production
```

### State Management (Pinia)
- State global di `src/stores/`. State UI (loading, snackbar, drawer) pakai `useUiStore()`.
- JANGAN akses `localStorage` di komponen/view — gunakan `StorageService` dari `src/services/storage.service.js`.

### HTTP / API
- Service layer (`src/services/`) memanggil API, Pinia store memanggil service.
- Untuk service baru gunakan `http` dari `src/api/http.js`.
- **JANGAN** gunakan `src/util/axios.js` untuk code baru (deprecated).

### Composables
- Untuk data fetching reaktif di komponen, pertimbangkan `useFetch` dari `src/composables/useFetch.js` (memiliki built-in in-memory caching).
- Untuk form state + validasi, gunakan `useForm` dari `src/composables/useForm.js`.
- Untuk konfigurasi app (app name, logo, dll dari API `/header`), gunakan `useAppConfig` dari `src/composables/useAppConfig.js`.

### Styling (SCSS)
- Gunakan token dari `_variables.scss`. Gunakan `@use`, BUKAN `@import`.
- Partial SCSS tersedia: `_animations.scss`, `_components.scss`, `_typography.scss`, `_utilities.scss`.

### Komponen
- Gunakan `<BaseInput>`, `<BaseButton>`, `<BaseDialog>`, `<BaseCard>` terlebih dahulu.
- Route baru: selalu lazy loading + `meta: { requiresAuth: true }` jika butuh login.

---

## ⚠️ Aturan Khusus Vuetify `<v-img>`

**JANGAN** menggunakan `<v-img>` untuk:
1. Aset statis lokal dari `@/assets/...` — gunakan tag `<img>` biasa sebagai gantinya.
2. Source kosong `<v-img src="" />` — gunakan `<v-icon>` dengan MDI icon.
3. Di dalam `<v-lazy>` atau `<v-icon>` tanpa guard — selalu tambahkan `v-if="imageUrl"`.

**GUNAKAN** `<v-img>` hanya untuk URL dinamis dari API/backend, selalu dengan guard:
```vue
<v-img v-if="item.img" :src="fileURL + item.img" />
```

**Alasan**: Vuetify `VImg` menjalankan `pollForSize(img)` yang akan throw `TypeError: Cannot destructure property 'naturalHeight' of 'img' as undefined` jika `src` kosong atau element belum di-mount.

---

## 🔐 Security

- **Token**: Token auth disimpan via `StorageService`. Default expiry 24 jam. Jangan simpan token tanpa expiry.
- **Sanitasi HTML**: Gunakan `dompurify` untuk sanitasi konten HTML yang di-render dengan `v-html`. Jangan render HTML mentah dari API tanpa sanitasi.
- **HTTP Headers**: Security headers sudah terpasang di `public/.htaccess` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP).

---

## 🚫 Dilarang

1. `npm audit fix --force` — bisa merusak Vuetify/Vite.
2. Menginstall package baru tanpa cek apakah alternatif sudah ada.
3. Vue 2 syntax atau library yang bergantung Vue 2.
4. Mengubah `vite.config.js` tanpa konfirmasi user.
5. Menghapus file tanpa grep terlebih dahulu untuk cek import aktif.
6. Menggunakan `<style>` tanpa `lang="scss"` jika menggunakan SCSS syntax.
7. Menggunakan `console.log()` langsung — gunakan `logger`.
8. Menggunakan `<v-img src="@/assets/...">` untuk aset statis lokal.
9. Menggunakan `src/util/axios.js` untuk code baru (deprecated).
10. Menyimpan token auth tanpa expiry di `StorageService`.

---

## 🚀 Deployment (cPanel)

1. `npm run build` → output di folder `dist/`.
2. Upload SELURUH isi `dist/` ke `public_html/`.
3. Pastikan `public/.htaccess` ikut ter-upload agar Vue Router history mode berfungsi dan security headers aktif.

---

## 🧪 Verifikasi Wajib

Setelah perubahan signifikan, SELALU jalankan:
```bash
npm run test:run
npm run build
```
Pastikan keduanya exit code 0 sebelum menyatakan pekerjaan selesai.

---

## 📝 Alur Kerja Standar AI

Urutan baku untuk menambah fitur baru:
1. Cek skills di `.agents/skills/` yang relevan.
2. Buat/update **Service** di `src/services/`.
3. Buat/update **Pinia Store** di `src/stores/`.
4. Buat/update **View/Component** di `src/views/` atau `src/components/`.
5. Daftarkan **Route** di `src/router/index.js` (lazy loading).
6. Jalankan `npm run test:run && npm run build` untuk verifikasi.
