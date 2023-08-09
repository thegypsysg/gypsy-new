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
              :class="{ 'login-card px-12': !isSmall, 'py-10 px-2': isSmall }"
            >
              <h1
                class="mb-1"
                style="font-family: Arial, Helvetica, sans-serif !important"
              >
                Welcome
              </h1>
              <p :class="{ 'mb-4': !isSmall, 'mb-12': isSmall }">
                To begin please enter your email and press Get Started
              </p>
              <v-form fast-fail @submit.prevent="login">
                <label
                  style="font-weight: 600"
                  :class="{
                    'section-mobile': isSmall,
                    'section-desktop': !isSmall,
                  }"
                  >Email ID</label
                >
                <v-text-field
                  v-model="email"
                  class="login-input mb-8 mt-2"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  placeholder="John@example.com"
                  :persistent-hint="true"
                />

                <v-btn
                  type="submit"
                  variant="outlined"
                  block
                  class="login-btn"
                  @click="nextStep"
                  :class="{ 'login-btn-mobile': isSmall }"
                >
                  Continue
                </v-btn>
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

                <div
                  v-if="isSmall"
                  class="d-flex flex-column justify-center text-center mt-10"
                  style="gap: 5px"
                >
                  <h2>Social Media</h2>
                  <p>please select anyone from below</p>
                </div>
                <div
                  class="login-footer-btn d-flex justify-center mt-5"
                  :class="{ 'login-footer-btn-mobile': isSmall }"
                >
                  <v-btn
                    v-if="!isSmall"
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
                    style="background: #4267b2"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-facebook-f" />
                    </v-icon>
                  </v-btn>

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #fc2145"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-instagram" />
                    </v-icon>
                  </v-btn>

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    color="white"
                    style="background: #db4a39"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-google-plus-g" />
                    </v-icon>
                  </v-btn>

                  <v-btn
                    :size="!isSmall ? '40' : '50'"
                    variant="text"
                    style="background: #0072b1"
                    color="white"
                    icon
                  >
                    <v-icon :size="!isSmall ? '18' : '24'">
                      <i class="fa-brands fa-linkedin-in" />
                    </v-icon>
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'InputEmail',
  data() {
    return {
      email: '',
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    nextStep() {
      this.$emit('nextStep');
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url('@/assets/Syringe-Signup-main.jpg');
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.section-desktop {
  font-size: 24px;
}

.section-mobile {
  font-size: 16px;
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

  background: #fa2964;
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
</style>
