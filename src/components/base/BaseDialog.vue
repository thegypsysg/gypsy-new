<!--
  BaseDialog.vue
  Wrapper standar v-dialog dengan slot header, body, dan footer.
-->
<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: [String, Number],
    default: 500,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title v-if="title || $slots.title" class="pa-4 font-weight-bold">
        <slot name="title">{{ title }}</slot>
      </v-card-title>
      <v-divider v-if="title || $slots.title" />
      <v-card-text class="pa-4">
        <slot />
      </v-card-text>
      <v-divider v-if="$slots.footer" />
      <v-card-actions v-if="$slots.footer" class="pa-4">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
