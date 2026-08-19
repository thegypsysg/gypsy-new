/**
 * content.service.js
 *
 * Service untuk konten statis (header, footer, privacy policy).
 */
import http from "@/api/http";

const ContentService = {
  /** Data header (logo, tagline, dll) */
  getHeader: () => http.get("/header"),

  /** Data footer */
  getFooter: () => http.get("/footer"),

  /** Konten privacy policy/terms */
  getPrivacy: (type) => http.get(`/privacy-policy/type/${type}`),
};

export default ContentService;
