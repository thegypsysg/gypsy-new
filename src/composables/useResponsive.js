/**
 * useResponsive.js
 *
 * Composable untuk screen size reactivity.
 * Menggantikan pola: screenWidth: window.innerWidth + event listener resize
 * yang saat ini ada di Header.vue, TrendingApps.vue, dan MyProfile.vue.
 *
 * Penggunaan (di Composition API):
 *   import { useResponsive } from "@/composables/useResponsive";
 *   const { screenWidth, isSmall, isMedium, isLarge } = useResponsive();
 */
import { ref, onMounted, onUnmounted } from "vue";

export function useResponsive() {
  const screenWidth = ref(window.innerWidth);

  const handleResize = () => {
    screenWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    screenWidth,
    isSmall: () => screenWidth.value < 640,
    isMedium: () => screenWidth.value < 1024,
    isLarge: () => screenWidth.value >= 1024,
  };
}
