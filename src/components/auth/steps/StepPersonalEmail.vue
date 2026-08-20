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
                'login-card px-12 pb-16': !isSmall,
                'login-card-mobile pb-16 px-2': isSmall,
              }"
            >
              <v-row>
                <v-col cols="12">
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
                      <div
                        style="width: 150px; height: 150px; border-radius: 50%"
                        class="mt-5"
                      >
                        <v-img
                          style="width: 100%; height: 100%; border-radius: 50%"
                          cover
                          :src="
                            image_path
                              ? image_path
                              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                          "
                        />
                      </div>
                      <div
                        class="mt-4 w-100 d-flex align-center"
                        :class="{
                          'justify-space-between': image_path,
                          'justify-center': !image_path,
                        }"
                      >
                        <v-btn
                          size="small"
                          color="blue"
                          variant="outlined"
                          @click="$refs.filePickerField.click()"
                        >
                          Upload Picture
                        </v-btn>
                        <v-icon
                          v-if="image_path"
                          @click="deleteImage()"
                          color="red"
                          icon="mdi-trash-can-outline"
                        >
                        </v-icon>
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
                  <v-form v-model="valid" @submit.prevent>
                    <div class="d-flex w-100 mb-2 justify-space-between">
                      <span
                        style="font-weight: 500"
                        class="w-50"
                        :class="{
                          'section-mobile ': isSmall,
                          'section-desktop': !isSmall,
                        }"
                        >Full Name</span
                      >
                    </div>
                    <input
                      v-model="name"
                      type="text"
                      required
                      class="form-control pl-2 mt-2 mb-4"
                      placeholder="Enter Your Full Name"
                    />
                    <h6 v-if="isName == false" class="w-100 mt-n4 text-red">
                      You must fill the name.
                    </h6>
                    <label
                      style="font-weight: 500"
                      :class="{
                        'section-mobile': isSmall,
                        'section-desktop': !isSmall,
                      }"
                      >Email
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      disabled
                      class="form-control pl-2 mt-2 mb-4"
                      placeholder="Enter Your Email Address"
                    />

                    <div class="d-flex justify-space-between">
                      <label
                        style="font-weight: 500"
                        :class="{
                          'section-mobile': isSmall,
                          'section-desktop ': !isSmall,
                        }"
                        >Where are you now</label
                      >
                    </div>

                    <div class="w-100 d-flex align-center">
                      <div
                        v-if="country"
                        style="
                          border-top: 2px solid rgb(239, 239, 239);
                          border-bottom: 2px solid rgb(239, 239, 239);
                          border-left: 2px solid rgb(239, 239, 239);
                          border-radius: 5px 0 0px 5px;
                          height: 47px;
                        "
                        class="d-flex align-center justify-center"
                      >
                        <span
                          class="fi ml-2 pr-4 mr-4"
                          :class="['fi-' + country.toLowerCase()]"
                        />
                      </div>
                      <MazSelect
                        v-slot="{ option }"
                        v-model="country"
                        label="Select Country"
                        item-height="40"
                        :options="options"
                        search
                        max-list-width="250"
                        search-placeholder="Search in country"
                        :class="{ 'ml-n1': country }"
                      >
                        <div
                          class="flex items-center"
                          style="
                            padding-top: 0.5rem;
                            padding-bottom: 0.5rem;
                            width: 100%;
                            gap: 1rem;
                          "
                        >
                          <span
                            class="fi"
                            :class="['fi-' + option.value.toLowerCase()]"
                          />
                          <span class="pl-2">
                            {{ option.label }}
                          </span>
                        </div>
                      </MazSelect>
                    </div>
                    <v-radio-group v-model="gender" inline>
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
                    <h6
                      v-if="isGender == false"
                      class="w-100 mt-n11 mb-6 text-red"
                    >
                      You must choose gender.
                    </h6>
                    <div class="d-flex justify-space-between">
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
                      :default-country-code="country ? country : 'SG'"
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
                    <h6 v-if="isMobile == false" class="w-100 text-red">
                      You must fill the mobile number.
                    </h6>

                    <div class="d-flex align-center justify-start">
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-66 login-btn-mobile mt-8 mb-6': isSmall,
                          'w-50 mt-8': !isSmall,
                        }"
                        @click="saveData()"
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
        <v-dialog v-model="isErrorPhone" max-width="500" persistent>
          <v-card class="pt-6 pb-3">
            <v-card-text class="pb-3">
              <span>{{ errorMessagePhone }}</span
              ><span class="text-blue-darken-4">{{ emailErrorPhone }}</span>
            </v-card-text>
            <v-card-actions class="py-0">
              <v-btn text color="blue" @click="isErrorPhone = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
import MazSelect from "maz-ui/components/MazSelect";
import ImageCropperDialog from "@/components/ImageCropperDialog.vue";
import { countryOptions } from "@/constants/countries";

export default {
  name: "StepPersonalEmail",
  components: {
    MazPhoneNumberInput,
    MazSelect,
    ImageCropperDialog,
  },
  data() {
    return {
      isName: true,
      isGender: true,
      isMobile: true,
      valid: false,
      image: null,
      imageSend: null,
      image_path: "",
      name: "",
      email: "",
      country: "SG",
      gender: "",
      code: "",
      mobile: null,
      phoneEvent: null,
      screenWidth: window.innerWidth,
      isError: false,
      isErrorPhone: false,
      isSuccess: false,
      errorMessage: "",
      errorMessagePhone: "",
      successMessage: "",
      emailErrorPhone: "",
      resource: {
        code: [],
      },
      options: countryOptions,
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  watch: {
    name: function (newVal) {
      if (newVal) {
        this.isName = true;
      }
    },
    gender: function (newVal) {
      if (newVal) {
        this.isGender = true;
      }
    },
    mobile: function (newVal) {
      if (newVal) {
        this.isMobile = true;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.getCountryCode();

    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "Sign-up by Email"
    );
    this.email = localStorage.getItem("email")
      ? localStorage.getItem("email")
      : "";
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    nextStep() {
      this.$emit("nextStep");
    },
    backStep() {
      this.$emit("backStep");
    },
    deleteImage() {
      this.image = null;
      this.imageSend = null;
      this.image_path = "";
    },
    onFileChangeInput(e) {
      var files = e.target.files || e.dataTransfer.files;
      this.image = files[0];
      this.image_path = URL.createObjectURL(files[0]);
    },
    async launchCropper(event) {
      if (!event) return;
      var file = event.target.files[0];
      this.image = await this.toBase64(file);
      this.imageSend = file;
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
      this.$emit("backStep");
    },
    hideEmail(email) {
      const atIndex = email.indexOf("@");
      if (atIndex >= 0) {
        const username = email.substring(0, atIndex);
        const hiddenPart = username
          .substring(0, Math.max(0, username.length - 6))
          .replace(/./g, "*");
        const visiblePart = username.substring(
          Math.max(0, username.length - 6)
        );
        return hiddenPart + visiblePart + email.substring(atIndex);
      } else {
        return email;
      }
    },
    saveData() {
      if (this.valid) {
        if (this.name == "") {
          this.isName = false;
        } else {
          this.isName = true;
        }
        if (this.gender == "") {
          this.isGender = false;
        } else {
          this.isGender = true;
        }
        if (this.mobile == null) {
          this.isMobile = false;
        } else {
          this.isMobile = true;
        }
        const countryName = this.options
          .filter((o) => o.value == this.country)
          .map((op) => op.label)[0];
        this.isSending = true;
        const appId = localStorage.getItem("app_id");
        const payload = {
          email_id: this.email,
          name: this.name,
          country_prefix: this.country,
          mobile_number: this.mobile,
          gender: this.gender,
          app_id: appId == "" ? this.$appId : appId,
          registered_type: this.isSmall ? "M" : "W",
          country_name: countryName,
          image: this.imageSend || null,
          country_code: this.phoneEvent?.countryCallingCode
            ? `+${this.phoneEvent.countryCallingCode}`
            : "",
          flag: `https://flagicons.lipis.dev/flags/4x3/${this.phoneEvent?.countryCode?.toLowerCase() || 'sg'}.svg`,
        };
        console.log(payload);

        if (
          this.isMobile == true &&
          this.isName == true &&
          this.isGender == true
        ) {
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
              localStorage.setItem("gypsy_id", data.data.gypsy_id);
              localStorage.setItem("user_image", data.data.image);
              localStorage.setItem("last_login", data.data.last_login);
              localStorage.setItem("token", data.data.token);
              this.isSuccess = true;
              this.nextStep();
            })
            .catch((error) => {
              console.log(error);
              if (error.response?.status == 422) {
                const message =
                  error.response.status == 422 &&
                  error.response.data.email_id &&
                  error.response.data.message
                    ? `This Mobile Number ${this.mobile} already exist in our database using the email id `
                    : error.response.status == 422 &&
                      error.response.data.email_id == null &&
                      error.response.data.message
                    ? `This Mobile Number ${this.mobile} already exists in our database`
                    : "";
                this.emailErrorPhone = error.response.data.email_id
                  ? error.response.data.email_id
                  : "";
                this.errorMessagePhone = message;
                this.isErrorPhone = true;
              } else {
                const message = error.response?.data?.email_id
                  ? error.response.data.email_id[0]
                  : error.response?.data?.message === ""
                  ? "Something Wrong!!!"
                  : error.response?.data?.message || "Something Wrong!!!";
                this.errorMessage = message;
                this.isError = true;
              }
            })
            .finally(() => {
              this.isSending = false;
            });
        }
      }
    },
    getUserData() {
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
          console.log(error);
          const message =
            error.response?.data?.message === ""
              ? "Something Wrong!!!"
              : error.response?.data?.message || "Something Wrong!!!";
          this.errorMessage = message;
          this.isError = true;
        });
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
          console.log(error);
          const message =
            error.response?.data?.message === ""
              ? "Something Wrong!!!"
              : error.response?.data?.message || "Something Wrong!!!";
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

.country-no {
  left: 30px;
}
.country-yes {
  left: 40px;
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
  margin-bottom: 50px;
  padding-top: 20px;
  padding-bottom: 100px;
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

.flag-text {
  margin-left: 10px;
}
</style>
