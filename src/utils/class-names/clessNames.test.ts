import cn from "./classNames";

describe("classNames", () => {
  test("concatenates string arguments", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("filters out falsy values", () => {
    expect(cn("foo", false, "bar", undefined, null)).toBe("foo bar");
  });

  test("handles object with truthy values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  test("combines strings and objects", () => {
    expect(cn("base", { active: true }, { disabled: false })).toBe(
      "base active"
    );
  });

  test("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
