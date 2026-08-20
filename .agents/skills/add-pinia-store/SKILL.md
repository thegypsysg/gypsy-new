---
name: add-pinia-store
description: >-
  Gunakan skill ini ketika user meminta menambah Pinia store baru untuk
  state management domain fitur tertentu. Skill ini menjabarkan struktur
  dan pattern baku yang digunakan di project ini.
---

# Skill: Menambah Pinia Store Baru

## Aturan Store di Project Ini

- Satu file store per domain. Nama file: `src/stores/namaDomain.store.js`
- Gunakan `defineStore` dengan **options API style** agar konsisten dengan store yang ada.
- **JANGAN** akses `localStorage` langsung. Gunakan `StorageService` dari `src/services/storage.service.js`
- **JANGAN** import `axios` langsung di store. Gunakan Service Layer (`src/services/`).
- Gunakan `logger` dari `@/utils/logger`, bukan `console.log`.

## Template Store Baku

Salin dan sesuaikan template berikut:

```js
/**
 * namaDomain.store.js
 *
 * Pinia store untuk manajemen state <deskripsi singkat>.
 */
import { defineStore } from "pinia";
import { logger } from "@/utils/logger";
import NamaService from "@/services/nama.service";

export const useNamaStore = defineStore("namaDomain", {
  state: () => ({
    items: [],
    selectedItem: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    totalItems: (state) => state.items.length,
  },

  actions: {
    // --- Setters ---
    setSelectedItem(item) {
      this.selectedItem = item;
    },

    // --- Async Actions ---
    async fetchItems() {
      this.isLoading = true;
      this.error = null;
      try {
        const { data } = await NamaService.getList();
        this.items = data.data;
        logger.log("Items berhasil dimuat:", this.items.length);
      } catch (error) {
        logger.error("Error fetching items:", error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // --- Reset ---
    clearStore() {
      this.items = [];
      this.selectedItem = null;
      this.error = null;
    },
  },
});

export default useNamaStore;
```

## Integrasi UI Store

Gunakan `useUiStore()` di **komponen/view** untuk loading overlay dan snackbar global,
**BUKAN** di dalam store domain itu sendiri:

```js
import { useUiStore } from "@/stores/ui.store";
import { useNamaStore } from "@/stores/nama.store";

const uiStore = useUiStore();
const namaStore = useNamaStore();

async function loadData() {
  uiStore.setLoading(true);
  await namaStore.fetchItems();
  if (namaStore.error) {
    uiStore.showSnackbar("Gagal memuat data.", "error");
  }
  uiStore.setLoading(false);
}
```

## Verifikasi

Setelah membuat store, jalankan:
```bash
npm run test:run
npm run build
```
