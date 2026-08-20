import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useResponsive } from "../useResponsive";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

describe("useResponsive composable", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    vi.restoreAllMocks();
  });

  it("should initialize screenWidth with current window.innerWidth", () => {
    window.innerWidth = 1200;
    const TestComponent = defineComponent({
      setup() {
        return { ...useResponsive() };
      },
      template: "<div></div>",
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.screenWidth).toBe(1200);
    expect(wrapper.vm.isLarge()).toBe(true);
    expect(wrapper.vm.isMedium()).toBe(false);
    expect(wrapper.vm.isSmall()).toBe(false);
  });

  it("should return isSmall = true when screenWidth < 640", () => {
    window.innerWidth = 500;
    const TestComponent = defineComponent({
      setup() {
        return { ...useResponsive() };
      },
      template: "<div></div>",
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.screenWidth).toBe(500);
    expect(wrapper.vm.isSmall()).toBe(true);
    expect(wrapper.vm.isMedium()).toBe(true);
    expect(wrapper.vm.isLarge()).toBe(false);
  });

  it("should return isMedium = true when screenWidth is between 640 and 1023", () => {
    window.innerWidth = 768;
    const TestComponent = defineComponent({
      setup() {
        return { ...useResponsive() };
      },
      template: "<div></div>",
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.screenWidth).toBe(768);
    expect(wrapper.vm.isSmall()).toBe(false);
    expect(wrapper.vm.isMedium()).toBe(true);
    expect(wrapper.vm.isLarge()).toBe(false);
  });

  it("should update screenWidth on window resize event", async () => {
    window.innerWidth = 1200;
    const TestComponent = defineComponent({
      setup() {
        return { ...useResponsive() };
      },
      template: "<div></div>",
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.vm.screenWidth).toBe(1200);

    window.innerWidth = 480;
    window.dispatchEvent(new Event("resize"));

    expect(wrapper.vm.screenWidth).toBe(480);
    expect(wrapper.vm.isSmall()).toBe(true);
  });
});
