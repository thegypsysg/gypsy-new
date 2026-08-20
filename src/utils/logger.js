/**
 * logger.js
 *
 * Production-safe logging utility.
 * console.log & console.warn hanya berjalan di development mode.
 * Di production build, log info/warn diabaikan secara otomatis.
 */

export const logger = {
  log: (...args) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Error tetap di-log bahkan di production untuk keperluan debugging/monitoring
    console.error(...args);
  },
};

export default logger;
