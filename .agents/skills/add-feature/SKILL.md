---
name: add-feature
description: >-
  Gunakan skill ini ketika user meminta menambah fitur baru, halaman baru, atau
  modul baru ke project Vue 3 ini. Skill ini menjabarkan urutan baku: membuat
  service layer, pinia store, view/component, dan mendaftarkan route dengan benar.
---

# Skill: Menambah Fitur Baru

Ikuti urutan langkah berikut secara ketat.

## Langkah 1 — Identifikasi & Riset

1. Baca `AGENTS.md` di root project untuk memahami rules aktif.
2. Grep codebase untuk memastikan tidak ada fitur serupa yang sudah ada.
3. Identifikasi endpoint API yang dibutuhkan (tanyakan ke user jika belum jelas).

## Langkah 2 — Service Layer (`src/services/`)

Buat file `src/services/<namaFitur>.service.js`:

```js
import http from "@/api/http";

const NamaFiturService = {
  getList: () => http.get("/nama-endpoint"),
  getById: (id) => http.get(`/nama-endpoint/${id}`),
  create: (payload) => http.post("/nama-endpoint", payload),
  update: (id, payload) => http.put(`/nama-endpoint/${id}`, payload),
  delete: (id) => http.delete(`/nama-endpoint/${id}`),
};

export default NamaFiturService;
```

Lihat skill `add-api-service` untuk detail lebih lanjut.

## Langkah 3 — Pinia Store (`src/stores/`)

Buat file `src/stores/<namaFitur>.store.js`. Lihat skill `add-pinia-store` untuk detail.

## Langkah 4 — View (`src/views/`)

- Gunakan `<script setup>` Composition API.
- Import store, gunakan `useUiStore()` untuk loading/snackbar.
- Gunakan `<BaseButton>`, `<BaseInput>`, `<BaseDialog>`, `<BaseCard>` dari `src/components/base/`.
- Jangan gunakan `console.log` — gunakan `logger` dari `@/utils/logger`.

Template minimal:

```vue
<template>
  <v-container>
    <!-- konten halaman -->
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUiStore } from "@/stores/ui.store";
import { logger } from "@/utils/logger";
import NamaFiturService from "@/services/namaFitur.service";

const uiStore = useUiStore();
const items = ref([]);

async function fetchData() {
  uiStore.setLoading(true);
  try {
    const { data } = await NamaFiturService.getList();
    items.value = data.data;
  } catch (error) {
    logger.error("Gagal fetch data:", error);
    uiStore.showSnackbar("Gagal memuat data.", "error");
  } finally {
    uiStore.setLoading(false);
  }
}

onMounted(fetchData);
</script>

<style lang="scss">
@use "@/assets/style/variables" as *;
</style>
```

## Langkah 5 — Daftarkan Route (`src/router/index.js`)

Tambahkan route dengan lazy loading:

```js
{
  path: "/nama-fitur",
  name: "NamaFitur",
  component: () => import("@/views/NamaFiturView.vue"),
  meta: {
    requiresAuth: true, // tambahkan jika halaman membutuhkan login
  },
},
```

## Langkah 6 — Verifikasi

Jalankan:
```bash
npm run test:run
npm run build
```
Pastikan keduanya berhasil (exit code 0) sebelum menyatakan selesai.

---

## Composables yang Tersedia

Manfaatkan composables yang sudah ada sebelum membuat logika baru:

| Composable | Lokasi | Kegunaan |
|---|---|---|
| `useApi` | `src/composables/useApi.js` | Wrapper API call dengan reactive state (loading, error, data) |
| `useFetch` | `src/composables/useFetch.js` | Data fetching dengan in-memory cache |
| `useForm` | `src/composables/useForm.js` | Form state + validasi (required, email, minLength) |
| `useAppConfig` | `src/composables/useAppConfig.js` | Konfigurasi app dari API (nama, logo, dll) |
| `useResponsive` | `src/composables/useResponsive.js` | Breakpoint helpers (isMobile, isTablet, isDesktop) |

### Contoh `useForm` untuk form baru:

```js
import { useForm } from "@/composables/useForm";

const { fields, errors, validateAll, resetForm } = useForm({
  email: {
    value: "",
    rules: [{ required: true }, { email: true }],
  },
  password: {
    value: "",
    rules: [{ required: true }, { minLength: 8 }],
  },
});

function submit() {
  if (!validateAll()) return;
  // lanjut submit
}
```

### Contoh `useFetch` untuk data read-only:

```js
import { useFetch } from "@/composables/useFetch";

const { data, loading, error } = useFetch("/api/items");
// data adalah ref, reactive, auto-fetch on mount
```
