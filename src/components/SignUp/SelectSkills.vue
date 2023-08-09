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
              min-height="80vh"
              class="mx-auto"
              :class="{ 'login-card px-12': !isSmall, 'py-10 px-2': isSmall }"
            >
              <v-row>
                <v-col cols="12">
                  <h1
                    class="mb-1"
                    style="font-family: Arial, Helvetica, sans-serif !important"
                    :class="{ 'header-mobile': isSmall }"
                  >
                    Step 6 - Select Skills
                  </h1>

                  <v-form fast-fail @submit.prevent="login">
                    <v-radio-group class="w-100" v-model="skill" inline>
                      <v-radio
                        v-for="option in resource.skills"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                        :class="{ 'w-25': !isSmall, 'w-50': isSmall }"
                      >
                        <template #label>
                          <div class="radio-label text-center">
                            <span>{{ option.label }}</span>
                            <v-img :src="option.image" max-height="100"></v-img>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <v-spacer></v-spacer>

                    <div
                      class="d-flex align-center"
                      :class="{ matop: !isSmall, 'matop-2': isSmall }"
                    >
                      <v-btn
                        type="submit"
                        variant="outlined"
                        class="login-btn"
                        :class="{
                          'w-33 login-btn-mobile': isSmall,
                          'w-25 m': !isSmall,
                        }"
                        @click="nextStep"
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
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          location="top"
          color="green"
          v-model="isSuccess"
          :timeout="3000"
        >
          {{ successMessage }}

          <template v-slot:actions>
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
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'SelectSkills',
  data() {
    return {
      skill: '',
      screenWidth: window.innerWidth,
      isSuccess: false,
      successMessage: '',
      resource: {
        skills: [
          {
            label: 'Nursing Jobs',
            value: 'nursing jobs',
            image: require('@/assets/nurse.png'),
          },
          {
            label: 'Allied Health Jobs',
            value: 'allied health jobs',
            image: require('@/assets/allied-jobs.jpg'),
          },
          {
            label: 'Medical/Doctor Jobs',
            value: 'medical/doctor Jobs',
            image: require('@/assets/doctor-jobs.jpg'),
          },
          {
            label: 'Executives Jobs',
            value: 'executives jobs',
            image: require('@/assets/exec-jobs.jpg'),
          },
        ],
      },
    };
  },
  computed: {
    isSmall() {
      return this.screenWidth < 640;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    nextStep() {
      this.$emit('nextStep');
    },
    backStep() {
      this.$emit('backStep');
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    resendOTP() {
      this.isSuccess = true;
      this.successMessage = 'Success send OTP';
    },
  },
};
</script>

<style scoped>
.login-container {
  background-image: url('@/assets/Syringe-Signup-main.jpg');
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

.matop {
  margin-top: 150px;
}
.matop-2 {
  margin-top: 250px;
}
</style>
