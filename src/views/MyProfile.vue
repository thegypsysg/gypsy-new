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

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { emitter } from "@/util/eventBus";
import axios from "@/util/axios";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import { countryOptions } from "@/constants/countries";
import ProfileAvatar from "@/components/profile/ProfileAvatar.vue";
import BasicInfoForm from "@/components/profile/BasicInfoForm.vue";
import ContactForm from "@/components/profile/ContactForm.vue";
import LocationForm from "@/components/profile/LocationForm.vue";
import SecurityForm from "@/components/profile/SecurityForm.vue";

const options = countryOptions;
const isWhy = ref(false);
const isVerifySent = ref(false);
const isVerifySuccess = ref(false);
const chosenImage = ref(null);
const showCropper = ref(false);
const imageFileType = ref(null);
const isSending = ref(false);
const isVerifying = ref(false);
const isLoading = ref(false);
const screenWidth = ref(window.innerWidth);
const isEmailVerified = ref(false);
const isEmailOTP = ref(false);
const isPhoneVerified = ref(false);
const isChangePassword = ref(false);
const isMobileChanged = ref(false);
const isPasswordChanged = ref(false);
const isPassword1 = ref(true);
const isPassword2 = ref(true);
const password2Mes = ref("");
const phoneEvent = ref(null);
const phoneEvent2 = ref(null);
const isSaveImage = ref(false);
const isChangePhone = ref(false);
const isChangeEmail = ref(false);
const showPassword1 = ref(false);
const showPassword2 = ref(false);
const menuOpen = ref(false);
const isError = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const image_path = ref("");
const image = ref(null);
const imageSend = ref(null);
const cropper = ref(null);

const input = ref({
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
});

const rules = {
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
};

const phoneNumberCounter = ref({
  value: 0,
  counterSize: 10,
});

const resource = ref({
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
});

const isSmall = computed(() => screenWidth.value < 640);

const tokenProvider = computed(() => {
  const url = new URL(window.location.href);
  const tokenParam = url.searchParams.get("token");
  if (tokenParam) {
    localStorage.setItem("token", tokenParam);
  }
  return tokenParam;
});

const age = computed(() => {
  if (!input.value.date) return null;

  const [day, month, year] = input.value.date.split("/").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    calculatedAge--;
  }

  return calculatedAge;
});

watch(
  () => input.value.country,
  (newVal) => {
    const countryObj = options.filter((o) => o.value === newVal)[0];
    console.log(countryObj?.label);
    input.value.countryName = countryObj?.label;
    getCity(countryObj?.label);
  }
);

watch(
  () => input.value.city,
  (newVal) => {
    getTown(newVal?.id);
  }
);

watch(
  () => input.value.passwordNew,
  (newVal) => {
    if (newVal) {
      isPassword1.value = true;
    }
  }
);

watch(
  () => input.value.passwordConfirm,
  (newVal) => {
    if (newVal) {
      isPassword2.value = true;
    }
  }
);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

function handleInputOTP(event) {
  if (event.target.value.length > 4) {
    event.target.value = event.target.value.slice(0, 4);
  }
  input.value.emailOTP = event.target.value;
}

async function verifyEmail() {
  isVerifying.value = true;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `/gypsy/send-verification-email`,
      {},
      {
        headers: {
          Authorization: `Bearer ${
            tokenProvider.value ? tokenProvider.value : token
          }`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    console.log(data);
    isEmailOTP.value = true;
    isVerifySent.value = true;
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.email_id
      ? error.response.data.email_id[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isVerifying.value = false;
  }
}

function verifySuccess() {
  input.value.emailOTP = null;
  isVerifySuccess.value = false;
  isEmailOTP.value = false;
  isEmailVerified.value = true;
}

async function saveEmailOTP() {
  isSending.value = true;
  const payload = {
    verify_email_otp: input.value.emailOTP,
  };
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/gypsy/validate-verify-email-otp`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isVerifySuccess.value = true;
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.verify_email_otp
      ? "Wrong OTP"
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function initCropper(fileType) {
  showCropper.value = true;
  imageFileType.value = fileType;
  await new Promise((resolve) => setTimeout(resolve, 50));
  cropper.value?.replace(image.value);
}

function resetCropper() {
  showCropper.value = false;
}

function cropChosenImage() {
  if (cropper.value) {
    image_path.value = cropper.value
      .getCroppedCanvas()
      .toDataURL(imageFileType.value);
  }
  saveImage();
  resetCropper();
}

function onInputNationality() {
  console.log("ok", input.value.nationality);
}

async function getTown(id) {
  try {
    const response = await axios.get(`/town-list`);
    const data = response.data.data;
    if (id) {
      resource.value.town = data
        .filter((i) => i.city_id == id)
        .map((town) => ({
          id: town.town_id,
          title: town.town_name,
          city_id: town.city_id,
          path: "#",
        }));
    } else {
      resource.value.town = data.map((town) => ({
        id: town.town_id,
        title: town.town_name,
        city_id: town.city_id,
        path: "#",
      }));
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCity(country_name) {
  try {
    const response = await axios.get(`/city`);
    const data = response.data.data;
    if (country_name) {
      resource.value.city = data
        .filter((i) => i.country_name === country_name)
        .map((city) => ({
          id: city.city_id,
          title: city.city_name,
          path: "#",
        }));
    } else {
      resource.value.city = data.map((city) => ({
        id: city.city_id,
        title: city.city_name,
        prefix: city.prefix,
        path: "#",
      }));
    }
  } catch (error) {
    console.log(error);
  }
}

async function getNationality() {
  isLoading.value = true;
  try {
    const response = await axios.get(`/country`);
    const data = response.data.data;
    resource.value.nationality = data.map((c) => ({
      id: c.country_id,
      title: c.nationality,
    }));

    resource.value.country = data.map((c) => ({
      id: c.country_id,
      title: c.country_name,
    }));
    await getUserData();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

async function getUserData() {
  isLoading.value = true;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/gypsy-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data.data;
    console.log(data);

    image_path.value =
      data.image != null ? (window.$fileURL || "/file/") + data.image : null;
    input.value = {
      id: data.gypsy_id,
      image_path: "",
      image: null,
      gender: resource.value.gender.filter((i) => i.value == data.gender)[0],
      gender2: data.gender || null,
      marital: resource.value.marital.filter(
        (i) => i.value == data.marital_status
      )[0],
      nationality: resource.value.nationality.filter(
        (i) => i.id == data.nationality
      ),
      name: data.name,
      email: data.email_id,
      countryCode: null,
      phone: data.mobile_number,
      phoneNew: data.mobile_number,
      password: data.password ? "xxxxxxxx" : "",
      passwordNew: "",
      passwordConfirm: "",
      date: data.date_of_birth,
      age: "",
      town: resource.value.town.filter((i) => i.id == data.town_current)[0],
      city: resource.value.city.filter((i) => i.id == data.city_current)[0],
      country: options.filter(
        (i) => i.label == data.current_country_name
      )[0]?.value,
      countryName: data.current_country_name,
    };
    isEmailVerified.value =
      data.email_verified === "N"
        ? false
        : data.email_verified === "Y"
        ? true
        : null;
    isPhoneVerified.value =
      data.mobile_verified === "N"
        ? false
        : data.mobile_verified === "Y"
        ? true
        : null;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

async function saveData() {
  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    name: input.value.name,
    gender: input.value.gender?.value,
    app_id: window.$appId || 1,
    marital_status: input.value.marital?.value,
    date_of_birth: input.value.date,
    country_current: input.value.nationality?.[0]?.id || input.value.nationality?.id,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    await getUserData();
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.mobile_number
      ? error.response.data.mobile_number[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveDataDesktop1() {
  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    gender: input.value.gender?.value,
    marital_status: input.value.marital?.value,
    nationality: input.value.nationality?.[0]?.id || input.value.nationality?.id,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    await getUserData();
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.mobile_number
      ? error.response.data.mobile_number[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveDataDesktop2() {
  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    name: input.value.name,
    date_of_birth: input.value.date,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    await getUserData();
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.mobile_number
      ? error.response.data.mobile_number[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveLocation() {
  isSending.value = true;
  const payload = {
    country_current: input.value.countryName,
    country_prefix: input.value.country,
    country_code: phoneEvent.value?.countryCallingCode
      ? `+${phoneEvent.value.countryCallingCode}`
      : "+65",
    flag:
      "https://flagicons.lipis.dev/flags/4x3/" +
      input.value.country?.toLowerCase() +
      ".svg",
    city_current: input.value.city?.title
      ? input.value.city.title
      : input.value.city,
    town_current: input.value.town?.title
      ? input.value.town.title
      : input.value.town,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/gypsy/save-current-location`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    await getUserData();
  } catch (error) {
    console.log(error);
    const message =
      error.response?.data?.message === ""
        ? "Something Wrong!!!"
        : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveEmail() {
  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    email_id: input.value.emailNew,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    isChangeEmail.value = false;
    input.value.email = input.value.emailNew;
    input.value.emailNew = "";
    isEmailVerified.value = false;
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.email_id
      ? error.response.data.email_id[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveMobile() {
  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    mobile_number: input.value.phoneNew || input.value.phone,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    successMessage.value = "New Number Updated";
    isMobileChanged.value = true;
    isChangePhone.value = false;
    input.value.phone = input.value.phoneNew;
    setTimeout(() => {
      isMobileChanged.value = false;
      isSending.value = false;
    }, 5000);
    input.value.phoneNew = "";
  } catch (error) {
    console.log(error);
    const message = error.response?.data?.mobile_number
      ? error.response.data.mobile_number[0]
      : error.response?.data?.message === ""
      ? "Something Wrong!!!"
      : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function deleteImage() {
  isSending.value = true;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`/gypsy/image`, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    emitter.emit("getHeaderUserData");
    await getUserData();
  } catch (error) {
    console.log(error);
    const message =
      error.response?.data?.message === ""
        ? "Something Wrong!!!"
        : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSending.value = false;
  }
}

async function saveImage() {
  isSaveImage.value = true;
  const payload = {
    gypsy_id: input.value.id,
    image: imageSend.value || null,
  };
  console.log(payload);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/save-gypsy-user`, payload, {
      headers: {
        Authorization: `Bearer ${
          tokenProvider.value ? tokenProvider.value : token
        }`,
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log(data);
    isSuccess.value = true;
    successMessage.value = data.message;
    emitter.emit("changeHeaderImage", data.data.image);
  } catch (error) {
    console.log(error);
    const message =
      error.response?.data?.message === ""
        ? "Something Wrong!!!"
        : error.response?.data?.message;
    errorMessage.value = message;
    isError.value = true;
  } finally {
    isSaveImage.value = false;
  }
}

async function changePassword() {
  if (input.value.passwordNew?.length !== 8) {
    isPassword1.value = false;
  } else if (input.value.passwordNew?.length === 8) {
    isPassword1.value = true;
  }
  if (input.value.password && input.value.passwordConfirm?.length !== 8) {
    isPassword2.value = false;
    password2Mes.value = "Password must be 8 characters";
  } else if (
    input.value.password &&
    input.value.passwordConfirm !== input.value.passwordNew
  ) {
    isPassword2.value = false;
    password2Mes.value = "Must be same with password above";
  } else if (
    input.value.password &&
    input.value.passwordConfirm?.length === 8
  ) {
    isPassword2.value = true;
  }

  isSending.value = true;
  const payload = {
    gypsy_id: input.value.id,
    email_id: input.value.email,
    password: input.value.passwordNew,
  };
  const token = localStorage.getItem("token");
  if (isPassword1.value === true && isPassword2.value === true) {
    try {
      const response = await axios.post(`/gypsy-change-password`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);
      input.value.password = input.value.passwordNew;
      successMessage.value = data.message;
      isChangePassword.value = false;
      isPasswordChanged.value = true;
      setTimeout(() => {
        isPasswordChanged.value = false;
      }, 5000);
      input.value.passwordNew = "";
      input.value.passwordConfirm = "";
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.email_id
        ? error.response.data.email_id[0]
        : error.response?.data?.message === ""
        ? "Something Wrong!!!"
        : error.response?.data?.message;
      errorMessage.value = message;
      isError.value = true;
      isChangePassword.value = false;
    } finally {
      isSending.value = false;
    }
  }
}

function onFileChangeInput(e) {
  const files = e.target.files || e.dataTransfer.files;
  if (files && files[0]) {
    image.value = files[0];
    image_path.value = URL.createObjectURL(files[0]);
  }
}

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function launchCropper(event) {
  if (!event) return;
  const file = event.target.files[0];
  if (!file) return;
  image.value = await toBase64(file);
  imageSend.value = file;
  initCropper(file.type);
}

function onDateInput() {
  const formattedDate = input.value.date.replace(/\D/g, "");

  const day = formattedDate.substring(0, 2);
  const month = formattedDate.substring(2, 4);
  const year = formattedDate.substring(4, 8);

  if (day && month && year) {
    input.value.date = `${month}/${day}/${year}`;
  } else {
    input.value.date = formattedDate;
  }
  console.log(input.value.date);
}

onMounted(() => {
  emitter.emit("changeHeaderWelcome", "My Profile");
  getCity();
  getTown();
  getNationality();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
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
