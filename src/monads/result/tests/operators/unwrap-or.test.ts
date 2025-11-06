import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/unwrap-or", () => {
  test("unwraps successful result", () => {
    const result = Result.ok<string, number>(42);
    const value = result.unwrapOr(0);

    expect(value).toBe(42);
  });

  test("returns default value for error result", () => {
    const result = Result.err<string, number>("error occurred");
    const value = result.unwrapOr(0);

    expect(value).toBe(0);
  });
});
