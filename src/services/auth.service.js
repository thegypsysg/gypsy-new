/**
 * auth.service.js
 *
 * Service untuk semua operasi autentikasi.
 * Endpoints: login, OTP, social auth, password.
 */
import http from "@/api/http";

const AuthService = {
  /** Login dengan email & password */
  login: (payload) => http.post("/gypsy/login", payload),

  /** Kirim OTP ke nomor HP / email */
  sendOtp: (payload) => http.post("/send-otp", payload),

  /** Login via social provider (google, facebook) */
  socialLogin: (socialName, payload) =>
    http.post(`/gypsy-login/${socialName}`, payload),

  /** Cek apakah email/mobile sudah terdaftar */
  checkEmailExists: (payload) =>
    http.post("/gypsy/check-info-by-email", payload),

  checkMobileExists: (payload) =>
    http.post("/gypsy-registration/check-mobile-exists", payload),

  /** Kirim link reset password ke email */
  sendForgetPasswordEmail: (payload) =>
    http.post("/gypsy/send-forget-password-email", payload),

  /** Set password baru (setelah OTP) */
  setPassword: (payload) => http.post("/gypsy-set-password", payload),

  /** Ganti password dari halaman profil */
  changePassword: (payload) => http.post("/gypsy-change-password", payload),

  /** Verifikasi OTP email */
  verifyEmailOtp: (payload) =>
    http.post("/gypsy/validate-verify-email-otp", payload),

  /** Logout */
  logout: () => http.get("/gypsy-logout"),
};

export default AuthService;
