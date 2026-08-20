<template>
  <div>
    <!-- Flow: Mobile Sign-Up / Sign-In (/sign-in) -->
    <template v-if="flow === 'mobile'">
      <StepWelcome
        v-if="currentStep === 1"
        @nextStep="nextStep"
      />
      <StepPersonalMobile
        v-else-if="currentStep === 2"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepCreatePassword
        v-else-if="currentStep === 3"
        auth-type="mobile"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepResult
        v-else-if="currentStep === 4"
        auth-type="mobile"
        @nextStep="nextStep"
        @backStep="backStep"
      />
    </template>

    <!-- Flow: Email Sign-Up via OTP (/sign-up-email) -->
    <template v-else-if="flow === 'email'">
      <StepOTPEmail
        v-if="currentStep === 1"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepPersonalEmail
        v-else-if="currentStep === 2"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepCreatePassword
        v-else-if="currentStep === 3"
        auth-type="email"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepResult
        v-else-if="currentStep === 4"
        auth-type="email"
        @nextStep="nextStep"
        @backStep="backStep"
      />
    </template>

    <!-- Flow: Create Password Direct (/signup-email) -->
    <template v-else-if="flow === 'create-password'">
      <StepCreatePassword
        v-if="currentStep === 1"
        auth-type="email"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepResult
        v-else-if="currentStep === 2"
        auth-type="email"
        @nextStep="nextStep"
        @backStep="backStep"
      />
    </template>

    <!-- Flow: Social Sign-Up (/social-sign-up) -->
    <template v-else-if="flow === 'social'">
      <StepPersonalSocials
        v-if="currentStep === 1"
        @nextStep="nextStep"
        @backStep="backStep"
      />
      <StepResult
        v-else-if="currentStep === 2"
        auth-type="social"
        @nextStep="nextStep"
        @backStep="backStep"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import StepWelcome from "@/components/auth/steps/StepWelcome.vue";
import StepOTPEmail from "@/components/auth/steps/StepOTPEmail.vue";
import StepPersonalEmail from "@/components/auth/steps/StepPersonalEmail.vue";
import StepPersonalMobile from "@/components/auth/steps/StepPersonalMobile.vue";
import StepPersonalSocials from "@/components/auth/steps/StepPersonalSocials.vue";
import StepCreatePassword from "@/components/auth/steps/StepCreatePassword.vue";
import StepResult from "@/components/auth/steps/StepResult.vue";

const route = useRoute();
const currentStep = ref(1);

const flow = computed(() => route.meta?.flow || "mobile");

watch(
  () => route.meta?.flow,
  () => {
    currentStep.value = 1;
  }
);

function nextStep() {
  currentStep.value++;
}

function backStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}
</script>
