<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <v-container v-if="!isLoading">
      <!-- Desktop View -->
      <template v-if="!isSmall">
        <div class="card-container d-flex flex-wrap justify-space-between">
          <!-- First Section (Left Card) -->
          <v-card class="first-section px-16 py-2">
            <ProfileAvatar
              :image-path="image_path"
              :is-save-image="isSaveImage"
              @launch-cropper="launchCropper"
              @delete-image="deleteImage"
            />
            <BasicInfoForm
              section="desktop-left"
              :input="input"
              :resource="resource"
              @input-nationality="onInputNationality"
              @save-desktop-1="saveDataDesktop1"
            />
          </v-card>

          <!-- Second Section (Right Card) -->
          <v-card class="second-section">
            <v-card-title
              style="border-bottom: 1px solid rgb(227, 227, 227)"
              class="card-title"
            >
              <v-container
                class="d-flex align-center justify-space-between my-n4"
              >
                <p class="title-card">Basic Information</p>
                <v-btn
                  class="text-none text-subtitle-1"
                  color="success"
                  size="large"
                  variant="flat"
                  @click="saveDataDesktop2()"
                >
                  Save Changes
                </v-btn>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container>
                <BasicInfoForm
                  section="desktop-right"
                  :input="input"
                  :resource="resource"
                  :is-email-verified="isEmailVerified"
                  :is-email-o-t-p="isEmailOTP"
                  :is-verifying="isVerifying"
                  :is-change-email="isChangeEmail"
                  :is-sending="isSending"
                  @verify-email="verifyEmail"
                  @open-why="isWhy = true"
                  @handle-input-otp="handleInputOTP"
                  @save-email-otp="saveEmailOTP"
                  @toggle-change-email="isChangeEmail = !isChangeEmail"
                  @save-email="saveEmail"
                />

                <v-row>
                  <v-col cols="6">
                    <ContactForm
                      :input="input"
                      :is-phone-verified="isPhoneVerified"
                      :is-change-phone="isChangePhone"
                      :is-mobile-changed="isMobileChanged"
                      :success-message="successMessage"
                      @toggle-change-phone="isChangePhone = !isChangePhone"
                      @save-mobile="saveMobile"
                      @phone-update="phoneEvent = $event"
                      @update:isMobileChanged="isMobileChanged = $event"
                    />
                  </v-col>
                  <v-col cols="6">
                    <SecurityForm
                      :input="input"
                      :is-change-password="isChangePassword"
                      :is-password-changed="isPasswordChanged"
                      :show-password-1="showPassword1"
                      :show-password-2="showPassword2"
                      :is-password-1="isPassword1"
                      :is-password-2="isPassword2"
                      :password-2-mes="password2Mes"
                      :success-message="successMessage"
                      :is-loading="isLoading"
                      @toggle-change-password="isChangePassword = !isChangePassword"
                      @toggle-show-password-1="showPassword1 = !showPassword1"
                      @toggle-show-password-2="showPassword2 = !showPassword2"
                      @change-password="changePassword"
                      @update:isPasswordChanged="isPasswordChanged = $event"
                    />
                  </v-col>
                </v-row>

                <BasicInfoForm
                  section="desktop-birthdate"
                  :input="input"
                  :resource="resource"
                  :age="age"
                  @date-input="onDateInput"
                />
              </v-container>

              <!-- Current Location Section -->
              <LocationForm
                :input="input"
                :resource="resource"
                :options="options"
                :rules="rules"
                @save-location="saveLocation"
              />
            </v-card-text>
          </v-card>
        </div>
      </template>

      <!-- Mobile View -->
      <template v-if="isSmall">
        <div class="mobile-container pb-16">
          <ProfileAvatar
            :image-path="image_path"
            :is-save-image="isSaveImage"
            @launch-cropper="launchCropper"
            @delete-image="deleteImage"
          />

          <BasicInfoForm
            section="mobile-top"
            :input="input"
            :resource="resource"
            :is-email-verified="isEmailVerified"
            :is-email-o-t-p="isEmailOTP"
            :is-verifying="isVerifying"
            :is-change-email="isChangeEmail"
            :is-sending="isSending"
            @verify-email="verifyEmail"
            @open-why="isWhy = true"
            @handle-input-otp="handleInputOTP"
            @save-email-otp="saveEmailOTP"
            @toggle-change-email="isChangeEmail = !isChangeEmail"
            @save-email="saveEmail"
          />

          <v-row>
            <v-col>
              <ContactForm
                :input="input"
                :is-phone-verified="isPhoneVerified"
                :is-change-phone="isChangePhone"
                :is-mobile-changed="isMobileChanged"
                :success-message="successMessage"
                :is-small="true"
                @toggle-change-phone="isChangePhone = !isChangePhone"
                @save-mobile="saveMobile"
                @phone-update="phoneEvent2 = $event"
                @update:isMobileChanged="isMobileChanged = $event"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <SecurityForm
                :input="input"
                :is-change-password="isChangePassword"
                :is-password-changed="isPasswordChanged"
                :show-password-1="showPassword1"
                :show-password-2="showPassword2"
                :is-password-1="isPassword1"
                :is-password-2="isPassword2"
                :password-2-mes="password2Mes"
                :success-message="successMessage"
                :is-loading="isLoading"
                :is-small="true"
                @toggle-change-password="isChangePassword = !isChangePassword"
                @toggle-show-password-1="showPassword1 = !showPassword1"
                @toggle-show-password-2="showPassword2 = !showPassword2"
                @change-password="changePassword"
                @update:isPasswordChanged="isPasswordChanged = $event"
              />
            </v-col>
          </v-row>

          <BasicInfoForm
            section="mobile-bottom"
            :input="input"
            :resource="resource"
            :age="age"
            :rules="rules"
            @date-input="onDateInput"
            @input-nationality="onInputNationality"
            @save-data="saveData"
          />
        </div>
      </template>

      <!-- Image Cropper Dialog -->
      <div class="crop-image-dialog">
        <v-dialog v-model="showCropper" max-width="500" persistent>
          <v-card class="pt-6 pb-3">
            <v-card-text class="pb-3">
              <vue-cropper
                ref="cropper"
                class="image-container"
                :aspect-ratio="1 / 1"
                :guides="true"
                :background="false"
                :view-mode="3"
                drag-mode="move"
                :src="image"
                alt="Image not available"
              />
            </v-card-text>
            <v-card-actions class="py-0 mx-10">
              <v-btn text color="red" @click="resetCropper"> Cancel </v-btn>
              <v-spacer />
              <v-btn text color="blue" @click="cropChosenImage"> Crop </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!-- Snackbars & Info Dialogs -->
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

      <v-snackbar v-model="isError" location="top" color="red" :timeout="3000">
        {{ errorMessage }}
        <template #actions>
          <v-btn color="white" variant="text" @click="isError = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <v-dialog v-model="isWhy" persistent width="auto">
        <v-card width="350">
          <v-card-text>
            <p class="my-4">
              We need to verify your email so we can make sure it is you and
              avoid scammers
            </p>
            <v-btn class="mb-4 w-100 bg-primary" @click="isWhy = false">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isVerifySent" persistent width="auto">
        <v-card width="350">
          <v-card-text>
            <h4>Verify Email</h4>
            <p class="my-4">Enter the 4 digit OTP sent to your email</p>
            <v-btn class="mb-4 w-100 bg-primary" @click="isVerifySent = false">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isVerifySuccess" persistent width="auto">
        <v-card width="350">
          <v-card-text>
            <h4 class="mt-4 mb-8">Email Verified Successfully</h4>
            <v-btn class="mb-4 w-100 bg-primary" @click="verifySuccess()">
              OK
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>

    <input
      ref="fileuploadinput"
      style="opacity: 0; filter: alpha(opacity=0)"
      type="file"
      accept="image/png, image/jpeg"
      @change="onFileChangeInput"
    />
  </div>
</template>

<script>
import app from "@/util/eventBus";
import axios from "@/util/axios";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import { countryOptions } from "@/constants/countries";
import ProfileAvatar from "@/components/profile/ProfileAvatar.vue";
import BasicInfoForm from "@/components/profile/BasicInfoForm.vue";
import ContactForm from "@/components/profile/ContactForm.vue";
import LocationForm from "@/components/profile/LocationForm.vue";
import SecurityForm from "@/components/profile/SecurityForm.vue";

export default {
  name: "MyProfile",
  components: {
    ProfileAvatar,
    BasicInfoForm,
    ContactForm,
    LocationForm,
    SecurityForm,
    VueCropper,
  },
  data() {
    return {
      options: countryOptions,
      isWhy: false,
      isVerifySent: false,
      isVerifySuccess: false,
      chosenImage: null,
      showCropper: false,
      imageFileType: null,
      isSending: false,
      isVerifying: false,
      isLoading: false,
      screenWidth: window.innerWidth,
      isEmailVerified: false,
      isEmailOTP: false,
      isPhoneVerified: false,
      isChangePassword: false,
      isMobileChanged: false,
      isPasswordChanged: false,
      isPassword1: true,
      isPassword2: true,
      password2Mes: "",
      phoneEvent: null,
      phoneEvent2: null,
      isSaveImage: false,
      isChangePhone: false,
      isChangeEmail: false,
      showPassword1: false,
      showPassword2: false,
      menuOpen: false,
      isError: false,
      isSuccess: false,
      errorMessage: "",
      successMessage: "",
      image_path: "",
      image: null,
      imageSend: null,
      input: {
        id: null,
        image_path: "",
        image: null,
        gender: null,
        gender2: null,
        marital: null,
        nationality: null,
        name: "",
        email: "",
        emailOTP: null,
        emailNew: "",
        countryCode: null,
        phone: "",
        phoneNew: "",
        password: "",
        passwordNew: "",
        passwordConfirm: "",
        date: null,
        age: "",
        town: null,
        city: null,
        country: null,
        countryName: null,
      },
      rules: {
        nameRules: [
          (value) => {
            if (value) return true;
            return "Name is required.";
          },
          (value) => {
            if (value?.length >= 4) return true;
            return "Username must be more than 4 characters.";
          },
          (value) => {
            if (value?.length <= 20) return true;
            return "Username must be less than 20 characters.";
          },
        ],
        emailRules: [
          (value) => {
            if (value) return true;
            return "E-mail is required.";
          },
          (value) => {
            if (/.+@.+\..+/.test(value)) return true;
            return "E-mail must be valid.";
          },
        ],
        phoneRules: [(v) => !!v || "Phone number is required"],
        passwordRules: [(v) => !!v || "Password is required"],
        dateRules: [(v) => !!v || "Birth Date is required"],
        genderRules: [(v) => !!v || "Gender is required"],
        maritalRules: [(v) => !!v || "Marital Status is required"],
        nationalityRules: [(v) => !!v || "Nationality is required"],
        nearestRules: [(v) => !!v || "Nearest Mall is required"],
        townRules: [(v) => !!v || "Town is required"],
        cityRules: [(v) => !!v || "City is required"],
        countryRules: [(v) => !!v || "Country is required"],
      },
      phoneNumberCounter: {
        value: 0,
        counterSize: 10,
      },
      resource: {
        gender: [
          { title: "Male", value: "M" },
          { title: "Female", value: "F" },
        ],
        marital: [
          { title: "Single", value: "S" },
          { title: "Married", value: "M" },
        ],
        nationality: [],
        countryCodes: [],
        favorite: [],
        town: [],
        city: ["Alexandra", "Ang Mo Kio", "Bedok", "Bukit Panjang"],
        country: ["Singapore"],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
    age() {
      if (!this.input.date) return null;

      const [day, month, year] = this.input.date.split("/").map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

      const today = new Date();
      const birthDate = new Date(year, month - 1, day);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
  },
  watch: {
    "input.country": function (newVal) {
      const country = this.options.filter((o) => o.value === newVal)[0];
      console.log(country?.label);
      this.input.countryName = country?.label;
      this.getCity(country?.label);
    },
    "input.city": function (newVal) {
      this.getTown(newVal?.id);
    },
    "input.passwordNew": function (newVal) {
      if (newVal) {
        this.isPassword1 = true;
      }
    },
    "input.passwordConfirm": function (newVal) {
      if (newVal) {
        this.isPassword2 = true;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "My Profile"
    );
    this.getCity();
    this.getTown();
    this.getNationality();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleInputOTP(event) {
      if (event.target.value.length > 4) {
        event.target.value = event.target.value.slice(0, 4);
      }
      this.input.emailOTP = event.target.value;
    },
    verifyEmail() {
      this.isVerifying = true;
      const token = localStorage.getItem("token");
      axios
        .post(
          `/gypsy/send-verification-email`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                this.tokenProvider ? this.tokenProvider : token
              }`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isEmailOTP = true;
          this.isVerifySent = true;
        })
        .catch((error) => {
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
          this.isVerifying = false;
        });
    },
    verifySuccess() {
      this.input.emailOTP = null;
      this.isVerifySuccess = false;
      this.isEmailOTP = false;
      this.isEmailVerified = true;
    },
    saveEmailOTP() {
      this.isSending = true;
      const payload = {
        verify_email_otp: this.input.emailOTP,
      };
      const token = localStorage.getItem("token");
      axios
        .post(`/gypsy/validate-verify-email-otp`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isVerifySuccess = true;
        })
        .catch((error) => {
          console.log(error);
          const message = error.response.data.verify_email_otp
            ? "Wrong OTP"
            : error.response.data.message === ""
            ? "Something Wrong!!!"
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    async initCropper(imageFileType) {
      this.showCropper = true;
      this.imageFileType = imageFileType;
      await new Promise((resolve) => setTimeout(resolve, 50));
      this.$refs.cropper.replace(this.image);
    },
    async resetCropper() {
      this.showCropper = false;
    },
    async cropChosenImage() {
      this.image_path = this.$refs.cropper
        .getCroppedCanvas()
        .toDataURL(this.imageFileType);
      this.saveImage();
      this.resetCropper();
    },
    onInputNationality() {
      console.log("ok", this.input.nationality);
    },
    getTown(id) {
      axios
        .get(`/town-list`)
        .then((response) => {
          const data = response.data.data;
          console.log(id);
          if (id) {
            this.resource.town = data
              .filter((i) => i.city_id == id)
              .map((town) => {
                return {
                  id: town.town_id,
                  title: town.town_name,
                  city_id: town.city_id,
                  path: "#",
                };
              });
          } else {
            this.resource.town = data.map((town) => {
              return {
                id: town.town_id,
                title: town.town_name,
                city_id: town.city_id,
                path: "#",
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCity(country_name) {
      axios
        .get(`/city`)
        .then((response) => {
          const data = response.data.data;
          if (country_name) {
            this.resource.city = data
              .filter((i) => i.country_name == country_name)
              .map((city) => {
                return {
                  id: city.city_id,
                  title: city.city_name,
                  path: "#",
                };
              });
          } else {
            this.resource.city = data.map((city) => {
              return {
                id: city.city_id,
                title: city.city_name,
                prefix: city.prefix,
                path: "#",
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getNationality() {
      this.isLoading = true;
      axios
        .get(`/country`)
        .then((response) => {
          const data = response.data.data;
          this.resource.nationality = data.map((country) => {
            return {
              id: country.country_id,
              title: country.nationality,
            };
          });

          this.resource.country = data.map((country) => {
            return {
              id: country.country_id,
              title: country.country_name,
            };
          });
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getUserData() {
      this.isLoading = true;
      const token = localStorage.getItem("token");
      axios
        .get(`/gypsy-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);

          this.image_path =
            data.image != null ? this.$fileURL + data.image : null;
          this.input = {
            id: data.gypsy_id,
            image_path: "",
            image: null,
            gender: this.resource.gender.filter(
              (i) => i.value == data.gender
            )[0],
            gender2: data.gender || null,
            marital: this.resource.marital.filter(
              (i) => i.value == data.marital_status
            )[0],
            nationality: this.resource.nationality.filter(
              (i) => i.id == data.nationality
            )[0],
            name: data.name,
            email: data.email_id,
            countryCode: null,
            phone: data.mobile_number,
            phoneNew: data.mobile_number,
            password: data.password ? "xxxxxxxx" : "",
            date: data.date_of_birth,
            age: "",
            town: this.resource.town.filter(
              (i) => i.id == data.town_current
            )[0],
            city: this.resource.city.filter(
              (i) => i.id == data.city_current
            )[0],
            country: this.options.filter(
              (i) => i.label == data.current_country_name
            )[0]?.value,
          };
          this.isEmailVerified =
            data.email_verified == "N"
              ? false
              : data.email_verified == "Y"
              ? true
              : null;
          this.isPhoneVerified =
            data.mobile_verified == "N"
              ? false
              : data.mobile_verified == "Y"
              ? true
              : null;
          this.input.nationality = this.resource.nationality.filter(
            (i) => i.id == data.nationality
          );
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    saveData() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        name: this.input.name,
        gender: this.input.gender?.value,
        app_id: this.$appId,
        marital_status: this.input.marital?.value,
        date_of_birth: this.input.date,
        country_current: this.input.nationality?.id,
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
            ? "Something Wrong!!!"
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveDataDesktop1() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        gender: this.input.gender?.value,
        marital_status: this.input.marital?.value,
        nationality: this.input.nationality?.id,
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
            ? "Something Wrong!!!"
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveDataDesktop2() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        name: this.input.name,
        date_of_birth: this.input.date,
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
            ? "Something Wrong!!!"
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveLocation() {
      this.isSending = true;
      const payload = {
        country_current: this.input.countryName,
        country_prefix: this.input.country,
        country_code: this.phoneEvent?.countryCallingCode
          ? `+${this.phoneEvent.countryCallingCode}`
          : "+65",
        flag:
          "https://flagicons.lipis.dev/flags/4x3/" +
          this.input.country?.toLowerCase() +
          ".svg",
        city_current: this.input.city?.title
          ? this.input.city.title
          : this.input.city,
        town_current: this.input.town?.title
          ? this.input.town.title
          : this.input.town,
      };
      console.log(payload);
      console.log(this.phoneEvent);
      const token = localStorage.getItem("token");
      axios
        .post(`/gypsy/save-current-location`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveEmail() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        email_id: this.input.emailNew,
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          this.isChangeEmail = false;
          this.input.email = this.input.emailNew;
          this.input.emailNew = "";
          this.isEmailVerified = false;
        })
        .catch((error) => {
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
    },
    saveMobile() {
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        mobile_number: this.input.phoneNew || this.input.phone,
      };
      console.log(payload);
      const token = localStorage.getItem("token");

      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.successMessage = "New Number Updated";
          this.isMobileChanged = true;
          this.isChangePhone = false;
          this.input.phone = this.input.phoneNew;
          setTimeout(() => {
            this.isMobileChanged = false;
            this.isSending = false;
          }, 5000);
          this.input.phoneNew = "";
        })
        .catch((error) => {
          console.log(error);
          const message = error.response.data.mobile_number
            ? error.response.data.mobile_number[0]
            : error.response.data.message === ""
            ? "Something Wrong!!!"
            : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    deleteImage() {
      this.isSending = true;
      const token = localStorage.getItem("token");
      axios
        .delete(`/gypsy/image`, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          app.config.globalProperties.$eventBus.$emit("getHeaderUserData");
          this.getUserData();
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    saveImage() {
      this.isSaveImage = true;
      const payload = {
        gypsy_id: this.input.id,
        image: this.imageSend || null,
      };
      console.log(payload);
      const token = localStorage.getItem("token");
      axios
        .post(`/save-gypsy-user`, payload, {
          headers: {
            Authorization: `Bearer ${
              this.tokenProvider ? this.tokenProvider : token
            }`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);
          this.isSuccess = true;
          this.successMessage = data.message;
          app.config.globalProperties.$eventBus.$emit(
            "changeHeaderImage",
            data.data.image
          );
        })
        .catch((error) => {
          console.log(error);
          const message =
            error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
          this.errorMessage = message;
          this.isError = true;
        })
        .finally(() => {
          this.isSaveImage = false;
        });
    },
    changePassword() {
      if (this.input.passwordNew?.length != 8) {
        this.isPassword1 = false;
      } else if (this.input.passwordNew?.length == 8) {
        this.isPassword1 = true;
      }
      if (this.input.password && this.input.passwordConfirm?.length != 8) {
        this.isPassword2 = false;
        this.password2Mes = "Password must be 8 characters";
      } else if (
        this.input.password &&
        this.input.passwordConfirm != this.input.passwordNew
      ) {
        this.isPassword2 = false;
        this.password2Mes = "Must be same with password above";
      } else if (
        this.input.password &&
        this.input.passwordConfirm?.length == 8
      ) {
        this.isPassword2 = true;
      }

      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        email_id: this.input.email,
        password: this.input.passwordNew,
      };
      const token = localStorage.getItem("token");
      if (this.isPassword1 == true && this.isPassword2 == true) {
        axios
          .post(`/gypsy-change-password`, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const data = response.data;
            console.log(data);
            this.input.password = this.input.passwordNew;
            this.successMessage = data.message;
            this.isChangePassword = false;
            this.isPasswordChanged = true;
            setTimeout(() => {
              this.isPasswordChanged = false;
            }, 5000);
            this.input.passwordNew = "";
            this.input.passwordConfirm = "";
          })
          .catch((error) => {
            console.log(error);
            const message = error.response.data.email_id
              ? error.response.data.email_id[0]
              : error.response.data.message === ""
              ? "Something Wrong!!!"
              : error.response.data.message;
            this.errorMessage = message;
            this.isError = true;
            this.isChangePassword = false;
          })
          .finally(() => {
            this.isSending = false;
          });
      }
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
      this.initCropper(file.type);
    },
    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    onDateInput() {
      const formattedDate = this.input.date.replace(/\D/g, "");

      const day = formattedDate.substring(0, 2);
      const month = formattedDate.substring(2, 4);
      const year = formattedDate.substring(4, 8);

      if (day && month && year) {
        this.input.date = `${month}/${day}/${year}`;
      } else {
        this.input.date = formattedDate;
      }
      console.log(this.input.date);
    },
  },
};
</script>

<style scoped>
.image-container {
  max-width: 450px;
}

.image-container img {
  width: 100%;
}
.card-container {
  margin-top: 100px;
  width: 100%;
}

.first-section {
  width: 35%;
  height: 60%;
}

.second-section {
  width: 63%;
}

.card-title {
  background: #f7f7f7;
}

.avatar {
  width: 160px;
  border-radius: 50%;
}
.avatar-mobile {
  width: 90px;
}

.title-card {
  font-size: 20px;
  font-weight: 500;
}

.mobile-container {
  margin-top: 80px;
}

.loading-page {
  margin-top: 300px;
}

@media (max-width: 599px) {
  .loading-page {
    margin-top: 450px;
  }
}
</style>
