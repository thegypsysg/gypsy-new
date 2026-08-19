/**
 * eventBus.js
 *
 * Event bus menggunakan mitt (ringan, type-safe).
 * API kompatibel dengan versi sebelumnya:
 * - $on(event, callback)
 * - $off(event, callback)
 * - $emit(event, ...args)
 *
 * Diakses via: app.config.globalProperties.$eventBus
 * (diregister di main.js)
 *
 * Catatan: File ini tidak lagi membuat Vue instance kedua.
 * Import 'app' dari file ini untuk backward compatibility dengan
 * komponen yang menggunakan: app.config.globalProperties.$eventBus
 */
import mitt from "mitt";
import { createApp } from "vue";

// Buat emitter mitt
const emitter = mitt();

// Bungkus mitt dengan interface yang kompatibel dengan kode yang sudah ada
const eventBus = {
  $on: (event, callback) => emitter.on(event, callback),
  $off: (event, callback) => emitter.off(event, callback),
  $emit: (event, ...args) => emitter.emit(event, ...args),
};

// Buat Vue app stub untuk backward compatibility
// (komponen lama mengakses via: app.config.globalProperties.$eventBus)
const app = createApp({});
app.config.globalProperties.$eventBus = eventBus;

// Export emitter untuk penggunaan di kode baru (Sprint 2+)
export { emitter };

// Export default app untuk backward compatibility
export default app;
