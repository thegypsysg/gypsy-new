import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFetch } from "../useFetch";

// Mock http
vi.mock("@/api/http", () => ({
  default: {
    get: vi.fn(),
  },
}));

import http from "@/api/http";

describe("useFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches data dan menyimpan ke cache", async () => {
    http.get.mockResolvedValueOnce({ data: { result: "ok" } });
    const { data, execute } = useFetch("/test", { immediate: false });
    await execute();
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(data.value).toEqual({ result: "ok" });
  });

  it("menggunakan cache saat TTL belum habis", async () => {
    http.get.mockResolvedValue({ data: { result: "cached" } });
    const { execute } = useFetch("/test-cache", { immediate: false, ttlMs: 60000 });
    await execute();
    await execute(); // call kedua — harus dari cache
    expect(http.get).toHaveBeenCalledTimes(1); // hanya 1x fetch
  });

  it("melempar error saat fetch gagal", async () => {
    http.get.mockRejectedValueOnce(new Error("Network Error"));
    const { execute, error } = useFetch("/fail", { immediate: false });
    await expect(execute()).rejects.toThrow("Network Error");
    expect(error.value).toBeInstanceOf(Error);
  });
});
