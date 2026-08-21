/**
 * @deprecated Gunakan `@/api/http` sebagai gantinya.
 * Seluruh komponen telah dimigrasikan ke `@/api/http` pada Sprint 7.
 */
import axios from "axios";
import { logger } from "@/utils/logger";

// Atur base URL API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.headers.post["Accept"] = "application/json";
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    logger.error("API response error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default axios;
