import { describe, test, expect } from "bun:test";

import { try_ } from "./try";

describe("try utility", () => {
  test("should return Ok when function succeeds", () => {
    const result = try_(() => 42);
    expect(result.kind).toBe("ok");
    expect(result.value).toBe(42);
  });

  test("should return Err when function throws", () => {
    const result = try_(() => {
      throw new Error("Test error");
    });
    expect(result.kind).toBe("err");
    expect(Error.isError(result.error)).toBe(true);
    expect(result.error.message).toBe("Test error");
  });
});
