<template>
  <div>
    <div v-if="isLoading" class="text-center loading-page">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>
    <v-container v-if="!isLoading">
      <template v-if="!isSmall">
        <div class="card-container d-flex flex-wrap justify-space-between">
          <v-card class="first-section px-16 py-2">
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
              <div>
                <div
                  style="width: 170px; height: 120px; border-radius: 20px"
                  class="mt-5"
                >
                  <v-img
                    style="width: 100%; height: 100%; border-radius: 20px"
                    :src="
                      image_path
                        ? image_path
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                  />
                </div>
                <div class="mt-2 w-100 d-flex justify-center">
                  <v-btn
                    color="blue"
                    variant="outlined"
                    @click="$refs.filePickerField.click()"
                  >
                    Upload Picture
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
            <v-row class="">
              <v-col>
                <label>Gender</label>

                <VueMultiselect
                  v-model="input.gender"
                  class="mt-2"
                  :options="resource.gender"
                  track-by="value"
                  label="title"
                  placeholder="Select Gender"
                />

                <!-- <select v-model="input.gender" class="form-control mt-2">
                  <option disabled value="">Gender</option>
                  <option
                    v-for="gender in resource.gender"
                    :key="gender"
                    :value="gender"
                  >
                    {{ gender }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row class="">
              <v-col>
                <label>Marital Status</label>
                <VueMultiselect
                  v-model="input.marital"
                  class="mt-2"
                  :options="resource.marital"
                  track-by="value"
                  label="title"
                  placeholder="Select Marital Status"
                />
                <!-- <select v-model="input.marital" class="form-control mt-2">
                  <option disabled value="">--- Select ---</option>
                  <option
                    v-for="marital in resource.marital"
                    :key="marital"
                    :value="marital"
                  >
                    {{ marital }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label>Nationality</label>

                <VueMultiselect
                  v-model="input.nationality"
                  @select="onInputNationality()"
                  class="mt-2"
                  :options="resource.nationality"
                  track-by="id"
                  label="title"
                  placeholder="Select Nationality"
                />
                <!-- <select v-model="input.nationality" class="form-control mt-2">
                  <option disabled value="">--- Select ---</option>
                  <option
                    v-for="nation in resource.nationality"
                    :key="nation"
                    :value="nation"
                  >
                    {{ nation }}
                  </option>
                </select> -->
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col class="d-flex justify-center">
                <v-btn
                  class="text-none text-subtitle-1"
                  color="success"
                  size="large"
                  variant="flat"
                >
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
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
                >
                  Save Changes
                </v-btn>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <label>Name</label>
                    <input
                      v-model="input.name"
                      type="text"
                      required
                      class="form-control mt-2"
                      placeholder="Enter Your Full Name"
                    />
                    <!-- <v-text-field
                      v-model="input.name"
                      :rules="rules.nameRules"
                      :counter="20"
                      class="mt-2"
                      variant="outlined"
                      placeholder="Enter Name"
                      density="compact"
                      required
                      single-line
                    /> -->
                  </v-col>
                  <v-col cols="6">
                    <label
                      >Email
                      <span
                        :class="{
                          'text-red': !isEmailVerified,
                          'text-green': isEmailVerified,
                        }"
                        >{{
                          isEmailVerified ? "(Verified)" : "(Not Verified)"
                        }}</span
                      ></label
                    >
                    <input
                      v-model="input.email"
                      type="email"
                      disabled
                      class="form-control mt-2"
                      placeholder="Enter Email"
                    />
                    <!-- <v-text-field
                      v-model="input.email"
                      :rules="rules.emailRules"
                      placeholder="Enter Email"
                      type="email"
                      class="mt-2"
                      hint="example@email.com"
                      density="compact"
                      variant="outlined"
                      required
                    /> -->
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label
                      >Contact Number
                      <span
                        :class="{
                          'text-red': !isPhoneVerified,
                          'text-green': isPhoneVerified,
                        }"
                        >{{
                          isPhoneVerified ? "(Verified)" : "(Not Verified)"
                        }}</span
                      ></label
                    >
                    <div class="d-flex">
                      <input
                        v-model="input.phone"
                        type="text"
                        required
                        class="form-control mt-2"
                        placeholder="Phone Number"
                      />
                      <!-- <v-text-field
                        v-model="input.phone"
                        :counter="phoneNumberCounter"
                        required
                        disabled
                        class="mt-2"
                        type="number"
                        density="compact"
                        placeholder="Phone Number"
                        variant="outlined"
                      /> -->
                      <v-btn
                        class="text-none text-subtitle-1 mt-2"
                        color="blue"
                        variant="flat"
                        @click="isChangePhone = !isChangePhone"
                      >
                        Change
                      </v-btn>
                    </div>
                    <div v-if="isChangePhone" class="mt-2">
                      <MazPhoneNumberInput
                        v-model="input.phoneNew"
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
                      <!-- <div class="d-flex mt-2">
                        <v-autocomplete
                          v-model="input.countryCode"
                          :items="resource.countryCodes"
                          label="Country Code"
                          item-text="name"
                          item-value="code"
                          density="compact"
                          outlined
                        />

                        <v-text-field
                          v-model="input.phoneNew"
                          :counter="phoneNumberCounter"
                          required
                          type="number"
                          density="compact"
                          placeholder="Phone Number"
                          variant="outlined"
                        />
                      </div> -->
                      <v-btn
                        class="text-none text-white w-100 mt-3"
                        color="#F0882D"
                        size="large"
                        variant="flat"
                      >
                        Send OTP
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <label>Password </label>
                    <div class="d-flex align-center">
                      <div>
                        <input
                          v-model="input.password"
                          type="password"
                          required
                          class="form-control mt-2"
                          placeholder="Enter Password"
                          :disabled="!isChangePassword"
                          maxlength="8"
                        />
                        <h6 v-if="isPassword == false" class="w-100 text-red">
                          Password must be 8 characters
                        </h6>
                      </div>
                      <!-- <v-text-field
                        v-model="input.password"
                        :append-inner-icon="
                          showPassword ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :type="showPassword ? 'text' : 'password'"
                        variant="outlined"
                        placeholder="Enter Password"
                        class="my-2 custom-input"
                        density="compact"
                        :disabled="!isChangePassword"
                        :rules="rules.passwordRules"
                        @click:append-inner="showPassword = !showPassword"
                      /> -->
                      <v-btn
                        v-if="!isChangePassword"
                        class="text-none text-subtitle-1 mt-2"
                        color="blue"
                        variant="flat"
                        @click="isChangePassword = !isChangePassword"
                      >
                        Change
                      </v-btn>
                      <v-btn
                        v-if="isChangePassword"
                        class="text-none text-subtitle-1"
                        :class="{ 'mt-2': isPassword, 'mt-n2': !isPassword }"
                        color="success"
                        variant="flat"
                        @click="changePassword()"
                      >
                        Save Changes
                      </v-btn>
                    </div>

                    <v-alert
                      class="my-2"
                      v-model="isPasswordChanged"
                      type="success"
                      :text="successMessage"
                    ></v-alert>
                  </v-col>
                </v-row>
                <v-row
                  style="border-bottom: 1px solid rgb(189, 189, 189)"
                  class="mb-4 pb-2"
                >
                  <v-col cols="5">
                    <label>Birth Date</label>
                    <input
                      v-model="input.date"
                      required
                      class="form-control mt-2"
                      type="text"
                      id="dateInput"
                      placeholder="DD/MM/YYYY"
                      @input="onDateInput"
                    />
                  </v-col>
                  <v-col cols="7">
                    <label>Age</label>
                    <p class="mt-5">
                      {{ age }}
                    </p>
                  </v-col>
                </v-row>
                <!-- <hr class="my-4" /> -->
              </v-container>
              <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n8"
                >
                  <p class="title-card">My Current Location</p>
                  <v-btn
                    class="text-none text-subtitle-1"
                    color="success"
                    size="large"
                    variant="flat"
                  >
                    Save Changes
                  </v-btn>
                </div>
                <v-row>
                  <v-col cols="6">
                    <VueMultiselect
                      v-model="input.location"
                      class="mt-2"
                      :options="resource.location"
                      placeholder="Select Location"
                    />
                    <!-- <v-autocomplete
                      v-model="input.location"
                      :items="resource.location"
                      variant="outlined"
                      placeholder="Select Location"
                      clearable
                      class="mt-2"
                      density="compact"
                      :rules="rules.locationRules"
                    /> -->
                  </v-col>
                  <v-col cols="6">
                    <VueMultiselect
                      v-model="input.country"
                      class="mt-2"
                      :options="resource.country"
                      placeholder="Select Country"
                    />
                    <!-- <v-autocomplete
                      v-model="input.country"
                      :items="resource.country"
                      variant="outlined"
                      placeholder="Select Country"
                      clearable
                      class="mt-2"
                      density="compact"
                      :rules="rules.countryRules"
                    /> -->
                  </v-col>
                </v-row>
                <v-row
                  style="border-bottom: 1px solid rgb(189, 189, 189)"
                  class="mb-n8 pb-2"
                >
                  <v-col cols="6">
                    <VueMultiselect
                      v-model="input.city"
                      :options="resource.city"
                      placeholder="Select City"
                    />
                    <!-- <v-autocomplete
                      v-model="input.city"
                      :items="resource.city"
                      variant="outlined"
                      placeholder="Select City"
                      clearable
                      class="mt-2"
                      density="compact"
                      :rules="rules.cityRules"
                    /> -->
                  </v-col>
                </v-row>
                <hr class="mt-8" />
              </v-container>
              <!-- <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n4"
                >
                  <p class="title-card">Nearest Mall</p>
                  <v-btn
                    class="text-none text-subtitle-1"
                    color="success"
                    size="large"
                    variant="flat"
                  >
                    Save Changes
                  </v-btn>
                </div>
                <v-row
                  style="border-bottom: 1px solid rgb(189, 189, 189)"
                  class="mb-2 pb-2"
                >
                  <v-col cols="6">
                    <VueMultiselect
                      v-model="input.nearest"
                      class="mt-2"
                      :options="resource.nearest"
                      placeholder="Select Nearest Mall"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <div
                  class="d-flex w-100 justify-space-between align-center mb-4 mt-n4"
                >
                  <p class="title-card">Favorite Malls</p>
                  <v-spacer />
                </div>
                <v-row>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite1"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite2"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                  <v-col cols="4">
                    <VueMultiselect
                      v-model="input.favorite3"
                      class="mt-2"
                      :options="resource.favorite"
                      placeholder="Select Mall"
                    />
                  </v-col>
                </v-row>
              </v-container> -->
            </v-card-text>
          </v-card>
        </div>
      </template>
      <template v-if="isSmall">
        <div class="mobile-container pb-16">
          <input
            ref="filePickerField"
            type="file"
            accept="image/*"
            hidden
            @change="launchCropper"
          />
          <div class="image-container w-100 mb-4">
            <!-- <v-img
                    style="width: 100%; height: 100%; border-radius: 20px"
                    :src="
                      image_path != ''
                        ? image_path
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    "
                  /> -->
            <v-img
              height="90"
              :src="
                image_path != ''
                  ? image_path
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
              "
              class="avatar mx-auto"
              :class="{ 'avatar-mobile': isSmall }"
            />
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
          <v-row>
            <v-col>
              <label>Name</label>
              <input
                v-model="input.name"
                type="text"
                required
                class="form-control mt-2"
                placeholder="Enter Your Full Name"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label
                >Email
                <span
                  :class="{
                    'text-red': !isEmailVerified,
                    'text-green': isEmailVerified,
                  }"
                  >{{ isEmailVerified ? "(Verified)" : "(Not Verified)" }}</span
                ></label
              >
              <div class="d-flex align-center">
                <input
                  v-model="input.email"
                  type="email"
                  disabled
                  class="form-control mt-2"
                  placeholder="Enter Email"
                /><v-btn
                  class="text-none text-subtitle-1 mt-2"
                  color="blue"
                  variant="flat"
                >
                  Change
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label
                >Contact Number
                <span
                  :class="{
                    'text-red': !isPhoneVerified,
                    'text-green': isPhoneVerified,
                  }"
                  >{{ isPhoneVerified ? "(Verified)" : "(Not Verified)" }}</span
                ></label
              >
              <div class="d-flex">
                <input
                  v-model="input.phone"
                  type="text"
                  required
                  disabled
                  class="form-control mt-2"
                  placeholder="Phone Number"
                />
                <!-- <v-text-field
                  v-model="input.phone"
                  :counter="phoneNumberCounter"
                  required
                  disabled
                  class="mt-2"
                  type="number"
                  density="compact"
                  placeholder="Phone Number"
                  variant="outlined"
                /> -->
                <v-btn
                  class="text-none text-subtitle-1 mt-2"
                  color="blue"
                  variant="flat"
                  @click="isChangePhone = !isChangePhone"
                >
                  Change
                </v-btn>
              </div>
              <div v-if="isChangePhone" class="mt-2">
                <MazPhoneNumberInput
                  v-model="input.phoneNew"
                  show-code-on-list
                  color="info"
                  :default-country-code="country ? country : 'SG'"
                  :preferred-countries="['SG', 'BD', 'IN', 'MY', 'GB', 'PH']"
                  @update="phoneEvent = $event"
                />
                <v-btn
                  class="text-none text-white w-100 mt-3"
                  color="#F0882D"
                  size="large"
                  variant="flat"
                >
                  Send OTP
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Password </label>
              <div class="d-flex align-center">
                <div>
                  <input
                    v-model="input.password"
                    type="password"
                    required
                    class="form-control mt-2"
                    placeholder="Enter Password"
                    :disabled="!isChangePassword"
                    maxlength="8"
                  />
                  <h6 v-if="isPassword == false" class="w-100 text-red">
                    Password must be 8 characters
                  </h6>
                </div>
                <v-btn
                  v-if="!isChangePassword"
                  class="text-none text-subtitle-1 mt-2"
                  color="blue"
                  variant="flat"
                  @click="isChangePassword = !isChangePassword"
                >
                  Change
                </v-btn>
                <v-btn
                  v-if="isChangePassword"
                  class="text-none text-subtitle-1"
                  :class="{ 'mt-2': isPassword, 'mt-n2': !isPassword }"
                  color="success"
                  variant="flat"
                  @click="changePassword()"
                >
                  Save Changes
                </v-btn>
              </div>
              <v-alert
                class="my-2"
                v-model="isPasswordChanged"
                type="success"
                :text="successMessage"
              ></v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <label
                >Birth Date (<span>{{ age }} Years</span>)</label
              >
              <input
                v-model="input.date"
                required
                class="form-control mt-2"
                type="text"
                id="dateInput"
                placeholder="DD/MM/YYYY"
                @input="onDateInput"
              />
            </v-col>
            <v-col cols="6">
              <div class="w-100 text-center">
                <label class="mx-auto">Gender</label>
              </div>

              <v-radio-group
                v-model="input.gender2"
                :rules="rules.genderRules"
                inline
                class="mt-3 ml-n4"
                style="font-size: 12px !important"
              >
                <v-radio
                  style="font-size: 10px !important"
                  label="Male"
                  value="M"
                />
                <v-radio
                  style="font-size: 10px !important"
                  label="Female"
                  value="F"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row class="mt-n10">
            <v-col>
              <label>Nationality</label>
              <VueMultiselect
                v-model="input.nationality"
                @select="onInputNationality()"
                class="mt-2"
                :options="resource.nationality"
                track-by="id"
                label="title"
                placeholder="Select Nationality"
              />
              <!-- <v-select
                v-model="input.nationality"
                :items="resource.nationality"
                placeholder="Select Nationality"
                variant="outlined"
                clearable
                class="mt-2"
                density="compact"
                :rules="rules.nationalityRules"
              /> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label>Marital Status</label>
              <VueMultiselect
                v-model="input.marital"
                class="mt-2"
                :options="resource.marital"
                track-by="value"
                label="title"
                placeholder="Select Marital Status"
              />
            </v-col>
          </v-row>
          <v-container
            style="position: fixed; bottom: 1.5rem; left: 0; z-index: 99999"
            class="d-flex justify-center align-center"
          >
            <v-btn
              class="text-none text-subtitle-1"
              color="success"
              size="large"
              variant="flat"
              @click="saveData()"
            >
              Save Changes
            </v-btn>
          </v-container>
        </div>
      </template>
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
// import VueAvatarCropper from "vue-avatar-cropper";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import app from "@/util/eventBus";
import ImageCropperDialog from "../components/ImageCropperDialog.vue";
import axios from "@/util/axios";

import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";
export default {
  components: {
    VueMultiselect,
    MazPhoneNumberInput,
    ImageCropperDialog,
  },
  data() {
    return {
      isLoading: false,
      screenWidth: window.innerWidth,
      isEmailVerified: false,
      isPhoneVerified: false,
      isChangePassword: false,
      isPasswordChanged: false,
      isPassword: true,
      isChangePhone: false,
      showPassword: false,
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
        countryCode: null,
        phone: "",
        phoneNew: "",
        password: "",
        date: null,
        age: "",

        location: null,
        city: null,
        country: null,
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
        locationRules: [(v) => !!v || "Location is required"],
        cityRules: [(v) => !!v || "City is required"],
        countryRules: [(v) => !!v || "Country is required"],
      },
      phoneNumberCounter: {
        value: 0,
        counterSize: 10,
      },
      resource: {
        gender: [
          // "Male",
          // "Female",
          { title: "Male", value: "M" },
          { title: "Female", value: "F" },
        ],
        marital: [
          // "Single",
          // "Married",
          // "Others",
          { title: "Single", value: "S" },
          { title: "Married", value: "M" },
        ],
        nationality: [],
        countryCodes: [],
        favorite: [],
        nearest: [
          "Parkway Parade",
          "Waterway Point",
          "Causeway Point",
          "Great World",
          "Tampines Mall",
          "Jewel",
          "Our Tampines Hub",
        ],
        location: [
          "Singapore",
          "India",
          "Malaysia",
          // { name: "Singapore", value: "Singapore" },
          // { name: "India", value: "India" },
          // { name: "Malaysia:", value: "Malaysia" },
        ],
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

      const today = new Date();
      const birthDate = new Date(this.input.date);
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
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    app.config.globalProperties.$eventBus.$emit(
      "changeHeaderWelcome",
      "My Profile"
    );
    this.getNationality();
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    onInputNationality() {
      console.log("ok", this.input.nationality);
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
          this.getUserData();
        })
        .catch((error) => {
          // eslint-disable-next-line
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
          // this.input.nationality = this.resource.nationality.filter(
          //   (i) => i.id == 2
          // )[0];
          // this.input.marital = this.resource.marital.filter(
          //   (i) => i.value == "S"
          // )[0];
          // this.input.gender = this.resource.gender.filter(
          //   (i) => i.value == "F"
          // )[0];
          // this.input.gender2 = "F";

          // country_current: 28,
          // date_of_birth: null,
          // gender: "M",
          // image: "cea8b5aca2c523ec0b425738e4d80b3d.jpg",
          // last_login: "11/09/2023",
          // marital_status: null,

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
              (i) => i.id == data.country_current
            )[0],
            name: data.name,
            email: data.email_id,
            countryCode: null,
            phone: data.mobile_number,
            phoneNew: data.mobile_number,
            password: "",
            date: data.date_of_birth,
            age: "",

            location: null,
            city: null,
            country: null,
          };
          this.input.nationality = this.resource.nationality.filter(
            (i) => i.id == data.country_current
          );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    saveData() {
      this.isSending = true;
      const payload = {
        // "marital_status":"M",
        // "country_current":1,
        // "image":[file upload]

        gypsy_id: this.input.id,
        name: this.input.name,
        mobile_number: this.input.phoneNew || this.input.phone,
        email_id: this.input.email,
        gender: this.input.gender.value,
        app_id: this.$appId,
        // password: this.input.password,
        marital_status: this.input.marital.value,
        date_of_birth: this.input.date,
        country_current: this.input.nationality.id,
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
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
          this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
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
    saveImage() {
      this.isSending = true;
      const payload = {
        // "marital_status":"M",
        // "country_current":1,
        // "image":[file upload]

        // name: this.input.name,
        // mobile_number: this.input.phoneNew || this.input.phone,
        // email_id: this.input.email,
        // gender: this.input.gender.value,
        // app_id: this.$appId,
        // // password: this.input.password,
        // marital_status: this.input.marital.value,
        // // date_of_birth: this.input.date,
        // country_current: this.input.nationality.id,
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
          // this.getUserData();
          // localStorage.setItem("name", data.data.name);
          // localStorage.setItem("email", data.data.email_id);
          // localStorage.setItem("g_id", data.data.gypsy_ref_no);
          // localStorage.setItem("user_image", data.data.image);
          // localStorage.setItem("last_login", data.data.last_login);
          // localStorage.setItem("token", data.data.token);
        })
        .catch((error) => {
          // eslint-disable-next-line
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
    changePassword() {
      if (this.input.password.length != 8) {
        this.isPassword = false;
      } else {
        this.isPassword = true;
      }
      this.isSending = true;
      const payload = {
        gypsy_id: this.input.id,
        email_id: this.input.email,
        password: this.input.password,
      };
      const token = localStorage.getItem("token");
      if (this.isPassword == true) {
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
            this.successMessage = data.message;
            // localStorage.setItem("name", data.data.name);
            // localStorage.setItem("email", data.data.email_id);
            // localStorage.setItem("g_id", data.data.gypsy_ref_no);
            // localStorage.setItem("user_image", data.data.image);
            // localStorage.setItem("last_login", data.data.last_login);
            // localStorage.setItem("token", data.data.token);
            // this.isSuccess = true;
            this.isChangePassword = false;
            this.isPasswordChanged = true;
            setTimeout(() => {
              this.isPasswordChanged = false;
            }, 5000);
            this.input.password = "";
            // this.email = "";
            // this.name = "";
            // this.country = null;
            // this.city = null;
            // this.mobile = "";
            // this.gender = "";
            // app.config.globalProperties.$eventBus.$emit(
            //   "changeHeaderWelcome",
            //   "Sign Up Completed"
            // );
            // this.nextStep();
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
      // console.log(this.input);
    },
    async launchCropper(event) {
      if (!event) return;
      var file = event.target.files[0];
      this.image = await this.toBase64(file);
      this.imageSend = file;
      if (this.imageSend != null) {
        this.saveImage();
      }
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
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    onDateInput() {
      const formattedDate = this.input.date.replace(/\D/g, "");

      // Memisahkan tanggal, bulan, dan tahun
      const day = formattedDate.substring(0, 2);
      const month = formattedDate.substring(2, 4);
      const year = formattedDate.substring(4, 8);

      // Memeriksa apakah tanggal, bulan, dan tahun valid
      if (day && month && year) {
        // Mengatur format tanggal yang benar
        this.input.date = `${day}/${month}/${year}`;
      } else {
        this.input.date = formattedDate; // Tidak valid, tetapkan nilai yang sama
      }
      console.log(this.input.date);
      this.calculateAge(this.input.date);
    },
    calculateAge(date) {
      if (!date) {
        this.age = null;
        return;
      }

      const formattedDate = date.split("/");
      if (formattedDate.length !== 3) {
        this.age = null;
        return;
      }

      const day = parseInt(formattedDate[0]);
      const month = parseInt(formattedDate[1]) - 1; // Subtract 1 to adjust for JavaScript's 0-based month indexing
      const year = parseInt(formattedDate[2]);

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        this.age = null;
        return;
      }

      const today = new Date();
      const birthDate = new Date(year, month, day); // Corrected month here
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      this.age = age;
    },
  },
};
</script>

<style scoped>
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

.loading-page {
  margin-top: 300px;
}

@media (max-width: 599px) {
  .loading-page {
    margin-top: 450px;
  }
}
</style>
