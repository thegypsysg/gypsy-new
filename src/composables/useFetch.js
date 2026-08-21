/**
 * useFetch.js
 *
 * Composable untuk fetch data dengan in-memory cache.
 * Digunakan untuk endpoint statis/jarang berubah (header, footer, groups, city).
 *
 * @param {string} url - endpoint path
 * @param {Object} options - { ttlMs: number (default 5 menit), immediate: boolean }
 */
import { ref } from "vue";
import http from "@/api/http";
import { logger } from "@/utils/logger";

const _cache = new Map();

export function useFetch(url, { ttlMs = 5 * 60 * 1000, immediate = true } = {}) {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function execute(overrideUrl) {
    const target = overrideUrl || url;
    const cached = _cache.get(target);
    if (cached && Date.now() - cached.ts < ttlMs) {
      data.value = cached.data;
      return cached.data;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const res = await http.get(target);
      data.value = res.data;
      _cache.set(target, { data: res.data, ts: Date.now() });
      return res.data;
    } catch (err) {
      error.value = err;
      logger.error(`useFetch error [${target}]:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  if (immediate && url) {
    execute();
  }

  return { data, isLoading, error, execute };
}

export default useFetch;
