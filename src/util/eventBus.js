/**
 * eventBus.js
 *
 * Event bus menggunakan mitt (ringan, type-safe).
 * API mitt:
 * - emitter.on(event, callback)
 * - emitter.off(event, callback)
 * - emitter.emit(event, ...args)
 *
 * Penggunaan di script setup:
 *   import { emitter } from "@/util/eventBus";
 *   emitter.emit("eventName", data);
 */
import mitt from "mitt";

// Buat emitter mitt
const emitter = mitt();

// Export emitter untuk named import dan default import
export { emitter };
export default emitter;

