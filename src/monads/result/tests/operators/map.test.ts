import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/map", () => {
  test("maps successful results", () => {
    const result = Result.ok(5).map((value) => value * 2);

    expect(result.isSuccess).toBe(true);
    expect(result.unwrap()).toBe(10);
  });

  test("propagates error from the first result", () => {
    const result = Result.err<string, number>("initial error").map((value) =>
      Result.ok<string, number>(value * 2)
    );

    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow("initial error");
  });

  test("propagates error from the maped result", () => {
    const result = Result.ok<number, number>(5).map((_) =>
      Result.err<string, number>("maped error")
    );

    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow("maped error");
  });

  test("handles exceptions in the mapping function", () => {
    const result = Result.ok<Error, number>(5).map((_) => {
      throw new Error("mapping error");
    });

    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow("mapping error");
  });
});
