<template>
  <div class="partners-onboarding">
    <v-container fluid class="fill-height pa-0">
      <div
        class="w-100 d-flex align-center justify-end"
        style="
          background-size: cover;
          background-position: center;
          min-height: calc(100vh);
        "
        :class="!isSmall ? 'bg-wrapper' : undefined"
        :style="{ padding: isSmall ? '0px' : '40px 10%' }"
      >
        <v-card
          width="100%"
          max-width="550"
          class="pa-8 rounded-lg"
          color="white"
          :elevation="!isSmall ? 4 : 0"
        >
          <h2
            class="font-weight-black mb-2"
            style="color: #000; font-size: 32px"
          >
            Partner with Us
          </h2>
          <p
            class="text-subtitle-1 text-grey-darken-1 mb-6"
            style="line-height: 1.4"
          >
            Please provide us with the following info and we will get back to
            you soon.
          </p>

          <v-form @submit.prevent>
            <v-text-field
              v-model="form.name"
              label="Your Name"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email Address"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.businessName"
              label="Restaurant / Outlet / Business Name"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.contact"
              label="Your Contact (What's App)"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.city"
              label="City"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              color="primary"
            ></v-text-field>

            <v-btn
              block
              color="#d4e2ff"
              class="text-white text-none font-weight-bold elevation-0"
              size="large"
              style="border-radius: 8px; font-size: 18px"
            >
              Update
            </v-btn>
          </v-form>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "PartnersOnBoarding",
  data() {
    return {
      form: {
        name: "",
        email: "",
        businessName: "",
        contact: "",
        city: "",
      },
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.bg-wrapper {
  background-image: url("@/assets/images/partner-background.jpg");
}
.v-text-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}
</style>
