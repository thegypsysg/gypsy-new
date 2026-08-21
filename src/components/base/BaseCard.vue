<script setup>
/**
 * BaseCard.vue
 *
 * Wrapper v-card standar dengan slot title, default (body), dan actions.
 * Gunakan ini alih-alih v-card langsung agar styling konsisten di seluruh app.
 */
defineProps({
  elevation: { type: [String, Number], default: 1 },
  rounded: { type: String, default: "lg" },
  loading: { type: Boolean, default: false },
  hover: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
});
</script>

<template>
  <v-card
    :elevation="flat ? 0 : elevation"
    :rounded="rounded"
    :loading="loading"
    :hover="hover"
    :flat="flat"
  >
    <v-card-title v-if="$slots.title">
      <slot name="title" />
    </v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>
