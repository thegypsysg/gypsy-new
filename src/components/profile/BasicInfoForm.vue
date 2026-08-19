<template>
  <div>
    <!-- Desktop Left Section: Gender, Marital Status, Nationality -->
    <template v-if="section === 'desktop-left'">
      <v-row>
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
      <v-row>
        <v-col>
          <label>Nationality</label>
          <VueMultiselect
            v-model="input.nationality"
            @select="$emit('input-nationality')"
            class="mt-2"
            :options="resource.nationality"
            track-by="id"
            label="title"
            placeholder="Select Nationality"
          />
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col class="d-flex justify-center">
          <v-btn
            class="text-none text-subtitle-1"
            color="success"
            size="large"
            variant="flat"
            @click="$emit('save-desktop-1')"
          >
            Save Changes
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <!-- Desktop Right Section: Name, Email (with verification/OTP/change), Birth Date, Age -->
    <template v-else-if="section === 'desktop-right'">
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
        </v-col>
        <v-col cols="6">
          <label>
            <div class="d-flex" style="gap: 5px">
              <span>Email</span>
              <span
                :class="{
                  'text-red': !isEmailVerified,
                  'text-green': isEmailVerified,
                }"
              >
                {{ isEmailVerified ? "(Verified)" : "(Not Verified)" }}
              </span>
              <div
                v-if="!isEmailVerified"
                class="d-flex"
                style="gap: 5px"
              >
                <span
                  v-if="!isVerifying"
                  @click="$emit('verify-email')"
                  class="text-green cursor-pointer"
                >
                  (Verify Now)
                </span>
                <span v-if="isVerifying" class="text-green">
                  (Verify Now)
                </span>
                <span
                  @click="$emit('open-why')"
                  class="text-blue-accent-4 cursor-pointer"
                >
                  Why ?
                </span>
              </div>
            </div>
          </label>
          <div
            class="w-100 d-flex"
            style="gap: 10px"
            v-if="isEmailOTP"
          >
            <input
              :value="input.emailOTP"
              maxlength="4"
              @input="$emit('handle-input-otp', $event)"
              type="number"
              class="form-control mt-4 w-50"
              placeholder="Enter OTP"
            />
            <v-btn
              :disabled="!input.emailOTP || isSending"
              :loading="isSending"
              class="text-none text-subtitle-1 mt-4 w-50"
              color="primary"
              variant="flat"
              @click="$emit('save-email-otp')"
            >
              Update
            </v-btn>
          </div>
          <div
            class="d-flex align-center mt-2 py-0 back-grey"
            style="border: 1px solid #ced4da; border-radius: 0.25rem"
          >
            <input
              :value="input.email"
              type="email"
              disabled
              class="form-control"
              style="border: none"
              placeholder="Enter Email"
            />
            <span
              class="text-blue-darken-4 mx-2"
              style="cursor: pointer"
              @click="$emit('toggle-change-email')"
            >
              Change
            </span>
          </div>
          <div v-if="isChangeEmail">
            <input
              v-model="input.emailNew"
              type="email"
              class="form-control mt-4"
              placeholder="Enter Email"
            />
            <v-btn
              class="text-none text-subtitle-1 mt-4"
              color="success"
              variant="flat"
              @click="$emit('save-email')"
            >
              Save Changes
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- Desktop Birth Date & Age Section -->
    <template v-else-if="section === 'desktop-birthdate'">
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
            @input="$emit('date-input')"
          />
        </v-col>
        <v-col cols="7">
          <label>Age</label>
          <p class="mt-5">
            {{ age }}
          </p>
        </v-col>
      </v-row>
    </template>

    <!-- Mobile Basic Info Section (Name, Email) -->
    <template v-else-if="section === 'mobile-top'">
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
          <label>
            <div class="d-flex" style="gap: 5px">
              <span>Email</span>
              <span
                :class="{
                  'text-red': !isEmailVerified,
                  'text-green': isEmailVerified,
                }"
              >
                {{ isEmailVerified ? "(Verified)" : "(Not Verified)" }}
              </span>
              <div v-if="!isEmailVerified" class="d-flex" style="gap: 5px">
                <span
                  v-if="!isVerifying"
                  @click="$emit('verify-email')"
                  class="text-green cursor-pointer"
                >
                  (Verify Now)
                </span>
                <span v-if="isVerifying" class="text-green">
                  (Verify Now)
                </span>
                <span
                  @click="$emit('open-why')"
                  class="text-blue-accent-4 cursor-pointer"
                >
                  Why ?
                </span>
              </div>
            </div>
          </label>
          <div class="w-100 d-flex" style="gap: 10px" v-if="isEmailOTP">
            <input
              :value="input.emailOTP"
              maxlength="4"
              @input="$emit('handle-input-otp', $event)"
              type="number"
              class="form-control mt-4 w-50"
              placeholder="Enter OTP"
            />
            <v-btn
              :disabled="!input.emailOTP || isSending"
              :loading="isSending"
              class="text-none text-subtitle-1 mt-4 w-50"
              color="primary"
              variant="flat"
              @click="$emit('save-email-otp')"
            >
              Update
            </v-btn>
          </div>
          <div
            class="d-flex align-center mt-2 py-0 back-grey"
            style="border: 1px solid #ced4da; border-radius: 0.25rem"
          >
            <input
              :value="input.email"
              type="email"
              disabled
              class="form-control"
              style="border: none"
              placeholder="Enter Email"
            />
            <span
              class="text-blue-darken-4 mx-2"
              style="cursor: pointer"
              @click="$emit('toggle-change-email')"
            >
              Change
            </span>
          </div>
          <div v-if="isChangeEmail">
            <input
              v-model="input.emailNew"
              type="email"
              class="form-control mt-4"
              placeholder="Enter Email"
            />
            <v-btn
              class="text-none text-subtitle-1 mt-4"
              color="success"
              variant="flat"
              @click="$emit('save-email')"
            >
              Save Changes
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- Mobile Basic Info Section (Birth Date, Gender, Nationality, Marital, Save Button) -->
    <template v-else-if="section === 'mobile-bottom'">
      <v-row>
        <v-col cols="6">
          <label>Birth Date (<span>{{ age }} Years</span>)</label>
          <input
            v-model="input.date"
            required
            class="form-control mt-2"
            type="text"
            id="dateInput"
            placeholder="DD/MM/YYYY"
            @input="$emit('date-input')"
          />
        </v-col>
        <v-col cols="6">
          <div class="w-100 text-center">
            <label class="mx-auto">Gender</label>
          </div>

          <v-radio-group
            v-model="input.gender2"
            :rules="rules ? rules.genderRules : []"
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
            @select="$emit('input-nationality')"
            class="mt-2"
            :options="resource.nationality"
            track-by="id"
            label="title"
            placeholder="Select Nationality"
          />
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
          @click="$emit('save-data')"
        >
          Save Changes
        </v-btn>
      </v-container>
    </template>
  </div>
</template>

<script>
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

export default {
  name: "BasicInfoForm",
  components: {
    VueMultiselect,
  },
  props: {
    section: {
      type: String,
      required: true,
    },
    input: {
      type: Object,
      required: true,
    },
    resource: {
      type: Object,
      required: true,
    },
    age: {
      type: [Number, String],
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isEmailOTP: {
      type: Boolean,
      default: false,
    },
    isVerifying: {
      type: Boolean,
      default: false,
    },
    isChangeEmail: {
      type: Boolean,
      default: false,
    },
    isSending: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    "save-desktop-1",
    "save-desktop-2",
    "save-data",
    "verify-email",
    "open-why",
    "handle-input-otp",
    "save-email-otp",
    "toggle-change-email",
    "save-email",
    "date-input",
    "input-nationality",
  ],
};
</script>

<style scoped>
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

.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}

.back-grey {
  background: #e9ecef;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
