/**
 * useAppConfig.js
 *
 * Composable untuk mengakses konfigurasi global aplikasi dari env variables.
 * Menggantikan antipattern app.config.globalProperties.$fileURL
 *
 * Penggunaan:
 *   import { useAppConfig } from "@/composables/useAppConfig";
 *   const { fileURL, appId, apiBaseURL } = useAppConfig();
 */
export function useAppConfig() {
  return {
    fileURL: import.meta.env.VITE_FILE_URL || "/file/",
    appId: Number(import.meta.env.VITE_APP_ID) || 1,
    apiBaseURL: import.meta.env.VITE_API_BASE_URL || "",
  };
}

export default useAppConfig;
