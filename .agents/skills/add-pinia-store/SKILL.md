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
- Gunakan `defineStore` dengan **setup function style** agar konsisten dengan composable pattern Vue 3.
- **JANGAN** akses `localStorage` langsung. Gunakan `StorageService` dari `src/services/storage.service.js`.
- **JANGAN** import `axios` langsung di store. Gunakan Service Layer (`src/services/`).
- Gunakan `logger` dari `@/utils/logger`, bukan `console.log`.
- Untuk store yang punya unit test, buat di `src/stores/__tests__/<namaDomain>.store.test.js`.

## Template Store Baku

Salin dan sesuaikan template berikut:

```js
/**
 * namaDomain.store.js
 *
 * Pinia store untuk manajemen state <deskripsi singkat>.
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { logger } from "@/utils/logger";
import NamaService from "@/services/nama.service";

export const useNamaStore = defineStore("namaDomain", () => {
  // --- State ---
  const items = ref([]);
  const selectedItem = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // --- Getters ---
  const totalItems = computed(() => items.value.length);

  // --- Actions ---
  function setSelectedItem(item) {
    selectedItem.value = item;
  }

  async function fetchItems() {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await NamaService.getList();
      items.value = data.data;
      logger.log("Items berhasil dimuat:", items.value.length);
    } catch (err) {
      logger.error("Error fetching items:", err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  function clearStore() {
    items.value = [];
    selectedItem.value = null;
    error.value = null;
  }

  return {
    items,
    selectedItem,
    isLoading,
    error,
    totalItems,
    setSelectedItem,
    fetchItems,
    clearStore,
  };
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

## Integrasi StorageService

Jika store perlu menyimpan atau membaca dari localStorage (misalnya: token, preferensi user):

```js
import StorageService from "@/services/storage.service";

// Simpan dengan expiry default (24 jam)
StorageService.set("key", value);

// Simpan dengan expiry custom (dalam milidetik)
StorageService.set("key", value, 7 * 24 * 60 * 60 * 1000); // 7 hari

// Baca (otomatis null jika expired)
const value = StorageService.get("key");

// Hapus
StorageService.remove("key");
```

## Template Unit Test Store

Buat file `src/stores/__tests__/<namaDomain>.store.test.js`:

```js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNamaStore } from "@/stores/nama.store";
import NamaService from "@/services/nama.service";

vi.mock("@/services/nama.service");

describe("useNamaStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetchItems berhasil mengisi state items", async () => {
    NamaService.getList.mockResolvedValue({ data: { data: [{ id: 1 }] } });
    const store = useNamaStore();
    await store.fetchItems();
    expect(store.items).toHaveLength(1);
    expect(store.isLoading).toBe(false);
  });

  it("fetchItems mengisi error jika gagal", async () => {
    NamaService.getList.mockRejectedValue(new Error("Network Error"));
    const store = useNamaStore();
    await store.fetchItems();
    expect(store.error).toBe("Network Error");
  });
});
```

## Verifikasi

Setelah membuat store, jalankan:
```bash
npm run test:run
npm run build
```
