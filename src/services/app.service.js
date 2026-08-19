/**
 * app.service.js
 *
 * Service untuk data aplikasi (app listing, groups, contact).
 */
import http from "@/api/http";

const AppService = {
  /** Ambil semua data apps */
  getApps: () => http.get("/app"),

  /** Ambil daftar group/kategori apps */
  getGroups: () => http.get("/groups"),

  /** Ambil data contact per app */
  getContact: (appId) => http.get(`/app/contact/${appId}`),

  /** Ambil daftar applicants */
  getApplicants: () => http.get("/applicants"),
};

export default AppService;
