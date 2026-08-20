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

1. Baca AGENTS.md di root project untuk memahami rules aktif.
2. Grep codebase untuk memastikan tidak ada fitur serupa yang sudah ada.
3. Identifikasi endpoint API yang dibutuhkan (tanyakan ke user jika belum jelas).

## Langkah 2 — Service Layer (src/services/)

Buat file src/services/<namaFitur>.service.js:

`js
import http from "@/api/http";

const NamaFiturService = {
  getList: () => http.get("/nama-endpoint"),
  getById: (id) => http.get(/nama-endpoint/),
  create: (payload) => http.post("/nama-endpoint", payload),
  update: (id, payload) => http.put(/nama-endpoint/, payload),
  delete: (id) => http.delete(/nama-endpoint/),
};

export default NamaFiturService;
`

## Langkah 3 — Pinia Store (src/stores/)

Buat file src/stores/<namaFitur>.store.js. Lihat skill dd-pinia-store untuk detail.

## Langkah 4 — View (src/views/)

- Gunakan <script setup> Composition API.
- Import store, gunakan useUiStore() untuk loading/snackbar.
- Gunakan <BaseButton>, <BaseInput>, <BaseDialog> dari src/components/base/.
- Jangan gunakan console.log — gunakan logger dari @/utils/logger.

Template minimal:

`ue
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
`

## Langkah 5 — Daftarkan Route (src/router/index.js)

Tambahkan route dengan lazy loading:

`js
{
  path: "/nama-fitur",
  name: "NamaFitur",
  component: () => import("@/views/NamaFiturView.vue"),
  meta: {
    requiresAuth: true, // tambahkan jika halaman membutuhkan login
  },
},
`

## Langkah 6 — Verifikasi

Jalankan:
`ash
npm run test:run
npm run build
`
Pastikan keduanya berhasil (exit code 0) sebelum menyatakan selesai.
