import { setActivePinia, createPinia } from "pinia";
import { useUiStore } from "@/stores/ui.store";
import { describe, it, expect, beforeEach } from "vitest";

describe("useUiStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("setLoading(true) mengubah isLoading menjadi true", () => {
    const store = useUiStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
  });

  it("setLoading(false) mengubah isLoading menjadi false", () => {
    const store = useUiStore();
    store.setLoading(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("showSnackbar mengisi snackbar dengan message dan color", () => {
    const store = useUiStore();
    store.showSnackbar("Berhasil disimpan", "success");
    expect(store.snackbar.show).toBe(true);
    expect(store.snackbar.message).toBe("Berhasil disimpan");
    expect(store.snackbar.color).toBe("success");
  });

  it("showSnackbar default color adalah success", () => {
    const store = useUiStore();
    store.showSnackbar("Info");
    expect(store.snackbar.color).toBe("success");
  });

  it("toggleDrawer mengubah state isDrawerOpen", () => {
    const store = useUiStore();
    const initial = store.isDrawerOpen;
    store.toggleDrawer();
    expect(store.isDrawerOpen).toBe(!initial);
  });
});
