---
name: fix-vuetify-vimg
description: >-
  Gunakan skill ini ketika terjadi error "TypeError: Cannot destructure property
  'naturalHeight' of 'img' as it is undefined" di browser console, atau ketika
  bekerja dengan gambar di Vuetify 3. Skill ini menjabarkan kapan boleh dan
  tidak boleh menggunakan <v-img> serta cara yang benar menampilkan gambar.
---

# Skill: Aturan Penggunaan `<v-img>` di Vuetify 3

## Masalah

Vuetify 3 `VImg` menggunakan helper internal `pollForSize(img)` yang melakukan:

```js
const { naturalHeight: imgHeight, naturalWidth: imgWidth } = img;
```

Jika `img` adalah `undefined` (elemen belum di-mount, `src` kosong, atau aset statis di dalam `<v-lazy>`/`<v-icon>`), Vuetify akan throw:

```
TypeError: Cannot destructure property 'naturalHeight' of 'img' as it is undefined
```

---

## Aturan Baku

### ❌ DILARANG

```vue
<!-- 1. src kosong — FORBIDDEN -->
<v-img src="" />

<!-- 2. Aset lokal @/assets di dalam v-img — FORBIDDEN -->
<v-img src="@/assets/images/logo.webp" />

<!-- 3. v-img di dalam v-icon tanpa guard — FORBIDDEN -->
<v-icon>
  <v-img src="@/assets/images/icon.webp" />
</v-icon>

<!-- 4. v-img dinamis tanpa v-if — FORBIDDEN -->
<v-img :src="item.imageUrl" />
```

### ✅ YANG BENAR

```vue
<!-- 1. Aset statis lokal — gunakan <img> biasa -->
<img
  src="@/assets/images/logo.webp"
  alt="Logo"
  style="object-fit: contain;"
  loading="lazy"
/>

<!-- 2. Icon kecil — gunakan <v-icon> dengan MDI class -->
<v-icon>mdi-home</v-icon>

<!-- 3. Icon dengan gambar custom di dalam v-icon — gunakan <img> -->
<v-icon size="35">
  <img
    src="@/assets/images/icons/google.webp"
    alt="Google"
    style="width: 100%; height: 100%; object-fit: contain;"
  />
</v-icon>

<!-- 4. URL dinamis dari API — gunakan v-img dengan v-if guard -->
<v-img
  v-if="item.imageUrl"
  :src="fileURL + item.imageUrl"
  :alt="item.name"
  cover
/>

<!-- 5. Logo dari API dengan fallback — v-if pada v-img, v-else pada icon -->
<v-img
  v-if="headerData?.app_logo"
  :src="fileURL + headerData.app_logo"
  alt="App Logo"
  height="40"
  contain
/>
<v-icon v-else size="40">mdi-application</v-icon>
```

---

## Decision Tree

```
Apakah sumber gambar dari API/backend?
├── YA → Gunakan <v-img v-if="imageUrl" :src="fileURL + imageUrl" />
└── TIDAK (aset lokal @/assets/...)
    ├── Apakah ini icon kecil?
    │   ├── Ada di MDI? → Gunakan <v-icon>mdi-nama-icon</v-icon>
    │   └── Custom icon file? → Gunakan <img> di dalam <v-icon>
    └── Gambar biasa (banner, logo, ilustrasi)?
        └── Gunakan <img src="@/assets/..." loading="lazy" />
```

---

## File-File yang Sudah Diperbaiki (Referensi)

- `src/components/Header.vue` — logo dari API dengan `v-if="headerData?.app_logo"`
- `src/components/header/AppHeaderMobile.vue` — drawer logo + nav icons dengan `<img>` dan `<v-icon>`
- `src/components/Partners.vue` — partner images dengan `<img>` biasa
- `src/components/TrendingApps.vue` — card images dengan `v-if="card.img"`
- `src/components/Footer.vue` — app images dengan `v-if="item.img"`
- `src/components/auth/steps/StepWelcome.vue` — Google icon dengan `<img>` di dalam `<v-icon>`

---

## Verifikasi

Buka browser DevTools → Console. Pastikan tidak ada:
- `TypeError: Cannot destructure property 'naturalHeight'`
- `ReferenceError` terkait function yang belum didefinisikan

Jalankan juga:
```bash
npm run build
```
