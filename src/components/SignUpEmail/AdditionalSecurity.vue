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
                    class="mb-6"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile': isSmall }"
                  >
                    Step 3 - Additional Security
                  </h1>

                  <v-form v-model="valid" @submit.prevent>
                    <label
                      style="font-weight: 600"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Enter a strong password, min 8 characters</label
                    >
                    <div
                      class="d-flex"
                      :class="{
                        'flex-column': isSmall,
                        'flex-row': !isSmall,
                      }"
                    >
                      <v-text-field
                        v-model="password"
                        class="login-input mb-8"
                        :class="{
                          'mr-4 mt-2': !isSmall,
                          'mt-4': isSmall,
                        }"
                        :rules="passwordRules"
                        type="password"
                        variant="outlined"
                        placeholder="Password"
                      />
                      <v-text-field
                        v-model="password2"
                        class="login-input mb-8"
                        :class="{
                          'mt-2': !isSmall,
                        }"
                        :rules="password2Rules"
                        type="password"
                        variant="outlined"
                        placeholder="Re-enter Password"
                      />
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
                        @click="saveData"
                        :disabled="!valid"
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
                  <h1 style="width: 80%">
                    Please create a password so you can use that to login.
                  </h1>
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

<script>
import axios from "@/util/axios";
import app from "@/util/eventBus";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "AdditionalSecurity",
  data() {
    return {
      valid: false,
      email: "",
      name: "",
      country: "",
      mobile: "",
      gender: "",
      countryName: "",
      imageSend: null,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      ],
      password2Rules: [
        (v) => !!v || "Confirm Password is required",
        (v) => v === this.password || "Passwords do not match",
      ],
      password: "",
      password2: "",
      screenWidth: window.innerWidth,
      isError: false,
      isSuccess: false,
      errorMessage: "",
      successMessage: "",
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
  mounted() {
    this.email = localStorage.getItem("p_email");
    this.name = localStorage.getItem("p_name");
    this.country = localStorage.getItem("p_country");
    this.mobile = localStorage.getItem("p_mobile");
    this.gender = localStorage.getItem("p_gender");
    this.countryName = localStorage.getItem("p_countryName");
    this.imageSend = localStorage.getItem("p_image") || null;
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
    dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    saveData() {
      if (this.valid) {
        this.isSending = true;
        const payload = {
          email_id: this.email,
          name: this.name,
          country_prefix: this.country,
          mobile_number: this.mobile,
          gender: this.gender,
          app_id: this.$appId,
          registered_type: this.isSmall ? "M" : "W",
          country_name: this.countryName,
          password: this.password2,
        };
        if (this.imageSend !== null) {
          const blob = this.dataURItoBlob(this.imageSend);
          const file = new File([blob], "image.jpg", { type: "image/jpeg" });
          payload["image"] = file;
          // payload["image"] = this.imageSend;
        }
        axios
          .post(`/gypsy/save-normal-user`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            const data = response.data;
            console.log(data);
            this.successMessage = data.message;
            localStorage.setItem("name", data.data.name);
            localStorage.setItem("email", data.data.email_id);
            localStorage.setItem("g_id", data.data.gypsy_ref_no);
            localStorage.setItem("user_image", data.data.image);
            localStorage.setItem("last_login", data.data.last_login);
            localStorage.setItem("token", data.data.token);
            this.isSuccess = true;
            this.email = "";
            this.name = "";
            this.country = null;
            this.city = null;
            this.mobile = "";
            this.gender = "";
            app.config.globalProperties.$eventBus.$emit(
              "changeHeaderWelcome",
              "Sign Up Completed"
            );
            this.nextStep();
            // this.getUserData();
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            const message = error.response.data.email_id
              ? error.response.data.email_id[0]
              : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/Syringe-Signup-main.jpg");
  background-position: center;
  background-size: cover;
  background-color: #cccccc;
  min-height: 100vh;
}

.header-mobile {
  font-size: 20px;
}

.section-desktop {
  font-size: 20px;
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
