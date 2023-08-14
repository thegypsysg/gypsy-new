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

                  <v-form v-model="valid" @submit.prevent>
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email</label
                    >
                    <div class="d-flex">
                      <v-text-field
                        v-model="email"
                        readonly
                        :rules="rules.emailRules"
                        class="login-input mt-2 mb-8"
                        type="email"
                        variant="outlined"
                        placeholder="John@example.com"
                        :persistent-hint="true"
                      >
                        <!-- <template #append> -->
                        <!-- </template> -->
                      </v-text-field>
                      <span
                        class="text-blue-darken-4 mt-5 ml-2"
                        style="cursor: pointer"
                        @click="backStep"
                      >
                        Change
                      </span>
                    </div>
                    <div class="d-flex w-100 mb-2 justify-space-between">
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
                      :rules="rules.nameRules"
                      class="login-input mb-8 mt-2"
                      type="text"
                      variant="outlined"
                      placeholder="Enter Name"
                    />
                    <!-- :persistent-hint="true" -->

                    <template v-if="!isSmall">
                      <div class="d-flex justify-space-between">
                        <label
                          style="font-weight: 600"
                          :class="{
                            'section-mobile': isSmall,
                            'section-desktop ': !isSmall,
                          }"
                          >Where Are You Now?</label
                        >
                        <div class="w-50">
                          <label
                            style="font-weight: 600"
                            :class="{
                              'section-mobile pl-4': isSmall,
                              'section-desktop w-50 pl-3': !isSmall,
                            }"
                            >Gender</label
                          >
                        </div>
                      </div>
                      <div class="d-flex mb-8">
                        <v-autocomplete
                          v-model="country"
                          :items="resource.countries"
                          :rules="rules.countryRules"
                          item-title="name"
                          item-value="id"
                          label="Enter Country"
                          class="mt-2 w-50 mr-8"
                          variant="outlined"
                          clearable
                        />

                        <v-radio-group
                          v-model="gender"
                          :rules="rules.genderRules"
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
                            :class="{
                              'mr-10': !isSmall,
                              'gender-small': isSmall,
                            }"
                            label="Male"
                            value="M"
                          >
                            <template #label>
                              <span :class="{ 'gender-small': isSmall }"
                                >Male</span
                              >
                            </template>
                          </v-radio>
                          <v-radio
                            :class="{
                              'gender-small': isSmall,
                            }"
                            value="F"
                          >
                            <template #label>
                              <span :class="{ 'gender-small': isSmall }"
                                >Female</span
                              >
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </div>
                    </template>

                    <template v-if="isSmall">
                      <label
                        style="font-weight: 600"
                        :class="{
                          'section-mobile': isSmall,
                          'section-desktop ': !isSmall,
                        }"
                        >Where Are You Now?</label
                      >

                      <v-autocomplete
                        v-model="country"
                        :items="resource.countries"
                        :rules="rules.countryRules"
                        item-title="name"
                        item-value="id"
                        label="Enter Country"
                        class="mt-2 w-50 mr-8 mb-6"
                        variant="outlined"
                        clearable
                      />

                      <div class="w-50">
                        <label
                          style="font-weight: 600"
                          :class="{
                            'section-mobile mt-6': isSmall,
                            'section-desktop w-50 pl-3': !isSmall,
                          }"
                          >Gender</label
                        >
                      </div>
                      <v-radio-group
                        v-model="gender"
                        :rules="rules.genderRules"
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
                          :class="{
                            'mr-10': !isSmall,
                            'gender-small': isSmall,
                          }"
                          label="Male"
                          value="M"
                        >
                          <template #label>
                            <span :class="{ 'gender-small': isSmall }"
                              >Male</span
                            >
                          </template>
                        </v-radio>
                        <v-radio
                          :class="{
                            'gender-small': isSmall,
                          }"
                          value="F"
                        >
                          <template #label>
                            <span :class="{ 'gender-small': isSmall }"
                              >Female</span
                            >
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </template>

                    <div class="d-flex align-center">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-66 login-btn-mobile mt-10': isSmall,
                          'w-50': !isSmall,
                        }"
                        @click="saveData"
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
import axios from "@/util/axios";
import app from "@/util/eventBus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "PersonalDetails",
  data() {
    return {
      valid: false,
      email: "",
      name: "",
      country: null,
      city: null,
      code: "",
      mobile: "",
      gender: "",
      rules: {
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
        nameRules: [
          (value) => {
            if (value) return true;
            return "Name is required.";
          },
        ],
        countryRules: [
          (value) => {
            if (value) return true;
            return "Country is required.";
          },
        ],
        cityRules: [
          (value) => {
            if (value) return true;
            return "City is required.";
          },
        ],
        codeRules: [
          (value) => {
            if (value) return true;
            return "Code is required.";
          },
        ],
        mobileRules: [
          (value) => {
            if (value) return true;
            return "Mobile is required.";
          },
        ],
        genderRules: [
          (value) => {
            if (value) return true;
            return "Gender is required.";
          },
        ],
      },
      screenWidth: window.innerWidth,
      isSuccess: false,
      successMessage: "",
      resource: {
        countries: [],
        cities: [],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    country: function (newVal, oldVal) {
      // this.getCityData(newVal);
      this.getCountryCode(newVal);
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.email = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : "";
    this.getCountry();
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
      app.config.globalProperties.$eventBus.$emit(
        "changeHeaderWelcome",
        "New Sign-Up"
      );
    },
    saveData() {
      if (this.valid) {
        // const payload = {
        //   email_id: this.email,
        //   name: this.name,
        //   country_current: this.country,
        //   gender: this.gender,
        //   registered_type: this.isSmall ? "M" : "W",
        //   app_id: this.$appId,
        // };
        localStorage.setItem("email_id", this.email);
        localStorage.setItem("name", this.name);
        localStorage.setItem("country_current", this.country);
        localStorage.setItem("gender", this.gender);
        localStorage.setItem("registered_type", this.isSmall ? "M" : "W");
        localStorage.setItem("app_id", this.$appId);
        localStorage.setItem("code", this.code);
        this.email = "";
        this.name = "";
        this.country = null;
        this.gender = "";

        this.nextStep();
      }
    },

    getCountry() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.countries = data.map((country) => {
            return {
              id: country.country_id,
              name: country.country_name,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
    },

    getCityData(country) {
      this.isLoading = true;
      axios
        .get(`/city`)
        .then((response) => {
          const data = response.data.data;
          // console.log(data);
          this.resource.cities = data
            .filter((i) => i.country_id == country)
            .map((item) => {
              return {
                id: item.city_id || 1,
                name: item.city_name || "",
              };
            });
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getCountryCode(country) {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.code = data
            .filter((i) => i.country_id == country)
            .map((country) => country.country_code);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        });
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
</style>
