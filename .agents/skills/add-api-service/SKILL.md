---
name: add-api-service
description: >-
  Gunakan skill ini ketika user meminta membuat API service baru, menambah
  endpoint baru, atau menghubungkan fitur ke backend API. Skill ini menjabarkan
  cara membuat service layer yang benar di project ini.
---

# Skill: Menambah API Service Baru

## Aturan Service di Project Ini

- Satu file service per domain. Nama file: `src/services/namaDomain.service.js`
- Semua service **WAJIB** menggunakan `http` dari `src/api/http.js` (bukan `axios` dari `src/util/axios.js`).
- `src/api/http.js` sudah memiliki interceptor untuk menangani Authorization header dan error secara global.
- Nama method service mengikuti pola: `getList`, `getById`, `create`, `update`, `delete`.
- Service **tidak** boleh mengurus state atau memanggil Pinia store — itu tugas store.

## Referensi: `src/api/http.js`

Interceptor yang sudah terpasang di `http.js`:
- **Request**: Otomatis menambahkan `Authorization: Bearer <token>` dari `StorageService`.
- **Response error**: Jika 401 Unauthorized, otomatis logout user (clear auth state).

## Template Service Baku

```js
/**
 * namaDomain.service.js
 *
 * Service layer untuk API calls domain <nama domain>.
 * Semua endpoint terkait <nama domain> ada di sini.
 */
import http from "@/api/http";

const NamaDomainService = {
  /**
   * Mengambil daftar semua item.
   */
  getList: () => http.get("/nama-endpoint"),

  /**
   * Mengambil detail satu item berdasarkan ID.
   * @param {number|string} id
   */
  getById: (id) => http.get(`/nama-endpoint/${id}`),

  /**
   * Membuat item baru.
   * @param {object} payload - Data yang akan dikirim.
   */
  create: (payload) => http.post("/nama-endpoint", payload),

  /**
   * Memperbarui item yang sudah ada.
   * @param {number|string} id
   * @param {object} payload
   */
  update: (id, payload) => http.put(`/nama-endpoint/${id}`, payload),

  /**
   * Menghapus item.
   * @param {number|string} id
   */
  delete: (id) => http.delete(`/nama-endpoint/${id}`),
};

export default NamaDomainService;
```

## Contoh Service yang Sudah Ada (Referensi)

Lihat file-file berikut sebagai referensi pola yang benar:
- `src/services/auth.service.js` — contoh POST dengan payload
- `src/services/user.service.js` — contoh PUT dan upload file
- `src/services/location.service.js` — contoh GET dengan query params
- `src/services/content.service.js` — contoh GET endpoint publik (tanpa auth header)

## Upload File / FormData

Untuk endpoint yang menerima file upload, gunakan `FormData`:

```js
uploadAvatar: (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  return http.post("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},
```

## Endpoint Publik (Tanpa Auth)

Jika endpoint tidak memerlukan token, override header di options:

```js
getPublicData: () =>
  http.get("/public-endpoint", {
    headers: { Authorization: "" },
  }),
```

## Verifikasi

Setelah membuat service, jalankan:
```bash
npm run build
```
Pastikan tidak ada error kompilasi.
