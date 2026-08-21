<template>
  <v-container class="mb-6 mt-10 wrapper-box">
    <v-row>
      <v-col cols="12">
        <p align="center" class="header-title">Become Our Partner</p>
        <p class="header-title-sub">
          As a Rider , Merchant , Employer , Agency
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box">
            <div class="img-cont">
              <img
                src="@/assets/partner-1.webp"
                class="align-end img-item"
                alt="As a Rider/Driver"
                loading="lazy"
                style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;"
              />
            </div>
            <v-card-title class="text-black text-center">
              As a Rider/Driver
            </v-card-title>
            <v-card-text class="text-center">
              Earn money by delivering food from restaurant. All you need are
              the skills and a bike
            </v-card-text>
            <v-card-actions align="center">
              <v-btn
                elevation="0"
                class="mx-auto bg-info"
                style="background: #37b909 !important"
              >
                Ride with us
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box">
            <div class="img-cont">
              <img
                src="@/assets/partner-2.webp"
                class="align-end img-item"
                alt="As a Merchant / Brand Owner"
                loading="lazy"
                style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;"
              />
            </div>
            <v-card-title class="text-black text-center">
              As a Merchant / Brand Owner
            </v-card-title>
            <v-card-text class="text-center">
              Quickbite helps restaurants grow with online ordering, loyalty,
              programs, and more
            </v-card-text>
            <v-card-actions align="center">
              <v-btn
                elevation="0"
                class="mx-auto bg-info"
                style="background: #00cdcd !important"
              >
                Partner with us
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
      <v-col sm="12" md="4" cols="12">
        <v-lazy :options="{ threshold: 0.5 }" min-height="200">
          <v-card class="partners_box">
            <div class="img-cont">
              <img
                src="@/assets/partner-3.webp"
                class="align-end img-item"
                alt="As an Employer / Agency"
                loading="lazy"
                style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;"
              />
            </div>
            <v-card-title class="text-black text-center">
              As an Employer / Agency
            </v-card-title>
            <v-card-text class="text-center">
              Be part of a team that’s building a top-notch delivery service.
            </v-card-text>
            <v-card-actions align="center">
              <v-btn
                elevation="0"
                class="mx-auto bg-info"
                style="background: #808080 !important"
              >
                Inquire now
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup></script>
<style>
.img-cont {
  position: relative;
  overflow: hidden;
}

.img-item {
  transition: all 0.3s;
  width: 100%;
  height: auto;
  transform: scale(1);
}

.partners_box:hover .img-item {
  transform: scale(1.2);
}
.skeleton {
  width: 100%;
  height: 100%;
  border-radius: 0;

  background: linear-gradient(-90deg, #f2f2f2 0%, #e1e1e1 50%, #f2f2f2 100%);
  background-size: 400% 400%;
  animation: skeleton 1.6s ease infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
