<template>
  <div>
    <div
      class="d-flex align-center"
      :class="{ 'login-container': !isSmall, 'mt-10': isSmall }"
    >
      <v-container fluid>
        <v-row class="d-flex align-center justify-end">
          <v-col :cols="isSmall ? '12' : '5'">
            <v-card
              :elevation="!isSmall ? 1 : 0"
              :max-width="isSmall ? `${screenWidth - 30}px` : ''"
              class="mx-auto"
              :class="{
                'login-card px-12': !isSmall,
                'login-card-mobile pt-10 pb-16 px-2': isSmall,
              }"
            >
              <v-row>
                <v-col cols="12">
                  <h2
                    class="mb-1 text-center"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile': isSmall }"
                  >
                    Step 1 - User Information
                  </h2>

                  <v-form v-model="valid" @submit.prevent>
                    <input
                      ref="filePickerField"
                      type="file"
                      accept="image/*"
                      hidden
                      @change="launchCropper"
                    />
                    <div
                      class="image-container d-flex justify-center w-100 mb-4"
                      style="position: relative"
                    >
                      <div
                        style="
                          cursor: pointer;
                          position: absolute;
                          left: 0;
                          top: 15px;
                        "
                        @click="goBack"
                      >
                        <v-icon>mdi-arrow-left</v-icon>
                      </div>
                      <div>
                        <v-avatar size="100px" class="mt-5">
                          <v-img
                            height="100"
                            :src="
                              image_path != ''
                                ? image_path
                                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                            "
                          />
                        </v-avatar>
                        <div class="mt-2 w-100 d-flex justify-center">
                          <v-btn
                            color="blue"
                            variant="outlined"
                            @click="$refs.filePickerField.click()"
                          >
                            Upload
                          </v-btn>
                        </div>
                        <image-cropper-dialog
                          ref="cropperDialog"
                          :chosen-image="image"
                          @onReset="$refs.filePickerField.value = null"
                          @onCrop="
                            (croppedImage) => {
                              image_path = croppedImage;
                            }
                          "
                        />
                      </div>
                    </div>
                    <div class="d-flex w-100 mb-2 justify-space-between">
                      <span
                        style="font-weight: 500"
                        class="w-50"
                        :class="{
                          'section-mobile mt-2': isSmall,
                          'section-desktop': !isSmall,
                        }"
                        >Full Name</span
                      >
                    </div>
                    <input
                      v-model="name"
                      type="text"
                      class="form-control mt-2 mb-4"
                      placeholder="Enter Your Full Name"
                    />
                    <label
                      style="font-weight: 500"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email</label
                    >
                    <input
                      v-model="email"
                      type="email"
                      class="form-control mt-2 mb-4"
                      placeholder="Enter Your Email Address"
                    />

                    <div class="d-flex justify-space-between">
                      <label
                        style="font-weight: 500"
                        :class="{
                          'section-mobile': isSmall,
                          'section-desktop ': !isSmall,
                        }"
                        >Password</label
                      >
                    </div>
                    <input
                      v-model="password"
                      type="password"
                      class="form-control mt-2"
                      placeholder="Enter Your Password"
                    />

                    <v-radio-group v-model="gender" class="mt-2" inline>
                      <v-radio
                        :class="{
                          'mr-2': !isSmall,
                          'gender-small': isSmall,
                        }"
                        label="Male"
                        color="#005CC8"
                        value="M"
                      >
                        <template #label>
                          <span :class="{ 'gender-small': isSmall }">Male</span>
                        </template>
                      </v-radio>
                      <v-radio
                        :class="{
                          'gender-small': isSmall,
                        }"
                        color="#005CC8"
                        value="F"
                      >
                        <template #label>
                          <span :class="{ 'gender-small': isSmall }"
                            >Female</span
                          >
                        </template>
                      </v-radio>
                    </v-radio-group>
                    <div class="d-flex justify-space-between mt-n4">
                      <label
                        style="font-weight: 500"
                        :class="{
                          'section-mobile mb-2': isSmall,
                          'section-desktop w-50 mb-2 ': !isSmall,
                        }"
                        >Mobile Number</label
                      >
                    </div>
                    <MazPhoneNumberInput
                      v-model="mobile"
                      show-code-on-list
                      color="info"
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
                    <!-- <VuePhoneNumberInput v-model="yourValue" /> -->

                    <div class="d-flex align-center justify-start">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-66 login-btn-mobile mt-8 mb-6': isSmall,
                          'w-50 mt-8': !isSmall,
                        }"
                        @click="saveData"
                      >
                        Next
                      </v-btn>
                    </div>
                  </v-form>
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
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
import ImageCropperDialog from "../ImageCropperDialog.vue";

export default {
  name: "PersonalDetails",
  components: {
    MazPhoneNumberInput,
    ImageCropperDialog,
  },
  data() {
    return {
      valid: false,
      image: null,
      image_path: "",
      name: "",
      email: "",
      password: "",
      gender: "",
      code: "",
      mobile: null,
      phoneEvent: null,
      screenWidth: window.innerWidth,
      isSuccess: false,
      successMessage: "",
      resource: {
        code: [],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    emailProvider() {
      return this.$route.query.email || "";
    },
    nameProvider() {
      return this.$route.query.name || "";
    },
    avatarProvider() {
      return this.$route.query.avatar || "";
    },
  },

  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.email = this.emailProvider;
    this.password = "";
    this.name = this.nameProvider;
    this.image_path = this.avatarProvider;
    this.getCountryCode();
    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "Google Registration"
    );
    console.log(this.emailProvider);
    console.log(this.nameProvider);
    console.log(this.avatarProvider);
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
    onFileChangeInput(e) {
      var files = e.target.files || e.dataTransfer.files;
      this.image = files[0];
      this.image_path = URL.createObjectURL(files[0]);
      // console.log(this.input);
    },
    async launchCropper(event) {
      if (!event) return;
      var file = event.target.files[0];
      this.image = await this.toBase64(file);
      this.$refs.cropperDialog.initCropper(file.type);
    },

    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    goBack() {
      window.history.back();
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

    getCountryCode() {
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.code = data.map((country) => {
            return {
              name: `${country.country_name} (${country.country_code})`,
              code: country.country_code,
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
  font-size: 18px;
}

.section-mobile {
  font-size: 14px;
}

.gender-small {
  font-size: 14px;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
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
  margin-top: 120px;
  marginn-bottom: 50px;
  padding-top: 20px;
  padding-bottom: 40px;
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
