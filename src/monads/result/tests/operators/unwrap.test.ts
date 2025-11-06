import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/unwrap", () => {
  test("unwraps success value", () => {
    const result = Result.ok<string, string>("success value");
    const value = result.unwrap();
    expect(value).toBe("success value");
  });

  test("throws error when unwrapping an error", () => {
    const result = Result.err<string, string>("error value");
    expect(() => result.unwrap()).toThrow("error value");
  });
});
