<!--
  BaseButton.vue
  Wrapper standar v-btn untuk konsistensi di seluruh aplikasi.
  Gunakan komponen ini sebagai pengganti <v-btn> langsung.
-->
<script setup>
defineProps({
  variant: {
    type: String,
    default: "elevated",
  },
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "default",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: String,
    default: "lg",
  },
});

defineEmits(["click"]);
</script>

<template>
  <v-btn
    :variant="variant"
    :color="color"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :rounded="rounded"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>
