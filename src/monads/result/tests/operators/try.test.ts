import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/try", () => {
  test("synchronous success", async () => {
    const result = Result.try(() => "value" as const);

    expect(result.isSuccess).toBe(true);
    expect(result.unwrap()).toBe("value");
  });

  test("synchronous error", async () => {
    const result = Result.try<string, string>(() => {
      throw "error";
    });

    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow("error");
  });
});
