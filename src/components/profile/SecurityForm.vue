<template>
  <div>
    <label>Password </label>
    <div
      class="d-flex align-center mt-2 py-0 back-grey"
      style="border: 1px solid #ced4da; border-radius: 0.25rem"
    >
      <input
        :value="input.password"
        type="password"
        required
        disabled
        class="form-control"
        :class="{ 'w-66 mr-3': !input.password && !isSmall, 'w-66 mr-2': !input.password && isSmall }"
        style="border: none"
        placeholder="Enter Password"
        maxlength="8"
      />
      <span
        v-if="!isLoading"
        class="text-blue-darken-4 mx-2 text-right"
        style="cursor: pointer"
        @click="$emit('toggle-change-password')"
      >
        {{ input.password ? "Change" : "Create New" }}
      </span>
    </div>
    <div v-if="isChangePassword">
      <div
        class="d-flex align-center mt-4 py-0"
        style="border: 1px solid #ced4da; border-radius: 0.25rem"
      >
        <input
          v-model="input.passwordNew"
          :type="!showPassword1 ? 'password' : 'text'"
          required
          class="form-control"
          style="border: none"
          placeholder="Enter Password"
          maxlength="8"
        />
        <span
          class="toggle-password mr-4 ml-2 mdi"
          :class="{
            'mdi-eye': showPassword1,
            'mdi-eye-off': !showPassword1,
          }"
          style="cursor: pointer; font-size: 26px"
          @click="$emit('toggle-show-password-1')"
        >
        </span>
      </div>
      <h6 v-if="isPassword1 === false" class="w-100 text-red mb-2">
        Password must be 8 characters
      </h6>
      <template v-if="input.password">
        <div
          class="d-flex align-center mt-4 py-0"
          style="border: 1px solid #ced4da; border-radius: 0.25rem"
        >
          <input
            v-model="input.passwordConfirm"
            :type="!showPassword2 ? 'password' : 'text'"
            required
            class="form-control"
            style="border: none"
            placeholder="Re-enter Password"
            maxlength="8"
          />
          <span
            class="toggle-password mr-4 ml-2 mdi"
            :class="{
              'mdi-eye': showPassword2,
              'mdi-eye-off': !showPassword2,
            }"
            style="cursor: pointer; font-size: 26px"
            @click="$emit('toggle-show-password-2')"
          >
          </span>
        </div>
        <h6 v-if="isPassword2 === false" class="w-100 text-red mb-2">
          {{ password2Mes }}
        </h6>
      </template>
      <v-btn
        class="text-none text-subtitle-1"
        :class="{ 'mt-4': isPassword2, 'mt-n2': !isPassword2 }"
        color="success"
        variant="flat"
        @click="$emit('change-password')"
      >
        Save Changes
      </v-btn>
    </div>

    <v-alert
      class="my-2"
      :model-value="isPasswordChanged"
      @update:model-value="$emit('update:isPasswordChanged', $event)"
      type="success"
      :text="successMessage"
    ></v-alert>
  </div>
</template>

<script>
export default {
  name: "SecurityForm",
  props: {
    input: {
      type: Object,
      required: true,
    },
    isChangePassword: {
      type: Boolean,
      default: false,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    showPassword1: {
      type: Boolean,
      default: false,
    },
    showPassword2: {
      type: Boolean,
      default: false,
    },
    isPassword1: {
      type: Boolean,
      default: true,
    },
    isPassword2: {
      type: Boolean,
      default: true,
    },
    password2Mes: {
      type: String,
      default: "",
    },
    successMessage: {
      type: String,
      default: "",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "change-password",
    "toggle-change-password",
    "toggle-show-password-1",
    "toggle-show-password-2",
    "update:isPasswordChanged",
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
