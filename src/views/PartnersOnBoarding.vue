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

          <v-form
            ref="formRef"
            validate-on="input lazy"
            @submit.prevent="handleSubmit"
          >
            <v-text-field
              v-model="form.name"
              label="Your Name"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email Address"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              color="primary"
              :rules="[rules.email]"
            ></v-text-field>

            <v-text-field
              v-model="form.businessName"
              label="Restaurant / Outlet / Business Name"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.contact"
              label="Your Contact (What's App)"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.city"
              label="City"
              variant="outlined"
              density="comfortable"
              class="mb-6"
              color="primary"
              :rules="[rules.required]"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              class="text-white text-none font-weight-bold elevation-0"
              size="large"
              style="border-radius: 8px; font-size: 18px"
              type="submit"
              :loading="isSubmitting"
            >
              Submit
            </v-btn>
          </v-form>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useUiStore } from "@/stores/ui.store";
import { logger } from "@/utils/logger";
import InquiryService from "@/services/inquiry.service";

const uiStore = useUiStore();
const formRef = ref(null);
const isSubmitting = ref(false);

const form = ref({
  name: "",
  email: "",
  businessName: "",
  contact: "",
  city: "",
});

const rules = {
  required: (v) => !!v || "This field is required",
  email: (v) => !v || /.+@.+\..+/.test(v) || "E-mail must be valid",
};

const screenWidth = ref(window.innerWidth);
const isSmall = computed(() => screenWidth.value < 640);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

async function handleSubmit() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      contact_person: form.value.name,
      email_id: form.value.email,
      company_name: form.value.businessName,
      contact_number: form.value.contact,
      city: form.value.city,
    };

    const response = await InquiryService.create(payload);
    const message =
      response?.data?.message || "Inquiry submitted successfully!";
    uiStore.showSnackbar(message, "success");

    form.value = {
      name: "",
      email: "",
      businessName: "",
      contact: "",
      city: "",
    };

    await nextTick();
    if (formRef.value) {
      formRef.value.resetValidation();
    }
  } catch (error) {
    logger.error("Failed to submit inquiry:", error);
    const errorMsg =
      error?.response?.data?.message ||
      "Failed to submit inquiry. Please try again.";
    uiStore.showSnackbar(errorMsg, "error");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.bg-wrapper {
  background-image: url("@/assets/images/partner-background.webp");
}
.v-text-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}
</style>
