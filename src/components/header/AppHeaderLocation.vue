<template>
  <div class="d-inline-flex align-center justify-center">
    <v-menu
      v-if="locationPlaceholder"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          v-bind="props"
          color="#494949"
          append-icon="mdi-chevron-down"
          :class="isDesktop ? 'ml-6 mr-4' : ''"
        >
          <template v-slot:prepend>
            <v-avatar
              :image="$fileURL + itemSelectedComplete?.flag"
              size="x-small"
            ></v-avatar>
          </template>

          {{ locationPlaceholder }}
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-title>
          <div class="d-flex align-center ga-2">
            <v-icon size="small">mdi-map-marker</v-icon>
            <p class="text-subtitle-2">Choose Your Location</p>
          </div>
        </v-card-title>

        <v-list v-for="(data, index) in country" :key="index">
          <v-list-subheader>
            <div class="d-flex align-center ga-2">
              <v-avatar
                :image="$fileURL + data?.flag"
                size="x-small"
              ></v-avatar>
              <p class="text-subtitle-1 font-weight-medium">
                {{ data.country_name }} (<span class="text-blue-lighten-1">{{
                  data.count
                }}</span>
                Properties)
              </p>
            </div>
          </v-list-subheader>

          <v-list-item
            :active="activeCity?.city_id === dataCity.city_id"
            v-for="(dataCity, indexCities) in data.cities"
            :key="indexCities"
            :value="dataCity.city_id"
            variant="text"
            active-color="primary"
            @click="$emit('change-item-selected', dataCity, data)"
          >
            <v-list-item-title>
              <div class="d-flex ml-7 align-center ga-2">
                <v-avatar
                  :image="$fileURL + dataCity?.city_image"
                  size="x-small"
                ></v-avatar>
                <p class="">
                  {{ dataCity.city_name }} ({{ dataCity.property_count }})
                </p>
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-skeleton-loader
      v-else
      width="200"
      type="list-item-two-line"
    ></v-skeleton-loader>
  </div>
</template>

<script>
export default {
  name: "AppHeaderLocation",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    locationPlaceholder: {
      type: String,
      default: "",
    },
    itemSelectedComplete: {
      type: Object,
      default: null,
    },
    country: {
      type: Array,
      default: () => [],
    },
    activeCity: {
      type: Object,
      default: null,
    },
    isDesktop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "change-item-selected"],
};
</script>
