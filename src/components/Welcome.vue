<template>
  <div>
    <!-- <v-app-bar color="white" elevation="1" fixed>
      <router-link to="/">
        <img class="logo-img" src="@/assets/images/logo/logo.png" height="90" />
      </router-link>
      <div class="ml-4 d-flex flex-row header-info">
        <div class="divider" />
        <span>Sign Up / Login</span>
      </div>
      <v-spacer />
    </v-app-bar> -->
    <div class="d-flex align-center login-container">
      <v-container fluid>
        <v-row class="d-flex align-center justify-end">
          <v-col cols="6">
            <v-card
              elevation="1"
              max-width="450"
              class="mt-12 mx-auto px-12 login-card"
            >
              <h1 class="mb-1">Welcome</h1>
              <p class="mb-4">
                To begin please enter your email and press Get Started
              </p>
              <v-form fast-fail @submit.prevent="login">
                <v-text-field
                  v-model="email"
                  class="login-input mb-8"
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder="John@example.com"
                  :persistent-hint="true"
                />

                <v-btn type="submit" variant="outlined" block class="login-btn">
                  Get Started
                </v-btn>
                <div class="login-footer mt-8">
                  <div class="d-flex justify-center" style="gap: 25px">
                    <div class="login-line" />
                    <span class="mt-n3">OR</span>
                    <div class="login-line" />
                  </div>
                </div>
                <div
                  class="login-footer-btn d-flex justify-center mt-5"
                  style="gap: 20px"
                >
                  <div class="login-footer-icon">
                    <img src="../assets/tiktok.png" alt="logo" />
                  </div>
                  <div class="login-footer-icon">
                    <img src="../assets/facebook.png" alt="logo" />
                  </div>
                  <div class="login-footer-icon">
                    <img src="../assets/instagram.png" alt="logo" />
                  </div>
                  <div class="login-footer-icon">
                    <img src="../assets/google.png" alt="logo" />
                  </div>
                  <div class="login-footer-icon">
                    <img src="../assets/linkedin.png" alt="logo" />
                  </div>
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
  name: "Welcome",
  data() {
    return {
      rememberMe: false,
      password: "",
      email: "",
      showPassword: false,
    };
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("../assets/header.png");
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

.login-line {
  width: 70px;
  height: 1px;
  background: #bababa;
}

.login-card {
  padding-top: 15px;
  padding-bottom: 120px;
}

.login-footer-icon {
  cursor: pointer;
}
</style>
