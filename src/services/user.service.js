/**
 * user.service.js
 *
 * Service untuk operasi data user (profil, registrasi).
 * Semua endpoint ini membutuhkan token (auto-attached oleh http.js).
 */
import http from "@/api/http";

const UserService = {
  /** Ambil data profil user yang sedang login */
  getUser: () => http.get("/gypsy-user"),

  /** Simpan data profil (generik) */
  saveUser: (payload) => http.post("/save-gypsy-user", payload),

  /** Registrasi user baru via email */
  registerByEmail: (payload) =>
    http.post("/gypsy/save-normal-user", payload),

  /** Registrasi user baru via nomor HP */
  registerByMobile: (payload) =>
    http.post("/gypsy/save-normal-user-by-mobile", payload),

  /** Simpan data user via social login */
  saveSocialUser: (payload) =>
    http.post("/gypsy/save-social-user", payload),

  /** Simpan lokasi terkini user */
  saveCurrentLocation: (payload) =>
    http.post("/gypsy/save-current-location", payload),

  /** Registrasi via OTP (flow mobile) */
  register: (payload) => http.post("/gypsy-registration", payload),
};

export default UserService;
