<!--
  BaseLoader.vue
  Full-screen loading overlay yang terhubung dengan ui.store.
-->
<script setup>
import { useUiStore } from "@/stores/ui.store";

const uiStore = useUiStore();
</script>

<template>
  <v-overlay
    :model-value="uiStore.isLoading"
    class="align-center justify-center"
    persistent
    z-index="9999"
  >
    <v-progress-circular color="primary" indeterminate size="64" />
  </v-overlay>
</template>
