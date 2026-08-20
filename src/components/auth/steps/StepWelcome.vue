<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-end">
          <v-col :cols="isSmall ? '12' : '6'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : '450'"
              class="mx-auto"
              :class="{
                'login-card px-12': !isSmall,
                'py-10 px-2': isSmall,
                'pb-16': !isSmall && isMobile,
              }"
            >
              <h1
                class="mb-1"
                style="font-family: Arial, Helvetica, sans-serif !important"
              >
                Welcome
              </h1>
              <p
                class="text-grey"
                :class="{ 'mb-3': !isSmall, 'mb-6': isSmall }"
              >
                Please use any one of your social accounts to Sign-Up or
                Sign-In.
              </p>
              <p
                class="text-grey"
                :class="{ 'mb-1': !isSmall, 'mb-12': isSmall }"
              >
                Last Used: <span class="text-red">{{ socialProvider }}</span>
              </p>
              <v-form v-model="valid" @submit.prevent>
                <div
                  class="login-footer-btn d-flex justify-start mt-8"
                  :class="{ 'login-footer-btn-mobile': isSmall }"
                >
                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    color="white"
                    style="background: transparent"
                    icon
                    @click="loginSocial('google')"
                  >
                    <v-icon :size="!isSmall ? '35' : '40'">
                      <v-img
                        src="@/assets/images/icons/google.png"
                        alt="Google Logo"
                      />
                    </v-icon>
                  </v-btn>

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #4267b2"
                    color="white"
                    icon
                    @click="loginSocial('facebook')"
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-facebook-f" />
                    </v-icon>
                  </v-btn>
                </div>
                <div class="login-footer mt-8">
                  <div class="d-flex justify-center" style="gap: 25px">
                    <div
                      class="login-line"
                      :class="{ 'login-line-mobile': isSmall }"
                    />
                    <span
                      class="mt-n3"
                      :class="{ 'login-footer-span': isSmall }"
                      >OR</span
                    >
                    <div
                      class="login-line"
                      :class="{ 'login-line-mobile': isSmall }"
                    />
                  </div>
                </div>
                <p
                  v-if="!isMobile"
                  class="text-grey mt-4"
                  :class="{ 'mb-4': !isSmall, 'mb-6': isSmall }"
                >
                  Dont have Email . ?
                  <span
                    style="cursor: pointer"
                    class="text-blue-darken-4"
                    @click="
                      () => {
                        isMobile = true;
                        email = null;
                      }
                    "
                    >Enter Mobile number</span
                  >
                </p>
                <div
                  v-if="isMobile && !isSendOtp"
                  class="text-grey mt-4"
                  :class="{ 'mb-4': !isSmall, 'mb-6': isSmall }"
                >
                  <p
                    style="cursor: pointer"
                    class="text-blue-darken-4"
                    @click="
                      () => {
                        isMobile = false;
                        isSendOtp = false;
                        mobile = null;
                      }
                    "
                  >
                    Register by Email
                  </p>
                  <p class="text-grey">
                    (Use this Mobile Registration only if you dont have Email
                    ID)
                  </p>
                </div>
                <template v-if="!isMobile">
                  <label style="font-size: 24px; font-weight: 600">Email</label>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    class="login-input mb-4"
                    type="email"
                    variant="outlined"
                    placeholder="Email Address"
                    :persistent-hint="true"
                  />
                  <transition name="fade">
                    <div v-if="isLogin">
                      <label style="font-size: 24px; font-weight: 600"
                        >Password</label
                      >
                      <v-text-field
                        v-model="password"
                        :append-inner-icon="
                          showPassword ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :type="showPassword ? 'text' : 'password'"
                        :rules="passwordRules"
                        variant="outlined"
                        class="login-input mb-3"
                        placeholder="Password"
                        :maxLength="8"
                        @click:append-inner="showPassword = !showPassword"
                      ></v-text-field>
                      <div class="d-flex align-center" style="gap: 10px">
                        <v-checkbox v-model="rememberMe" class="black--text">
                          <template v-slot:label>
                            <span
                              style="
                                font-weight: 400;
                                font-size: 14px;
                                color: #000 !important;
                              "
                              >Remember this Device</span
                            >
                          </template>
                        </v-checkbox>
                        <v-btn
                          @click="forgotPassword()"
                          variant="text"
                          :disabled="isLoadingForgot"
                          class="text-body-2 font-weight-regular mt-n4"
                          style="
                            text-decoration: none;
                            color: #4b80b1;
                            font-weight: 400;
                            font-size: 12px;
                            cursor: pointer;
                          "
                          >Forgot Password?</v-btn
                        >
                      </div>
                    </div>
                  </transition>
                </template>
                <template v-if="isMobile && !isSendOtp">
                  <label class="mt-n4" style="font-size: 24px; font-weight: 600"
                    >Mobile</label
                  >
                  <MazPhoneNumberInput
                    v-model="mobile"
                    show-code-on-list
                    color="info"
                    default-country-code="SG"
                    :preferred-countries="['SG', 'BD', 'IN', 'MY', 'GB', 'PH']"
                    @update="phoneEvent = $event"
                  />
                </template>
                <template v-if="isMobile && isSendOtp">
                  <div class="d-flex">
                    <input
                      v-model="mobile"
                      type="text"
                      required
                      disabled
                      class="form-control mt-2"
                      placeholder="Phone Number"
                    />
                    <v-btn
                      class="text-none text-subtitle-1 mt-2"
                      color="blue"
                      variant="flat"
                      @click="isChangeMobile = !isChangeMobile"
                    >
                      Change
                    </v-btn>
                  </div>
                  <div v-if="isChangeMobile" class="mt-2">
                    <MazPhoneNumberInput
                      v-model="mobile"
                      show-code-on-list
                      color="info"
                      default-country-code="SG"
                      :preferred-countries="[
                        'SG',
                        'BD',
                        'IN',
                        'MY',
                        'GB',
                        'PH',
                      ]"
                      @update="phoneEvent = $event"
                    />
                    <v-btn
                      class="text-none text-white w-100 mt-3"
                      color="#F0882D"
                      size="large"
                      variant="flat"
                      @click="resendOTP"
                    >
                      Resend OTP
                    </v-btn>
                  </div>
                  <v-alert
                    class="my-2"
                    v-model="isResendOTP"
                    type="success"
                    :text="`OTP is sent successfully to ${mobile}`"
                  ></v-alert>
                  <div class="d-flex">
                    <input
                      v-model="otp"
                      required
                      class="form-control mt-2"
                      placeholder="Enter 6 Digit OTP"
                    />
                    <v-btn
                      :disabled="otp?.length != 6"
                      class="text-none text-subtitle-1 mt-2"
                      color="green"
                      variant="flat"
                      @click="nextStep"
                    >
                      Continue
                    </v-btn>
                  </div>
                </template>
                <v-btn
                  v-if="!isMobile && !isLogin"
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn mt-8"
                  :disabled="!isNext || isSending"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="sendDataEmail"
                >
                  <v-progress-circular
                    v-if="isSending"
                    :size="20"
                    color="primary"
                    indeterminate
                  />
                  <span v-else>Next</span>
                </v-btn>
                <v-btn
                  v-if="isLogin && !isMobile"
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn"
                  :disabled="isSending || !isNext || !password"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="loginEmail()"
                >
                  <v-progress-circular
                    v-if="isSending"
                    :size="20"
                    color="primary"
                    indeterminate
                  />
                  <span v-else>Sign In</span>
                </v-btn>
                <v-btn
                  v-if="isMobile && !isSendOtp"
                  color="#F0882D"
                  size="large"
                  variant="flat"
                  class="login-btn text-none text-white w-100 mt-3"
                  :disabled="!isNext"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="sendDataMobile"
                >
                  Next
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

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
        <v-dialog v-model="isSuccessForgot" persistent width="auto">
          <v-card width="350">
            <v-card-text>
              <h3 class="">Forgot Password</h3>
              <h5 class="my-4">
                Please check your email as you will receive an OTP
              </h5>
              <v-btn
                class="mb-4 w-100 bg-primary"
                @click="isSuccessForgot = false"
              >
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isChangePassword" persistent width="auto">
          <v-card width="350">
            <v-card-text>
              <h5 class="">
                New Password successfully updated . Please change your password
                under "My Profile"
              </h5>
              <v-btn
                class="my-4 w-100 bg-primary"
                @click="closeChangePassword()"
              >
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isFacebook" persistent width="auto">
          <v-card width="350">
            <v-card-text class="">
              <p class="my-4">
                Facebook Sign up is not available now please use your email or
                Google
              </p>
              <v-btn class="mb-4 w-100 bg-primary" @click="isFacebook = false">
                OK
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
import axios from "@/util/axios";
import { emitter } from "@/util/eventBus";

const emit = defineEmits(["nextStep"]);

const route = useRoute();
const router = useRouter();

const appIdLogin = ref("");
const tokenLogin = ref(null);
const isSending = ref(false);
const isSuccessForgot = ref(false);
const isForgotPassword = ref(false);
const isChangePassword = ref(false);
const isFacebook = ref(false);
const isLoadingForgot = ref(false);
const isSendOtp = ref(false);
const isChangeMobile = ref(false);
const isResendOTP = ref(false);
const valid = ref(false);
const isMobile = ref(false);
const isNext = ref(false);
const isLogin = ref(false);
const rememberMe = ref(false);
const showPassword = ref(false);
const email = ref(null);
const password = ref("");
const mobile = ref(null);
const otp = ref("");
const phoneEvent = ref(null);
const isError = ref(false);
const token = ref(null);
const isSuccess = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const emailRules = [
  (value) => {
    if (value) return true;
    return "E-mail is requred.";
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;
    return "E-mail must be valid.";
  },
];

const passwordRules = [
  (value) => {
    if (value) return true;
    return "Password is requred.";
  },
];

const screenWidth = ref(window.innerWidth);

const isSmall = computed(() => screenWidth.value < 640);

function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

const socialProvider = computed(() => {
  const social = localStorage.getItem("social");
  return capitalizeFirstLetter(social) === "Linkedin-openid"
    ? "LinkedIn Login"
    : capitalizeFirstLetter(social) + " Login";
});

const appId = computed(() => {
  const aid = route.query.app_id || "";
  localStorage.setItem("app_id", aid);
  return aid;
});

watch(isMobile, (newVal) => {
  if (newVal) {
    email.value = null;
    mobile.value = null;
    isNext.value = false;
  }
});

watch(email, (newVal) => {
  if (email.value == null) {
    isNext.value = false;
  } else if (/.+@.+\..+/.test(newVal)) {
    isNext.value = true;
  }
});

watch(mobile, () => {
  if (mobile.value == null) {
    isNext.value = false;
  } else {
    isNext.value = true;
  }
});

function handleResize() {
  screenWidth.value = window.innerWidth;
}

async function sendOTP() {
  isSending.value = true;
  const payload = {
    email_id: email.value,
  };
  try {
    const response = await axios.post(`/send-otp`, payload);
    const data = response.data;
    console.log(data);
    successMessage.value = data.message;
    isSuccess.value = true;
    localStorage.setItem("email", data.data.email_id);
    router.push("/sign-up-email");
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

function resendOTP() {
  isResendOTP.value = true;
  setTimeout(() => {
    isResendOTP.value = false;
  }, 3000);
}

function nextStep() {
  emit("nextStep");
}

async function loginSocial(social_name) {
  if (social_name === "facebook") {
    isFacebook.value = true;
  } else {
    try {
      const response = await axios.post(`/gypsy-login/${social_name}`, {
        app_id: appId.value === "" ? window.$appId || 1 : appId.value,
      });
      console.log(response);
      if (response && response.data?.target_url) {
        window.location.assign(response.data.target_url);
      } else {
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.log(error);
      window.location.href = "/sign-in";
    }
  }
}

async function forgotPassword() {
  isLoadingForgot.value = true;
  try {
    const response = await axios.post(`/gypsy/send-forget-password-email`, {
      email_id: email.value,
    });
    console.log(response);
    if (response) {
      isSuccessForgot.value = true;
      isForgotPassword.value = true;
    }
  } catch (error) {
    const message = error.response?.data?.email_id
      ? error.response.data.email_id[0]
      : error.response?.data?.message
      ? error.response.data.message
      : "Something Wrong!!!";
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isLoadingForgot.value = false;
  }
}

function hideEmail(emailStr) {
  const atIndex = emailStr.indexOf("@");
  if (atIndex >= 0) {
    const username = emailStr.substring(0, atIndex);
    const hiddenPart = username
      .substring(0, Math.max(0, username.length - 6))
      .replace(/./g, "*");
    const visiblePart = username.substring(Math.max(0, username.length - 6));
    return hiddenPart + visiblePart + emailStr.substring(atIndex);
  } else {
    return emailStr;
  }
}

async function sendDataMobile() {
  if (valid.value) {
    isSending.value = true;
    const payload = {
      mobile_number: mobile.value,
    };
    try {
      const response = await axios.post(
        `/gypsy-registration/check-mobile-exists`,
        payload
      );
      const data = response.data;
      successMessage.value = data.message;
      isSuccess.value = true;
      localStorage.setItem("mobile", mobile.value);
      nextStep();
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.mobile_number
        ? error.response.data.mobile_number[0]
        : error.response?.data?.message
        ? `This Mobile Number ${
            mobile.value
          } is already exist in our database using the email id ${hideEmail(
            error.response.data.email_id
          )}`
        : "Something Wrong!!!";
      errorMessage.value = message;
      isError.value = true;
    } finally {
      isSending.value = false;
    }
  }
}

async function sendDataEmail() {
  if (valid.value) {
    isSending.value = true;
    const payload = {
      email_id: email.value,
    };
    try {
      const response = await axios.post(`/gypsy/check-info-by-email`, payload);
      const data = response.data.data;
      console.log(data);
      if (data == null) {
        localStorage.setItem("email", email.value);
        router.push("/sign-up-email");
      } else if (data.social_type === "E" && data.password) {
        isLogin.value = true;
      } else if (data.social_type === "E" && !data.password) {
        localStorage.setItem("email", data.email_id);
        localStorage.setItem("gypsy_id", data.gypsy_id);
        localStorage.setItem("token", data.token);
        router.push("/signup-email");
      } else if (data.social_type === "G") {
        successMessage.value =
          "You Last used Google to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
        isLogin.value = true;
        isSuccess.value = true;
      } else if (data.social_type === "F") {
        successMessage.value =
          "You Last used Facebook to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
        isLogin.value = true;
        isSuccess.value = true;
      } else if (data.social_type === "L") {
        successMessage.value =
          "You Last used Linkedin to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
        isLogin.value = true;
        isSuccess.value = true;
      } else if (data.social_type === "T") {
        successMessage.value =
          "You Last used Tiktok to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
        isLogin.value = true;
        isSuccess.value = true;
      } else if (data.social_type === "X") {
        successMessage.value =
          "You Last used Twitter to Sign-Up please use it again for faster login your account or please Enter your Password to proceed .";
        isLogin.value = true;
        isSuccess.value = true;
      }
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

async function loginEmail() {
  appIdLogin.value = localStorage.getItem("app_id");
  isSending.value = true;
  const payload = {
    email_id: email.value,
    password: password.value,
  };
  try {
    const response = await axios.post(`/gypsy/login`, payload);
    const data = response.data;
    console.log(data);
    if (isForgotPassword.value) {
      isChangePassword.value = true;
      tokenLogin.value = data.token;
    } else {
      successMessage.value = data.message;
      isSuccess.value = true;

      if (appIdLogin.value === "") {
        localStorage.setItem("social", "Email");
        localStorage.setItem("token", data.token);
        emitter.emit("changeHeaderWelcome3", "Sign-Up / Sign-in");
        router.push(`/?token=${data.token}`);
      } else if (appIdLogin.value === "5") {
        localStorage.setItem("social", "Email");
        const externalURL = `${import.meta.env.VITE_SYRINGE_URL}?token=${
          data.token
        }`;
        window.location.href = externalURL;
      } else if (appIdLogin.value === "2") {
        localStorage.setItem("social", "Email");
        const externalURL = `${import.meta.env.VITE_MALLE_URL}?token=${
          data.token
        }`;
        window.location.href = externalURL;
      }
    }
  } catch (error) {
    errorMessage.value = "Wrong Password";
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

function closeChangePassword() {
  isChangePassword.value = false;
  if (appIdLogin.value === "") {
    console.log("app id, ", appIdLogin.value);
    localStorage.setItem("social", "Email");
    localStorage.setItem("token", tokenLogin.value);
    emitter.emit("changeHeaderWelcome3", "Sign-Up / Sign-in");
    router.push(`/?token=${tokenLogin.value}`);
  } else if (appIdLogin.value === "5") {
    localStorage.setItem("social", "Email");
    const externalURL = `${import.meta.env.VITE_SYRINGE_URL}?token=${
      tokenLogin.value
    }`;
    window.location.href = externalURL;
  } else if (appIdLogin.value === "2") {
    localStorage.setItem("social", "Email");
    const externalURL = `${import.meta.env.VITE_MALLE_URL}?token=${
      tokenLogin.value
    }`;
    window.location.href = externalURL;
  }
}

onMounted(() => {
  console.log(appId.value);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/header.png");
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.login-input ::v-deep input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  -webkit-text-fill-color: #333 !important;
}
.login-input ::v-deep input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  -webkit-text-fill-color: #333 !important;
}

/* Firefox */
.login-input ::v-deep input:-moz-autofill {
  -moz-box-shadow: 0 0 0 30px #fff inset !important;
  -moz-text-fill-color: #333 !important;
}
/* Firefox */
.login-input ::v-deep input:-moz-autofill:focus {
  -moz-box-shadow: 0 0 0 30px #fff inset !important;
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

.login-btn-mobile {
  font-weight: 600;
  font-size: 18px;
}

.login-footer-span {
  font-size: 20px;
  font-weight: 600;
}

.login-line {
  width: 150px;
  height: 1px;
  background: #bababa;
}
.login-line-mobile {
  width: 150px;
}

.login-card {
  margin-top: 90px;
  padding-top: 15px;
  padding-bottom: 30px;
}

.login-footer-icon {
  cursor: pointer;
}
.login-footer-btn {
  gap: 20px;
}
.login-footer-btn-mobile {
  gap: 20px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
