import { describe, it, expect, vi } from "vitest";
import { useApi } from "@/composables/useApi";

describe("useApi composable", () => {
  it("data terisi setelah execute berhasil", async () => {
    const mockFn = vi.fn().mockResolvedValue({ data: { id: 1, name: "Test" } });
    const { data, isLoading, error, execute } = useApi(mockFn);

    const result = await execute();
    expect(data.value).toEqual({ id: 1, name: "Test" });
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  it("isLoading true saat execute berjalan", async () => {
    let resolvePromise;
    const mockFn = vi.fn(() => new Promise((r) => (resolvePromise = r)));
    const { isLoading, execute } = useApi(mockFn);

    const p = execute();
    expect(isLoading.value).toBe(true);
    resolvePromise({ data: null });
    await p;
    expect(isLoading.value).toBe(false);
  });

  it("error terisi ketika execute gagal", async () => {
    const mockError = new Error("Network Error");
    const mockFn = vi.fn().mockRejectedValue(mockError);
    const { data, error, execute } = useApi(mockFn);

    await expect(execute()).rejects.toThrow("Network Error");
    expect(error.value).toBe(mockError);
    expect(data.value).toBeNull();
  });
});
