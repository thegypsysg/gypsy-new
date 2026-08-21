import { describe, it, expect } from "vitest";
import { useForm } from "@/composables/useForm";

describe("useForm composable", () => {
  it("values terinisialisasi dari initialValues", () => {
    const { values } = useForm({ email: "", name: "test" });
    expect(values.email).toBe("");
    expect(values.name).toBe("test");
  });

  it("validate mengembalikan false jika ada rule yang gagal", () => {
    const { errors, validate } = useForm({ email: "" });
    const ok = validate({ email: [(v) => !!v || "Email wajib diisi"] });
    expect(ok).toBe(false);
    expect(errors.email).toBe("Email wajib diisi");
  });

  it("validate mengembalikan true jika semua rule lolos", () => {
    const { errors, validate } = useForm({ email: "test@test.com" });
    const ok = validate({ email: [(v) => !!v || "Wajib diisi"] });
    expect(ok).toBe(true);
    expect(errors.email).toBeUndefined();
  });

  it("reset mengembalikan values ke initialValues", () => {
    const { values, reset } = useForm({ email: "" });
    values.email = "changed@test.com";
    reset();
    expect(values.email).toBe("");
  });

  it("reset membersihkan errors", () => {
    const { errors, validate, reset } = useForm({ email: "" });
    validate({ email: [(v) => !!v || "Wajib"] });
    expect(errors.email).toBe("Wajib");
    reset();
    expect(errors.email).toBeUndefined();
  });
});
