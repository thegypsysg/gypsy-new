/**
 * http.js
 *
 * Centralized HTTP client menggunakan Axios.
 * Fitur:
 * - Auto-attach Authorization token dari localStorage
 * - Auto-handle 401 (redirect ke login)
 * - baseURL dari environment variable
 * - Default timeout 10 detik
 *
 * Gunakan file ini sebagai pengganti @/util/axios untuk semua kode baru.
 * File lama @/util/axios akan di-retire secara bertahap di Sprint 2.
 */
import axios from "axios";
import router from "@/router";
import StorageService from "@/services/storage.service";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request Interceptor — auto-attach token
http.interceptors.request.use(
  (config) => {
    const token = StorageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — auto-handle 401
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      StorageService.clearAuth();
      router.push("/sign-in");
    }
    return Promise.reject(error);
  }
);

export default http;
