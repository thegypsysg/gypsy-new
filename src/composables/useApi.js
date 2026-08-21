/**
 * useApi.js
 *
 * Composable untuk memanggil API dengan loading dan error state.
 * Menggunakan http.js (dengan auth interceptors).
 *
 * Penggunaan:
 *   import { useApi } from "@/composables/useApi";
 *   const { data, isLoading, error, execute } = useApi(() => UserService.getUser());
 *   await execute();
 */
import { ref } from "vue";
import { logger } from "@/utils/logger";

export function useApi(apiFunction) {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const execute = async (...args) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiFunction(...args);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      logger.error("API Error:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, execute };
}
