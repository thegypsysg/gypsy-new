<template>
  <v-container>
    <div class="d-flex w-100 justify-space-between align-center mb-4 mt-n8">
      <p class="title-card">My Current Location</p>
      <v-btn
        class="text-none text-subtitle-1"
        color="success"
        size="large"
        variant="flat"
        @click="$emit('save-location')"
      >
        Save Changes
      </v-btn>
    </div>

    <v-row>
      <v-col :cols="!isSmall ? 6 : 12">
        <div class="w-100 d-flex align-center">
          <div
            v-if="input.country"
            style="
              border-top: 2px solid rgb(239, 239, 239);
              border-bottom: 2px solid rgb(239, 239, 239);
              border-left: 2px solid rgb(239, 239, 239);
              border-radius: 5px 0 0px 5px;
              height: 47px;
            "
            class="d-flex align-center justify-center"
          >
            <span
              class="fi ml-2 pr-4 mr-4"
              :class="['fi-' + input.country.toLowerCase()]"
            />
          </div>
          <MazSelect
            v-slot="{ option }"
            v-model="input.country"
            item-height="40"
            :options="options"
            search
            size="md"
            class="w-100"
            search-placeholder="Search in country"
            :class="{ 'ml-n1': input.country }"
          >
            <div
              class="flex items-center"
              style="
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                width: 100%;
                gap: 1rem;
              "
            >
              <span
                class="fi"
                :class="['fi-' + option.value.toLowerCase()]"
              />
              <span class="pl-2">
                {{ option.label }}
              </span>
            </div>
          </MazSelect>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="!isSmall ? 6 : 12">
        <div class="location-input">
          <v-combobox
            v-model="input.city"
            :items="resource.city"
            variant="outlined"
            label="Select City"
            clearable
            class="mt-n1"
            density="compact"
            :rules="rules ? rules.cityRules : []"
          />
        </div>
      </v-col>
    </v-row>
    <v-row class="mb-n8 pb-2">
      <v-col :cols="!isSmall ? 6 : 12">
        <div class="location-input">
          <v-combobox
            v-model="input.town"
            :items="resource.town"
            variant="outlined"
            label="Select Town (Optional)"
            clearable
            class="mt-n1"
            density="compact"
          />
        </div>
      </v-col>
    </v-row>
    <hr class="mt-8" />
  </v-container>
</template>

<script setup>
import MazSelect from "maz-ui/components/MazSelect";

defineProps({
  input: {
    type: Object,
    required: true,
  },
  resource: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  isSmall: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["save-location"]);
</script>

<style scoped>
.title-card {
  font-size: 20px;
  font-weight: 500;
}

.location-input {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  height: 38px;
  border: 1px solid rgb(160, 160, 160);
  border-radius: 5px;
}
</style>
