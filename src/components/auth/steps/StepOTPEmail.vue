<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-center">
          <v-col :cols="isSmall ? '12' : '10'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : ''"
              class="mx-auto"
              :class="{ 'login-card px-12': !isSmall, 'py-10 px-2': isSmall }"
            >
              <v-row>
                <v-col :cols="isSmall ? '12' : '6'">
                  <h1
                    class="mb-1"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile mb-6': isSmall }"
                  >
                    Step 1 - Email Verification
                  </h1>

                  <v-form v-model="valid" @submit.prevent>
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile ': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email</label
                    >
                    <div
                      class="d-flex align-center mt-2 py-0 back-grey"
                      style="border: 1px solid #ced4da; border-radius: 0.25rem"
                    >
                      <input
                        v-model="email"
                        type="email"
                        disabled
                        class="form-control"
                        style="border: none"
                        placeholder="Enter Email"
                      />
                      <span
                        class="text-blue-darken-4 mx-2"
                        style="cursor: pointer"
                        @click="backStep"
                      >
                        Change
                      </span>
                    </div>

                    <div class="d-flex align-center">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn mt-4"
                        :class="{
                          'w-66 login-btn-mobile mt-10': isSmall,
                          'w-50': !isSmall,
                        }"
                        @click="nextStep()"
                      >
                        Next
                      </v-btn>
                      <div
                        :class="{
                          'w-33 login-btn-mobile mt-10': isSmall,
                          'w-33': !isSmall,
                        }"
                        style="
                          text-align: center;
                          cursor: pointer;
                          color: #2b0087;
                          font-weight: 700;
                          font-size: 20px;
                        "
                        @click="backStep"
                      >
                        Back
                      </div>
                    </div>
                  </v-form>
                </v-col>
                <v-col
                  v-if="!isSmall"
                  cols="6"
                  class="d-flex align-center justify-center"
                >
                  <h2 style="width: 80%">
                    Please check your email as you will receive an OTP
                  </h2>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="isSuccess"
          location="top"
          color="green"
          :timeout="3000"
        >
          {{ successMessage }}

          <template #actions>
            <v-btn color="white" variant="text" @click="isSuccess = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
        <v-snackbar
          v-model="isError"
          location="top"
          color="red"
          :timeout="3000"
        >
          {{ errorMessage }}

          <template #actions>
            <v-btn color="white" variant="text" @click="isError = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/util/axios";
import { emitter } from "@/util/eventBus";
import VOtpInput from "vue3-otp-input";

const emit = defineEmits(["nextStep", "backStep"]);
const router = useRouter();

const valid = ref(false);
const email = ref("");
const otp = ref(null);
const isSending = ref(false);

const rules = {
  emailRules: [
    (value) => {
      if (value) return true;
      return "E-mail is requred.";
    },
    (value) => {
      if (/.+@.+\..+/.test(value)) return true;
      return "E-mail must be valid.";
    },
  ],
};

const screenWidth = ref(window.innerWidth);
const isError = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const countdown = ref(0);
const timer = ref(null);
const otpDigits = ref(["", "", "", ""]);
const otpFilled = ref(0);
const otpInput = ref([]);

const isSmall = computed(() => screenWidth.value < 640);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

function startCountdown() {
  if (timer.value) {
    clearInterval(timer.value);
  }

  countdown.value = 120;

  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
}

onMounted(() => {
  startCountdown();
  emitter.emit("changeHeaderWelcome", "Sign-up by Email");
  email.value = localStorage.getItem("email") || "";
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (timer.value) {
    clearInterval(timer.value);
  }
});

function onInput(index) {
  if (otpDigits.value[index] && index < 3) {
    let nextIndex = index + 1;
    while (nextIndex <= 3 && otpDigits.value[nextIndex]) {
      nextIndex++;
    }
    if (nextIndex <= 3 && otpInput.value[nextIndex]) {
      otpInput.value[nextIndex].focus();
    }
  } else if (!otpDigits.value[index] && index > 0) {
    if (otpInput.value[index - 1]) {
      otpInput.value[index - 1].focus();
    }
  }

  otpFilled.value = otpDigits.value.filter((digit) => digit !== "").length;

  if (otpFilled.value === 4) {
    otp.value = otpDigits.value.join("");
  }
}

function nextStep() {
  emit("nextStep");
}

function backStep() {
  emitter.emit("changeHeaderWelcome", "Sign-Up / Sign-in");
  emit("backStep");
  router.push("/sign-in");
}

async function saveData() {
  if (valid.value) {
    isSending.value = true;
    const payload = {
      email_id: email.value,
      otp: otp.value,
    };
    try {
      const response = await axios.post(`/send-otp`, payload);
      const data = response.data;
      console.log(data);
      isSuccess.value = true;
      successMessage.value = "Success verify OTP";
      email.value = "";
      otp.value = null;

      nextStep();
      startCountdown();
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.email_id
        ? error.response.data.email_id[0]
        : error.response?.data?.message
        ? error.response.data.message
        : "Something Wrong!!!";
      errorMessage.value = message;
      isError.value = true;
      email.value = "";
      otp.value = null;

      startCountdown();
    } finally {
      isSending.value = false;
    }
  }
}

async function resendOTP() {
  if (countdown.value === 0) {
    isSending.value = true;
    const payload = {
      email_id: localStorage.getItem("email"),
    };
    try {
      const response = await axios.post(`/send-otp`, payload);
      const data = response.data;
      console.log(data);
      isSuccess.value = true;
      successMessage.value = "Success send OTP";
      startCountdown();
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.email_id
        ? error.response.data.email_id[0]
        : error.response?.data?.message
        ? error.response.data.message
        : "Something Wrong!!!";
      errorMessage.value = message;
      isError.value = true;
    } finally {
      isSending.value = false;
    }
  }
}
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/header.webp");
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.header-mobile {
  font-size: 20px;
}

.section-desktop {
  font-size: 24px;
}

.section-mobile {
  font-size: 16px;
}

.form-control {
  display: block;
  width: 100%;
  border: 1px solid #ced4da;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

@media screen and (prefers-reduced-motion: reduce) {
  .form-control {
    transition: none;
  }
}

.form-control::-ms-expand {
  background-color: transparent;
  border: 0;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
.form-control:-webkit-autofill {
  background-color: #fff;
}

.form-control::-webkit-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::-moz-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control:-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::-ms-input-placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 1;
}

.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}

.back-grey {
  background: #e9ecef;
}

.gender-small {
  font-size: 14px;
}

.login-input .v-text-field input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -webkit-text-fill-color: #333 !important;
}

/* Firefox */
.login-input .v-text-field input:-moz-autofill {
  -moz-box-shadow: 0 0 0 30px #f5f5f5 inset !important;
  -moz-text-fill-color: #333 !important;
}

.login-btn {
  width: 400px;
  height: 50px;

  background: #5d87ff;
  border-radius: 10px;
  color: white !important;
  font-weight: 500;
  font-size: 14px;
  text-transform: unset;
}

.next-btn {
  width: 70% !important;
}

.login-btn-mobile {
  font-weight: 600;
  font-size: 18px;
}

.login-footer-span {
  font-size: 20px;
  font-weight: 600;
}

.login-line {
  width: 70px;
  height: 1px;
  background: #bababa;
}
.login-line-mobile {
  width: 150px;
}

.login-card {
  margin-top: 90px;
  padding-top: 15px;
  padding-bottom: 120px;
}

.login-footer-icon {
  cursor: pointer;
}
.login-footer-btn {
  gap: 20px;
}
.login-footer-btn-mobile {
  gap: 40px;
}

.otp-digit {
  width: 30px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  margin-right: 10px;
  border: 1px solid rgb(137, 137, 137);
  border-radius: 5px;
}
</style>
