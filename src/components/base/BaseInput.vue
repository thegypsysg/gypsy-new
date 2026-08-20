<!--
  BaseInput.vue
  Wrapper standar v-text-field dengan styling dan behavior konsisten.
-->
<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  errorMessages: {
    type: [String, Array],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  prependInnerIcon: {
    type: String,
    default: "",
  },
  appendInnerIcon: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  density: {
    type: String,
    default: "comfortable",
  },
  hideDetails: {
    type: [Boolean, String],
    default: "auto",
  },
});

defineEmits(["update:modelValue", "click:appendInner", "click:prependInner"]);
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :rules="rules"
    :error-messages="errorMessages"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="appendInnerIcon"
    :variant="variant"
    :density="density"
    :hide-details="hideDetails"
    @update:model-value="$emit('update:modelValue', $event)"
    @click:append-inner="$emit('click:appendInner', $event)"
    @click:prepend-inner="$emit('click:prependInner', $event)"
  />
</template>
