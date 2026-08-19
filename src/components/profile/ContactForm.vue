<template>
  <div>
    <label>
      Contact Number
      <span
        :class="{
          'text-red': !isPhoneVerified,
          'text-green': isPhoneVerified,
        }"
      >
        {{ isPhoneVerified ? "(Verified)" : "(Not Verified)" }}
      </span>
    </label>
    <div
      class="d-flex align-center mt-2 py-0 back-grey"
      style="border: 1px solid #ced4da; border-radius: 0.25rem"
    >
      <input
        :value="input.phone"
        type="text"
        required
        disabled
        class="form-control"
        style="border: none"
        placeholder="Phone Number"
      />
      <span
        class="text-blue-darken-4 mx-2"
        style="cursor: pointer"
        @click="$emit('toggle-change-phone')"
      >
        Change
      </span>
    </div>
    <div v-if="isChangePhone" class="mt-2">
      <MazPhoneNumberInput
        v-model="input.phoneNew"
        show-code-on-list
        color="info"
        :default-country-code="input.country ? input.country : 'SG'"
        :preferred-countries="['SG', 'BD', 'IN', 'MY', 'GB', 'PH']"
        @update="$emit('phone-update', $event)"
      />
      <v-btn
        class="text-none text-subtitle-1 text-white w-100 mt-3"
        color="#F0882D"
        variant="flat"
        @click="$emit('save-mobile')"
      >
        Save
      </v-btn>
    </div>
    <v-alert
      class="my-2"
      :model-value="isMobileChanged"
      @update:model-value="$emit('update:isMobileChanged', $event)"
      type="success"
      :text="successMessage"
    ></v-alert>
  </div>
</template>

<script>
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput";

export default {
  name: "ContactForm",
  components: {
    MazPhoneNumberInput,
  },
  props: {
    input: {
      type: Object,
      required: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isChangePhone: {
      type: Boolean,
      default: false,
    },
    isMobileChanged: {
      type: Boolean,
      default: false,
    },
    successMessage: {
      type: String,
      default: "",
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "toggle-change-phone",
    "save-mobile",
    "phone-update",
    "update:isMobileChanged",
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
</style>
