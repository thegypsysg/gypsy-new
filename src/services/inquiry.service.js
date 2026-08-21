/**
 * inquiry.service.js
 *
 * Service untuk operasi API Inquiry / Partnership.
 * Endpoint: /inquiry
 */
import http from "@/api/http";

const InquiryService = {
  /**
   * Mengirim form inquiry partnership.
   * @param {Object} payload
   * @param {string} payload.contact_person - Nama kontak
   * @param {string} payload.email_id - Email kontak
   * @param {string} payload.company_name - Nama bisnis/perusahaan
   * @param {string} payload.contact_number - Nomor kontak (WhatsApp)
   * @param {string} payload.city - Kota
   * @returns {Promise}
   */
  create: (payload) => http.post("/inquiry", payload),
};

export default InquiryService;
