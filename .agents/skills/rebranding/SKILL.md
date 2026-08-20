---
name: rebranding
description: >-
  Gunakan skill ini ketika user ingin menggunakan project ini sebagai template
  untuk project baru, atau ingin mengganti nama brand, warna, dan identitas
  visual project. Skill ini menjabarkan seluruh file yang perlu diubah untuk
  rebranding yang bersih dan menyeluruh.
---

# Skill: Rebranding Project ke Template Baru

Gunakan skill ini ketika memulai project baru dari template ini, atau ketika mengganti identitas visual.

## Daftar File yang Harus Diubah

### 1. Warna Brand — `src/plugins/vuetify.js`

Ganti warna di dalam objek `gypsyTheme.colors`:

```js
const gypsyTheme = {
  dark: false,
  colors: {
    primary: "#FF6B35",    // ← Ganti warna utama brand
    secondary: "#1A1A2E",  // ← Ganti warna sekunder
    accent: "#E94560",     // ← Ganti warna aksen
    background: "#FFFFFF",
    surface: "#F8F8F8",
  },
};
```

### 2. Design Tokens — `src/assets/style/_variables.scss`

Perbarui CSS custom properties sesuai brand baru:

```scss
:root {
  --color-primary: #e53935;        // ← Warna utama
  --color-primary-dark: #b71c1c;
  --color-primary-light: #ef9a9a;
  --color-secondary: #1565c0;
  // dll...
}
```

### 3. Nama & Meta Tag — `index.html`

Ubah title, description, dan Open Graph tags:

```html
<title>Nama Project Baru</title>
<meta name="description" content="Deskripsi project baru..." />
<meta property="og:title" content="Nama Project Baru" />
<meta property="og:description" content="Deskripsi project baru..." />
<meta property="og:url" content="https://domain-baru.com/" />
<meta property="og:image" content="https://domain-baru.com/og-image.webp" />
```

### 4. Environment Variables — `.env`

Ganti semua URL dan konfigurasi yang spesifik ke project lama:

```env
VITE_API_BASE_URL=https://api.domain-baru.com/api
VITE_FILE_URL=https://api.domain-baru.com/storage/
VITE_APP_ID=1
```

### 5. Favicon & Aset Visual — `public/favicon.ico` dan `src/assets/images/`

- Ganti `public/favicon.ico` dengan favicon brand baru.
- Ganti gambar-gambar di `src/assets/images/` (logo, banner, background).
- Jalankan `npm run optimize:images` setelah menambahkan gambar baru agar terkonversi ke WebP.

### 6. Footer & Header Data

Teks nama brand, copyright, dan link media sosial biasanya diambil dari API (`/footer`, `/header`).
Pastikan data di backend sudah disesuaikan, atau update langsung di komponen:
- `src/components/Footer.vue`
- `src/components/Header.vue`

### 7. `package.json`

Ganti nama project:
```json
{
  "name": "nama-project-baru",
  "version": "1.0.0"
}
```

### 8. `README.md`

Update dokumentasi dengan informasi project baru.

## Checklist Rebranding

```
[ ] Warna brand di vuetify.js sudah diganti
[ ] Design tokens di _variables.scss sudah diperbarui
[ ] Title & meta tags di index.html sudah diganti
[ ] .env sudah dikonfigurasi untuk backend baru
[ ] Favicon sudah diganti
[ ] Gambar aset lama sudah diganti (banner, logo, background)
[ ] npm run optimize:images sudah dijalankan untuk gambar baru
[ ] npm run build berhasil tanpa error
[ ] Tampilan diperiksa di browser
```

## Verifikasi

```bash
npm run optimize:images  # jika ada gambar baru
npm run build
```
