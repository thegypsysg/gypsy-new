<template>
  <div>
    <input
      ref="filePickerField"
      type="file"
      accept="image/*"
      hidden
      @change="$emit('launch-cropper', $event)"
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
            cover
            :src="
              imagePath
                ? imagePath
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            "
          />
        </div>
        <div
          class="mt-4 w-100 d-flex align-center"
          :class="{
            'justify-space-between': imagePath,
            'justify-center': !imagePath,
          }"
        >
          <v-btn
            size="small"
            color="blue"
            variant="outlined"
            @click="$refs.filePickerField.click()"
            :disabled="!!imagePath"
          >
            {{ !isSaveImage ? "Upload Picture" : "Saving Image" }}
          </v-btn>
          <v-icon
            v-if="imagePath"
            @click="$emit('delete-image')"
            color="red"
            icon="mdi-trash-can-outline"
          >
          </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileAvatar",
  props: {
    imagePath: {
      type: String,
      default: "",
    },
    isSaveImage: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["launch-cropper", "delete-image"],
};
</script>

<style scoped>
.image-container {
  max-width: 450px;
}

.image-container img {
  width: 100%;
}
</style>
