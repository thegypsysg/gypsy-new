/**
 * useForm.js
 *
 * Composable untuk manajemen state dan validasi form.
 * Menghilangkan duplikasi logika form di setiap komponen.
 *
 * Penggunaan:
 *   const { values, errors, isSubmitting, validate, reset } = useForm({ email: "", password: "" });
 *   const ok = validate({ email: [v => !!v || "Wajib diisi"] });
 */
import { reactive, ref } from "vue";

export function useForm(initialValues = {}) {
  const values = reactive({ ...initialValues });
  const errors = reactive({});
  const isSubmitting = ref(false);

  /**
   * Validasi form dengan rules.
   * @param {Record<string, Array<(v: any) => true | string>>} rules
   * @returns {boolean} true jika semua valid
   */
  function validate(rules) {
    // Clear errors dulu
    Object.keys(errors).forEach((k) => delete errors[k]);
    let isValid = true;
    Object.entries(rules).forEach(([field, ruleFns]) => {
      for (const fn of ruleFns) {
        const result = fn(values[field]);
        if (result !== true) {
          errors[field] = result;
          isValid = false;
          break;
        }
      }
    });
    return isValid;
  }

  function reset() {
    Object.assign(values, initialValues);
    Object.keys(errors).forEach((k) => delete errors[k]);
    isSubmitting.value = false;
  }

  return { values, errors, isSubmitting, validate, reset };
}

export default useForm;
