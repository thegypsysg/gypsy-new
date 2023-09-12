spanspan
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
                Last Used: {{ socialProvider }}
              </p>
              <v-form v-model="valid" @submit.prevent>
                <!-- <div
                  v-if="isSmall"
                  class="d-flex flex-column justify-center text-center mt-10"
                  style="gap: 5px"
                >
                  <h2>Social Media</h2>
                  <p>please select anyone from below</p>
                </div> -->
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
                  <!-- <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #fc2145"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-instagram" />
                    </v-icon>
                  </v-btn> -->

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

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #0072b1"
                    color="white"
                    icon
                    @click="loginSocial('linkedin-openid')"
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-linkedin-in" />
                    </v-icon>
                  </v-btn>
                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: black"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-tiktok" />
                    </v-icon>
                  </v-btn>
                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #1c96e8"
                    color="white"
                    icon="mdi-twitter"
                  />
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
                <p
                  v-if="isMobile"
                  class="text-grey mt-4"
                  :class="{ 'mb-4': !isSmall, 'mb-6': isSmall }"
                >
                  <span
                    style="cursor: pointer"
                    class="text-blue-darken-4"
                    @click="
                      () => {
                        isMobile = false;
                        mobile = null;
                      }
                    "
                    >Register by Email</span
                  >
                </p>
                <template v-if="!isMobile">
                  <label style="font-size: 24px; font-weight: 600">Email</label>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    class="login-input mb-8"
                    type="email"
                    variant="outlined"
                    placeholder="Email Address"
                    :persistent-hint="true"
                  />
                </template>
                <template v-else>
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
                <v-btn
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn"
                  :disabled="!isNext"
                  :class="{ 'login-btn-mobile': isSmall, 'mt-6': isMobile }"
                  @click="sendData"
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
      </v-container>
    </div>
  </div>
</template>
<script setup>
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
</script>

<script>
import axios from "@/util/axios";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Welcome",
  data() {
    return {
      valid: false,
      isMobile: false,
      isNext: false,
      email: null,
      mobile: null,
      phoneEvent: null,
      isError: false,
      errorMessage: "",
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
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    socialProvider() {
      return localStorage.getItem("social")
        ? localStorage.getItem("social") + " Login"
        : "-";
    },
  },
  watch: {
    isMobile(newVal) {
      if (newVal) {
        this.email = null;
        this.mobile = null;
        this.isNext = false;
      }
    },
    email(newVal) {
      if (this.email == null) {
        this.isNext = false;
      } else if (/.+@.+\..+/.test(newVal)) {
        this.isNext = true;
      }
    },
    mobile() {
      if (this.mobile == null) {
        this.isNext = false;
      } else {
        this.isNext = true;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    nextStep() {
      this.$emit("nextStep");
    },
    loginSocial(social_name) {
      axios
        .get(`/gypsy-login/${social_name}`)
        .then((response) => {
          console.log(response);
          if (response) {
            window.location.assign(response.data.target_url);
          } else {
            window.location.href = "/sign-in";
          }
          console.log(response.data.target_url);
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/sign-in";
        });
    },
    sendData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          email_id: this.email,
        };
        axios
          .post(`/gypsy-registration/check-email-exists`, payload)
          .then((response) => {
            const data = response.data;
            this.successMessage = data.message;
            this.isSuccess = true;
            localStorage.setItem("email", this.email);
            // this.email = "";
            this.nextStep();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.email_id
              ? error.response.data.email_id[0]
              : error.response.data.message
              ? error.response.data.message
              : "Something Wrong!!!";
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/header.png");
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
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
</style>
