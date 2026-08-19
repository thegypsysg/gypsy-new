<template>
  <div
    class="mobile__app text-center scroll-container d-flex flex-column justify-center align-content-space-between mx-2"
  >
    <template v-if="activeLocationButton && isSmall">
      <AppHeaderLocation
        :model-value="userLocation"
        :location-placeholder="locationPlaceholder"
        :item-selected-complete="itemSelectedComplete"
        :country="country"
        :active-city="activeCity"
        :is-desktop="false"
        @update:model-value="$emit('update:userLocation', $event)"
        @change-item-selected="(city, country) => $emit('change-item-selected', city, country)"
      />
    </template>

    <form
      class="navbar__search navbar__search__mobile mx-auto"
      @submit="preventSubmit"
    >
      <input
        id="product_name"
        class="form-control mr-sm-2"
        type="text"
        placeholder="What are you looking for . ?"
        aria-label="Search"
        data-autocompleturl="https://boozards.com/merchant-product/search"
      />
      <button class="btn btn--search" type="submit">
        <v-icon color="white"> mdi-magnify </v-icon>
      </button>
    </form>

    <div v-if="!isLoading" class="my-slide d-flex">
      <v-btn
        class="sub-menu-btn view-all"
        :class="{
          active: activeTag === '' || activeTag === null,
        }"
        style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
        @click="$emit('select-tag', '')"
      >
        <p style="font-size: 12px" elevation>View All</p>
      </v-btn>
      <v-slide-group
        :model-value="activeTag"
        @update:model-value="$emit('update:activeTag', $event)"
      >
        <v-slide-group-item
          v-for="btn in trendingBtn"
          :key="btn.id"
          v-slot="{ isSelected }"
          :value="btn.tag"
        >
          <v-btn
            class="sub-menu-btn"
            :class="{
              active: isSelected,
            }"
            style="box-shadow: 0 5px 25px rgba(0, 0, 0, 0)"
            @click="$emit('select-tag', btn.tag)"
          >
            <p style="font-size: 12px" elevation>
              {{ btn.title }}
              <span>{{
                countCards(btn.tag) == 0 ? "" : `(${countCards(btn.tag)})`
              }}</span>
            </p>
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </div>
</template>

<script>
import AppHeaderLocation from "@/components/header/AppHeaderLocation.vue";

export default {
  name: "AppHeaderNav",
  components: {
    AppHeaderLocation,
  },
  props: {
    activeLocationButton: {
      type: Boolean,
      default: false,
    },
    isSmall: {
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
    userLocation: {
      type: Boolean,
      default: false,
    },
    activeCity: {
      type: Object,
      default: null,
    },
    trendingBtn: {
      type: Array,
      default: () => [],
    },
    trendingCard: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    activeTag: {
      type: String,
      default: null,
    },
  },
  emits: [
    "select-tag",
    "change-item-selected",
    "update:userLocation",
    "update:activeTag",
  ],
  methods: {
    countCards(tag) {
      if (!this.trendingCard || !Array.isArray(this.trendingCard)) return 0;
      const count = this.trendingCard.filter(
        (trend) => trend.tag === tag
      ).length;
      return count;
    },
    preventSubmit(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.view-all {
  position: sticky !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1000 !important;
}
.scroll-container {
  margin-top: -80px;
  overflow-x: auto;
  white-space: nowrap;
  gap: 20px;
}
</style>
