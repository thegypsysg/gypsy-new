import { describe, it, expect } from "vitest";
import { useAppConfig } from "@/composables/useAppConfig";

describe("useAppConfig composable", () => {
  it("provides fileURL, appId, and apiBaseURL", () => {
    const config = useAppConfig();
    expect(config).toHaveProperty("fileURL");
    expect(config).toHaveProperty("appId");
    expect(config).toHaveProperty("apiBaseURL");
    expect(typeof config.fileURL).toBe("string");
    expect(typeof config.appId).toBe("number");
  });
});
