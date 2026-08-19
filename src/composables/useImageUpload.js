/**
 * useImageUpload.js
 *
 * Composable untuk upload gambar profil dengan preview dan validasi.
 * Mengekstrak logika yang saat ini tersebar di MyProfile.vue.
 *
 * Penggunaan:
 *   import { useImageUpload } from "@/composables/useImageUpload";
 *   const { imagePreview, selectedFile, uploadError, onFileChange, getFormData, reset } = useImageUpload();
 */
import { ref } from "vue";

export function useImageUpload(options = {}) {
  const { maxSizeMB = 5, acceptedTypes = ["image/jpeg", "image/png", "image/webp"] } = options;

  const imagePreview = ref(null);
  const selectedFile = ref(null);
  const uploadError = ref(null);

  const onFileChange = (event) => {
    const file = event.target?.files?.[0] || event;
    if (!file) return;

    // Validasi tipe file
    if (!acceptedTypes.includes(file.type)) {
      uploadError.value = `Format file tidak didukung. Gunakan: ${acceptedTypes.join(", ")}`;
      return;
    }

    // Validasi ukuran file
    if (file.size > maxSizeMB * 1024 * 1024) {
      uploadError.value = `Ukuran file maksimal ${maxSizeMB}MB`;
      return;
    }

    uploadError.value = null;
    selectedFile.value = file;

    // Buat preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getFormData = (fieldName = "image") => {
    if (!selectedFile.value) return null;
    const formData = new FormData();
    formData.append(fieldName, selectedFile.value);
    return formData;
  };

  const reset = () => {
    imagePreview.value = null;
    selectedFile.value = null;
    uploadError.value = null;
  };

  return {
    imagePreview,
    selectedFile,
    uploadError,
    onFileChange,
    getFormData,
    reset,
  };
}
