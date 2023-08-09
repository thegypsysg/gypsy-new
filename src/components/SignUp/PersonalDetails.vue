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
                  <!-- <h1
                    class="mb-1"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile': isSmall }"
                  >
                    Step 2 - Personal Details
                  </h1> -->

                  <v-form fast-fail @submit.prevent="login">
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email</label
                    >
                    <v-text-field
                      v-model="email"
                      class="login-input mt-2 mb-8"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      placeholder="John@example.com"
                      :persistent-hint="true"
                    />
                    <div class="d-flex w-100 mb-n8 justify-space-between">
                      <span
                        style="font-weight: 600"
                        class="w-50"
                        :class="{
                          'section-mobile mt-2': isSmall,
                          'section-desktop': !isSmall,
                        }"
                        >Full Name</span
                      >
                    </div>
                    <v-text-field
                      v-model="name"
                      class="login-input mb-8 mt-2"
                      variant="outlined"
                      placeholder="Enter Name"
                      :persistent-hint="true"
                    />

                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Where Are You Now?</label
                    >
                    <div class="d-flex mb-8">
                      <v-autocomplete
                        v-model="country"
                        :items="resource.countries"
                        label="Enter Country"
                        class="mt-6 w-50 mr-2"
                        variant="outlined"
                        clearable
                      />
                      <v-autocomplete
                        v-model="city"
                        :items="resource.cities"
                        label="Which City"
                        class="mt-6 w-50"
                        variant="outlined"
                        clearable
                      />
                    </div>
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Mobile Number</label
                    >
                    <div class="d-flex">
                      <div class="d-flex mr-2" style="width: 50%">
                        <v-text-field
                          v-model="mobileCountry"
                          type="text"
                          class="mt-2"
                          placeholder="Code"
                          variant="outlined"
                          :persistent-hint="true"
                        />
                        <v-text-field
                          v-model="mobile"
                          type="number"
                          class="login-input mb-8 mt-2"
                          variant="outlined"
                          placeholder="Phone Number"
                          :persistent-hint="true"
                        />
                      </div>
                      <div>
                        <p>Gender</p>
                        <v-radio-group
                          v-model="gender"
                          style="
                            border: 1px solid rgb(166, 166, 166);
                            border-radius: 5px;
                            height: 50px;
                            width: 50%;
                          "
                          class="mt-2"
                          inline
                        >
                          <v-radio
                            :class="{ 'mr-10': !isSmall }"
                            label="Male"
                            value="male"
                          />
                          <v-radio label="Female" value="female" />
                        </v-radio-group>
                      </div>
                    </div>

                    <div class="d-flex align-center">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-66 login-btn-mobile': isSmall,
                          'w-75': !isSmall,
                        }"
                        @click="nextStep"
                      >
                        Next
                      </v-btn>
                      <div
                        :class="{
                          'w-33 login-btn-mobile': isSmall,
                          'w-25': !isSmall,
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
                    Please enter your personal details and press Next to
                    continue
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
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "PersonalDetails",
  data() {
    return {
      name: "",
      gender: "",
      mobileCountry: "",
      mobile: "",
      whatsappCountry: null,
      whatsapp: "",
      screenWidth: window.innerWidth,
      isSuccess: false,
      successMessage: "",
      resource: {
        countries: [
          {
            code: "+65",
            name: "Singapore",
            flag: "https://link-to-singapore-flag-image.png",
          },
          {
            code: "+62",
            name: "Indonesia",
            flag: "https://link-to-indonesia-flag-image.png",
          },
          {
            code: "+91",
            name: "India",
            flag: "https://link-to-india-flag-image.png",
          },
        ],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
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
    backStep() {
      this.$emit("backStep");
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    resendOTP() {
      this.isSuccess = true;
      this.successMessage = "Success send OTP";
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

.header-mobile {
  font-size: 20px;
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
</style>
