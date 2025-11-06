import { describe, expect, test } from "bun:test";
import { Result } from "../../implementation";

describe("result/operators/await", () => {
  test("asynchronous success", async () => {
    const result = await Result.await(async () => "value" as const);

    expect(result.isSuccess).toBe(true);
    expect(result.unwrap()).toBe("value");
  });

  test("asynchronous error", async () => {
    const result = await Result.await<string, string>(async () => {
      throw "error";
    });

    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow("error");
  });
});
