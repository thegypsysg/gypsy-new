# Project Rules — Gypsy SG Vue 3 Template

Rules ini WAJIB diikuti oleh AI di setiap sesi kerja.
Project ini adalah **Vue 3 SPA Boilerplate** yang di-deploy ke **cPanel** (static file hosting).

---

## 🏗️ Arsitektur & Stack

- **Framework**: Vue 3 dengan <script setup> Composition API — TIDAK BOLEH menggunakan Options API.
- **Build Tool**: Vite 3 (JANGAN upgrade Vite ke versi mayor baru tanpa konfirmasi eksplisit user).
- **UI Library**: Vuetify 3 (Material Design 3). Gunakan Vuetify components terlebih dahulu sebelum membuat custom component dari scratch.
- **State Management**: Pinia — TIDAK BOLEH menggunakan Vuex atau global data store lain.
- **HTTP Client**: Gunakan src/api/http.js (centralized Axios instance) untuk API calls di stores dan services baru.
- **Routing**: Vue Router 4 dengan lazy loading dan auth guard sudah terpasang di src/router/index.js.

---

## 📁 Struktur Direktori Wajib

| Path | Keterangan |
|---|---|
| src/api/http.js | Axios centralized client. Gunakan ini untuk service baru. |
| src/assets/style/_variables.scss | SATU-SATUNYA sumber design tokens. Ubah DI SINI untuk rebranding. |
| src/components/base/ | BaseButton, BaseInput, BaseDialog, BaseLoader. Gunakan sebelum membuat komponen baru. |
| src/plugins/vuetify.js | Konfigurasi Vuetify & custom brand theme. |
| src/router/index.js | Route definitions. Selalu gunakan lazy loading. |
| src/services/ | API service layer. Satu file per domain. |
| src/stores/ | Pinia stores. Satu file per domain. |
| src/stores/ui.store.js | UI state: loading overlay, snackbar, drawer. |
| src/utils/logger.js | Logger production-safe. WAJIB digunakan, bukan console.log langsung. |
| src/views/ | Page-level components. Satu file per halaman/route. |

---

## ✅ Coding Standards Wajib

### Logging
DILARANG menggunakan console.log() langsung. Gunakan selalu:
`js
import { logger } from "@/utils/logger";
logger.log("...");    // hanya aktif di dev
logger.warn("...");   // hanya aktif di dev
logger.error("...");  // aktif di dev & production
`

### State Management (Pinia)
- State global di src/stores/. State UI (loading, snackbar, drawer) pakai useUiStore().
- JANGAN akses localStorage di komponen/view — gunakan StorageService dari src/services/storage.service.js.

### HTTP / API
- Service layer (src/services/) memanggil API, Pinia store memanggil service.
- Untuk service baru gunakan http dari src/api/http.js.

### Styling (SCSS)
- Gunakan token dari _variables.scss. Gunakan @use, BUKAN @import.

### Komponen
- Gunakan <BaseInput>, <BaseButton>, <BaseDialog> terlebih dahulu.
- Route baru: selalu lazy loading + meta: { requiresAuth: true } jika butuh login.

---

## 🚫 Dilarang

1. 
pm audit fix --force — bisa merusak Vuetify/Vite.
2. Menginstall package baru tanpa cek apakah alternatif sudah ada.
3. Vue 2 syntax atau library yang bergantung Vue 2.
4. Mengubah ite.config.js tanpa konfirmasi user.
5. Menghapus file tanpa grep terlebih dahulu untuk cek import aktif.
6. Menggunakan <style> tanpa lang="scss" jika menggunakan SCSS syntax.

---

## 🚀 Deployment (cPanel)

1. 
pm run build → output di folder dist/.
2. Upload SELURUH isi dist/ ke public_html/.
3. Pastikan public/.htaccess ikut ter-upload agar Vue Router history mode berfungsi.

---

## 🧪 Verifikasi Wajib

Setelah perubahan signifikan, SELALU jalankan:
`ash
npm run test:run
npm run build
`
Pastikan keduanya exit code 0 sebelum menyatakan pekerjaan selesai.

---

## 📝 Alur Kerja Standar AI

Urutan baku untuk menambah fitur baru:
1. Cek skills di .agents/skills/ yang relevan.
2. Buat/update **Service** di src/services/.
3. Buat/update **Pinia Store** di src/stores/.
4. Buat/update **View/Component** di src/views/ atau src/components/.
5. Daftarkan **Route** di src/router/index.js (lazy loading).
6. Jalankan 
pm run test:run && npm run build untuk verifikasi.
