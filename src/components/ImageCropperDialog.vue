<template>
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
            :src="chosenImage"
            alt="Image not available"
          />
        </v-card-text>
        <v-card-actions class="py-0 mx-10">
          <v-btn text color="red" aria-label="Cancel image crop" @click="resetCropper"> Cancel </v-btn>
          <v-spacer />
          <v-btn text color="blue" aria-label="Confirm image crop" @click="cropChosenImage"> Crop </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps({
  chosenImage: {
    default: null,
  },
});

const emit = defineEmits(["onReset", "onCrop"]);

const showCropper = ref(false);
const imageFileType = ref(null);
const cropper = ref(null);

async function initCropper(fileType) {
  showCropper.value = true;
  imageFileType.value = fileType;
  await new Promise((resolve) => setTimeout(resolve, 50));
  cropper.value?.replace(props.chosenImage);
}

function resetCropper() {
  emit("onReset");
  showCropper.value = false;
}

function cropChosenImage() {
  if (cropper.value) {
    emit(
      "onCrop",
      cropper.value.getCroppedCanvas().toDataURL(imageFileType.value)
    );
  }
  resetCropper();
}

defineExpose({
  initCropper,
  resetCropper,
  cropChosenImage,
});
</script>

<style>
.image-container {
  max-width: 450px;
}

.image-container img {
  /* This is important */
  width: 100%;
}
</style>
